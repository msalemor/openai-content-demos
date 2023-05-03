import { FormEvent, useEffect, useReducer, useState } from "react";
import "./askme.css";
import {
  IChatCompletion,
  IChatMessage,
  IChatPrompt,
  IDavinciPrompt,
  ISettings,
} from "../interfaces";
import {
  StateStore,
  getChatCompletion,
  getDavinciCompletion,
  getJson,
} from "../services";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import {
  IDemoContent,
  demoContentContract,
  demoContentFinance,
  demoContentProjects,
  demoContentServers,
} from "../demos";

const AksMe = (props: { settings: ISettings }) => {
  // Constants
  const Default_Role_Text = "You are a general assistant.";
  const Default_Role_Text_Context =
    "You are a general assistant that can answer question based on the following:";
  const SCRAPPER_URI = "/api/uricontent";
  const CONTEXT_DIVIDER = "[context]";
  let startModel: IChatPrompt = {
    messages: [],
    context: "",
    temperature: parseFloat(props.settings.temperature),
    max_tokens: parseInt(props.settings.max_tokens),
    n: parseInt(props.settings.n),
  };
  const contentTypeConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let [prompt, setPrompt] = useState<string>("");
  let [roleText, setRoleText] = useState<string>("");
  let [context, setContext] = useState<string>("");
  let [completion, setCompletion] = useState<IChatCompletion | null>(null);
  let [completionText, setCompletionText] = useState<string>("");
  let [payload, setPayload] = useState<string>("");
  let [uriContent, setUriContent] = useState({
    uri: "",
    elementType: "div",
    attribute: "class",
    attributeID: "",
  });
  let [selectedOption, setSelectedOption] = useState<string>("GPT");
  const [, forceRender] = useReducer((s) => s + 1, 0);

  const onClear = (prevent: boolean) => {
    setPrompt("");
    if (!prevent) {
      setContext("");
      setUriContent({
        uri: "",
        elementType: "div",
        attribute: "class",
        attributeID: "",
      });
    }
    setPayload("");
    //setCompletion(null);
    setCompletionText("");
  };

  const processGPT = async () => {
    const messages: IChatMessage[] = [];
    let siteContent = "";
    let finalContext = "";

    if (uriContent.uri !== "") {
      const contentRequest = {
        uri: uriContent.uri,
        elementType: uriContent.elementType,
        attribute: uriContent.attribute,
        attributeID: uriContent.attributeID,
      };
      let resp = await axios.post(
        SCRAPPER_URI,
        contentRequest,
        contentTypeConfig
      );
      siteContent = resp.data ?? "";
    }

    if (context !== "" && siteContent !== "") {
      finalContext = context + "\n" + siteContent;
    } else if (context !== "" && siteContent === "") {
      finalContext = context;
    } else if (context === "" && siteContent !== "") {
      finalContext = siteContent;
    }

    if (finalContext !== "") {
      messages.push({
        role: "system",
        content:
          (roleText === "" ? Default_Role_Text_Context : roleText) +
          "\n[context]\n" +
          finalContext,
      });
      messages.push({
        role: "user",
        content: prompt,
      });
    } else {
      messages.push({
        role: "system",
        content: roleText === "" ? Default_Role_Text : roleText,
      });
      messages.push({
        role: "user",
        content: prompt,
      });
    }

    let payload: IChatPrompt = {
      ...startModel,
      messages,
      context: finalContext,
    };

    setPayload(JSON.stringify(payload, null, 2));
    let completion = await getChatCompletion(payload);
    setCompletion(completion);
    setCompletionText(completion?.choices[0].message.content ?? "");
  };

  const processDavinci = async () => {
    let finalPrompt = prompt;
    let finalContent = "";
    let siteContent = "";

    if (uriContent.uri !== "") {
      const contentRequest = {
        uri: uriContent.uri,
        elementType: uriContent.elementType,
        attribute: uriContent.attribute,
        attributeID: uriContent.attributeID,
      };
      let resp = await axios.post(
        SCRAPPER_URI,
        contentRequest,
        contentTypeConfig
      );
      siteContent = resp.data ?? "";
    }

    if (context !== "" && siteContent !== "") {
      finalContent = context + "\n" + siteContent;
    } else if (context !== "" && siteContent === "") {
      finalContent = context;
    } else if (context === "" && siteContent !== "") {
      finalContent = siteContent;
    }

    if (finalContent !== "") {
      finalPrompt += "\n" + CONTEXT_DIVIDER + "\n" + finalContent;
    }

    let payload: IDavinciPrompt = {
      prompt: finalPrompt,
      context: context,
      temperature: parseFloat(props.settings.temperature),
      max_tokens: parseInt(props.settings.max_tokens),
      n: parseInt(props.settings.n),
    };

    //console.info(payload);
    setPayload(JSON.stringify(payload, null, 2));
    let completion = await getDavinciCompletion(payload);

    //setCompletion(completion);
    const ans = completion?.choices[0].text;
    setCompletionText(ans ?? "");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.info(selectedOption);

    if (selectedOption === "GPT") {
      await processGPT();
    } else if (selectedOption === "DAVINCI") {
      await processDavinci();
    }
  };

  const onRadioValueChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  enum DemoArea {
    Servers,
    Projects,
    Finance,
    Lease,
  }

  const loadContent = (area: DemoArea) => {
    let demoContent: IDemoContent | null = null;
    switch (area) {
      case DemoArea.Servers:
        demoContent = demoContentServers;
        break;
      case DemoArea.Projects:
        demoContent = demoContentProjects;
        break;
      case DemoArea.Finance:
        demoContent = demoContentFinance;
        break;
      case DemoArea.Lease:
        demoContent = demoContentContract;
        break;
      default:
        break;
    }
    if (demoContent !== null) {
      setRoleText(demoContent.role);
      setPrompt(demoContent.prompt);
      setContext(demoContent.context);
    }
  };

  useEffect(() => {
    forceRender();
    console.info("rendering");
  }, [props.settings]);
  return (
    <div className="askme">
      <h2>Ask me anything</h2>

      <section>
        <div className="areaTitle">Prompt & Context</div>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="mb-3">
            <label htmlFor="systemrole" className="form-label">
              GPT System Role
            </label>
            <textarea
              className="form-control"
              id="systemrole"
              onChange={(e) => setRoleText(e.target.value)}
              rows={2}
              placeholder="You are a general assistant."
              value={roleText}
              disabled={selectedOption === "DAVINCI"}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="prompt" className="form-label">
              Prompt
            </label>
            <textarea
              className="form-control"
              id="prompt"
              aria-describedby="emailHelp"
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder="prompt"
              value={prompt}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Context
            </label>
            <textarea
              className="form-control"
              id="context"
              placeholder="context"
              onChange={(e) => setContext(e.target.value)}
              rows={5}
              value={context}
            />
          </div>
          <div className="row">
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                placeholder="URL"
                aria-label="URL"
                value={uriContent.uri}
                onChange={(e) => {
                  setUriContent({
                    ...uriContent,
                    uri: e.target.value,
                  });
                }}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="div"
                aria-label="Element"
                value={uriContent.elementType}
                onChange={(e) => {
                  setUriContent({
                    ...uriContent,
                    elementType: e.target.value,
                  });
                }}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="attribute type <class, ID>"
                aria-label="Attribute Type"
                value={uriContent.attribute}
                onChange={(e) => {
                  setUriContent({
                    ...uriContent,
                    attribute: e.target.value,
                  });
                }}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="main"
                aria-label="Attribute"
                value={uriContent.attributeID}
                onChange={(e) => {
                  setUriContent({
                    ...uriContent,
                    attributeID: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="mt-2">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger m-2"
              onClick={() => onClear(true)}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-danger me-2"
              onClick={() => onClear(false)}
            >
              Clear All
            </button>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="api"
                id="api1"
                value="GPT"
                checked={selectedOption === "GPT"}
                onChange={onRadioValueChange}
              />
              <label className="form-check-label" htmlFor="api1">
                GPT 3.5
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="api"
                id="api2"
                value="DAVINCI"
                checked={selectedOption === "DAVINCI"}
                onChange={onRadioValueChange}
              />
              <label className="form-check-label" htmlFor="api2">
                Davinci
              </label>
            </div>
          </div>
          <div className="mt-2">
            <button
              className="btn btn-secondary me-2"
              onClick={() => loadContent(DemoArea.Servers)}
            >
              Data Center
            </button>
            <button
              className="btn btn-secondary me-2"
              onClick={() => loadContent(DemoArea.Projects)}
            >
              Projects
            </button>
            <button
              className="btn btn-secondary me-2"
              onClick={() => loadContent(DemoArea.Finance)}
            >
              Finance
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => loadContent(DemoArea.Lease)}
            >
              Contract
            </button>
          </div>
        </form>
      </section>

      <hr />
      <section>
        <div className="areaTitle">Completion</div>

        <div className="row">
          <div className="col-md-4">
            <section>
              <label>Payload</label>
              <div className="">
                {props.settings.sensitive ? (
                  <div>Sensitive Information.</div>
                ) : (
                  <textarea
                    className="form-control bg-dark text-light"
                    readOnly={true}
                    rows={10}
                    value={payload}
                  />
                )}
              </div>
            </section>
          </div>
          <div className="col-md-8">
            <section>
              <label>Completion</label>
              <div>
                {/* <textarea
                className="form-control"
                readOnly={false}
                rows={10}
                value={completionText}
              />
               */}
                <section className="bg-light">
                  <ReactMarkdown children={completionText} />
                </section>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AksMe;
