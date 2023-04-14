import { useEffect, useState } from "react";
import { getDavinciCompletion } from "../services";
import { IDavinciPrompt, ISettings } from "../interfaces";
import "./promptarea.css";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const PromptArea = (props: { prompt: string; settings: ISettings }) => {
  const [prompt, setPrompt] = useState(props.prompt);
  const [completion, setCompletion] = useState<string>("");
  //const [loaded, setLoaded] = useState(false);
  let loaded = false;

  useEffect(() => {
    if (!loaded) {
      let promptOptions: IDavinciPrompt = {
        prompt,
        context: "",
        temperature: parseFloat(props.settings.temperature),
        max_tokens: parseInt(props.settings.max_tokens),
        n: parseInt(props.settings.n),
      };
      console.info("Request");
      console.info(promptOptions);
      getDavinciCompletion(promptOptions).then((ans) => {
        console.info("Response");
        console.info(ans);
        if (ans && ans.choices.length > 0) {
          setCompletion(ans.choices[0].text);
        } else {
          setCompletion("");
        }
      });
      loaded = true;
    }
  }, []);

  const cleanAndTransform = (text: string) => {
    const tag = "<br/>";
    let temp = text.replace(/(?:\r\n|\r|\n)/g, tag);
    let aTemp = temp.split(tag);
    let html = aTemp
      .join(tag)
      .split(tag + tag)
      .join(tag);
    return html;
  };

  return (
    <div className="mb-3">
      <ReactMarkdown children={completion} />
    </div>
  );
};

export default PromptArea;
