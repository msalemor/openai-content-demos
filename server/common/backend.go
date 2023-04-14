package common

import (
	"bytes"
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"
)

func Post(url string, body []byte, application Application) ([]byte, error) {
	log.Info("Sending POST request to OpenAI.")
	client := application.HttpClient
	r, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	r.Header.Add("Content-Type", "application/json")
	r.Header.Add("api-key", application.Settings.OpenAI_API_KEY)

	res, err := client.Do(r)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode == 200 {
		buf := new(bytes.Buffer)
		buf.ReadFrom(res.Body)
		log.Info("Successful POST request to OpenAI.")
		return buf.Bytes(), nil
	}
	msg := fmt.Sprintf("Error from server: %s", res.Status)
	log.Debug("POST request to OpenAI failed.")
	return nil, fmt.Errorf(msg)
}
