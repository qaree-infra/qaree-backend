import adminGetBooks from "./getBooks/query.js";
import getBookEPubMetadata from "./fileContent/getBookEPubMetadata/query.js";
import getBookEPubManifest from "./fileContent/getBookEPubManifest/query.js";
import getBookEPubContent from "./fileContent/getBookEPubContent/query.js";
import getBookInfo from "./getBookInfo/query.js";

export default {
	adminGetBooks: adminGetBooks,
	getBookEPubMetadata: getBookEPubMetadata,
	getBookEPubManifest: getBookEPubManifest,
	getBookEPubContent: getBookEPubContent,
	getBookInfo: getBookInfo,
};
