// import { initializeApp, credential } from "firebase-admin";
import { google } from "googleapis";
import dotenv from "dotenv";
import https from "https";
import { UserInterface } from "../models/user.js";

dotenv.config();

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];
const PROJECT_ID = serviceAccount.project_id;
const HOST = "fcm.googleapis.com";
const PATH = "/v1/projects/" + PROJECT_ID + "/messages:send";

function getAccessToken() {
	return new Promise(function (resolve, reject) {
		const jwtClient = new google.auth.JWT(
			serviceAccount.client_email,
			null,
			serviceAccount?.private_key,
			SCOPES,
			null,
		);
		jwtClient.authorize(function (err, tokens) {
			if (err) {
				reject(err);
				return;
			}
			resolve(tokens.access_token);
		});
	});
}

export function sendFcmMessage(fcmMessage) {
	getAccessToken().then(function (accessToken) {
		const options = {
			hostname: HOST,
			path: PATH,
			method: "POST",
			headers: {
				Authorization: "Bearer " + accessToken,
			},
		};

		const request = https.request(options, function (resp) {
			resp.setEncoding("utf8");
			resp.on("data", function (data) {
				console.log("Message sent to Firebase for delivery, response:");
				console.log(data);
			});
		});

		request.on("error", function (err) {
			console.log("Unable to send message to Firebase");
			console.log(err);
			throw new Error("Unable to send message to Firebase");
		});

		request.write(JSON.stringify(fcmMessage));
		request.end();
	});
}

export function generateFollowingMessage(user: UserInterface, lang: string) {
	return {
		message: {
			/* add token to message object */ token: "REGISTERETION_TOKEN",
			notification: {
				title: lang === "ar" ? "متابع جديد" : "New follower",
				body:
					lang === "ar"
						? `${user.name} قد بدأ متابعتك`
						: `${user.name} started following you`,
				image: user.avatar.path,
			},
			data: {
				user_id: user._id,
			},
		},
	};
}

export function generateMessageNotification(
	image,
	content,
	sender,
	room,
	lang: string,
) {
	return {
		message: {
			/* add token to message object */ token: "REGISTERETION_TOKEN",
			notification: {
				title:
					lang === "ar"
						? `رسالة جديدة من ${sender.name}`
						: `New message from ${sender.name}`,
				body: content,
				image: image,
			},
			data: {
				roomId: room,
			},
		},
	};
}

export function generateNewBookNotification(book, lang: string) {
	return {
		message: {
			/* add token to message object */ token: "REGISTERETION_TOKEN",
			notification: {
				title:
					lang === "ar"
						? `كتاب جديد من ${book.author.name}`
						: `New Book from ${book.author.name}`,
				body:
					lang === "ar"
						? `تم نشر ${book.name} من قبل ${book.author.name}`
						: `New book have been published ${book.name} from ${book.author.name}`,
				image: book.cover.path,
			},
			data: {
				book_id: book._id,
			},
		},
	};
}

export function generateNewReviewNotification(review, book, lang: string) {
	return {
		message: {
			/* add token to message object */
			token: "",
			notification: {
				title:
					lang === "ar"
						? `مراجعة جديد من ${review.user.name}`
						: `New Review from ${review.user.name}`,
				body:
					lang === "ar"
						? `مراجعة جديدة ل ${book.name} من قبل ${review.user.name}`
						: `New review have been published ${book.name} from ${review.user.name}`,
				image: book.cover.path,
			},
			data: {
				book_id: book._id,
				review_id: review._id,
			},
		},
	};
}
