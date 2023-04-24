# Azure OpenAI Demo

The Azure OpenAI demo includes three areas: 

- **Product Descriptions**: this area simulates a call to a database to get structure product data, and then from each product data it generates a sales description. This area leverages the Azure Davinci OpenAI endpoint.
- **City Travel Guides**: this area is a more complex use case of content generation, in this area a full city travel guide is generated for a given city. This includes information such as the history, getting to downtown from the airport, a walking tour, entertainment options, etc. all in one Web page.  This area leverages the Azure Davinci OpenAI endpoint.
- **Ask Me Anything**:  this area leverages the Azure OpenAI ChatGPT 3.5 endpoint. This area of the demo is similar to other playgrounds, but it is designed to help understand prompting and setting context from a textbox area or by scrapping content from a URL.

## Requirements

- Azure Subscription
  - Access to the OpenAI Services
    - A Davinci deployment
    - A Gpt 3.5 turbo deployment
    - An API KEY for the deployments
- node v18.13.0 or latest and npm
- Go 1.20

## Demo Areas

The demo is meant to serve as a simulator to help you understand how to use the Azure OpenAI API could be leverage to build a variety of applications. The demo is broken into three areas:

## Ask Me Anything

This demo a playground for you to try out different prompts and see how the API responds. You can also set the context from text or scrapping a web site. The idea of this demo it to help the user understand how to set context when ChatGPT generates a completion from a prompt. This demo leverages the Azure GPT 3.5 endpoint.

## Product Description Generator

This demo will mock requesting a list of electronic consumer products, and the generating sales descriptions for the same. This demo leverages the Davinci endpoint.

## City Guides

This demo will mock building a travel guide for a city. The city guide is built by selecting from a list of cities or dynamically based on the city name that is entered. This demo leverages the Davinci endpoint. You can add more cities to the list by modifying the `openai-demos/public/data/list.json`. For the attraction images, I did not want to use images that I did not own. Only Rio de Janeiro has images.

## Static Generator

City guides generates the content dynamically. This means that every section of the page is rendered by making a call to OpenAI. This approach is for demo purposes to visualize what is happening. A better approach to generate such a site would be to generate static content for the different sections and then use a static site generator such as Jekyll or Hugo to buid such site. The static content generator generates such content.

## Stack

### Frontend

```text
"dependencies": {
    "axios": "^1.3.5",
    "bootstrap": "^5.2.3",
    "bootstrap-icons": "^1.10.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^8.0.6",
    "react-router-dom": "^6.10.0"
  }
```

### Backend: Go 1.20

```text
require (
	github.com/anaskhan96/soup v1.2.5
	github.com/gofiber/fiber/v2 v2.43.0
	github.com/joho/godotenv v1.5.1
	github.com/sirupsen/logrus v1.9.0
)
```

### Static Generation Job: Go 1.20

```text
require (
	github.com/go-gota/gota v0.12.0
	github.com/sirupsen/logrus v1.9.0
	github.com/subosito/gotenv v1.4.2
)
```

## Running the demo

### Running the demo directly from React

> Note: This demo can run directly from React

- Change directory to: `openai-demo`
- Type: `npm install`
- Create or edit an `.env` file and add the following values:

```bash
VITE_OPENAI_GPT_URL=<AZURE_GPT_ENDPOINT>
VITE_OPENAI_DAVINCI_URL=<AZURE_GPT_ENDPOINT>
VITE_OPENAI_KEY=<AZURE_API_KEY>
```

- Type: `npm run dev`
- Diagram:
```mermaid
flowchart LR
A((User)) --> B(frontend)
B --> C(Azure<br/>OpenAI API)
C --> B
B --> A
```
### Running the demo from the Go server

- Change directory to: `openai-demo`
- Create or edit an `.env` file and add or replace the following values:

```bash
VITE_OPENAI_GPT_URL=/api/gpt
VITE_OPENAI_DAVINCI_URL=/api/davinci
VITE_OPENAI_KEY=
VITE_CONTENT_URI=/
```

- Change directory to: `server`
- Create or edit an `.env` file and add the following values:

```bash
OPENAI_API_KEY=<KEY>
OPENAI_GPT_URI=https://<name>.openai.azure.com/openai/deployments/gpt/<gpt-deployment-name>/completions?api-version=2023-03-15-preview
OPENAI_DAVINCI_URI=https://<name>.openai.azure.com/openai/deployments/<davinci-deployment-name>/completions?api-version=2022-12-01
Temperature=0.3
MAX_TOKENS=300
N=1
APPLICATION_PORT=3000
```

- type: sh run.sh
- Diagram:
```mermaid
flowchart LR
A((User)) --> B(frontend)
B --> C(backend)
C --> D(Azure<br/>OpenAI API)
D --> C
C --> B
B --> A
```

### Running the Static Generation Job

- Change directory to: `generator`
- Add or edit the `.env` file with the following settings:

```bash
OPENAI_DAVINCI_URL=<AZURE_GPT_ENDPOINT>
OPENAI_KEY=<AZURE_API_KEY>
```

- Type: `go run .`
- Review the `output/` folder
