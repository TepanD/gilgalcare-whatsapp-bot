const getDigit = (text: string)=>{
    const match = text.match(/\d+$/);
    return match ? parseInt(match[0], 10) : null;
};

const numberHelper ={
    getDigit
}

export default numberHelper;