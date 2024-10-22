import type { Message } from "whatsapp-web.js";
import newcomerController from "../../../newcomer/api/newcomerController";
import logger from "../../../../libraries/logger/logger";
import newcomerValidation from "../../../../libraries/validation/newcomerDataValidation";

const addNewcomerInternal = async (spreadSheetId: string, message: Message) => {
	const data = message.body.split("#");
	const operator = (await message.getContact()).number;

	//remove first element "daftar"
	data.shift();
	let trimmedData = data.map((value) => value.trim());
	logger.info(`Newcomer data received from ${operator}`, {
		data: trimmedData,
		type: "INTERNAL",
		from: "newcomerEvents.addNewcomerInternal()",
	});

	/* array values:
		0-Name
		1-Gender
	  XX - BirthDate - isi N/A di sini
		2-Age
		3-WANumber 
		4-FamilyCell
	*/

	//validate data is complete
	if (trimmedData.length < 5) {
		message.reply("Silakan cek kembali format pendaftaran");
		message.react("❌");
		return;
	}

	//isi birthdate as 'N/A'
	trimmedData.splice(2, 0, "N/A");

	const validationResult = newcomerValidation(trimmedData);
	if (!validationResult.isSuccess) {
		message.reply(
			validationResult.message ?? "Error: Terdapat kesalahan validasi data"
		);
		message.react("❌");
		return;
	}
	trimmedData = validationResult.object;

	const insertResult: ResponseHelper = await newcomerController.insertNewcomer(
		spreadSheetId,
		trimmedData,
		"INTERNAL",
		operator ?? ""
	);
	if (!insertResult.isSuccess) {
		message.reply(insertResult.message ?? "Error inserting data.");
		message.react("❌");
		return;
	}
	message.reply("data berhasil diinput. ty.");
	message.react("✅");
	return;
};

const addNewcomerExternal = async (spreadSheetId: string, message: Message) => {
	/* array values
		- Nama lengkap
		- Gender
		- Tanggal lahir
		- Age (calc from birthdate)
		- Nomor WA
		- famcell
		*/
	const extractedData = extractDataFormExternal(message.body.toString());
	const operator = (await message.getContact()).number;

	if (extractedData.name === "") {
		message.reply("Data input is not valid, kindly recheck the values.");
		message.react("❌");
	}

	logger.info(`Newcomer data received from ${operator}`, {
		data: extractedData,
		type: "EXTERNAL",
		from: "newcomerEvents.addNewcomerExternal()",
	});
	let dataArray = [
		extractedData.name.toUpperCase(),
		extractedData.gender,
		extractedData.birthDate,
		extractedData.age,
		extractedData.waNumber,
		"",
	];

	const newcomerValidationResult = newcomerValidation(dataArray);
	if (!newcomerValidationResult.isSuccess) {
		message.reply(
			newcomerValidationResult.message ??
				"Error: Terdapat kesalahan validasi data"
		);
		message.react("❌");
		return;
	}
	dataArray = newcomerValidationResult.object;
	//logger.debug(dataArray);

	const insertResult: ResponseHelper = await newcomerController.insertNewcomer(
		spreadSheetId,
		dataArray,
		"EXTERNAL",
		operator ?? ""
	);
	if (!insertResult.isSuccess) {
		message.reply(insertResult.message ?? "Error inserting data.");
		message.react("❌");
	}
	message.reply("Form submitted. Terima kasih, Tuhan memberkati! 😁");
	message.react("✅");
	return;
};

const extractDataFormExternal = (input: string): Newcomer => {
	//split data per line
	const dataPerLine = input.split("\n").map((line) => line.trim());

	const namaMatch = dataPerLine[1].match(/Nama:\s*(.*)$/m);
	const genderMatch = dataPerLine[2].match(/Gender:\s*(.*)$/m);
	const tanggalLahirMatch = dataPerLine[3].match(/Tanggal Lahir:\s*(.*)$/m);
	const nomorWAMatch = dataPerLine[4].match(/Nomor WA:\s*(.*)$/m);

	const namaValue =
		namaMatch && namaMatch[1].trim() !== "" ? namaMatch[1].trim() : null;
	const genderValue =
		genderMatch && genderMatch[1].trim() !== "" ? genderMatch[1].trim() : null;
	const tanggalLahirValue =
		tanggalLahirMatch && tanggalLahirMatch[1].trim() !== ""
			? tanggalLahirMatch[1].trim()
			: null;
	const nomorWAValue =
		nomorWAMatch && nomorWAMatch[1].trim() !== ""
			? nomorWAMatch[1].trim()
			: null;
	const ageValue = calculateAge(tanggalLahirValue ?? "");

	const data = {
		name: namaValue ?? "",
		gender: genderValue ?? "",
		birthDate: tanggalLahirValue ?? "",
		age: ageValue ?? "",
		waNumber: nomorWAValue ?? "",
		famCell: "",
	};
	return data;
};

const calculateAge = (birthDateString: string): string => {
	if (birthDateString === "") return "0";

	const [day, month, year] = birthDateString.split("/").map(Number);
	const birthDate = new Date(year, month - 1, day); // Month is 0-indexed

	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	const dayDiff = today.getDate() - birthDate.getDate();

	// Adjust age if the current date hasn't yet passed the birthdate in the year
	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--;
	}

	return age.toString();
};

const newcomerEvents = {
	addNewcomerInternal,
	addNewcomerExternal,
};
export default newcomerEvents;
