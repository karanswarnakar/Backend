import "dotenv/config";
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "langchain";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});

let messages = [];

while (true) {
    const userInput = await rl.question("You: ");

    messages.push(new HumanMessage(userInput));

    try {
        const response = await model.invoke(messages);

        messages.push(response);

        console.log("AI:", response.content);
    } catch (error) {
        console.error("Mistral Error:", error);
    }
}