// Replace the API key with a placeholder
const openAiApiKey = "{{OPENAI_API_KEY}}";
const prompt = args[0];

// make HTTP request
const url = 'https://api.openai.com/v1/completions';
console.log(`HTTP GET Request to ${url}`);

const OpenAIRequest = fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${openAiApiKey}`,
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0,
    max_tokens: 1000,
  }),
});

const OpenAIResponse = await OpenAIRequest
if (OpenAIResponse.error) {
  console.error(OpenAIResponse.error)
  throw Error("Request failed")
}

console.log(OpenAIResponse)

const data = OpenAIResponse.data
if (data.Response === "Error") {
  console.error(data.Message)
  throw Error(`Functional error. Read message: ${data.Message}`)
}

// extract the reponse

let choices = OpenAIResponse.data.choices
let value = choices[0].text
let result = value.replace(/[\n\r]/g, "")
let uintValue = parseInt(result, 10);

console.log(result)


return Functions.encodeUint256(uintValue)

// ... (rest of the code remains the same)
