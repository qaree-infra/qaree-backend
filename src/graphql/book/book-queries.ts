import getUserBooks from "./user/getUserBooks/query.js";
import getUserBook from './user/getUserBook/query.js';
import getBooks from "./user/getBooks/query.js";
import getBook from "./user/getBookInfo/query.js";
import getBookReviews from "./user/getBookReviews/query.js";

export default {
  getUserBook: getUserBook,
  getUserBooks: getUserBooks,
  getBooks: getBooks,
  getBook: getBook,
  getBookReviews: getBookReviews,
}
