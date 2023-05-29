import { useState } from "react";
import { ISettings } from "../interfaces";
import { Between, Sine, UniqueList } from "../services";
import Playground from "./playground";
import { Button } from "flowbite-react";

export interface ITurbine {
    id: number
    voltage: number
    rpm: number
    temperature: number
    rotorAge: number
    anomaly: boolean
}

const getTurbines = (): ITurbine[] => {
    let turbines: ITurbine[] = []
    const failures = UniqueList(1001, 1020, 5)
    for (let i = 1001; i <= 1020; i++) {
        let voltage = Sine(650, 690, Between(0, 360))
        let rpm = Sine(15, 25, Between(0, 360))
        let temperature = Sine(15, 25, Between(0, 360))
        let anomaly = false
        let rotorAge = Between(10, 60)
        if (failures.includes(i)) {
            let raiseAnomaly = Between(1, 4)
            anomaly = true
            switch (raiseAnomaly) {
                case 1:
                    voltage = 0
                    break;
                case 2:
                    rpm = 0
                    break;
                case 3:
                    temperature = 0
                    break;
                case 4:
                    rotorAge = Between(61, 100)
                    break
                default:
                    break;
            }

        }
        turbines.push({
            id: i,
            voltage,
            rpm,
            temperature,
            rotorAge,
            anomaly
        })
    }
    return turbines
}


const Energy = (props: { settings: ISettings }) => {
    let [turbines, _] = useState(getTurbines())
    let [state, setState] = useState({ context: "", role: "" })
    const LoadContext = () => {
        let sb = "Wind Turbines:\n"
        for (let i = 0; i < turbines.length; i++) {
            sb += `ID: ${turbines[i].id}, `
            sb += `Voltage: ${turbines[i].voltage.toFixed(2)}, `
            sb += `RPM: ${turbines[i].rpm.toFixed(2)}, `
            sb += `Temperature: ${turbines[i].temperature.toFixed(2)},`
            sb += `Age: ${turbines[i].rotorAge}\n`
        }
        setState({ ...state, role: 'You are an assistant that can help analyze the running state of wind turbines. A temperature, rpm, and voltage reading of 0 indicates an anomaly. A rotor age (Age) of greater than 60 months may indicate a need of replacement of the rotor assembly.', context: sb })
    }
    return (
        <>
            <div className="container mx-auto mt-2">
                <h1 className="font-bold">Wind Farm Monitor</h1>
                <div className="overflow-auto h-[500px] mt-3">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th className="">Turbine ID</th>
                                <th className="">Voltage</th>
                                <th className="">RPM</th>
                                <th className="">Temperature</th>
                                <th className="">Rotor Age</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turbines.map((turbine, idx) => {
                                return (
                                    <tr key={idx} className={turbine.anomaly ? "bg-red-100 border-b-2 border-slate-800" : "border-b-2 border-slate-800"}>
                                        <td className="font-bold p-2">{turbine.id}</td>
                                        <td align="right" className="p-2">{turbine.voltage.toFixed(2)}</td>
                                        <td align="right" className="p-2">{turbine.rpm.toFixed(2)}</td>
                                        <td align="right" className="p-2">{turbine.temperature.toFixed(2)}</td>
                                        <td align="right" className="p-2">{turbine.rotorAge}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <Button className="mt-4 w-[200px]" onClick={LoadContext}>
                    Load Context
                </Button>

            </div>
            {state.context !== "" ? <Playground settings={props.settings} role={state.role} context={state.context} /> : null}
        </>
    )
}
export default Energy;