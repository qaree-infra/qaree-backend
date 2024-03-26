import { Router } from "express";
import uploadUserAvatarController from "./controller/Avatar/user.js";
import uploadBookCoverController from "./controller/book/uploadCover.js";
import uploadBookFileController from "./controller/book/uploadFile.js";
import multer from "multer";
import VerifyFile from "../middleware/verifyFile.js";
import Auth from "../middleware/ForRoutes/Auth.js";
import VerifyBook from "../middleware/ForRoutes/VerifyBook.js";

const router = Router();

const upload = multer({
	storage: multer.diskStorage({}),
});

router.post(
	"/user/avatar",
	Auth,
	upload.single("avatar"),
	VerifyFile,
	uploadUserAvatarController,
);

router.post(
	"/book/cover/:id",
	Auth,
	VerifyBook,
	upload.single("cover"),
	VerifyFile,
	uploadBookCoverController,
);

router.post(
	"/book/file/:id",
	Auth,
	VerifyBook,
	upload.single("file"),
	VerifyFile,
	uploadBookFileController,
);

export default router;
