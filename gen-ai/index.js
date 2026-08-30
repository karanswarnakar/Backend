import dotenv from "dotenv/config"
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai"
import {HumanMessage} from 'langchain'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const model = new ChatMistralAI({
    model: "mistral-small-latest",

})
let message = []
while (true) {
    const userInput = await rl.question("You: ")

    message.push(new HumanMessage(userInput))

    const response = await model.invoke(message)

    message.push(response)

   console.log("AI: ",response.content)
}