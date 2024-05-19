import axios from "axios";
import xml2js from "xml2js";
import cloudinarySdk from "cloudinary";
import { BookInterface } from "../models/book.js";
import { parseURL } from "./helper.js";

const cloudinary = cloudinarySdk.v2;
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
	api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const xml2jsOptions = xml2js.defaults["0.1"];

export const getBookFiles = async (bookData: BookInterface) => {
	try {
		const prefix = `book/file/${bookData._id.toString()}`;

		const allAssets = await cloudinary.api.resources({
			type: "upload",
			prefix: prefix,
			resource_type: "raw",
			max_results: 500,
		});
		console.log(allAssets.resources.map((resource) => resource.secure_url));
		// .then((res) => res.resources.map((resource) => resource.secure_url));

		return allAssets.resources.map((resource) => resource.secure_url);
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
};

const readFile = async (fileUrl: string, lower?: boolean) => {
	console.log(fileUrl);
	try {
		const { data } = await axios.get(fileUrl);
		// console.log(fileUrl, data)

		const parseData = parseXML(data, lower);
		// console.log(fileUrl, parseData)

		return { content: data, parsedData: parseData };
	} catch (error) {
		throw new Error(error.message);
	}
};

const parseXML = (data: Buffer, lower?: boolean) => {
	let parsedData;

	const xml = lower
		? data.toString("utf-8").toLowerCase().trim()
		: data.toString("utf-8").trim();

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

export const parseManifest = (allAssets, rootFile: string, manifest) => {
	const path = rootFile.slice(0, -23).split("/");
	const path_str = path.join("/");

	const result = {};

	if (manifest.item) {
		for (let i = 0, len = manifest.item.length; i < len; i++) {
			if (manifest.item[i]["@"]) {
				const element = manifest.item[i]["@"];

				if (
					element.href &&
					element.href.substr(0, path_str.length) != path_str
				) {
					const fromAssets = allAssets.find((asset) =>
						asset.toLowerCase().includes(parseURL(element.href)),
					);

					// if (!element.href.includes(path.slice(0, 6).join("/"))) {
					element.href = fromAssets
						? fromAssets
						: !element.href.includes(path.slice(0, 6).join("/"))
						? path.concat([element.href]).join("/")
						: element.href;
					console.log(element.href);
					// }
				}

				result[manifest.item[i]["@"].id] = element;
			}
		}
	}

	return result;
};

export const getEPubRootFile = async (bookContainerURL: string) => {
	try {
		const bookContainerData = await readFile(bookContainerURL, true);

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
		throw new Error(error.message);
	}
};

export const parseSpain = async (spine, rootFile, manifest) => {
	try {
		const result = { toc: {}, contents: [] };

		if (spine["@"] && spine["@"].toc) {
			result.toc = manifest[spine["@"].toc] || false;
		}

		if (spine.itemref) {
			if (!Array.isArray(spine.itemref)) {
				spine.itemref = [spine.itemref];
			}
			for (let i = 0, len = spine.itemref.length; i < len; i++) {
				if (spine.itemref[i]["@"]) {
					let element;
					if ((element = manifest[spine.itemref[i]["@"].idref])) {
						element.mediaType = element["media-type"] || element.mediaType;
						result.contents.push(element);
					}
				}
			}
		}

		return result;
	} catch (error) {
		throw new Error(error);
	}
};

export const parseTOC = async (spine, manifest) => {
	try {
		const path = spine.toc.href.split("/"),
			id_list = {};
		path.pop();

		const keys = Object.keys(manifest);

		for (let i = 0, len = keys.length; i < len; i++) {
			id_list[manifest[keys[i]].href] = keys[i];
		}

		const { parsedData, content } = await readFile(spine.toc.href);

		let toc = [];

		if (parsedData.navMap && parsedData.navMap.navPoint) {
			toc = walkNavMap(manifest, parsedData.navMap.navPoint, path, id_list);
		}

		return toc;
	} catch (error) {
		throw new Error(error);
	}
};

const walkNavMap = (manifest, branch, path, id_list, level?: number) => {
	level = level || 0;

	// don't go too far
	if (level > 7) {
		return [];
	}

	let output = [];

	if (!Array.isArray(branch)) {
		branch = [branch];
	}

	for (let i = 0; i < branch.length; i++) {
		if (branch[i].navLabel) {
			let title = "";
			if (branch[i].navLabel && typeof branch[i].navLabel.text == "string") {
				title =
					(branch[i].navLabel && branch[i].navLabel.text) ||
					(branch[i].navLabel === branch[i].navLabel &&
						branch[i].navLabel.text.length > 0)
						? (
								(branch[i].navLabel && branch[i].navLabel.text) ||
								branch[i].navLabel ||
								""
						  ).trim()
						: "";
			}
			let order = Number((branch[i]["@"] && branch[i]["@"].playOrder) || 0);
			if (isNaN(order)) {
				order = 0;
			}
			let href = "";
			if (
				branch[i].content &&
				branch[i].content["@"] &&
				typeof branch[i].content["@"].src == "string"
			) {
				href = branch[i].content["@"].src.trim();
			}

			interface Element {
				level: number;
				order: number;
				title: string;
				href?: string;
				id?: string;
			}

			let element: Element = {
				level: level,
				order: order,
				title: title,
			};

			if (href) {
				href = !href.includes(path.slice(0, 6).join("/"))
					? path.concat([href]).join("/")
					: href;
				element.href = href;

				if (id_list[element.href]) {
					// link existing object
					element = manifest[id_list[element.href]];
					element.title = title;
					element.order = order;
					element.level = level;
				} else {
					// use new one
					element.href = href;
					element.id = ((branch[i]["@"] && branch[i]["@"].id) || "").trim();
				}

				output.push(element);
			}
		}
		if (branch[i].navPoint) {
			output = output.concat(
				walkNavMap(manifest, branch[i].navPoint, path, id_list, level + 1),
			);
		}
	}
	return output;
};

export default readFile;
