import { Router } from "express";
import controller from "./controller.js";
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
	controller,
);

router.post(
	"/book/cover/:id",
	Auth,
	VerifyBook,
	upload.single("cover"),
	VerifyFile,
	controller,
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
