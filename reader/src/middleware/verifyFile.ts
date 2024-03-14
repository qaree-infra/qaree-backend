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

		if (fileType.includes("avatar") || fileType.includes("category-icon")) {
			if (!file.mimetype.includes("image")) {
				return res.status(400).json({
					message:
						lang === "ar" ? "هذا الملف ليس صورة" : "This is not image file",
				});
			}
		}

		if (fileType.includes("cover")) {
			if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
				return res.status(400).json({
					message:
						lang === "ar" ? "هذا الملف ليس صورة" : "This is not image file",
				});
			}

			const dimentions = imageSize(file.path);

			const rate: number = dimentions.height / dimentions.width;

			if (parseFloat(rate.toFixed(1)) !== 1.6) {
				return res.status(400).json({
					message:
						lang === "ar"
							? "ابعاد الصورة غير صالحة من فضلك استخدم صورة ذات نسبة 1.6:1"
							: "Invalid image dimentions, please use 1.6:1 aspect rate",
				});
			}
		}

		if (
			(fileType.includes("file") || fileType.includes("sample")) &&
			file.mimetype !== "application/epub+zip"
		) {
			return res.status(400).json({
				message:
					lang === "ar" ? "هذا الملف ليس بصيخة epub" : "This is not epub file",
			});
		}

		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error?.message });
	}
};

export default VerifyFile;
