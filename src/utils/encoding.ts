export const toBase64 = (obj: object) => {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
};

export const fromBase64 = (str: string) => {
  return JSON.parse(Buffer.from(str, "base64").toString());
};
