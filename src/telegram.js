import { CONFIG } from "./config.js"
import axios from "axios"

export async function sendMessage({ sender, subject, text }) {
	console.log("Sending message to telegram", new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
	const data = {
		text: "Received new mail",
		disable_web_page_preview: true,
		chat_id: CONFIG.TELEGRAM_CHAT_ID,
	}
	const telegramBotEndpoint = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}`

	try {
		if (text.length > 4000) text = text.substring(0, 400) + "..."

		const message = `${subject}
    \n From : ${sender}
    \n ------------------------
    \n ${text}`

		Object.assign(data, { text: message })

		await Promise.all([axios.post(`${telegramBotEndpoint}/sendMessage`, data)])
	} catch (error) {
		const message = `Error when sending message. Please check your email.`
		Object.assign(data, { text: message })
		axios.post(`${telegramBotEndpoint}/sendMessage`, data)
		console.error("Error while sending message", error)
	}
}