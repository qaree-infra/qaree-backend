import getRefreshTokenQuery from "./getRefreshToken/query.js";
import userInfoQuery from "./getUserInfo/query.js";
import getTopAuthors from "./getTopAuthors/query.js";
import getAuthorInfo from "./getAuthorInfo/query.js";

export default {
	userInfo: userInfoQuery,
	refreshToken: getRefreshTokenQuery,
	getTopAuthors,
	getAuthorInfo,
};
