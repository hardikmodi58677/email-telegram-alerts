import { READ_MAIL_CONFIG } from "./config.js"
import { eventEmitter } from "./eventEmitter.js"
import { readMail } from "./readMail.js"
import imaps from "imap-simple"
import { sendMessage } from "./telegram.js"

const bootstrap = async () => {
	const connection = await imaps.connect(READ_MAIL_CONFIG)
	console.log("CONNECTION SUCCESSFUL", new Date().toString())
	await readMail(connection)
}

eventEmitter.on("newMail", async (mail) => {
	// Only required if you have openapi api key, and want to summarize the text 
	// const emailTextSummary = await summarizeText(`Sent by:${mail.sender} Subject;${mail.subject} \n Text:${mail.text}`)

	sendMessage({
		sender: mail.sender,
		subject: mail.subject,
		text: mail.text,
	})
})

bootstrap()
