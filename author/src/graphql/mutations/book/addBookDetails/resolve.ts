import { auth } from "../../../../middleware/general/auth.js";
import Book, { BookInterface } from "../../../../models/book.js";
import Category, { CategoryInterface } from "../../../../models/category.js";

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
			previousPublishingData,
		} = args;

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

		if (edition !== undefined && edition < 1)
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

		if (publishingRights === null)
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

		const categoriesDate: CategoryInterface[] = await Category.find({
			_id: { $in: categories },
		});

		if (categories.length !== categoriesDate.length)
			throw new Error(
				lang == "ar"
					? "عذرًا، معرفات الفئات غير صالحة"
					: "Sorry, invalid category ids",
			);

		if (!language)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل لغة صالحة"
					: "please, enter a valid language",
			);

		const previousPublishingDataObj = new Date(
			String(parseInt(previousPublishingData)) === previousPublishingData
				? parseInt(previousPublishingData)
				: previousPublishingData,
		);

		if (previousPublishingData && isNaN(previousPublishingDataObj.getDate()))
			throw new Error(
				lang == "ar" ? "تاريخ انتهاء العرض غير صالح" : "invalid expire date",
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
			author: auth.user._id,
			previousPublishingData: previousPublishingData ? previousPublishingDataObj : new Date(),
		});

		return addedBook;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default addBookDetails;
