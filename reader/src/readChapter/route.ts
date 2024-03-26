import { Router } from "express";
import Auth from "../middleware/ForRoutes/Auth.js";
import readChapter from "./readChapter.js";
import verifyBook from './middleware.js';

const router = Router();

router.get("/:bookId/:chId", Auth, verifyBook, readChapter);

export default router;
