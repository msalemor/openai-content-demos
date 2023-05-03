import { BreakIntoSections, ogText } from "./book";
import { getLeaseAgreement } from "./lease-agreement";
import { getProjects } from "./projects";
import { getServers } from "./servers";

export interface IDemoContent {
  title: string;
  role: string;
  prompt: string;
  context: string;
  other: any | null;
}

export const demoContentContract: IDemoContent = {
  title: "Contract summary and risk analysis",
  role: "You are an assistant that help can summarize contracts, analyze risk, list action items, and answer questions.",
  prompt: "Summarize and analyze the risk.",
  context: getLeaseAgreement(),
  other: null,
};

export const demoContentTranslation: IDemoContent = {
  title: "Translation",
  role: "You are an assistant that can summarize documents, analyze risk, list action items, and answer questions.",
  prompt: "",
  context: ogText,
  other: BreakIntoSections(ogText),
};

export const demoContentProjects: IDemoContent = {
  title: "Project Analysis",
  role: "You are an assistant that can analyze project delivery. An unapproved project can be approved is in unapproved status, and can approved if it meets the 5K requirements or has an exception, includes a desired or approved workload (DAW), and has a well-defined condition of success (WDCOS). An active project is in activate status and does not have an ending date. A quality project is one that is a closed status, has met the conditions of success (COS), has completed a security engagement (SE), and has completed a resiliency review (RR) or one has been scheduled.",
  prompt:
    "Who are the engineers working on projects? Who are the PMs working on projects? How many projects can be approved? Out of the total number of delivered projects, how many projects have been delivered with quality?",
  context: getProjects(),
  other: null,
};

export const demoContentServers: IDemoContent = {
  title: "Data center analysis",
  role: "You are an assistant that can analyze server health in a data center.",
  prompt:
    "How many servers are in the data center? What are the normal operating ranges? What servers are not operating under normal conditions?",
  context: getServers(),
  other: null,
};

export const demoContentFinance: IDemoContent = {
  title: "Data center analysis",
  role: "You are an assistant help answer financial questions.",
  prompt:
    "How many investments in my portfolio? What is my best investment? What is my worst investment? Are there other investment options?",
  context: `Portfolio
MSFT, QTY: 100, Cost: $100, Current Price: $300
TSLA, QTY: 100, Cost: $900, Current Price: $250
FTEC, QTY: 500, Cost: $114, Current Price: $150
Other Options
MGK, average 10 year return 17.5%`,
  other: null,
};

export const demoSelectCompute: IDemoContent = {
  title: "Compute",
  role: "You are an assistant that can recommend an Azure compute service. Compute services include Azure App Services (AppService), Sprint Apps (Spring), Azure Batch (Batch), Virtual Machines (VMs), Azure Functions (AzFunc), Azure Container Instances (ACI), Azure Red Hat OpenShift (ARO), and Azure Kubernetes Service (AKS). AppService supports C#, Java, Python and Node.",
  prompt:
    "What compute do you recommend if I want to lift and shift, have access to my code and I don't have a lot of experience working with containers.",
  context: `AppService or Spring, Type: Lift and Shift, Container: No, Support Code: Yes, Commercial App: No
VMs, Type: Lift and Shift, Container: No, Code: Yes, Commercial App: Yes
VM, Type: New, Full Control: Yes
Batch, Type: New, Is HPC workload: yes
Spring, Type: New, Using Spring Boot Apps: Yes
AzFunc, Type: New, Serverless: Yes, Supported Code: Yes, Commercial App: No, Code: Yes
ACI, Type: New, Containers: Yes, Full Orchestration: No
ARO, Type: New, Containers: Yes, Red Hat Openshift: Yes
AKS, Type: New, Containers: Yes, Full Orchestration: Yes, Full Kubernetes API: Yes
AKS and OpenShift can also run on VMs`,
  other: null,
};

export const demos: IDemoContent[] = [
  demoContentContract,
  demoContentTranslation,
  demoContentProjects,
  demoContentServers,
];
