import { Router } from "express";
import controller from "./controller.js";
import uploadAdminAvatarController from "./controller/Avatar/admin.js";
import uploadUserAvatarController from "./controller/Avatar/user.js";
import uploadBookCoverController from './controller/book/uploadCover.js';
import multer from "multer";
import VerifyFile from "./middlewares/verifyFile.js";
import Auth from "./middlewares/Auth.js";
import AdminAuth from "./middlewares/AdminAuth.js";
import VerifyBook from "./middlewares/verifyBook.js";

const router = Router();

const upload = multer({
	storage: multer.diskStorage({}),
});

router.post(
	"/category/icon/:id",
	AdminAuth,
	upload.single("icon"),
	VerifyFile,
	controller,
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
	controller,
);

router.post(
	"/book/sample/:id",
	Auth,
	VerifyBook,
	upload.single("sample"),
	VerifyFile,
	controller,
);

export default router;
