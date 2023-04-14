package common

import (
	"net/http"
	"os"
	"strconv"

	dotenv "github.com/joho/godotenv"
)

func getSettings() AppSettings {
	dotenv.Load()
	openai_api_key := os.Getenv("OPENAI_API_KEY")
	openai_gpt_url := os.Getenv("OPENAI_GPT_URI")
	openai_davinci_url := os.Getenv("OPENAI_DAVINCI_URI")
	sport := os.Getenv("APPLICATION_PORT")
	port := 3000
	if sport != "" {
		port, _ = strconv.Atoi(sport)
	}
	appSettings := AppSettings{OpenAI_API_KEY: openai_api_key, OpenAI_GPT_URL: openai_gpt_url, OpenAI_DAVINCI_URL: openai_davinci_url, Temperature: 0.9, MaxTokens: 100, N: 1, Stop: nil, Application_Port: port}
	return appSettings
}

func New() Application {
	client := &http.Client{}
	return Application{Settings: getSettings(), HttpClient: client}
}
