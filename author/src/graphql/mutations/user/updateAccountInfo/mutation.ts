import userType from "../../../types/user-type.js";
import updateAccountArgs from "./args.js";

import updateAccountResolve from "./resolve.js";

export default {
  type: userType,
  args: updateAccountArgs,
  resolve: updateAccountResolve
}
