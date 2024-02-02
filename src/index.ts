import { handler } from "@/main";
import { config } from 'dotenv'
config();

handler([],{} as any,(err, res) => {
  console.log(err, res)
});
