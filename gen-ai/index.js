import dotenv from "dotenv/config"
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, tool, createAgent } from 'langchain'

import { z } from 'zod'
import { sendEmail } from "./mail.service.js";


const emailTool = tool(
    sendEmail,
    {
        name: "send_email",
        description: "user this took to send email",
        schema: z.object({
            to: z.string().describe("The recipient's email address"),
            subject: z.string().describe("This recived the subject"),
            html: z.string().describe("Html content for the email"),
        })
    }
)



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const model = new ChatMistralAI({
    model: "mistral-small-latest",
})



const agent = createAgent({
    model,
    tools: [emailTool]
})


let messages = []

while (true) {
    const userInput = await rl.question("You: ")

    messages.push(new HumanMessage(userInput))

    const response = await agent.invoke({
        messages,

    })

    messages.push(response.messages[response.messages.length -1 ])

    console.log("AI: ", messages)
}