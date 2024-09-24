import { getSheetsService } from "../../googleSheets/sheetsService";
import sheetsRepo from "../../googleSheets/repository/sheetsRepo";
import numberHelper from "../../../libraries/helpers/numberHelper";
import { config } from "../../../config/config";
import logger from "../../../libraries/logger/logger";
import type { sheets_v4 } from "googleapis";

const SHEET_NAME = config.GOOGLE_SHEET_NAME ?? "";

const insertNewcomer = async (
	spreadSheetId: string,
	newcomerData: string[],
	entryType: "INTERNAL" | "EXTERNAL",
	operator: string
): Promise<ResponseHelper> => {
	const sheetsService = await getSheetsService();
	const returnResponse: ResponseHelper = {
		isSuccess: true,
		message: "",
	};

	const newRowIndex = await sheetsRepo.getAfterLastRowIndex(
		sheetsService,
		spreadSheetId,
		SHEET_NAME
	);
	if (newRowIndex == null) {
		returnResponse.isSuccess = false;
		returnResponse.message =
			"Error in fetching sheet's last row, please check google sheet.";
		return returnResponse;
	}

	//generate newcomer id
	const generateNewcomerIdResponse = await generateNewComerID(
		sheetsService,
		spreadSheetId,
		returnResponse
	);
	if (!generateNewcomerIdResponse.isSuccess) return generateNewcomerIdResponse;

	//create metadata
	const today = new Date();
	const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	//convert format: DD/MM/YYYY
	const entryDate = new Intl.DateTimeFormat("en-GB").format(date);
	const metadata = [entryType, entryDate, operator];

	//finalize row to be inserted
	const data = [
		generateNewcomerIdResponse.object ?? "",
		...newcomerData,
		...metadata,
	];

	try {
		const insertResult = await sheetsRepo.insertNewRow(
			sheetsService,
			spreadSheetId,
			newRowIndex,
			data
		);
		if (insertResult.statusText.toLowerCase() === "ok") {
			returnResponse.message = `spreadsheet ${insertResult.data.spreadsheetId}, range ${insertResult.data.updatedRange} successfully updated.`;
		}
		logger.info("Newcomer inserted to spreadsheet.", {
			data: data,
			from: "newcomerController.insertNewcomer()",
		});
		return returnResponse;
	} catch (err: any) {
		logger.error("Error when inserting data.", {
			err,
			from: "newcomerController.insertNewcomer()",
		});
		returnResponse.isSuccess = false;
		returnResponse.message = err.toString();
		return returnResponse;
	}
};

const generateNewComerID = async (
	sheetsService: sheets_v4.Sheets,
	spreadSheetId: string,
	returnResponse: ResponseHelper
): Promise<ResponseHelper> => {
	const ids = (await sheetsRepo.getRowValue(
		sheetsService,
		spreadSheetId,
		"test_byWA!A2:A"
	)) ?? [[0]];

	const today = new Date();
	const year = today.getFullYear().toString();
	const month = (today.getMonth() + 1).toString().padStart(2, "0");
	const date = today.getDate().toString().padStart(2, "0");
	const todayString = year + month + date;

	//find all ids created today.
	const filteredIds = ids.filter((id) => {
		if (id[0] === 0) return false;

		const datePart = id[0].slice(3, 11); // Extracts the 'YYYYMMDD' part from the ID
		return datePart === todayString;
	});

	//get last index of today if any
	let numberizedIds: number[] = [];
	if (filteredIds.length == 0 || filteredIds[0][0] == 0) {
		numberizedIds = [0];
	} else {
		numberizedIds = filteredIds.map(
			(value) => numberHelper.getIdIndex(value[0]) ?? 0
		);
	}
	const lastIdNumber = Math.max(...numberizedIds);

	const newcomerId =
		"UNI" +
		year +
		month +
		date +
		//do not change parenthesis, calculation might differ
		((lastIdNumber ?? 0) + 1).toString().padStart(3, "0");
	returnResponse.isSuccess = true;
	returnResponse.object = newcomerId;
	return returnResponse;
};

const newcomerController = {
	insertNewcomer,
};
export default newcomerController;
