import { Message } from "whatsapp-web.js";
import birthDateValidation from "../../../../libraries/validation/birthDateValidation";
import newcomerController from "../../../newcomer/api/newcomerController";
import logger from "../../../../libraries/logger/logger";

const addNewcomerInternal =  async(
    spreadSheetId: string,
    message: Message
)=>{
    const data = message.body.split("#");
    data.shift();
    const trimmedData = data.map((value)=> (value.trim()));
    logger.info("RECEIVED DATA:", trimmedData);

    /*
    data array: 
    1 - nama
    2 - tanggal lahir
    3 - alamat
    */
    if(!birthDateValidation.validateBirthDate(trimmedData[1])){
        message.reply("Format tanggal lahir DD/MM/YYYY");
        message.react("❌");
        return;
    }
    else{
        trimmedData[1] = birthDateValidation.formatBirthdate(trimmedData[1]);
    }

    const insertResult: ResponseHelper = await newcomerController.insertNewcomer(spreadSheetId,trimmedData);
    if(!insertResult.isSuccess){
        message.reply(insertResult.message ?? "Terdapat kesalahan import data");
        message.react("❌");
        return;
    }
    message.reply("data berhasil diupdate. ty."); 
    message.react("✅");
    return;
}

const addNewcomerExternal = async (
    spreadSheetId: string, 
    message: Message
)=>{
    const extractedData = extractDataFormExternal(message.body.toString());
    if(extractedData.name === ""){
      message.reply("Data input is not valid, kindly recheck the values.");
      message.react("❌");
    }

    logger.info(extractedData);
    const dataArray = [
        extractedData.name,
        extractedData.birthDate,
        extractedData.address
    ];

    if(!birthDateValidation.validateBirthDate(dataArray[1])){
        message.reply("Format tanggal lahir DD/MM/YYYY");
        message.react("❌");
        return;
    }
    else{
        dataArray[1] = birthDateValidation.formatBirthdate(dataArray[1]);
    }

    const insertResult: ResponseHelper = await newcomerController.insertNewcomer(spreadSheetId, dataArray); 
    if(!insertResult.isSuccess){
        message.reply(insertResult.message ?? "Error inserting data.");
        message.react("❌");
    }
    message.reply("data berhasil diupdate. ty.");
    message.react("✅");
    return;
}

const extractDataFormExternal = (input: string) : Newcomer => {
    //split data per line
    const dataPerLine = input.split("\n").map(line => line.trim());
    
    //TEST: Kalau formnya langsung dimulai dengan label, ini bisa dihapus
    dataPerLine.shift();
  
    const namaMatch = dataPerLine[0].match(/Nama:\s*(.*)$/m);
    const tanggalLahirMatch = dataPerLine[1].match(/Tanggal Lahir:\s*(.*)$/m);
    const alamatMatch = dataPerLine[2].match(/Alamat:\s*(.*)$/m);
  
    const namaValue = namaMatch && namaMatch[1].trim() !== "" ? namaMatch[1].trim() : null;
    const tanggalLahirValue = tanggalLahirMatch && tanggalLahirMatch[1].trim() !== "" ? tanggalLahirMatch[1].trim() : null;
    const alamatValue = alamatMatch && alamatMatch[1].trim() !== "" ? alamatMatch[1].trim() : null;
  
    return {
       name: namaValue ?? "",
       birthDate: tanggalLahirValue ?? "",
       address: alamatValue ?? ""
    };
}



const newcomerEvents = {
    addNewcomerInternal,
    addNewcomerExternal
}
export default newcomerEvents;