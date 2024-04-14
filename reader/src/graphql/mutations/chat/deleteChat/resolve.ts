import { auth } from "../../../../middleware/general/auth.js";
import Room from "../../../../models/chatRoom.js";

export default async function resolve(_, { room }: { room: string }, context) {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		console.log(room, room.split("-").length !== 2);
		console.log(auth.user._id);

		const orOptions =
			room.split("-").length !== 2
				? [
						{
							roomId: room,
							$or: [
								{ creator: auth.user._id },
								{ members: { $in: [auth.user._id] } },
							],
						},
						{
							_id: room,
							$or: [
								{ creator: auth.user._id },
								{ members: { $in: [auth.user._id] } },
							],
						},
						{
							book: room,
							members: { $in: [auth.user._id] },
						},
				  ]
				: [
						{
							roomId: room,
							creator: auth.user._id,
							partner:
								room.split("-")[1] !== auth.user._id.toString()
									? room.split("-")[1]
									: room.split("-")[0],
						},
				  ];

		console.log(orOptions);

		const roomData = await Room.findOne({
			$or: orOptions,
		});

		console.log(roomData);

		if (roomData) {
			if (roomData.members.length > 0) {
				await Room.findByIdAndUpdate(roomData._id, {
					members: roomData.members.filter((m) => m !== auth.user._id),
				});
			} else {
				await Room.findByIdAndUpdate(
					roomData._id,
					{ activation: false },
					{ new: true },
				);
			}

			return {
				success: true,
				message: "the chat have been deleted successfully",
			};
		} else {
			throw new Error("This is room not found");
		}
	} catch (error) {
		throw new Error(error);
	}
}
