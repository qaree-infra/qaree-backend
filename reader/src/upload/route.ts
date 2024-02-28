import { Router } from "express";
import uploadUserAvatarController from "./controller/Avatar/user.js";
import multer from "multer";
import VerifyFile from "../middleware/verifyFile.js";
import Auth from "../middleware/ForRoutes/Auth.js";

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

export default router;
