import { ISettings } from "../interfaces";

const Settings = (props: { settings: ISettings, setSettings: any }) => {
    return (

        <div className='flex flex-row flex-wrap p-3 bg-slate-600 text-white align-middle'>
            <div className='flex flex-row place-items-center mr-4'>
                <label className='flex mr-2 uppercase text-sm'>Model:</label>
                <input type='radio' name="model" id="model" className='mr-1' checked={props.settings.model === "GPT"} value="GPT" onChange={(e) => { props.setSettings({ ...props.settings, model: e.target.value }) }} /> <label className='mr-2'>GPT</label>
                <input type='radio' name="model" id="model" className='mr-2' checked={props.settings.model === "Davinci"} value="Davinci" onChange={(e) => { props.setSettings({ ...props.settings, model: e.target.value }) }} /> <label className='mr-2'>Davinci</label>
            </div>
            <div className='flex flex-row place-items-center mr-4'>
                <label className='flex mr-2 uppercase text-sm'>Max Tokens:</label>
                {/* <label className='bg-slate-200 p-1 text-black font-mono rounded text-sm'>{settings.max_tokens}</label> */}
                <input type='text' className='bg-slate-200 text-black rounded pr-1 pl-1 pt-0 pb-0 w-20' value={props.settings.max_tokens} onChange={(e) => { props.setSettings({ ...props.settings, max_tokens: e.target.value }) }} />
            </div>
            <div className='flex flex-row place-items-center mr-4'>
                <label className='flex mr-2 uppercase text-sm'>Temperature:</label>
                {/* <label className='bg-slate-200 p-1 text-black font-mono rounded text-sm'>{settings.temperature}</label> */}
                <input type='text' className='bg-slate-200 text-black rounded pr-1 pl-1 pt-0 pb-0 w-20' value={props.settings.temperature} onChange={(e) => { props.setSettings({ ...props.settings, temperature: e.target.value }) }} />
            </div>
            <div className='flex flex-row place-items-center mr-4'>
                <label className='flex mr-2 uppercase text-sm'>N:</label>
                {/* <label className='bg-slate-200 p-1 text-black font-mono rounded text-sm'>{settings.n}</label> */}
                <input type='text' className='bg-slate-200 text-black rounded pr-1 pl-1 pt-0 pb-0 w-10' value={props.settings.n} readOnly={true} />
            </div>
            <div className='flex flex-row place-items-center mr-4'>
                <label className='flex mr-2 uppercase text-sm'>Stop:</label>
                {/* <label className='bg-slate-200 p-1 text-black font-mono rounded text-sm'>{settings.n}</label> */}
                <input type='text' className='bg-slate-200 text-black rounded pr-1 pl-1 pt-0 pb-0 w-10' value={props.settings.stop} onChange={(e) => { props.setSettings({ ...props.settings, stop: e.target.value }) }} />
            </div>
            {/* {props.settings.stop !== null ? <div className='flex flex-row place-items-center mr-4'>
                <label className='flex mr-2 uppercase text-sm'>STOP:</label>
                <label className='bg-slate-200 p-1 text-black font-mono rounded text-sm'>{props.settings.stop}</label>
            </div> : null} */}
        </div>
    )
}

export default Settings