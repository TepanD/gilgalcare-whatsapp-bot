import birthDateValidation from "./birthDateValidation";

const newcomerValidation = (arrayData: string[]): ResponseHelper => {
	const returnResponse: ResponseHelper = {
		isSuccess: true,
		message: "",
	};
	/* array values:
		0-Name
		1-Gender
	  2-BirthDate
		3-Age
		4-WANumber 
		5-FamilyCell
	*/

	//newcomer name
	if (
		arrayData[0] === null ||
		arrayData[0] === undefined ||
		arrayData[0] === ""
	) {
		returnResponse.isSuccess = false;
		returnResponse.message = "Silakan isi kolom nama";
		return returnResponse;
	}
	arrayData[0] = arrayData[0].toUpperCase();

	//gender
	if (arrayData[1] !== "F" && arrayData[1] !== "M") {
		returnResponse.isSuccess = false;
		returnResponse.message = "Gender harus berupa *M* atau *F*";
		return returnResponse;
	}

	//birthdate validation
	if (arrayData[2] !== "N/A") {
		if (!birthDateValidation.validateBirthDate(arrayData[2])) {
			returnResponse.isSuccess = false;
			returnResponse.message = "Format tanggal lahir harus *DD/MM/YYYY*";
			return returnResponse;
		} else {
			arrayData[2] = birthDateValidation.formatBirthdate(arrayData[2]);
		}
	}

	//validate WA number
	if (
		arrayData[4] == null ||
		arrayData[4] === undefined ||
		arrayData[4].length < 10
	) {
		returnResponse.isSuccess = false;
		returnResponse.message = "Nomor WA tidak valid";
		return returnResponse;
	}

	//famcell leader //masih dibolehin kosong
	arrayData[5] = arrayData[5].toUpperCase() ?? "";

	returnResponse.object = arrayData;
	return returnResponse;
};

export default newcomerValidation;
