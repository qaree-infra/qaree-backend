import getBooks from "./getBooks/query.js";
import getBook from "./getBookInfo/query.js";
import getBookReviews from "./getBookReviews/query.js";
import getBookReview from "./getBookReview/query.js";
import search from "./search/query.js";
import getBookContent from "./getBookContent/query.js";
import getLastActivity from "./activities/getLastActivity/query.js";
import getBestSellerBooks from "./getBestSellerBooks/query.js";
import getClientData from "./buy/getClientData/query.js";
import getBookStatus from "./activities/getBookStatus/query.js";

export default {
	getBooks: getBooks,
	getBook: getBook,
	getBookReviews: getBookReviews,
	getBookReview: getBookReview,
	search: search,
	getBookContent: getBookContent,
	getLastActivity: getLastActivity,
	getBestSellerBooks: getBestSellerBooks,
	getPaymentClientData: getClientData,
	getBookStatus: getBookStatus,
};
