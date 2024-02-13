import axios from "axios";
import xml2js from "xml2js";
import File, { FileInterface } from "../models/file.js";

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

interface EPubFileMetadata {
	publisher?: string;
	language?: string;
	title?: string;
	subject?: string;
	description?: string;
	creator?: string;
	creatorFileAs?: string;
	date?: string;
	ISBN?: string;
	UUID?: string;
	generator?: string;
	cover?: string;
	specifiedFonts?: string;
	modified?: string;
}

export const parseMetadata = (metadata) => {
	const keys = Object.keys(metadata);
	const result: EPubFileMetadata = {};

	console.log(keys);

	for (let i = 0, len = keys.length; i < len; i++) {
		const keyparts = keys[i].split(":"),
			key = (keyparts.pop() || "").toLowerCase().trim();
		switch (key) {
			case "publisher":
				if (Array.isArray(metadata[keys[i]])) {
					result.publisher = String(
						(metadata[keys[i]][0] && metadata[keys[i]][0]["#"]) ||
							metadata[keys[i]][0] ||
							"",
					).trim();
				} else {
					result.publisher = String(
						metadata[keys[i]]["#"] || metadata[keys[i]] || "",
					).trim();
				}
				break;
			case "language":
				if (Array.isArray(metadata[keys[i]])) {
					result.language = String(
						(metadata[keys[i]][0] && metadata[keys[i]][0]["#"]) ||
							metadata[keys[i]][0] ||
							"",
					)
						.toLowerCase()
						.trim();
				} else {
					result.language = String(
						metadata[keys[i]]["#"] || metadata[keys[i]] || "",
					)
						.toLowerCase()
						.trim();
				}
				break;
			case "title":
				if (Array.isArray(metadata[keys[i]])) {
					result.title = String(
						(metadata[keys[i]][0] && metadata[keys[i]][0]["#"]) ||
							metadata[keys[i]][0] ||
							"",
					).trim();
				} else {
					result.title = String(
						metadata[keys[i]]["#"] || metadata[keys[i]] || "",
					).trim();
				}
				break;
			case "subject":
				if (Array.isArray(metadata[keys[i]])) {
					result.subject = String(
						(metadata[keys[i]][0] && metadata[keys[i]][0]["#"]) ||
							metadata[keys[i]][0] ||
							"",
					).trim();
				} else {
					result.subject = String(
						metadata[keys[i]]["#"] || metadata[keys[i]] || "",
					).trim();
				}
				break;
			case "description":
				if (Array.isArray(metadata[keys[i]])) {
					result.description = String(
						(metadata[keys[i]][0] && metadata[keys[i]][0]["#"]) ||
							metadata[keys[i]][0] ||
							"",
					).trim();
				} else {
					result.description = String(
						metadata[keys[i]]["#"] || metadata[keys[i]] || "",
					).trim();
				}
				break;
			case "creator":
				if (Array.isArray(metadata[keys[i]])) {
					result.creator = String(
						(metadata[keys[i]][0] && metadata[keys[i]][0]["#"]) ||
							metadata[keys[i]][0] ||
							"",
					).trim();
					result.creatorFileAs = String(
						(metadata[keys[i]][0] &&
							metadata[keys[i]][0]["@"] &&
							metadata[keys[i]][0]["@"]["opf:file-as"]) ||
							result.creator,
					).trim();
				} else {
					result.creator = String(
						metadata[keys[i]]["#"] || metadata[keys[i]] || "",
					).trim();
					result.creatorFileAs = String(
						(metadata[keys[i]]["@"] && metadata[keys[i]]["@"]["opf:file-as"]) ||
							result.creator,
					).trim();
				}
				break;
			case "date":
				if (Array.isArray(metadata[keys[i]])) {
					result.date = String(
						(metadata[keys[i]][0] && metadata[keys[i]][0]["#"]) ||
							metadata[keys[i]][0] ||
							"",
					).trim();
				} else {
					result.date = String(
						metadata[keys[i]]["#"] || metadata[keys[i]] || "",
					).trim();
				}
				break;
			case "identifier":
				if (
					metadata[keys[i]]["@"] &&
					metadata[keys[i]]["@"]["opf:scheme"] == "ISBN"
				) {
					result.ISBN = String(metadata[keys[i]]["#"] || "").trim();
				} else if (
					metadata[keys[i]]["@"] &&
					metadata[keys[i]]["@"].id &&
					metadata[keys[i]]["@"].id.match(/uuid/i)
				) {
					result.UUID = String(metadata[keys[i]]["#"] || "")
						.replace("urn:uuid:", "")
						.toUpperCase()
						.trim();
				} else if (Array.isArray(metadata[keys[i]])) {
					for (let j = 0; j < metadata[keys[i]].length; j++) {
						if (metadata[keys[i]][j]["@"]) {
							if (metadata[keys[i]][j]["@"]["opf:scheme"] == "ISBN") {
								result.ISBN = String(metadata[keys[i]][j]["#"] || "").trim();
							} else if (
								metadata[keys[i]][j]["@"].id &&
								metadata[keys[i]][j]["@"].id.match(/uuid/i)
							) {
								result.UUID = String(metadata[keys[i]][j]["#"] || "")
									.replace("urn:uuid:", "")
									.toUpperCase()
									.trim();
							}
						}
					}
				}
				break;
		}
	}

	const metas = metadata["meta"] || {};
	console.log("metas: ", metas);
	Object.keys(metas).forEach(function (key) {
		const meta = metas[key];
		if (meta["@"] && meta["@"].name) {
			const name = meta["@"].name;
			result[name] = meta["@"].content;
		}
		if (meta["#"] && meta["@"].property) {
			if (meta["@"].property === "dcterms:modified")
				result["modified"] = meta["#"];
			else if (meta["@"].property.includes("specified-fonts"))
				result["specifiedFonts"] = meta["#"];
			else result[meta["@"].property] = meta["#"];
		}

		if (meta.name && meta.name == "cover") {
			result[meta.name] = meta.content;
		}
	}, this);

	return result;
};

