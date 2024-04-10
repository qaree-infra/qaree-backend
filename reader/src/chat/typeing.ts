export default (io, socket) => {
	return function isTypeing({ room, isTypeing }) {
		const userData = socket.handshake["authData"].user;
		if (isTypeing !== false && isTypeing !== true) {
			console.log("invalid typeing");
			return socket.emit("error", "invalid is typeing");
		}

		console.log(room, isTypeing);

		if (socket.handshake["authData"].user.rooms.includes(room)) {
			io.in(room).emit("typeing", {
				userId: userData._id,
				room: room,
				isTypeing: isTypeing,
			});
		} else return socket.emit("error", "invalid room");
	};
};
