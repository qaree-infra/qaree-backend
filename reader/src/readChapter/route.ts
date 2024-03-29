import { Router } from "express";
import Auth from "../middleware/ForRoutes/Auth.js";
import readChapter from "./readChapter.js";
import readChapterJson from "./readChapterInJson.js";
import verifyBook from './middleware.js';

const router = Router();

router.get("/:bookId/:chId", Auth, verifyBook, readChapter);
router.get("/:bookId/:chId/json", Auth, verifyBook, readChapterJson);

export default router;
