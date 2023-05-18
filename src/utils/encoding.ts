export const objectToBase64 = (obj: object) => {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
};