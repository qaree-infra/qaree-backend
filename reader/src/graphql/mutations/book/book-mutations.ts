import reviewBook from "./reviewBook/mutation.js";
import likeReview from "./likeReview/mutation.js";
import createPaymentOrder from "./buyBook/createOrder/mutation.js";
import completePaymentOrder from "./buyBook/confirmPayment/mutation.js";

export default {
	reviewBook,
	likeReview,
	createPaymentOrder,
	completePaymentOrder,
};
