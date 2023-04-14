package utils

import (
	"bytes"
	"fmt"
	"net/http"
	"time"

	log "github.com/sirupsen/logrus"
)

func Post(httpClient *http.Client, url string, key string, body []byte) ([]byte, error) {
	//log.Info("Sending POST request to OpenAI.")
	request, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	request.Header.Add("Content-Type", "application/json")
	request.Header.Add("api-key", key)

	retries := 0
	for {
		res, err := httpClient.Do(request)
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
