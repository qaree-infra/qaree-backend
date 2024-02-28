import getMyBooks from "./getMyBook/query.js";
import getBookInfo from "./getBookInfo/query.js";
import getUserBooks from "./getUserBooks/query.js";
import getBook from "./getBookInfo/query.js";
import getBooksFromRecycleBin from "./getBooksFromRecycleBin/query.js";
import search from "./search/query.js";
import getBookEPubMetadata from "./fileContent/getBookMetadata/query.js";
import getBookEPubContent from "./fileContent/getBookEPubContent/query.js";
import getBookEPubManifest from "./fileContent/getBookEPubManifest/query.js";

export default {
	getBookInfo,
	getMyBooks: getMyBooks,
	getBooks: getUserBooks,
	getBook: getBook,
	search: search,
	getBooksFromRecycleBin: getBooksFromRecycleBin,
	getBookEPubMetadata: getBookEPubMetadata,
	getBookEPubManifest: getBookEPubManifest,
	getBookEPubContent: getBookEPubContent,
};
