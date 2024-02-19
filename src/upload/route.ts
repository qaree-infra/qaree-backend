import { Router } from "express";
import controller from "./controller.js";
import uploadAdminAvatarController from "./controller/Avatar/admin.js";
import uploadUserAvatarController from "./controller/Avatar/user.js";
import uploadBookCoverController from "./controller/book/uploadCover.js";
import uploadBookFileController from "./controller/book/uploadFile.js";
import uploadCategoryIcon from './controller/uploadCategoryIcon.js';
import multer from "multer";
import VerifyFile from "../middleware/verifyFile.js";
import Auth from "../middleware/Auth.js";
import AdminAuth from "../middleware/AdminAuth.js";
import { VerifyBookAuthor } from "../middleware/VerifyBook.js";

const router = Router();

const upload = multer({
	storage: multer.diskStorage({}),
});

router.post(
	"/category/icon/:id",
	AdminAuth,
	upload.single("icon"),
	VerifyFile,
	uploadCategoryIcon,
);

router.post(
	"/user/avatar",
	Auth,
	upload.single("avatar"),
	VerifyFile,
	uploadUserAvatarController,
);

router.post(
	"/admin/avatar",
	AdminAuth,
	upload.single("avatar"),
	VerifyFile,
	uploadAdminAvatarController,
);

router.post(
	"/book/cover/:id",
	Auth,
	VerifyBookAuthor,
	upload.single("cover"),
	VerifyFile,
	uploadBookCoverController,
);

router.post(
	"/book/file/:id",
	Auth,
	VerifyBookAuthor,
	upload.single("file"),
	VerifyFile,
	uploadBookFileController,
);

router.post(
	"/book/sample/:id",
	Auth,
	VerifyBookAuthor,
	upload.single("sample"),
	VerifyFile,
	controller,
);

export default router;
