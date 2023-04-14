package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"genguides/common"
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

func Post(url string, body []byte) ([]byte, error) {
	//log.Info("Sending POST request to OpenAI.")
	request, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	request.Header.Add("Content-Type", "application/json")
	request.Header.Add("api-key", API_KEY)

	retries := 0
	for {
		res, err := Http_Client.Do(request)
		if err != nil {
			return nil, err
		}
		defer res.Body.Close()
		if res.StatusCode == 200 {
			buf := new(bytes.Buffer)
			buf.ReadFrom(res.Body)
			//log.Info("Successful POST request to OpenAI.")
			return buf.Bytes(), nil
		} else if res.StatusCode == 429 {
			if retries == 3 {
				log.Error("too many retries")
				return nil, fmt.Errorf("too many retries")
			}
			time.Sleep(100 * time.Millisecond)
			retries++
		} else {
			msg := fmt.Sprintf("Error from server: %s", res.Status)
			log.Error("POST request to OpenAI failed.")
			return nil, fmt.Errorf(msg)
		}
	}
}

func make_call(payload common.DavinciPrompt) (common.DavinciCompletion, error) {
	var completion common.DavinciCompletion
	byteArray, err := json.Marshal(payload)
	if err != nil {
		return completion, err
	}

	byteArray, err = Post(API_URI, byteArray)
	if err != nil {
		return completion, err
	}

	err = json.Unmarshal(byteArray, &completion)
	if err != nil {
		return completion, err
	}

	return completion, nil
}

func save_file(city, country, section, completionText string) {
	// Save to file
	now := time.DateTime
	metadata := fmt.Sprintf("---\nsection: %s\ncity: %s\ncountry: %s\ncreated: %s\n---\n", section, city, country, now)
	filename := fmt.Sprintf("output/%s-%s/%s.md", city, country, section)
	log.Info("Saving file name: ", filename)
	if err := os.WriteFile(filename, []byte(metadata+completionText), 0644); err != nil {
		log.Error(err)
	}
}

func main() {

	gotenv.Load()
	API_URI = os.Getenv("OPENAI_DAVINCI_URI")
	API_KEY = os.Getenv("OPENAI_KEY")

	var waitGroup sync.WaitGroup

	prompts, _ := ioutil.ReadFile("prompts.csv")
	cities, _ := ioutil.ReadFile("cities.csv")

	log.Info("Loading source files")
	citiesFrame := df.ReadCSV(strings.NewReader(string(cities)))

	promptsFrame := df.ReadCSV(strings.NewReader(string(prompts)),
		df.WithDelimiter('|'),
		df.HasHeader(true))

	os.RemoveAll("output")
	os.Mkdir("output", 0755)

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

		save_file(city, country, "main", "\n\n")

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
				//log.Info(fmt.Sprintf("%s, %s, %s, %s, %s", time.DateTime, city, country, payloadPrompt, completionText))
				log.Info(fmt.Sprintf("%s: %s", time.DateTime, "response processed"))
				save_file(city, country, section, completionText)
			}()
			// Throttler
			time.Sleep(10 * time.Millisecond)
		}
	}
	log.Println("Waiting")
	waitGroup.Wait()
	log.Info("Processed all content")
}
