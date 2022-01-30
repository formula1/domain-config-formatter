
import { JSON_Unknown } from "../types";
import { testEmail } from "../validators/email"

export function formatEmail(value: JSON_Unknown): string {
  if(typeof value !== "string"){
    throw new Error("email is necessary")
  }
  testEmail(value);
  return value;
}
