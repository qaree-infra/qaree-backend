import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";

const uploadController = async (req: AuthRequest, res: Response) => {
	try {

		return res.status(200).json({ file: "uploaded" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export default uploadController;
