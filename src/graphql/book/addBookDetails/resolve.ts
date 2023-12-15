import { auth } from "../../../middleware/auth.js";
import Book, { BookInterface } from "../../../models/book.js";

const addBookDetails = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const {
			name,
			description,
			isbn,
			edition,
			language,
			publishingRights,
			categories,
			price,
		} = args;

		// todo: fix it
		if (
			!name &&
			!description &&
			!isbn &&
			!edition &&
			!language &&
			!publishingRights &&
			!categories &&
			!price
		)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل بيانات الكتاب"
					: "please, enter the book details",
			);

		if (!name)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل اسم الكتاب"
					: "please, enter the book name",
			);

		if (!description)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل وصف الكتاب"
					: "please, enter the book description",
			);

		if (isbn && isbn.length < 10) {
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل رقم ISBN صالح"
					: "please, enter a valid ISBN",
			);
		}

		if (edition && edition > 1)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل اصدار صالح"
					: "please, enter a valid book edition",
			);

		if (price && price < 1 && price > 100000)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل سعر صالح"
					: "please, enter a valid book price",
			);

		if (!publishingRights)
			throw new Error(
				lang === "ar"
					? "من فضلك اخبرنا اذا كان لديك حقوق النشر ام لا"
					: "please tell us if you have a publishing rights or not",
			);

		if (!categories || categories.length === 0)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل تصنيف واحد على الاقل"
					: "please, enter at least only one category",
			);

		if (!language)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل لغة صالحة"
					: "please, enter a valid language",
			);

		const addedBook: BookInterface = await Book.create({
			name,
			description,
			isbn,
			edition,
			language,
			publishingRights,
			categories,
			price,
			authorId: auth.user._id,
		});

		return addedBook;
	} catch (error) {
		throw new Error(error);
	}
};

export default addBookDetails;
