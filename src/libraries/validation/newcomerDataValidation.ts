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
	arrayData[0] = arrayData[0].toUpperCase();

	//gender
	if (arrayData[1] !== "F" && arrayData[1] !== "M") {
		returnResponse.isSuccess = false;
		returnResponse.message = "Data gender harus berupa M atau F";
		return returnResponse;
	}

	//birthdate validation
	if (arrayData[2] !== "N/A") {
		if (!birthDateValidation.validateBirthDate(arrayData[2])) {
			returnResponse.isSuccess = false;
			returnResponse.message = "Format tanggal lahir DD/MM/YYYY";
			return returnResponse;
		} else {
			arrayData[2] = birthDateValidation.formatBirthdate(arrayData[2]);
		}
	}

	//famcell leader
	arrayData[5] = arrayData[5].toUpperCase();

	returnResponse.object = arrayData;
	return returnResponse;
};

export default newcomerValidation;
