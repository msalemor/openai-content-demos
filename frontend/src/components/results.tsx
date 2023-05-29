import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import gfm from 'remark-gfm'

const Results = (props: {
    payload: string
    usage: string,
    markdown: string
    processing: boolean
    status: string
}) => {
    const payloadRows = props.payload.split('\n').length

    return (
        <div className="flex flex-row flex-wrap md:flex-nowrap lg:flex-nowrap gap-x-3 gap-y-3">
            <div className="flex flex-col basis-full md:basis-1/3 shadow-md">
                <label className="bg-slate-800 text-white font-bold text-sm uppercase p-1 mb-1">Cost & Payload</label>
                <textarea
                    className=" bg-sky-300 text-black font-mono text-sm basis-full md:basis-1/3 rounded-lg p-1 mb-2"
                    rows={5}
                    readOnly={true}
                    value={props.usage}
                />
                <textarea
                    className="bg-slate-500 font-mono text-sm text-white basis-full md:basis-1/3 rounded-lg p-1"
                    rows={payloadRows > 20 ? 20 : payloadRows}
                    readOnly={true}
                    value={props.payload}
                />
            </div>
            <div className="flex flex-col basis-full md:basis-2/3 shadow-md">
                <label className="bg-slate-800 text-white font-bold text-sm uppercase p-1 mb-1">Completion</label>
                <p>

                    {props.status !== "" && props.status !== "stop" ? <>
                        <label className='uppercase'>Incomplete Response: <span
                            className="inline-block whitespace-nowrap rounded-full bg-red-300 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-red-900">
                            {props.status}
                        </span></label>
                    </> : null}
                </p>
                <div className="overflow-auto basis-full md:basis-2/3 h-max font-sans bg-slate-100 p-1 rounded-lg ">
                    <ReactMarkdown className='basis-full md:basis-2/3' remarkPlugins={[gfm]} children={props.markdown}></ReactMarkdown>
                </div>
            </div>
        </div>
    )
}
export default Results
