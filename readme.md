# Sample code to call the OpenAI API and synthesize it Polly - paritally generated with the OpenAI API itself

Only tested on an Intel-based Macbook. 

Uses [Polly's Aria](https://aws.amazon.com/blogs/machine-learning/meet-aria-the-first-new-zealand-english-accented-voice-for-amazon-polly-includes-limited-te-reo-maori-support/) voice, which get's some Māori pronunciation correct but also terribly mangles some other words


## Setup

## Prerequites

AWS and OpenAI API Keys exported into your environment


```
export AWS_ACCESS_KEY_ID=AK...
export AWS_SECRET_ACCESS_KEY=5...
export OPENAI_API_KEY=sk-...
```


To install:
```bash
npm i
```

To run:
```bash
node . "what are some interesting facts about Aotearoa?"
``` 

Double quotes aren't necessary unless you used words like "in" that trigger shell commands and special characters. Safer if you do!