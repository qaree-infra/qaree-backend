import adminGetBooks from "./admin/getBooks/query.js";
import getBookEPubMetadata from "./admin/fileContent/getBookEPubMetadata/query.js";
import getBookEPubManifest from "./admin/fileContent/getBookEPubManifest/query.js";
import getBookEPubContent from "./admin/fileContent/getBookEPubContent/query.js";

export default {
	adminGetBooks: adminGetBooks,
	getBookEPubMetadata: getBookEPubMetadata,
	getBookEPubManifest: getBookEPubManifest,
	getBookEPubContent: getBookEPubContent,
};
