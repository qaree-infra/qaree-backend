import getUserBooks from "./user/getUserBooks/query.js";
import getUserBook from './user/getUserBook/query.js';
import getBooksResolve from "./user/getBooks/query.js";

export default {
  getUserBook: getUserBook,
  getUserBooks: getUserBooks,
  getBooks: getBooksResolve
}
