export interface IChatPrompt {
  messages: IChatMessage[];
  context: string;
  temperature: number;
  max_tokens: number;
  n: number;
}

export interface IDavinciCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: IDavinciChoice[];
  usage: IUsage;
}

export interface IDavinciPrompt {
  prompt: string;
  context: string;
  temperature: number;
  max_tokens: number;
  n: number;
}

export interface IDavinciChoice {
  text: string;
  index: number;
  finish_reason: string | null;
  logprobs: string | null;
}

export interface IChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: IChatChoice[];
  usage: IUsage;
}

export interface IChatChoice {
  index: number;
  finish_reason: string;
  message: IChatMessage;
}

export interface IUsage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

export interface IChatMessage {
  role: string;
  content: string;
}

export interface ICity {
  city: string;
  country: string;
  airport: string;
  attraction_images: IAttractionImage[];
}

export interface IAttractionImage {
  name: string;
  image_url: string;
}

export interface ICompletionResponse {
  prompt: string;
  completion: string;
  error?: string | null;
}

export interface IAreas {
  visa: string;
  transportation: string;
  attractions: string;
  walkingTour: string;
}

export interface IProduct {
  id: number;
  make: string;
  model: string;
  color: string;
  features: string[];
  warranty: string;
  price: number;
  description?: string;
}

export interface ISettings {
  temperature: string;
  max_tokens: string;
  n: string;
  sensitive: boolean;
}
