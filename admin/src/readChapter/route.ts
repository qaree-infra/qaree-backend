import { Router } from "express";
import Auth from "../middleware/ForRoutes/Auth.js";
// import readChapter from "./controller/readChapter.js";
// import auth from "../middleware/general/auth.js";
import VerifyBookAdmin from "../middleware/ForRoutes/VerifyBook.js";
import readChapterForAdmin from "./controller/readChapter.js";

const router = Router();

router.get("/:id/:chId", Auth, VerifyBookAdmin, readChapterForAdmin);

export default router;
