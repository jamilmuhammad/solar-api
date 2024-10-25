import { Matches } from "class-validator";

export const IsDateOnly = () => Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, { message: (v) => `${v.property} must be a date in the format YYYY-MM-DD` });

