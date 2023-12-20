
import getRefreshTokenQuery from './getRefreshToken/query.js';
import userInfoQuery from './getUserInfo/query.js';

export default {
  userInfo: userInfoQuery,
  refreshToken: getRefreshTokenQuery,
}
