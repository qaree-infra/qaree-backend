import userType from "../user-type.js";
import userInfoResolve from './resolve.js';

export default {
  type: userType,
  description: "This is the user info",
  resolve: userInfoResolve,
};
