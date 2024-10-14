import { sheets_v4 } from "googleapis";
import { SHEET_VALUE_INPUT_OPTION_ENUM } from "../enum/SheetValueInputOptionEnum";
import { SHEET_DIMENSION_ENUM } from "../enum/SheetDimensionEnum";

const getAfterLastRowIndex = async (
	sheetsService: sheets_v4.Sheets,
	spreadSheetId: string,
	sheetName: string
) => {
	//craete dummy append to get last row.
	const dummyAppend = await sheetsService.spreadsheets.values.append({
		spreadsheetId: spreadSheetId,
		range: `${sheetName}!A:ZZZ`,
		valueInputOption: SHEET_VALUE_INPUT_OPTION_ENUM.USER_ENTERED,
		insertDataOption: "INSERT_ROWS",
		requestBody: {
			majorDimension: SHEET_DIMENSION_ENUM.ROWS,
			values: [],
		},
	});

	//find the last row index using regex
	const index = getDigit(dummyAppend.data.updates?.updatedRange ?? "");
	return index;
};

const getSingleCellValue = async (
	sheetsService: sheets_v4.Sheets,
	spreadSheetId: string,
	range: string
) => {
	const lastRowResponse = await sheetsService.spreadsheets.values.get({
		spreadsheetId: spreadSheetId,
		range: range,
	});
	return lastRowResponse.data.values;
};

const insertNewRow = async (
	sheetsService: sheets_v4.Sheets,
	spreadSheetId: string,
	sheetName: string,
	newRowIndex: number,
	data: string[]
) => {
	const updateResponse = await sheetsService.spreadsheets.values.update({
		spreadsheetId: spreadSheetId,
		range: `${sheetName}!A${newRowIndex}`,
		valueInputOption: SHEET_VALUE_INPUT_OPTION_ENUM.RAW,
		requestBody: {
			majorDimension: SHEET_DIMENSION_ENUM.ROWS,
			values: [data],
		},
	});
	return updateResponse;
};

const getDigit = (text: string) => {
	const match = text.match(/\d+$/);
	return match ? parseInt(match[0], 10) : null;
};

const sheetRepoProperties = {
	getAfterLastRowIndex,
	getRowValue: getSingleCellValue,
	insertNewRow,
};
export default sheetRepoProperties;
