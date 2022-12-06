import axios from "axios";
import AWS from "aws-sdk";
import wav from "node-wav";
import Speaker from "node-speaker";

// Use the OpenAI API to generate text
async function generateText(prompt, temperature) {
  // Set the request parameters
  const endpoint = "https://api.openai.com/v1/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${process.env.OPENAI_API_KEY}",
  };
  const body = {
    prompt,
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
  const polly = new AWS.Polly({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",  // Replace with your region
  });

  // Specify the text to synthesize and the voice to use
  const params = {
    Text: text,
    VoiceId: voice,
    OutputFormat: "pcm",
  };

  // Synthesize the text using the specified voice
  const response = await polly.synthesizeSpeech(params).promise();
  return response.AudioStream;
}

// Play the synthesized audio using the default audio device
async function playAudio(audioStream) {
  // Convert the audio data from PCM format to WAV format
  const audioBuffer = await wav.decode(audioStream);

  // Play the audio using the default audio device
  Speaker.play(audioBuffer.channelData[0], {
    sampleRate: audioBuffer.sampleRate,
  });
}
