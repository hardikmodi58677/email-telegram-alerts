import { convert } from "html-to-text"
import { CONFIG } from "./config.js"
import { eventEmitter } from "./eventEmitter.js"

export const readMail = async (connection) => {
	try {
		console.log("Fetching the newly received mail", new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))

		await connection.openBox("INBOX")
		const last1Min = new Date().getTime() - 60 * 1000
		const emailSendersToNotifyFor = CONFIG.EMAIL_SENDERS_LIST.length
			? ["OR", ...CONFIG.EMAIL_SENDERS_LIST.map((email) => ["FROM", email])]
			: null
		const searchCriteria = ["UNSEEN", ["SINCE", last1Min]]

		if (emailSendersToNotifyFor) {
			searchCriteria.push(emailSendersToNotifyFor)
		}

		const fetchOptions = {
			// Add message id
			bodies: ["HEADER", "TEXT"],
			markSeen: false,
		}
		let results = []
		try {
			results = await connection.search(searchCriteria, fetchOptions)
		} catch (error) {
			console.error(error)
		}
		if (!results.length) {
			console.log("NO NEW MAILS")

			setTimeout(() => {
				readMail(connection)
			}, CONFIG.CHECK_MAIL_INTERVAL_SECONDS )
			return
		}

		results.forEach((res) => {
			let [emailHtml=""] = res.parts.filter((part) => {
				return part.which === "TEXT"
			})

			emailHtml = emailHtml?.body || ""

			let [subject=""] = res.parts.filter((part) => {
				return part.which === "HEADER"
			})

			// [0].body?.subject[0]
			subject = subject?.body?.subject[0] || ""

			let [sender=""] = res.parts.filter((part) => {
				return part.which === "HEADER"
			})

			sender = sender?.body?.from[0] || ""

			const text = convert(emailHtml)
			eventEmitter.emit("newMail", { subject, text, sender })
		})

		setTimeout(() => {
			readMail(connection)
		}, CONFIG.CHECK_MAIL_INTERVAL_SECONDS)
	} catch (error) {
		eventEmitter.emit("newMail",{subject:"Error",text:"Error while reading mail",sender:"Error"})
		setTimeout(() => {
			readMail(connection)
		}, CONFIG.CHECK_MAIL_INTERVAL_SECONDS )
		console.log(error)
	}
}
