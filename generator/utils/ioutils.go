package utils

import (
	"fmt"
	"os"
	"time"

	log "github.com/sirupsen/logrus"
)

func Save_file(city, country, section, completionText string) {
	// Save to file
	now := time.DateTime
	metadata := fmt.Sprintf("---\nsection: %s\ncity: %s\ncountry: %s\ncreated: %s\n---\n", section, city, country, now)
	filename := fmt.Sprintf("output/%s-%s/%s.md", city, country, section)
	log.Info("Saving file name: ", filename)
	if err := os.WriteFile(filename, []byte(metadata+completionText), 0644); err != nil {
		log.Error(err)
	}
}
