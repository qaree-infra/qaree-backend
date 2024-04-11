import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/graphql-schema.js";
import auth from "./middleware/general/auth.js";
import uploadRoute from "./upload/route.js";
import readChapter from "./readChapter/route.js";
import { createServer } from "http";
import { Server } from "socket.io";
import authSocket from "./middleware/forSocket/auth.js";
import User from "./models/user.js";
import messageing from "./chat/messageing.js";
import typeing from "./chat/typeing.js";
import readMsg from "./chat/readMsg.js";
import listMsgs from "./chat/listMsgs.js";
import Room from "./models/chatRoom.js";

const app: express.Application = express();
const server = createServer(app);
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use(auth);

const io = new Server(server, {});

io.use(authSocket);

io.on("connection", async (socket) => {
	const userData = socket.handshake["authData"].user;

	await User.findByIdAndUpdate(
		userData._id,
		{
			chat: {
				connection: true,
				socketId: socket.id,
			},
		},
		{ new: true },
	);

	const rooms = await Room.find({
		$or: [
			{
				creator: userData._id,
				activation: true,
			},
			{
				partner: userData._id,
				activation: true,
			},
			{
				members: { $elemMatch: { user: userData._id } },
			},
		],
	});

	if (rooms.length > 0) {
		rooms.forEach((room) => {
			socket.join(room.roomId);
		});
	}

	socket.on("message", messageing(io, socket));

	socket.on("typeing", typeing(io, socket));

	socket.on("read", readMsg(io, socket));

	socket.on("message-list", listMsgs(io, socket));

	socket.on("disconnect", async () => {
		const result = await User.findByIdAndUpdate(
			userData._id,
			{ chat: { connection: false, socketId: "" } },
			{ new: true },
		);
		console.log(result);
		await console.log(socket.id);
	});
});

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true,
	}),
);

app.use("/upload", uploadRoute);

app.use("/read", readChapter);

export default server;
