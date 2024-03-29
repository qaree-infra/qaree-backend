import Book, { BookInterface } from "../../../../models/book.js";
import { auth } from "../../../../middleware/general/auth.js";
import verifyBook from "../../../../middleware/general/verifyBook.js";
import Category, { CategoryInterface } from "../../../../models/category.js";

const editBookDetails = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const {
			bookId,
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

		const bookVerification = await verifyBook(context, bookId, auth.user?._id);

		if (bookVerification?.error) throw new Error(bookVerification?.error);

		if (
			name === undefined &&
			description === undefined &&
			isbn === undefined &&
			edition === undefined &&
			language === undefined &&
			publishingRights === undefined &&
			categories === undefined &&
			price === undefined
		)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل بيانات الكتاب"
					: "please, enter the book details",
			);

		if (name !== undefined && name.length === 0)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل اسم الكتاب"
					: "please, enter the book name",
			);

		if (description !== undefined && description.length === 0)
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

		if (categories && categories.length > 0) {
			const categoriesDate: CategoryInterface[] = await Category.find({
				_id: { $in: categories },
			});

			if (categories.length !== categoriesDate.length)
				throw new Error(
					lang == "ar"
						? "عذرًا، معرفات الفئات غير صالحة"
						: "Sorry, invalid category ids",
				);
		}

		const previousPublishingDataObj = new Date(
			String(parseInt(previousPublishingData)) === previousPublishingData
				? parseInt(previousPublishingData)
				: previousPublishingData,
		);

		if (previousPublishingData && isNaN(previousPublishingDataObj.getDate()))
			throw new Error(
				lang == "ar" ? "تاريخ انتهاء العرض غير صالح" : "invalid expire date",
			);

		let newBook = Object.assign(bookVerification.bookData, {
			name,
			description,
			isbn,
			edition,
			language,
			publishingRights,
			categories,
			price,
			previousPublishingData: previousPublishingData
				? previousPublishingDataObj
				: bookVerification.bookData.previousPublishingData,
		});

		const updatedBook: BookInterface = await Book.findByIdAndUpdate(
			bookVerification.bookData._id,
			newBook,
			{
				new: true,
			},
		)
			.populate("categories")
			.populate("author")
			.populate("cover")
			.populate("file")
			.populate("sample");

		return updatedBook;
	} catch (error) {
		throw new Error(error);
	}
};

export default editBookDetails;
