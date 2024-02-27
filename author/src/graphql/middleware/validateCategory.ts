const validateCategoryName = async (args, context, mutationType) => {
	try {
		const { lang } = context.query;
		const { name_ar, name_en } = args;
		if (!name_ar && !name_en)
			return {
				valid: false,
				error: lang === "ar" ? "تصنيف غير صالح" : "Invalid category",
			};

		if (mutationType === "add") {
			if (!name_en)
				return {
					valid: false,
					error:
						lang === "ar"
							? "من فضلك ادخل اسم التصنيف بالانجليزية"
							: "please, enter name in english",
				};

			if (!name_ar)
				return {
					valid: false,
					error:
						lang === "ar"
							? "من فضلك ادخل اسم التصنيف بالعربية"
							: "please, enter name in arabic",
				};
		}

		const arabicRegex = /[\u0600-\u06FF]/;

		if (!arabicRegex.test(name_ar))
			return {
				valid: false,
				error:
					lang === "ar"
						? "اسم التصنيف بالعربية غير صالح"
						: "Invalid category arabic name",
			};

		return { valid: true, error: "" };
	} catch (error) {
		return { error: error, valid: false };
	}
};

export default validateCategoryName;
