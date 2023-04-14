package common

import "net/http"

type AppSettings struct {
	OpenAI_API_KEY     string
	OpenAI_GPT_URL     string
	OpenAI_DAVINCI_URL string
	Application_Port   int
	Temperature        float32
	MaxTokens          int
	N                  int
	Stop               *string
}

type Application struct {
	HttpClient *http.Client
	Settings   AppSettings `json:"settings"`
}

type ChatGPTMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatGPTPrompt struct {
	Messages    []ChatGPTMessage `json:"messages"`
	Temperature float32          `json:"temperature"`
	MaxTokens   int              `json:"max_tokens"`
	N           int              `json:"n"`
	Stop        *string          `json:"stop"`
}

type ChatGPTCompletion struct {
	Id      string `json:"id"`
	Object  string `json:"object"`
	Created int    `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Message      ChatGPTMessage `json:"message"`
		Index        int            `json:"index"`
		Logprobs     interface{}    `json:"logprobs"`
		FinishReason string         `json:"finish_reason"`
	} `json:"choices"`
}

type DavinciPrompt struct {
	Prompt      string  `json:"prompt"`
	Temperature float32 `json:"temperature"`
	MaxTokens   int     `json:"max_tokens"`
	N           int     `json:"n"`
	Stop        *string `json:"stop"`
}

type DavinciCompletion struct {
	Id      string `json:"id"`
	Object  string `json:"object"`
	Created int    `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Text         string      `json:"text"`
		Index        int         `json:"index"`
		Logprobs     interface{} `json:"logprobs"`
		FinishReason string      `json:"finish_reason"`
	} `json:"choices"`
}

type URIContentRequest struct {
	URI         string `json:"uri"`
	ElementType string `json:"elementType"` // div, body, etc.
	Attribute   string `json:"attribute"`   // id, class
	AttributeID string `json:"attributeID"` // id or class name
}

type URIContentResponse struct {
	Content string `json:"content"`
}
