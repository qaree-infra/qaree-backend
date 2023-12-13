import bookDetailsInputs from "./args.js";
import bookType from "../myBook-type.js";
import addBookDetails from "./resolve.js";

export default {
  type: bookType,
  args: bookDetailsInputs,
  resolve: addBookDetails,
}
