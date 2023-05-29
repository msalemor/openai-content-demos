import { Button, Spinner } from "flowbite-react";
import { IMessage, IPrompt, ISettings } from "../interfaces";
import Results from "./results";
import { useState } from "react";
import { OpenAIServicePostPromise, PromiseAllAsync } from "../services";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
//import gfm from "https://cdn.skypack.dev/remark-gfm@1.0.0";

export interface IPlaygroundState {
    role: string
    prompt: string
    messages: string[]
    context: string
    payload: string
    usage: string
    completion: string
    processing: boolean
    status: string
}

const Playground = (props: { settings: ISettings, role: string, context: string }) => {
    let historyState: { ts: Date, role: string, content: string }[] = []

    let playgroundState: IPlaygroundState = {
        role: props.role === "" ? "You are a general assistant." : props.role,
        prompt: "",
        messages: [""],
        context: props.context,
        payload: "{}",
        usage: "{}",
        completion: "no results",
        processing: false,
        status: ""
    }
    let [state, setState] = useState(playgroundState)
    let [history, setHistory] = useState(historyState)

    const onClickHandle = async () => {
        setState({ ...state, processing: true })
        const prompt = state.prompt + ((state.context !== "") ? "\n\nText:\n" + state.context : "")
        let messages: IMessage[] = []
        console.info('History:', history)
        // if (history.length === 0) {
        //     messages.push({ role: "system", content: state.role })
        //     messages.push({
        //         role: "user", content: prompt
        //     })
        // } else {
        //     for (let i = 0; i < history.length; i++) {
        //         messages.push({ role: history[i].role, content: history[i].content })
        //         console.info('Adding:', history)
        //     }
        // }
        messages.push({ role: "system", content: state.role })
        messages.push({
            role: "user", content: prompt
        })
        let promptPayload: IPrompt = {
            prompt: props.settings.model === "Davinci" ? prompt : null,
            messages: props.settings.model === "GPT" ? messages : null,
            max_tokens: props.settings.max_tokens,
            temperature: props.settings.temperature,
            n: props.settings.n,
            stop: props.settings.stop === "" ? null : props.settings.stop,
        }
        let promise = OpenAIServicePostPromise(props.settings.model, promptPayload);
        let promises = await PromiseAllAsync([promise])
        let completion = ""
        let status = ""
        const data = promises[0].data
        if (props.settings.model === "Davinci") {
            completion = data.choices[0].text
            status = data.choices[0].finish_reason
        } else {
            completion = data.choices[0].message.content
            status = data.choices[0].finish_reason
        }
        const usage = JSON.stringify(data.usage, null, 1)
        console.info('Usage:', usage)
        let hist: any[] = [
            { ts: new Date(), role: 'user', content: state.prompt },
            { ts: new Date(), role: 'system', content: completion }
        ]
        let newHistory = history.concat(hist);
        setHistory(newHistory)
        console.info('After History:', newHistory)
        setState({ ...state, processing: false, completion, payload: JSON.stringify(promptPayload, null, 1), usage, status })
    }

    return (
        <div className='container mx-auto mt-2 p-3'>
            <h1 className=" text-2xl font-bold mb-5">Playground</h1>
            <div className="mb-2">
                <div className="flex flex-col">
                    {props.settings.model === "GPT" ?
                        <>
                            <label className="font-bold text-sm uppercase mb-1">
                                System Role
                            </label>
                            <textarea className="rounded-lg bg-slate-100 p-1 mb-3"
                                rows={3}
                                value={state.role}
                                onChange={(e) => setState({ ...state, role: e.target.value })}
                            />
                        </> : null
                    }
                    <label className="font-bold text-sm uppercase mb-1">Conversation</label>
                    {history.map((item, idx) => <div key={idx} className="flex flex-col w-full">
                        {item.role === "user" ?
                            <div className="flex flex-row w-full place-content-end mb-2">
                                <span className="bg-sky-300 flex text-sm ml-2 basis-full md:basis-1/2 p-3 rounded-xl">{item.content}</span>
                            </div> :
                            <div className="flex flex-row w-full place-content-start mb-2 overflow-auto">
                                <div className=" bg-teal-200 basis-full md:basis-1/2 rounded-xl p-2">
                                    <ReactMarkdown remarkPlugins={[gfm]} children={item.content}></ReactMarkdown>
                                </div>
                            </div>}
                    </div>)}
                    <label className="font-bold text-sm uppercase mt-3 mb-1">
                        Prompt
                    </label>
                    <textarea className="rounded-lg bg-slate-100 p-1 mb-3"
                        rows={2}
                        value={state.prompt}
                        onChange={(e) => setState({ ...state, prompt: e.target.value })}
                    />
                    <label className="font-bold text-sm uppercase mb-1">
                        Context
                    </label>
                    <textarea className="rounded-lg bg-slate-100 p-1"
                        rows={4}
                        value={state.context}
                        onChange={(e) => setState({ ...state, context: e.target.value })}
                    />
                </div>
                <div className="flex flex-row mt-4 mb-4">
                    <Button className="mr-3" pill={true} size={"sm"} onClick={onClickHandle} disabled={state.processing}>
                        {!state.processing ? "Submit" : <><Spinner className="mr-2" aria-label="Default status example" /> Processing</>}
                    </Button>
                    <Button color="warning" className="mr-3" pill={true} size={"sm"} onClick={() => setState({ ...state, prompt: "", payload: "{}", processing: false, completion: "no results" })}>
                        Clear
                    </Button>
                    <Button color="warning" className="mr-3" pill={true} size={"sm"} onClick={() => { setState({ ...state, prompt: "", context: "", role: "You are a general assistant.", payload: "{}", usage: "{}", processing: false, completion: "no results" }); setHistory([]) }}>
                        Clear All
                    </Button>
                </div>
            </div>

            <Results usage={state.usage} payload={state.payload} markdown={state.completion} processing={state.processing} status={state.status} />
        </div >
    )
}
export default Playground;