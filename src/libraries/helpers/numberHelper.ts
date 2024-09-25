const getIdIndex = (text: string) => {
	const today = new Date();
	const year = today.getFullYear().toString();
	const month = (today.getMonth() + 1).toString().padStart(2, "0");
	const date = today.getDate().toString().padStart(2, "0");

	const prefix = "UNI" + year + month + date;

	const match = text.match(new RegExp(`${prefix}(\\d+)$`));
	return match ? parseInt(match[1], 10) : null;
};

const numberHelper = {
	getIdIndex: getIdIndex,
};

export default numberHelper;
