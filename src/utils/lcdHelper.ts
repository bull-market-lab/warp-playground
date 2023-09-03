import axios from "axios";
import { LCDClient } from "@terra-money/feather.js";

export const getErrorDescription = (e: any) => {
  let errorDescription;
  if (axios.isAxiosError(e)) {
    console.log(JSON.stringify(e.message, null, 2));
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.headers);
      if (
        typeof e.response.data === "object" &&
        e.response.data !== null &&
        "code" in e.response.data &&
        "message" in e.response.data
      ) {
        errorDescription = `Code=${e.response?.data["code"]} Message=${e.response?.data["message"]} \n`;
      } else {
        errorDescription = JSON.stringify(e.response.data);
      }
      console.log(errorDescription);
    } else {
      errorDescription = JSON.stringify(e.message, null, 2);
    }
  } else {
    console.log(JSON.stringify(e, null, 2));
    errorDescription = JSON.stringify(e.message, null, 2);
  }
  return errorDescription;
};

export const queryWasmContractWithCatch = async (
  lcd: LCDClient,
  contractAddress: string,
  query: object
): Promise<any> => {
  return lcd.wasm.contractQuery(contractAddress, query).catch((e) => {
    console.log(`error in querying contract ${contractAddress}`);
    getErrorDescription(e);
    throw e;
  });
};
