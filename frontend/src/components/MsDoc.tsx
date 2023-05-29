import { useState } from "react"
import { IMessage, IPrompt, ISettings } from "../interfaces"
import { OpenAIServicePostPromise, PromiseAllAsync } from "../services"
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm";

const DocText = `Architect Azure applications for resiliency and availability
After you've developed the requirements for your application, the next step is to build resiliency and availability into it. These qualities can't be added at the end—you must design them into the architecture.

Plan for redundancy
Failures vary in scope of impact. Some hardware failures, such as a failed disk, affect a single host machine. A failed network switch, however, could affect an entire server rack. Less common failures, such as loss of power, disrupt a whole datacenter. Rarely an entire region becomes unavailable.

Redundancy is one way to make an application resilient. The level of redundancy depends on your business requirements—not every application needs redundancy across regions to guard against a regional outage. Generally, there's a tradeoff between greater redundancy and reliability versus lower costs and less complexity.

Review Azure redundancy features
Azure has many redundancy features at every level of failure, from an individual virtual machine (VM) to an entire region.

Single VMs have an uptime service level agreement (SLA) provided by Azure. (The VM must use premium storage for all operating system disks and data disks.) Although you can get a higher SLA by running two or more VMs, a single VM might be reliable enough for some workloads. For production workloads, however, we recommend using two or more VMs for redundancy.

Availability sets protect against localized hardware failures, such as a disk or network switch failing. VMs in an availability set are distributed across up to three fault domains. A fault domain defines a group of VMs that share a common power source and network switch. If a hardware failure affects one fault domain, network traffic is routed to VMs in the other fault domains. For more information about availability sets, see Manage the availability of Windows virtual machines in Azure.

Availability Zones are physically separate zones within an Azure region. Each Availability Zone has a distinct power source, network, and cooling. Deploying VMs across Availability Zones helps to protect an application against datacenter-wide failures. Not all regions support Availability Zones. For a list of supported regions and services, see What are Availability Zones in Azure?.

If you plan to use Availability Zones in your deployment, first validate that your application architecture and codebase support this configuration. If you deploy commercial software, consult with the software vendor and test adequately before deploying into production. An application must maintain state and prevent loss of data during an outage within the configured zone. The application must support running in an elastic and distributed infrastructure with no hard-coded infrastructure components.

Azure Site Recovery replicates Azure Virtual Machines to another Azure region for business continuity (BC) and disaster recovery (DR) needs. You can conduct periodic DR drills to ensure that you meet the compliance needs. The VM is replicated with the specified settings to the selected region so you can recover your applications in the event of outages in the source region. For more information, see Set up disaster recovery to a secondary Azure region for an Azure VM.

During testing, verify that the recovery time objective (RTO) and recovery point objective (RPO) meet your needs. RTO is the maximum time an application is unavailable after an incident, and RPO is the maximum duration of data loss during a disaster.

Paired regions are created using Azure Traffic Manager to distribute Internet traffic to different regions, protecting an application against a regional outage. Each Azure region is paired with another region. Together, these regions form a regional pair. To meet data residency requirements for tax and law enforcement jurisdiction purposes, regional pairs are located within the same geography (except for Brazil South).

To improve application resiliency, Azure serializes platform updates (planned maintenance) across each region pair, so only one paired region is updated at a time.

When you design a multi-region application, take into account that network latency across regions is higher than within a region. For example, if you replicate a database to enable failover, use synchronous data replication within a region but asynchronous data replication across regions.`

interface IHistory {
    prompt: string
    completion: string
}

