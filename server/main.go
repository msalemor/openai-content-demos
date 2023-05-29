package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"server/common"
	"strconv"

	"github.com/anaskhan96/soup"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	log "github.com/sirupsen/logrus"
	"github.com/vic3lord/stocks"
)

func main() {

	stock, err := stocks.GetQuote("AAPL")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Print(stock)

	application := common.New()

	//fiber 2.0
	app := fiber.New(fiber.Config{})

	// Logger middleware
	app.Use(logger.New())
	app.Use(cors.New())

	app.Get("/info", func(c *fiber.Ctx) error {
		return c.SendString("This is an API server serving APIs at: /api/gpt and /api/davinci")
	})

	app.Post("/api/gpt", func(c *fiber.Ctx) error {
		// Deserialize the body
		var payload common.ChatGPTPrompt
		if err := c.BodyParser(&payload); err != nil {
			return err
		}
		// Serialize the payload
		bytes, err := json.Marshal(payload)
		log.Println(string(bytes))
		if err != nil {
			return c.SendString(err.Error())
		}
		// Post it to the actual GPT endpoint
		bytes, err = common.Post(application.Settings.OpenAI_GPT_URL, bytes, application)
		if err != nil {
			return c.SendString(err.Error())
		}
		// Deserialize the response
		var completion common.ChatGPTCompletion
		err = json.Unmarshal(bytes, &completion)
		if err != nil {
			return err
		}
		// Send the json response
		return c.JSON(completion)
	})

	app.Post("/api/davinci", func(c *fiber.Ctx) error {
		// Deserialize the body
		var payload common.DavinciPrompt
		if err := c.BodyParser(&payload); err != nil {
			return err
		}
		// Serialize the payload
		bytes, err := json.Marshal(payload)
		if err != nil {
			return c.SendString(err.Error())
		}
		// Post it to the actual GPT endpoint
		bytes, err = common.Post(application.Settings.OpenAI_DAVINCI_URL, bytes, application)
		if err != nil {
			return c.SendString(err.Error())
		}
		// Deserialize the response
		var completion common.DavinciCompletion
		err = json.Unmarshal(bytes, &completion)
		if err != nil {
			return err
		}
		// Send the json response
		return c.JSON(completion)
	})

	app.Post("/api/uricontent", func(c *fiber.Ctx) error {
		// Deserialize the body
		var payload common.URIContentRequest
		if err := c.BodyParser(&payload); err != nil {
			return err
		}
		log.Info(payload)
		resp, err := soup.Get(payload.URI)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(common.URIContentResponse{Content: "Error"})
		}
		doc := soup.HTMLParse(resp)
		div := doc.Find(payload.ElementType, payload.Attribute, payload.AttributeID)
		if div.Error != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(common.URIContentResponse{Content: "Error"})
		}
		// Send the json response
		page_content := div.FullText()
		re := regexp.MustCompile(`[ \t\r\f\v]+`)
		output := re.ReplaceAllString(page_content, " ")
		re = regexp.MustCompile(`\n+`)
		output = re.ReplaceAllString(output, "\n")
		re = regexp.MustCompile(`\n\s+`)
		output = re.ReplaceAllString(output, "\n ")
		return c.JSON(common.URIContentResponse{Content: output})
	})

	// Configure the static server
	app.Static("/", "./public")

	// Start the server
	log.Info("Server is running on port: ", application.Settings.Application_Port)
	app.Listen(":" + strconv.Itoa(application.Settings.Application_Port))
}
