const formatBirthdate = (birthDate: string) => {
	const birthDateArr = birthDate.split("/");
	const convertedBirthDateArr = birthDateArr.map((value) => {
		return Number.parseInt(value);
	});
	const date = new Date(
		convertedBirthDateArr[2],
		convertedBirthDateArr[1] - 1,
		convertedBirthDateArr[0]
	);

	//convert format birthDate: DD/MM/YYYY
	const formattedDate = new Intl.DateTimeFormat("en-GB").format(date);
	return formattedDate;
};

const validateBirthDate = (stringDate: string) => {
	const birthDateArr = stringDate.split("/");
	const convertedBirthDateArr = birthDateArr.map((value) => {
		return Number.parseInt(value);
	});
	if (convertedBirthDateArr[2].toString().length < 4) return false;

	const date = new Date(
		convertedBirthDateArr[2],
		convertedBirthDateArr[1] - 1,
		convertedBirthDateArr[0]
	);
	return !isNaN(Date.parse(date.toLocaleDateString()));
};

const birthDateValidation = {
	formatBirthdate,
	validateBirthDate,
};

export default birthDateValidation;
