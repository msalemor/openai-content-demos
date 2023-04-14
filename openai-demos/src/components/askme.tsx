import { FormEvent, useEffect, useReducer, useState } from "react";
import "./askme.css";
import {
  IChatCompletion,
  IChatMessage,
  IChatPrompt,
  ISettings,
} from "../interfaces";
import { StateStore, getChatCompletion, getJson } from "../services";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const AksMe = (props: { settings: ISettings }) => {
  let startModel: IChatPrompt = {
    messages: [],
    context: "",
    temperature: parseFloat(props.settings.temperature),
    max_tokens: parseInt(props.settings.max_tokens),
    n: parseInt(props.settings.n),
  };

  let [prompt, setPrompt] = useState<string>("");
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (prompt !== "" && uriContent.uri === "") {
      const messages: IChatMessage[] = [];
      if (context !== "") {
        messages.push({
          role: "system",
          content:
            "You are a assistant that can answer questions using the following context:\n" +
            context,
        });
        messages.push({
          role: "user",
          content: prompt,
        });
      } else {
        messages.push({
          role: "system",
          content: "You are a general assistant.",
        });
        messages.push({
          role: "user",
          content: prompt,
        });
      }

      let payload: IChatPrompt = {
        ...startModel,
        messages,
        context: context,
      };
      //console.info(payload);
      setPayload(JSON.stringify(payload, null, 2));
      let completion = await getChatCompletion(payload);
      setCompletion(completion);
      setCompletionText(completion?.choices[0].message.content ?? "");
    } else if (prompt !== "" && uriContent.uri !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const contentRequest = {
        uri: uriContent.uri,
        elementType: uriContent.elementType,
        attribute: uriContent.attribute,
        attributeID: uriContent.attributeID,
      };
      axios
        .post("/api/uricontent", contentRequest, config)
        .then(async (resp: any) => {
          console.info(contentRequest, resp);
          const urlContext: string = resp.data.content;
          const messages: IChatMessage[] = [];
          messages.push({
            role: "system",
            content:
              "You are a assistant that can answer questions using the following context:\n" +
              urlContext,
          });
          messages.push({
            role: "user",
            content: prompt,
          });

          let payload: IChatPrompt = {
            ...startModel,
            messages,
            context: context,
          };
          //console.info(payload);
          setPayload(JSON.stringify(payload, null, 2));
          let completion = await getChatCompletion(payload);
          setCompletion(completion);
          setCompletionText(completion?.choices[0].message.content ?? "");
        });
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
            className="btn btn-danger"
            onClick={() => onClear(false)}
          >
            Clear All
          </button>
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
