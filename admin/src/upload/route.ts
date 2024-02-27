import { Router } from "express";
import uploadAdminAvatarController from "./controller/Avatar/admin.js";
import uploadCategoryIcon from "./controller/uploadCategoryIcon.js";
import multer from "multer";
import VerifyFile from "../middleware/verifyFile.js";
import Auth from "../middleware/ForRoutes/Auth.js";


const router = Router();

const upload = multer({
	storage: multer.diskStorage({}),
});

router.post(
	"/category/icon/:id",
	Auth,
	upload.single("icon"),
	VerifyFile,
	uploadCategoryIcon,
);

router.post(
	"/admin/avatar",
	Auth,
	upload.single("avatar"),
	VerifyFile,
	uploadAdminAvatarController,
);

export default router;
