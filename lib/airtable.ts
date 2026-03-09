import Airtable from "airtable";

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.warn("Missing Airtable environment variables");
}

export const airtableBase = new Airtable({ apiKey }).base(baseId ?? "");
