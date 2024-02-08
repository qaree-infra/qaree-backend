import axios from "axios";
import xml2js from "xml2js";

const xml2jsOptions = xml2js.defaults["0.1"];

const readFile = async (fileUrl: string) => {
	try {
		const { data } = await axios.get(fileUrl);
		console.log("File content: ", data);

		const parseData = parseXML(data);

		return { content: data, parsedData: parseData };
	} catch (error) {
		throw new Error(error.message);
	}
};

const parseXML = (data: Buffer) => {
	let parsedData;

	const xml = data.toString("utf-8").toLowerCase().trim();

	xml2js.parseString(xml, xml2jsOptions, function (err, result) {
		if (err) throw new Error(err);

		parsedData = result;
	});

	return parsedData;
};

export default readFile;
