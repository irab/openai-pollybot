import axios from "axios";
import fs from "fs";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import player from "node-wav-player";

// Use the OpenAI API to generate text
async function generateText(prompt, temperature) {
  // Set the request parameters
  const endpoint = "https://api.openai.com/v1/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
  };
  const body = {
    prompt,
    model: "text-davinci-003",
    max_tokens: 1024,
    n: 1,
    temperature,
  };

  // Call the OpenAI API to generate text
  const response = await axios.post(endpoint, body, { headers });
  return response.data.choices[0].text;
}

// Use the AWS Polly API to synthesize text
async function synthesizeText(text, voice) {
  // Set up the AWS Polly client
  const client = new PollyClient({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",  // Replace with your region
  });
  
  // Specify the text to synthesize and the voice to use
  const SynthesizeSpeechCommandInput = {
    Text: text,
    VoiceId: voice,
    OutputFormat: "mp3",
    Engine: "neural",  // Use the neural engine for text-to-speech synthesis
  }

  const command = new SynthesizeSpeechCommand(SynthesizeSpeechCommandInput);

  try {
    let data = await client.send(command)
    if (!data || !data.AudioStream) throw Error(`bad response`);
    await saveStream(data.AudioStream, "output.mp3")
  }
  catch(err) {
      console.log(err)
  }

  function saveStream(fromStream, filename) {
    return new Promise((resolve, reject) => {
        let toStream = fs.createWriteStream(filename)
        toStream.on('finish', resolve);
        toStream.on('error', reject);
        fromStream.pipe(toStream)
    })
  }

}

async function generateAndSaveAudio(prompt, temperature, voice) {
  // Generate text using the OpenAI API
  console.log(`${prompt}`);

  const text = await generateText(prompt, temperature);
  console.log(`Generated text: ${text}`);

  // Synthesize the generated text using the AWS Polly API
  await synthesizeText(text, voice);
  
  player.play({
    path: './output.mp3',
  }).then(() => {
    console.log('The wav file started to be played successfully.');
  }).catch((error) => {
    console.error(error);
  });
}

function promptFromArgs(){
  // Removes elements from offset of 0
process.argv.splice(0, 2);

return process.argv.join(' ');
}

generateAndSaveAudio(promptFromArgs(), 0.5, "Aria");