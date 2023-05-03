import { useState } from "react";
import { demoContentTranslation } from "../demos";
import { IDavinciPrompt, ISettings } from "../interfaces";
import ReactMarkdown from "react-markdown";
import { getDavinciCompletion, limiter, promiseAll } from "../services";
import axios from "axios";

function sleep(milliseconds: number) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

const Translation = (props: { settings: ISettings }) => {
  const demoContent = demoContentTranslation;
  let [content, setContent] = useState(demoContent.context);
  let [translation, setTranslation] = useState("");

  const Translate = async () => {
    let sections: string[] = demoContent.other;
    let content = "";
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      let promptOptions: IDavinciPrompt = {
        prompt:
          "Translate from English to Spanish the following text:\n" + section,
        context: "",
        temperature: parseFloat(props.settings.temperature),
        max_tokens: parseInt(props.settings.max_tokens),
        n: parseInt(props.settings.n),
      };
      //console.info(promptOptions);
      let resp: any = await getDavinciCompletion(promptOptions);
      const completion = resp.choices[0].text;
      content += (completion ?? "") + "\n\n";
      const newString = `${content}`;
      setTranslation(content);
    }

    // let translation: string[] = [];

    // sections.forEach(async (section) => {

    //   let responses = await axios.all()
    //   await Promise.all(sections.map(async (section) => {
    //   }));
    //   let promptOptions: IDavinciPrompt = {
    //     prompt:
    //       "Translate from English to Spanish the following text:\n" + section,
    //     context: "",
    //     temperature: parseFloat(props.settings.temperature),
    //     max_tokens: parseInt(props.settings.max_tokens),
    //     n: parseInt(props.settings.n),
    //   };
    //   let resp: any = await getDavinciCompletion(promptOptions);
    //   const completion = resp.choices[0].text;
    //   translation.push(completion);
    //   if (sections.length === translation.length) {
    //     let content = "";
    //     translation.forEach((t) => {
    //       content += t + "\n\n";
    //     });
    //     setTranslation(content);
    //   }
    // });

    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "api-key": import.meta.env.VITE_OPENAI_KEY,
    //   },
    // };
    // let promises: any[] = [];
    const gptURI = import.meta.env.VITE_OPENAI_DAVINCI_URL;
    // for (let i = 0; i < sections.length; i++) {
    //   //for (let i = 0; i < 5; i++) {
    //   const sectionText = sections[i];
    //   let payload: IDavinciPrompt = {
    //     prompt: `Translate the following text from English to Spanish:\n${sectionText}`,
    //     context: "",
    //     temperature: parseFloat(props.settings.temperature),
    //     max_tokens: parseInt(props.settings.max_tokens),
    //     n: parseInt(props.settings.n),
    //   };
    //   promises.push(axios.post(gptURI, payload, config));
    //   sleep(100);
    // }

    // const sectionPromises: any[] = sections.map((sectionText) => {
    //   let payload: IDavinciPrompt = {
    //     prompt: `Translate the following text from English to Spanish:\n${sectionText}`,
    //     context: "",
    //     temperature: parseFloat(props.settings.temperature),
    //     max_tokens: parseInt(props.settings.max_tokens),
    //     n: parseInt(props.settings.n),
    //   };
    //   return axios.post(gptURI, payload, config);
    // });

    // //let promisesData = await axios.all(promises);
    // let promisesData: any[] = await axios.all(sectionPromises);

    // for (let promise of promisesData) {
    //   console.info(promise);
    //   if (promise.data && promise.data.choices) {
    //     const completion = promise.data.choices[0].text;
    //     content += (completion ?? "") + "\n\n";
    //   }
    // }
    // const newContent = `${content}`;
    // //console.info(newContent);
    // setTranslation(newContent);

    // paragraphs.forEach(async (p) => {
    //   let prompt: IDavinciPrompt = {
    //     prompt: "Translate from English to Spanish.",
    //     context: p,
    //     max_tokens: 200,
    //     temperature: 0.1,
    //     n: 1,
    //   };
    //   let resp: any = await getDavinciCompletion(prompt);
    //   content += (resp.data ?? "") + "\n\n";
    //   setTranslation(content);
    // });
  };

  return (
    <div>
      <h2>Translation</h2>
      <p>Translate text from one language to another.</p>
      <div>
        Source Language: <input type="text" value="English" readOnly />
        <br />
        Target Language: <input type="text" value="Spanish" />
        <br />
        <button className="btn btn-primary" onClick={() => Translate()}>
          Translate
        </button>
      </div>
      <div className="row mt-2">
        <div className="col-md-6">
          <p>Original</p>
          <div className="bg-light p-1">
            <ReactMarkdown children={content} />
          </div>
        </div>
        <div className="col-md-6">
          <p>Translation</p>
          <div className="p-1">
            <ReactMarkdown children={translation} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Translation;
