import { Request, Response, NextFunction } from "express";

import { imageSize } from "image-size";

const VerifyFile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const file = req.file;
		const { lang } = req.query;
		const fileType = req.url.split("/")[2];

		if (file.size > 50 * 1024 * 1024) {
			return res.status(400).json({
				message:
					lang === "ar"
						? "هذا الملف مساحته اكبر من 50 MB"
						: "This file size is long than 50 MB",
			});
		}

		if (fileType.includes("avatar")) {
			if (!file.mimetype.includes("image")) {
				return res.status(400).json({
					message:
						lang === "ar" ? "هذا الملف ليس صورة" : "This is not image file",
				});
			}
		}

		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error?.message });
	}
};

export default VerifyFile;
