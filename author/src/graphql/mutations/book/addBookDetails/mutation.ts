import bookDetailsInputs from "./args.js";
import bookType from "../../../types/book-type.js";
import addBookDetails from "./resolve.js";

export default {
  type: bookType,
  args: bookDetailsInputs,
  resolve: addBookDetails,
}
