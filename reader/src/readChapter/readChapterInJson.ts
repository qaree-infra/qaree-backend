import { Response, Request } from "express";
import { BookInterface } from "../models/book.js";
import readFile from "../utils/readFile.js";
import File from "../models/file.js";
import BookRead, { BookReadInterface } from "../models/bookRead.js";
import { auth } from "../middleware/general/auth.js";
import Offer, { OfferInterface } from "../models/offer.js";
import Shelf, { ShelfInterface } from "../models/shelf.js";

import {
	CURRENT_READING_SHELF,
	CURRENT_READING_SHELF_AR,
	FINISHED_READING_SHELF,
	FINISHED_READING_SHELF_AR,
} from "../utils/consts.js";
import { Schema } from "mongoose";
interface ReadRequest extends Request {
	params: {
		bookId: string;
		chId: string;
	};
	bookData: BookInterface;
	chapterData: { id?: string; href?: string };
	bookManifest;
	auth: auth;
	content;
	allHTML;
	bookRead: BookReadInterface | null;
}

const readChapter = async (req: ReadRequest, res: Response) => {
	try {
		const { lang } = req.query;
		const { chId } = req.params;
		const {
			chapterData,
			bookData,
			bookManifest,
			auth,
			content,
			allHTML,
			bookRead,
		} = req;
		const user = auth.user;

		console.log("bookRead: ", bookRead);

		const bookOffer: OfferInterface = await Offer.findOne({
			book: bookData._id,
		});
		const bookPrice = (100 - Number(bookOffer?.percent || 0)) * bookData.price;
		const sample = Object.values(content).filter(
			(c: { id: string; href: string }) => bookData.sample.includes(c.id),
		);

		if (
			bookPrice > 0 &&
			bookRead?.status !== "purchased" &&
			sample.findIndex((c: { id: string; href: string }) => c.id === chId) ===
				-1
		)
			return res.status(400).json({
				message:
					lang === "ar"
						? "عفواَ لا يمكنك الوصل الى هذا الفصل"
						: "Sorry, you can't read this chapter",
			});

		const htmlContent = await readFile(chapterData.href);
		const manifestArray: Array<{ id: string; href: string }> =
			Object.values(bookManifest);

		const srcRegex = /src="([^"]*)"/g;
		const hrefRegex = /href="([^"]*)"/g;
		let srcValue;
		while ((srcValue = srcRegex.exec(htmlContent.content)) !== null) {
			if (srcValue[1].includes(bookData._id)) {
				break;
			}

			const manifestData = manifestArray.find(
				(f) =>
					f?.href?.split("/")[f?.href?.split("/").length - 1] ===
					srcValue[1]?.split("/")[srcValue[1]?.split("/").length - 1],
			);
			const replacer = manifestData ? manifestData?.href : srcValue[1];
			htmlContent.content = htmlContent.content.replace(
				new RegExp(srcValue[1], "g"),
				replacer,
			);
		}

		let hrefValue;
		while ((hrefValue = hrefRegex.exec(htmlContent.content)) !== null) {
			if (hrefValue[1].includes(bookData._id)) {
				break;
			}

			const manifestData = manifestArray.find(
				(f) =>
					f?.href?.split("/")[f?.href?.split("/").length - 1] ===
					hrefValue[1]?.split("/")[hrefValue[1]?.split("/").length - 1],
			);
			const replacer = manifestData ? manifestData?.href : hrefValue[1];
			htmlContent.content = htmlContent.content.replace(
				new RegExp(hrefValue[1], "g"),
				replacer,
			);
		}

		htmlContent.content = htmlContent.content.replace(
			/<\/body>/,
			`<div id="context-menu">
    <ul>
      <li>
        <button onclick="highlightSelection()" id="highlight-btn" type="button">
          <i class="fas fa-highlighter icon"></i>
        </button>
      </li>
      <li>
        <button onclick="handleComment()">
          <i class="fas fa-comment icon"></i>
        </button>
      </li>
      <!-- <li onclick="alert('Share')"><i class="fas fa-share icon"></i></li> -->
    </ul>
  </div>
  <div id="note-container">
    <div id="note">
      <textarea name="note" id="note-text" placeholder="Take a note..."></textarea>
      <div class="btns-container">
        <button type="button" id="save-btn" onclick="handleSaveComment()">
          save
        </button>
        <button type="button" id="cancel-btn" onclick="handleCancelComment()">
          cancel
        </button>
      </div>
    </div>\n</div>\n<script type="text/javascript" src="https://cdn.jsdelivr.net/gh//qaree-infra/qaree-reading-view-scripts/js-script.js"></script>\n</body>`,
		);

		htmlContent.content = htmlContent.content.replace(
			/<\/head>/,
			`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh//qaree-infra/qaree-reading-view-scripts/style.css">\n</head>`,
		);

		const bookFile = await File.findById(bookData.file);
		const bookLength = bookFile?.assets?.reduce(
			(p, c) => p + (c?.length || 0),
			0,
		);
		console.log("bookLength: ", bookLength);

		let chapter: { path: string; length: number } = bookFile.assets.find(
			(f: { path: string; length: number }) =>
				f?.path.split("/")[f?.path.split("/").length - 1] ===
				chapterData.href.split("/")[chapterData.href.split("/").length - 1],
		);
		console.log("chapter: ", chapter);

		if (!chapter) {
			chapter = {
				path: chapterData.href,
				length: htmlContent.content
					.replace(/<[^>]*>/g, " ")
					.trim()
					.split(/\s+/).length,
			};
			await File.findByIdAndUpdate(
				bookFile._id,
				{
					assets: bookFile.assets.concat([chapter]),
				},
				{ new: true },
			);
		}

		const currentReadingShelf: ShelfInterface = await Shelf.findOne({
			name_ar: CURRENT_READING_SHELF_AR,
			name_en: CURRENT_READING_SHELF,
			userId: auth.user._id,
		});

		if (bookRead) {
			const bookReadContent = new Set(bookRead.content.map((e) => e.chId));
			const chapterAtBookRead = bookReadContent.has(chapterData?.id as string);
			console.log("chAtBookRead for book read: ", chapterAtBookRead);
			if (!chapterAtBookRead) {
				const content = bookRead.content.concat([
					{ chId: chapterData.id, length: chapter.length },
				]);
				console.log("content for book read: ", content);
				const progerss =
					content?.length === 0
						? 0
						: content?.reduce((p, c) => p + (c?.length || 0), 0);
				console.log("progress for book read: ", progerss);
				await BookRead.findByIdAndUpdate(bookRead._id, {
					content: content,
					readingProgress: (progerss / bookLength) * 100,
				});
				if (progerss === 100) {
					await Shelf.findByIdAndUpdate(
						currentReadingShelf._id,
						{
							books: currentReadingShelf.books.filter(
								(b) => b !== bookData._id,
							),
						},
						{ new: true },
					);
					const finishedShelf = await Shelf.findOne({
						name_ar: FINISHED_READING_SHELF,
						name_en: FINISHED_READING_SHELF_AR,
						userId: user._id,
					});
					await Shelf.findByIdAndUpdate(
						finishedShelf._id,
						{
							books: [bookData._id as Schema.Types.ObjectId].concat(
								finishedShelf.books as Array<Schema.Types.ObjectId>,
							),
						},
						{ new: true },
					);
				}
			}
		} else {
			const content = [{ chId: chapterData.id, length: chapter.length }];
			console.log("content: ", content);
			const progerss: number =
				content?.length === 0
					? 0
					: content?.reduce((p, c) => p + (c?.length || 0), 0);
			console.log("progress: ", progerss);
			await BookRead.create({
				user: user._id,
				book: bookData._id,
				content: content,
				readingProgress: (progerss / bookLength) * 100,
				status: bookData.price === 0 ? "purchased" : "sample",
			});

			if (currentReadingShelf)
				await Shelf.findByIdAndUpdate(
					currentReadingShelf._id,
					{
						books: [bookData._id as Schema.Types.ObjectId].concat(
							currentReadingShelf.books as Array<Schema.Types.ObjectId>,
						),
					},
					{ new: true },
				);
			else {
				await Shelf.create({
					name_ar: CURRENT_READING_SHELF_AR,
					name_en: CURRENT_READING_SHELF,
					userId: auth.user._id,
					books: [bookData._id],
				});
			}
		}

		return res.json({
			content: htmlContent.content,
			BookAllHTML: allHTML,
			BookContent: content,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default readChapter;
