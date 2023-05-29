import { useState } from "react";
import { ISettings } from "../interfaces";
import Playground from "./playground";
import { Button } from "flowbite-react";

const Wizard = (props: { settings: ISettings }) => {
    let obj = {
        shiftLift: true,
        type: "Code",
        containers: true,
        osControl: false,
        springBoot: false,
        eventDriven: false,
        shortLived: false,
        orchestration: false,
        redHat: false,
        kubernetes: false,
        context: "",
        role: "",
    }
    let [state, setState] = useState(obj)

    const LoadContext = () => {
        let role = ""
        let context = "Can you recommend the best compute option for my application?"
        if (state.shiftLift) {
            context += "I am shifting and lifting an application. "
        } else {
            context += "I am building a new application. "
        }
        if (state.type === "COTS") {
            context += "I am deploying a commercial application. "
        } else if (state.type === "Code") {
            context += "I am deploying code. "
        } else {
            context += "I am deploying containers. "
        }
        if (state.osControl) {
            context += "I need to control the OS ."
        } else {
            context += "I do not need to control the OS. "
        }
        if (state.springBoot) {
            context += "I am using Spring Boot. "
        }
        if (state.type === "Code" && state.eventDriven) {
            if (state.eventDriven) {
                context += "I am building an event-driven application or short-live application. "
            }
        }
        if (state.type === "Containers" && state.orchestration) {
            if (state.orchestration) {
                context += "I need full-fledge container orchestration. "
            } else {
                context += "I am new to containers. "
            }
        }
        context += "\nAzure services include Azure Virtual Machines, Azure Kubernetes Service, Azure Container Instances, Azure App Service, Azure Functions, Azure Batch, Azure Service Fabric, Azure Spring Cloud, Azure Red Hat OpenShift, Azure VMware Solution, Azure Stack, Azure Stack HCI, and Azure Stack Edge. Azure Virtual Machines is a good option for you if you need full IOS control or deploying a commercial application. Azure Kubernetes Service is a good option for you if you need full-fledge container orchestration. Azure Container Instances if you do not need full-fledge orchestration and need per second billing. Azure App Service is a good option for you if you have access to and are deploying code. Azure Functions is a good option for you if you are building an short-lived event-driven application. Azure Batch is a good option for you if you are running large-scale parallel and high-performance computing (HPC) applications efficiently in the cloud."


        setState({ ...state, role, context })
    }

    return (
        <div className="container mx-auto mt-4">
            <h1 className="font-bold">Compute Wizard</h1>
            <div className="flex flex-row w-full gap-x-2">
                <div className="bg-slate-300 flex flex-col basis-1/2 mt-3 p-4 text-lg rounded-xl">
                    <label mb-2>Are you shifting or lifting or building a new application?</label>
                    <div className="mb-2 flex flex-row">
                        <div className="flex flex-row place-items-center">
                            <input className="mr-2" type="radio" id="sl1" name="sl" value={"1"} onChange={(e) => setState({ ...state, shiftLift: (e.target.value == "1") })} checked={state.shiftLift} /> <label htmlFor="sl1">Shift and Lift</label>
                            <input className="ml-4 mr-2" type="radio" id="sl2" name="sl" value={"0"} onChange={(e) => setState({ ...state, shiftLift: (e.target.value == "1") })} checked={!state.shiftLift} /> <label htmlFor="sl2">New</label>
                        </div>
                    </div>
                    <label mb-2>Are you deploying a commercial application, code or containers?</label>
                    <div className="mb-2 flex flex-row">
                        <div className="flex flex-row place-items-center">
                            <input className="mr-2" type="radio" id="type1" name="type" value={"COTS"} onChange={(e) => setState({ ...state, type: e.target.value })} checked={state.type === "COTS"} /> <label htmlFor="type1">COTS</label>
                            <input className="ml-4 mr-2" type="radio" id="type2" name="type" value={"Code"} onChange={(e) => setState({ ...state, type: e.target.value })} checked={state.type === "Code"} /> <label htmlFor="type2">Code</label>
                            <input className="ml-4 mr-2" type="radio" id="type3" name="type" value={"Containers"} onChange={(e) => setState({ ...state, type: e.target.value })} checked={state.type === "Containers"} /> <label htmlFor="type3">Containers</label>
                        </div>
                    </div>
                    <div className="">
                        <label mb-2>Do you require full OS Control</label>
                        <div className="mb-2 flex flex-row place-items-center">
                            <input className="mr-2" type="radio" id="os1" name="os" value={"1"} onChange={(e) => setState({ ...state, osControl: (e.target.value == "1") })} checked={state.osControl} /> <label htmlFor="os1">Yes</label>
                            <input className="ml-4 mr-2" type="radio" id="os2" name="os" value={"0"} onChange={(e) => setState({ ...state, osControl: (e.target.value == "1") })} checked={!state.osControl} /> <label htmlFor="os2">No</label>
                        </div>
                    </div>
                    <div className="">
                        <label mb-2>Are you using Spring Boot apps?</label>
                        <div className="mb-2 flex flex-row place-items-center">
                            <input className="mr-2" type="radio" id="sp1" name="sp" value={"1"} onChange={(e) => setState({ ...state, springBoot: (e.target.value == "1") })} checked={state.springBoot} /> <label htmlFor="sp1">Yes</label>
                            <input className="ml-4 mr-2" type="radio" id="sp2" name="sp" value={"0"} onChange={(e) => setState({ ...state, springBoot: (e.target.value == "1") })} checked={!state.springBoot} /> <label htmlFor="sp2">No</label>
                        </div>
                    </div>
                    <div className={state.type === "Code" ? "visible" : "hidden"}>
                        <label mb-2>Is it an event-driven workload or short-lived process?</label>
                        <div className="mb-2 flex flex-row place-items-center">
                            <input className="mr-2" type="radio" id="evd1" name="evd" value={"1"} onChange={(e) => setState({ ...state, eventDriven: (e.target.value == "1") })} checked={state.eventDriven} /> <label htmlFor="evd1">Yes</label>
                            <input className="ml-4 mr-2" type="radio" id="evd2" name="evd" value={"0"} onChange={(e) => setState({ ...state, eventDriven: (e.target.value == "1") })} checked={!state.eventDriven} /> <label htmlFor="evd2">No</label>
                        </div>
                    </div>
                    <div className={state.type === "Containers" ? "visible" : "hidden"}>
                        <label mb-2>Need full fledge container orchestration?</label>
                        <div className="mb-2 flex flex-row place-items-center">
                            <input className="mr-2" type="radio" id="orch1" name="orch" value={"1"} onChange={(e) => setState({ ...state, orchestration: (e.target.value == "1") })} checked={state.orchestration} /> <label htmlFor="orch1">Yes</label>
                            <input className="ml-4 mr-2" type="radio" id="orch2" name="orch" value={"0"} onChange={(e) => setState({ ...state, orchestration: (e.target.value == "1") })} checked={!state.orchestration} /> <label htmlFor="orch2">No</label>
                        </div>
                    </div>
                    <div className={state.type === "Containers" ? "visible" : "hidden"}>
                        <label mb-2>Using Red Hat Openshift?</label>
                        <div className="mb-2 flex flex-row place-items-center">
                            <input className="mr-2" type="radio" id="rh1" name="rh" value={"1"} onChange={(e) => setState({ ...state, redHat: (e.target.value == "1") })} checked={state.redHat} /> <label htmlFor="rh1">Yes</label>
                            <input className="ml-4 mr-2" type="radio" id="rh2" name="rh" value={"0"} onChange={(e) => setState({ ...state, redHat: (e.target.value == "1") })} checked={!state.redHat} /> <label htmlFor="rh2">No</label>
                        </div>
                    </div>
                    <div className={state.type === "Containers" ? "visible" : "hidden"}>
                        <label mb-2>Familiar or expert using the Kubernetes API?</label>
                        <div className="mb-2 flex flex-row place-items-center">
                            <input className="mr-2" type="radio" id="kub1" name="kub" value={"1"} onChange={(e) => setState({ ...state, kubernetes: (e.target.value == "1") })} checked={state.kubernetes} /> <label htmlFor="kub1">Yes</label>
                            <input className="ml-4 mr-2" type="radio" id="kub2" name="kub" value={"0"} onChange={(e) => setState({ ...state, kubernetes: (e.target.value == "1") })} checked={!state.kubernetes} /> <label htmlFor="kub2">No</label>
                        </div>
                    </div>
                </div>
                <div className="basis-1/2">
                    <img src="https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/images/compute-choices.png" />
                </div>
            </div>
            <Button className="mt-4 w-[200px]" onClick={LoadContext}>
                Load Context
            </Button>
            {state.context !== "" ? <Playground settings={props.settings} role={state.role} context={state.context} /> : null}
        </div>
    )
}
export default Wizard;