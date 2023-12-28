import getUserBooks from "./user/getUserBooks/query.js";
import getUserBook from './user/getUserBook/query.js';
import getBooks from "./user/getBooks/query.js";
import getBook from "./user/getBookInfo/query.js";
import getBookReviews from "./user/getBookReviews/query.js";
import getBookReview from "./user/getBookReview/query.js";
import getBooksFromRecycleBin from "./user/getBooksFromRecycleBin/query.js";

export default {
  getUserBook: getUserBook,
  getUserBooks: getUserBooks,
  getBooks: getBooks,
  getBook: getBook,
  getBookReviews: getBookReviews,
  getBookReview: getBookReview,
  getBooksFromRecycleBin: getBooksFromRecycleBin,
}
