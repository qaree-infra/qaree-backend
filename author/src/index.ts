import mongoose, { ConnectOptions } from "mongoose";
import app from "./server.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
} as ConnectOptions)
	.then(() =>
		app.listen(PORT, () => {
			console.log(`server is running at http://localhost:${PORT}/`);
		}),
	)
	.catch((error) =>
		console.log("The MongoDB Error is", error.message, "%n", error),
	);