const MsDoc = (props: { settings: ISettings }) => {

    let questions: IHistory[] = []
    let [state, setState] = useState(questions)

    let [question, setQuestion] = useState("")

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            onSubmit();
        }
    }

    const onSubmit = async () => {
        console.info(question)
        const prompt = question + "\n[context]\n" + DocText

        let messages: IMessage[] = []
        messages.push({ role: "system", content: "You are a general assistant." })
        messages.push({
            role: "user", content: prompt
        })
        let payload: IPrompt = {
            prompt,
            messages: props.settings.model === "GPT" ? messages : null,
            max_tokens: props.settings.max_tokens,
            temperature: props.settings.temperature,
            n: props.settings.n,
            stop: props.settings.stop === "" ? null : props.settings.stop,
        }
        setQuestion("Processing ...")
        let task = OpenAIServicePostPromise(props.settings.model, payload);
        let promises = await PromiseAllAsync([task])
        let completion = ""
        //let status = ""
        const data = promises[0].data
        if (props.settings.model === "Davinci") {
            completion = data.choices[0].text
            status = data.choices[0].finish_reason
        } else {
            completion = data.choices[0].message.content
            status = data.choices[0].finish_reason
        }
        setQuestion("")
        setState([...state, { prompt: question, completion: completion }])
    }

    return (
        <div className="flex flex-row flex-nowrap gap-x-2 w-100 shadow-md mt-2 rounded-lg">
            <div className="content basis-2/3 bg-slate-100 rounded-lg p-3">
                <h1 className="font-bold mb-2">Architect Azure applications for resiliency and availability</h1>
                <p>After you've developed the requirements for your application, the next step is to build resiliency and availability into it. These qualities can't be added at the end—you must design them into the architecture.</p>
                <h2 className="text-4xl font-bold mb-2" id="plan-for-redundancy">Plan for redundancy</h2>
                <p>Failures vary in scope of impact. Some hardware failures, such as a failed disk, affect a single host machine. A failed network switch, however, could affect an entire server rack. Less common failures, such as loss of power, disrupt a whole datacenter. Rarely an entire region becomes unavailable.</p>
                <p>Redundancy is one way to make an application resilient. The level of redundancy depends on your business requirements—not every application needs redundancy across regions to guard against a regional outage. Generally, there's a tradeoff between greater redundancy and reliability versus lower costs and less complexity.</p>
                <h3 className="text-3xl font-bold mb-2" id="review-azure-redundancy-features">Review Azure redundancy features</h3>
                <p>Azure has many redundancy features at every level of failure, from an individual virtual machine (VM) to an entire region.</p>
                <ul>
                    <li><p><strong>Single VMs</strong> have an <a href="https://azure.microsoft.com/support/legal/sla/virtual-machines" data-linktype="external">uptime service level agreement (SLA)</a> provided by Azure. (The VM must use premium storage for all operating system disks and data disks.) Although you can get a higher SLA by running two or more VMs, a single VM might be reliable enough for some workloads. For production workloads, however, we recommend using two or more VMs for redundancy.</p>
                    </li>
                    <li><p><strong>Availability sets</strong> protect against localized hardware failures, such as a disk or network switch failing. VMs in an availability set are distributed across up to three <em>fault domains</em>. A fault domain defines a group of VMs that share a common power source and network switch. If a hardware failure affects one fault domain, network traffic is routed to VMs in the other fault domains. For more information about availability sets, see <a href="/en-us/azure/virtual-machines/windows/manage-availability" data-linktype="absolute-path">Manage the availability of Windows virtual machines in Azure</a>.</p>
                    </li>
                    <li><p><strong>Availability Zones</strong> are physically separate zones within an Azure region. Each Availability Zone has a distinct power source, network, and cooling. Deploying VMs across Availability Zones helps to protect an application against datacenter-wide failures. Not all regions support Availability Zones. For a list of supported regions and services, see <a href="/en-us/azure/availability-zones/az-overview" data-linktype="absolute-path">What are Availability Zones in Azure?</a>.</p>
                        <p>If you plan to use Availability Zones in your deployment, first validate that your application architecture and codebase support this configuration. If you deploy commercial software, consult with the software vendor and test adequately before deploying into production. An application must maintain state and prevent loss of data during an outage within the configured zone. The application must support running in an elastic and distributed infrastructure with no hard-coded infrastructure components.</p>
                    </li>
                    <li><p><strong>Azure Site Recovery</strong> replicates Azure Virtual Machines to another Azure region for business continuity (BC) and disaster recovery (DR) needs. You can conduct periodic DR drills to ensure that you meet the compliance needs. The VM is replicated with the specified settings to the selected region so you can recover your applications in the event of outages in the source region. For more information, see <a href="/en-us/azure/site-recovery/azure-to-azure-quickstart" data-linktype="absolute-path">Set up disaster recovery to a secondary Azure region for an Azure VM</a>.</p>
                        <p>During testing, verify that the <em>recovery time objective</em> (RTO) and <em>recovery point objective</em> (RPO) meet your needs. RTO is the maximum time an application is unavailable after an incident, and RPO is the maximum duration of data loss during a disaster.</p>
                    </li>
                    <li><p><strong>Paired regions</strong> are created using Azure Traffic Manager to distribute Internet traffic to different regions, protecting an application against a regional outage. Each Azure region is paired with another region. Together, these regions form a <a href="/en-us/azure/best-practices-availability-paired-regions" data-linktype="absolute-path"><em>regional pair</em></a>. To meet data residency requirements for tax and law enforcement jurisdiction purposes, regional pairs are located within the same geography (except for Brazil South).</p>
                        <p>To improve application resiliency, Azure serializes platform updates (planned maintenance) across each region pair, so only one paired region is updated at a time.</p>
                    </li>
                    <li><p>When you design a multiregion application, take into account that network latency across regions is higher than within a region. For example, if you replicate a database to enable failover, use synchronous data replication within a region but asynchronous data replication across regions.</p>
                    </li>
                </ul>

            </div>
            <div className="basis-1/3 bg-slate-800 p-3 text-white rounded-lg">
                <div className="flex flex-col w-full">
                    <textarea className="rounded-lg p-1 mt-3 mb-4 text-black" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What is your question about this document? Press ENTER to submit." rows={2} onKeyDown={(e) => onKeyDown(e)}></textarea>
                    <div className="flex flex-col w-full overflow-auto">
                        {state.map((q, idx) => <div key={idx}>
                            <div className="flex flex-row w-full place-content-end mb-3">
                                <div className="bg-sky-300 flex text-sm ml-2 basis-full md:basis-3/4 p-3 rounded-xl text-sky-950">{q.prompt}</div>
                            </div>
                            <div className="flex flex-row w-full place-content-start mb-3">
                                <div className="bg-teal-200 flex text-sm ml-2 basis-full md:basis-3/4 p-3 rounded-xl text-teal-950">
                                    <div className="flex flex-col w-full">
                                        <ReactMarkdown remarkPlugins={[gfm]} children={q.completion}></ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MsDoc