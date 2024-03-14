import { Router } from "express";
import Auth from "../middleware/ForRoutes/Auth.js";
import VerifyBook from "../middleware/ForRoutes/VerifyBook.js";
import readChapter from "./controller/readChapter.js";

const router = Router();

router.get("/:id/:chId", Auth, VerifyBook, readChapter);

export default router;
