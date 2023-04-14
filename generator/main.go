package main

import (
	"encoding/json"
	"fmt"
	"genguides/common"
	"genguides/utils"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	df "github.com/go-gota/gota/dataframe"
	log "github.com/sirupsen/logrus"
	"github.com/subosito/gotenv"
)

var (
	Http_Client = &http.Client{}
	API_URI     string
	API_KEY     string
)

func make_call(payload common.DavinciPrompt) (common.DavinciCompletion, error) {
	var completion common.DavinciCompletion
	byteArray, err := json.Marshal(payload)
	if err != nil {
		return completion, err
	}

	byteArray, err = utils.Post(Http_Client, API_URI, API_KEY, byteArray)
	if err != nil {
		return completion, err
	}

	err = json.Unmarshal(byteArray, &completion)
	if err != nil {
		return completion, err
	}

	return completion, nil
}

func main() {

	gotenv.Load()
	API_URI = os.Getenv("OPENAI_DAVINCI_URI")
	API_KEY = os.Getenv("OPENAI_KEY")

	var waitGroup sync.WaitGroup

	prompts, _ := ioutil.ReadFile("data/prompts.csv")
	cities, _ := ioutil.ReadFile("data/cities.csv")

	log.Info("Loading source files")
	citiesFrame := df.ReadCSV(strings.NewReader(string(cities)))
	promptsFrame := df.ReadCSV(strings.NewReader(string(prompts)),
		df.WithDelimiter('|'),
		df.HasHeader(true))

	// Create the output directory
	os.RemoveAll("output")
	os.Mkdir("output", 0755)

	// Send the content requests
	cityCount := 0
	for _, cityRow := range citiesFrame.Records() {
		if cityCount == 0 {
			cityCount++
			continue
		}
		city := cityRow[0]
		country := cityRow[1]

		log.Info(fmt.Sprintf("Processing: %s", city))
		os.Mkdir(fmt.Sprintf("output/%s-%s", city, country), 0755)
		promptCount := 0

		utils.Save_file(city, country, "main", "\n\n")

		for _, promptRow := range promptsFrame.Records() {
			if promptCount == 0 {
				promptCount++
				continue
			}
			section := promptRow[0]
			prompt := promptRow[1]

			waitGroup.Add(1)
			go func() {
				defer waitGroup.Done()
				payloadPrompt := strings.Replace(prompt, "{city}", city, -1)
				payloadPrompt = strings.Replace(payloadPrompt, "{country}", country, -1)
				log.Info(fmt.Sprintf("%s, % s %s", time.DateTime, "Request: ", payloadPrompt))

				payload := common.DavinciPrompt{
					Prompt:      payloadPrompt,
					Temperature: 0.3,
					MaxTokens:   300,
					N:           1,
					Stop:        nil,
				}

				completion, err := make_call(payload)
				if err != nil {
					log.Error(err)
					return
				}
				completionText := completion.Choices[0].Text
				//log.Info(fmt.Sprintf("%s: %s", time.DateTime, "response processed"))
				utils.Save_file(city, country, section, completionText)
			}()
			// Throttler
			time.Sleep(10 * time.Millisecond)
		}
	}
	log.Println("Waiting")
	waitGroup.Wait()
	log.Info("Processed all content")
}
