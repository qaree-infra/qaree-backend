import bookDetailsInputs from "./args.js";
import userBookType from "../../../../types/myBook-type.js";
import addBookDetails from "./resolve.js";

export default {
  type: userBookType,
  args: bookDetailsInputs,
  resolve: addBookDetails,
}
