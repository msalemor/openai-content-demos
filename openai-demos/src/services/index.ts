import axios from "axios";
import {
  IChatPrompt,
  IChatCompletion,
  IDavinciPrompt,
  IDavinciCompletion,
} from "../interfaces";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const getDavinciCompletion = async (
  options: IDavinciPrompt
): Promise<IDavinciCompletion | null> => {
  // Azure OpenAI call
  const config = {
    headers: {
      "Content-Type": "application/json",
      "api-key": import.meta.env.VITE_OPENAI_KEY,
    },
  };
  const gptURI = import.meta.env.VITE_OPENAI_DAVINCI_URL;

  let prompt = "";
  if (!options.context) {
    prompt = options.prompt + "\n[context]\n" + options.context;
  } else {
    prompt = options.prompt;
  }

  const payload = {
    prompt,
    max_tokens: options.max_tokens,
    temperature: options.temperature,
    n: 1,
  };
  //console.info(JSON.stringify(payload));
  let response = await axios.post(gptURI, payload, config);
  if (response.status === 200) {
    const data = response.data;
    console.debug(JSON.stringify(data));
    return data;
  } else {
    console.error(response);
  }
  return null;
};

export const getChatCompletion = async (
  options: IChatPrompt
): Promise<IChatCompletion | null> => {
  // Azure OpenAI call
  const config = {
    headers: {
      "Content-Type": "application/json",
      "api-key": import.meta.env.VITE_OPENAI_KEY,
    },
  };
  const gptURI = import.meta.env.VITE_OPENAI_GPT_URL;
  const payload = {
    messages: options.messages,
    max_tokens: options.max_tokens,
    temperature: options.temperature,
    n: 1,
  };
  //console.info(JSON.stringify(payload));
  let response = await axios.post(gptURI, payload, config);
  if (response.status === 200) {
    const data = response.data;
    //console.debug(JSON.stringify(data));
    return data;
  } else {
    console.error(response);
  }
  return null;
};

export const getJson = async (url: string): Promise<any> => {
  let response = await axios.get(url);
  if (response.status === 200) {
    return response.data;
  }
  return null;
};

export const StateStore = () => {
  let temperature = 0.3;
  let max_tokens = 300;
  let sensitivity = false;

  return {
    temperature,
    max_tokens,
    sensitivity,
  };
};
