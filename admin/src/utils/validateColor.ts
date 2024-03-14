function stringToNumber(arr: string[]): number[] {
	return arr.map((s) => Number(s));
}

function validateColor(color: string): boolean {
	if (!color) {
		return false;
	}

	const hexRegex = /^#[0-9A-Fa-f]{3,6}/;
	const rgbRegex =
		/^rgb\\\(\\s\*\(\\d\{1,3\}\)\\s\*,\\s\*\(\\d\{1,3\}\)\\s\*,\\s\*\(\\d\{1,3\}\)\\s\*\\\)/;
	const rgbaRegex =
		/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0?\.\d+|\d+(?:\.\d*)?)\s*\)/;
	const hslRegex =
		/^hsl\\\(\\s\*\(\\d\+\|\\d\{1,2\}\(?\:\\\.\\d\+\)?\)\\s\*,\\s\*\(\\d\+\|\\d\{1,2\}%\)\\s\*,\\s\*\(\\d\+\|\\d\{1,2\}%\)\\s\*\\\)/;
	const hslaRegex =
		/^hsla\(\s*(\d+|\d{1,2}(?:\.\d+)?)\s*,\s*(\d+|\d{1,2}%)\s*,\s*(\d+|\d{1,2}%)\s*,\s*(0?\.\d+|\d+(?:\.\d*)?)\s*\)$/;

	// Validate based on format
	if (hexRegex.test(color)) {
		return true; // Hex format (3 or 6 digits)
	} else if (rgbRegex.test(color)) {
		const [, r, g, b] = stringToNumber(color.match(rgbRegex));
		return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255; // Check RGB values
	} else if (rgbaRegex.test(color)) {
		const [, r, g, b, a] = stringToNumber(color.match(rgbaRegex));
		return (
			r >= 0 &&
			r <= 255 &&
			g >= 0 &&
			g <= 255 &&
			b >= 0 &&
			b <= 255 &&
			a >= 0 &&
			a <= 1
		);
	} else if (hslRegex.test(color)) {
		const [, h, s, l] = stringToNumber(color.match(hslRegex));
		return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
	} else if (hslaRegex.test(color)) {
		const [, h, s, l, a] = stringToNumber(color.match(hslaRegex));
		return (
			h >= 0 &&
			h <= 360 &&
			s >= 0 &&
			s <= 100 &&
			l >= 0 &&
			l <= 100 &&
			a >= 0 &&
			a <= 1
		);
	} else {
		return false;
	}
}

export default validateColor;
