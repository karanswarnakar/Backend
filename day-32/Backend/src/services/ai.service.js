import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai"


const geminiModel = new ChatGoogle({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.5-flash-lite",
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY

})

export async function generateResponse(messages) {
    const langchainMessages = messages.map((msg) => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        }

        else if (msg.role === "ai") {
            return new AIMessage(msg.content);
        }

        return null;
    }).filter(Boolean);

    const response = await geminiModel.invoke(langchainMessages);

    return response.text;
}


export async function genetareTitel(message) {
  const resaponse = await geminiModel.invoke([
    new SystemMessage(`
          User will provide you a message and you need to generate a title that can resonate with that message/topic make it sort in 2-3 words 
          title need to clear and engaging 
        `),
    new HumanMessage(`
          genarete a title beshed on the folling first message
          "${message}"
        `)
  ])

  return resaponse.text
}