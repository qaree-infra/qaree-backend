import getUserBooks from "./user/getUserBooks/query.js";
import getUserBook from "./user/getUserBook/query.js";
import getBooks from "./user/getBooks/query.js";
import getBook from "./user/getBookInfo/query.js";
import getBookReviews from "./user/getBookReviews/query.js";
import getBookReview from "./user/getBookReview/query.js";
import getBooksFromRecycleBin from "./user/getBooksFromRecycleBin/query.js";
import search from "./user/search/query.js";
import adminGetBooks from "./admin/getBooks/query.js";
import getBookEPubMetadata from "./admin/fileContent/getBookEPubMetadata/query.js";
import getBookEPubManifest from "./admin/fileContent/getBookEPubManifest/query.js";
import getBookEPubContent from "./admin/fileContent/getBookEPubContent/query.js";
import getBookContent from "./user/fileContent/getBookContent/query.js";
import getMyBookEPubMetadata from "./user/fileContent/getMyBookMetadata/query.js";
import getMyBookEPubContent from "./user/fileContent/getMyBookEPubContent/query.js";
import getMyBookEPubManifest from "./user/fileContent/getMyBookEPubManifest/query.js";

export default {
	getUserBook: getUserBook,
	getUserBooks: getUserBooks,
	getBooks: getBooks,
	getBook: getBook,
	getBookReviews: getBookReviews,
	getBookReview: getBookReview,
	getBooksFromRecycleBin: getBooksFromRecycleBin,
	search: search,
	adminGetBooks: adminGetBooks,
	getBookEPubMetadata: getBookEPubMetadata,
	getBookEPubManifest: getBookEPubManifest,
	getBookEPubContent: getBookEPubContent,
	getBookContent: getBookContent,
	getMyBookEPubMetadata,
	getMyBookEPubManifest,
	getMyBookEPubContent,
};
