import { z } from "zod";

export const IntegerUrlParam = z.preprocess((v) => {
  const result = parseInt(v as string);
  return Number.isNaN(result) ? v : result;
}, z.number());
