import { Router } from "express";
import Auth from "../middleware/ForRoutes/Auth.js";
import AdminAuth from "../middleware/ForRoutes/AdminAuth.js";
// import readChapter from "./controller/readChapter.js";
// import adminAuth from "../middleware/general/adminAuth.js";
import { VerifyBookAdmin, VerifyBookAuthor } from "../middleware/ForRoutes/VerifyBook.js";
import readChapterForAdmin from "./controller/readChapterForAdmin.js";
import readChapterForAuthor from "./controller/readChapterForAuthor.js";

const router = Router();

// router.get("/:bookId/:chId", Auth, readChapter);

router.get("/admin/:id/:chId", AdminAuth, VerifyBookAdmin, readChapterForAdmin);

router.get("/author/:id/:chId", Auth, VerifyBookAuthor, readChapterForAuthor);

export default router;