export const parseManifest = (rootFile: string, manifest) => {
	const path = rootFile.slice(0, -23).split("/");
	const path_str = path.join("/");
	console.log(path_str);

	const result = {};

	if (manifest.item) {
		for (let i = 0, len = manifest.item.length; i < len; i++) {
			if (manifest.item[i]["@"]) {
				const element = manifest.item[i]["@"];

				if (
					element.href &&
					element.href.substr(0, path_str.length) != path_str
				) {
					element.href = path.concat([element.href]).join("/");
				}

				result[manifest.item[i]["@"].id] = element;
			}
		}
	}

	return result;
};

export const getEPubRootFile = async (bookContainerURL: string) => {
	try {
		const bookContainerData = await readFile(bookContainerURL);

		if (
			!bookContainerData.parsedData.rootfiles ||
			!bookContainerData.parsedData.rootfiles.rootfile
		) {
			throw new Error("No rootfiles for this book file, invalid book file");
		}

		let rootfile = bookContainerData.parsedData.rootfiles.rootfile,
			filename = "";

		if (Array.isArray(rootfile)) {
			for (let i = 0, len = rootfile.length; i < len; i++) {
				if (
					rootfile[i]["@"]["media-type"] &&
					rootfile[i]["@"]["media-type"] == "application/oebps-package+xml" &&
					rootfile[i]["@"]["full-path"]
				) {
					filename = rootfile[i]["@"]["full-path"].toLowerCase().trim();
					break;
				}
			}
		} else if (rootfile["@"]) {
			if (
				rootfile["@"]["media-type"] != "application/oebps-package+xml" ||
				!rootfile["@"]["full-path"]
			) {
				throw new Error("Rootfile in unknown format, invalid book file");
			}
			filename = rootfile["@"]["full-path"].toLowerCase().trim();
		}

		if (!filename) {
			throw new Error("Empty rootfile, invalid book file extract");
		}

		return { filename };
	} catch (error) {
		throw new Error(error);
	}
};

export default readFile;
