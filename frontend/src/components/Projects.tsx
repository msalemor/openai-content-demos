import { useState } from "react";
import { ISettings } from "../interfaces";
import { Between, UniqueList } from "../services";
import { Button } from "flowbite-react";
import Playground from "./playground";

const engineers = ["John", "Mary", "Pedro", "Jane"]
const pms = ["Mark", "Susan", "Rajesh"]
const pms1 = ["Peter", "Mary", "Carlos", "John"]
const statusList = ["Pending", "Active", "Closed"]

export interface IProject {
    id: number
    engineer: string
    pm: string
    startDate?: Date | null
    closeDate?: Date | null
    status: string
    cos: string
    security: string
    rr: string
    nsat: number
    anomaly: boolean
}

const getProjects = () => {
    let list: IProject[] = []
    const anomalies = UniqueList(1010, 1030, 6)
    for (let i = 1011; i <= 1030; i++) {
        let status = statusList[Math.floor(Math.random() * statusList.length)]
        let cos = "No"
        let security = "No"
        let rr = "No"
        let nsat = Between(170, 200)
        let anomaly = false
        let startDate = null
        let closeDate = null
        if (status === "Closed" || status === "Active") {
            startDate = new Date()
            startDate.setDate(startDate.getDate() - Between(90, 100))
        }
        if (status === "Closed") {
            closeDate = new Date()
            closeDate.setDate(closeDate.getDate() - Between(1, 60))
            cos = "Yes"
            security = "Yes"
            rr = "Yes"
        }

        if (status === "Closed" && anomalies.includes(i)) {
            anomaly = true
            const raiseAnomaly = Between(1, 4)
            switch (raiseAnomaly) {
                case 1:
                    cos = "No"
                    break;
                case 2:
                    security = "No"
                    break;
                case 3:
                    rr = "No"
                    break;
                case 4:
                    nsat = Between(100, 165)
                    break
                default:
                    break
            }

        }
        list.push({
            id: i,
            engineer: engineers[Math.floor(Math.random() * engineers.length)],
            pm: pms1[Math.floor(Math.random() * pms1.length)],
            startDate,
            closeDate,
            status,
            cos,
            security,
            rr,
            nsat,
            anomaly
        })
    }
    return list
}

export interface INomination {
    id: number
    pm: string
    status: string
    fivek: string
    wdcos: string // well-defined condition of success
    wded: string // well-defined ending date
    anomaly: boolean
}
const getNominations = (): INomination[] => {
    let list: INomination[] = []
    const anomalies = UniqueList(1001, 1010, 3)
    for (let i = 1001; i <= 1010; i++) {
        let fivek = "Yes"
        let wdcos = "Yes"
        let wded = "Yes"
        let anomaly = false
        if (anomalies.includes(i)) {
            anomaly = true
            const raiseAnomaly = Between(1, 3)
            switch (raiseAnomaly) {
                case 1:
                    fivek = "No"
                    break;
                case 2:
                    wdcos = "No"
                    break;
                case 3:
                    wded = "No"
                    break;
                default:
                    break
            }
        }
        list.push({
            id: i,
            pm: pms[Math.floor(Math.random() * pms.length)],
            status: "Pending",
            fivek,
            wdcos,
            wded,
            anomaly
        })
    }
    return list
}

const Projects = (props: { settings: ISettings }) => {
    let [projects] = useState<IProject[]>(getProjects())
    let [nominations] = useState<INomination[]>(getNominations())
    let defaultState = { role: '', context: '' }
    let [state, setState] = useState(defaultState)
    const LoadContext = () => {
        let sb = `A new nomination can be approved if it is in pending status, the 5K requirement is met, the well-defined condition of success (WDCOS) is met, and has a well-defined end date (WDED). An active project is in active status and does not have a close date. A pending project has a status of pending and does not have a start date. A closed project is in closed status. A project that has been delivered with quality is in status closed, has an ending date, has a close date, met the condition of success (COS), a security engagement was completed or has an exception, a resiliency review was completed or one has been scheduled, and the NSAT score at or above 170.\n\n`
        sb += "Nominations list:\n\n"
        nominations.forEach(n => {
            sb += `Nomination ID: ${n.id}, Status: ${n.status}, PM: ${n.pm}, 5K met ${n.fivek}, WDCOS met ${n.wdcos}, WDED met ${n.wded}\n`
        })
        sb += "\nProject list:\n\n"
        projects.forEach(p => {
            sb += `Project ID: ${p.id}, PM: ${p.pm}, Engineer: ${p.engineer}, Status: ${p.status}, Start Date: ${p.startDate ? p.startDate.toLocaleDateString() : "None"}, Close Date: ${p.closeDate ? p.closeDate.toLocaleDateString() : "None"}, COS: ${p.cos}, Security: ${p.security}, RR: ${p.rr}, NSAT: ${p.nsat}\n`
        })
        setState({ ...state, role: 'You are an assistant that can help answer questions regarding nominations and projects.', context: sb })
    }
    return (
        <div className="container mx-auto mt-4">
            <h1 className="font-bold">Project Tracking</h1>
            <div className="flex flex-row w-full gap-x-2">
                <div className="flex flex-col w-1/2">
                    <h2>Nominations</h2>
                    <table className="table-auto w-100">
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th className="font-bold">ID</th>
                                <th className="font-bold">PM</th>
                                <th className="font-bold">Status</th>
                                <th className="font-bold">5K</th>
                                <th className="font-bold">WDCOS</th>
                                <th className="font-bold">WDED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nominations.map((project, index) => {
                                return (
                                    <tr className={project.anomaly ? "bg-red-200" : ""} key={index}>
                                        <td className="border p-1">{project.id}</td>
                                        <td className="border p-1">{project.pm}</td>
                                        <td className="border p-1">{project.status}</td>
                                        <td className="border p-1">{project.fivek}</td>
                                        <td className="border p-1">{project.wdcos}</td>
                                        <td className="border p-1">{project.wded}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col w-1/2">
                    <h2 className="">Projects</h2>
                    <table className="table-auto w-100">
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th className="font-bold">ID</th>
                                <th className="font-bold">Engineer</th>
                                <th className="font-bold">PM</th>
                                <th className="font-bold">Status</th>
                                <th className="font-bold">Start Date</th>
                                <th className="font-bold">Close Date</th>
                                <th className="font-bold">COS</th>
                                <th className="font-bold">Security</th>
                                <th className="font-bold">RR</th>
                                <th className="font-bold">NSAT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => {
                                return (
                                    <tr className={project.anomaly ? "bg-red-200" : ""} key={index}>
                                        <td className="border p-1">{project.id}</td>
                                        <td className="border p-1">{project.engineer}</td>
                                        <td className="border p-1">{project.pm}</td>
                                        <td className="border p-1">{project.status}</td>
                                        <td className="border p-1">{project.startDate?.toLocaleDateString()}</td>
                                        <td className="border p-1">{project.closeDate?.toLocaleDateString()}</td>
                                        <td className="border p-1">{project.cos}</td>
                                        <td className="border p-1">{project.security}</td>
                                        <td className="border p-1">{project.rr}</td>
                                        <td className="border p-1">{project.nsat}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Button className="mt-4 w-[200px]" onClick={LoadContext}>
                Load Context
            </Button>
            {state.context !== "" ? <Playground settings={props.settings} role={state.role} context={state.context} /> : null}
        </div>
    )
}
export default Projects;