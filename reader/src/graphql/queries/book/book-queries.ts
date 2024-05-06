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
import getBookCommunity from "./community/getCommunityInfo/mutation.js";
import getCommunityMembers from "./community/getCommunityMembers/mutation.js";
import getAuthorBooks from "./getAuthorBooks/query.js";

export default {
	getBooks: getBooks,
	getBook: getBook,
	getAuthorBooks: getAuthorBooks,
	getBookReviews: getBookReviews,
	getBookReview: getBookReview,
	search: search,
	getBookContent: getBookContent,
	getLastActivity: getLastActivity,
	getBestSellerBooks: getBestSellerBooks,
	getPaymentClientData: getClientData,
	getBookStatus: getBookStatus,
	getBookCommunity: getBookCommunity,
	getCommunityMembers: getCommunityMembers,
};
