import addBookDetails from "./user/addBookDetails/mutation.js";
import editBookDetails from "./user/editBookDetails/mutation.js";
import moveBookToRecycleBin from "./user/moveBookToRecycleBin/mutation.js";
import moveBookFromRecycleBin from "./user/moveBookFromRecycleBin/mutation.js";
import publishBook from "./user/publishBook/mutation.js";
import adminReviewBookData from './admin/reviewBook/mutation.js';

export default {
	addBookDetails,
	editBookDetails,
	moveBookToRecycleBin,
	moveBookFromRecycleBin,
	publishBook,
	adminReviewBookData,
};
