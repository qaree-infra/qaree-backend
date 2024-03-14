import getRefreshTokenQuery from "./user/getRefreshToken/query.js";
import userInfoQuery from "./user/getUserInfo/query.js";
import getTopAuthors from "./user/getTopAuthors/query.js";

export default {
	userInfo: userInfoQuery,
	refreshToken: getRefreshTokenQuery,
	getTopAuthors,
};
