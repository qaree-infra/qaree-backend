import getRefreshTokenQuery from "./user/getRefreshToken/query.js";
import userInfoQuery from "./user/getUserInfo/query.js";
import adminGetAllUsers from "./admin/getAllUsers/query.js";
import getTopAuthors from "./user/getTopAuthors/query.js";

export default {
	userInfo: userInfoQuery,
	refreshToken: getRefreshTokenQuery,
	adminGetAllUsers,
	getTopAuthors,
};
