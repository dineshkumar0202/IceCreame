import mongoose from "mongoose";
import { MONGO_URI } from "./src/config.js";
import City from "./src/models/City.js";
import Branch from "./src/models/Branch.js";

await mongoose.connect(MONGO_URI);

await City.deleteMany();
await Branch.deleteMany();

const salem = await City.create({ name: "Salem" });
await Branch.insertMany([
  { name: "Hasthampatti", cityId: salem._id },
  { name: "Fairlands", cityId: salem._id }
]);

console.log("Seeded sample data");
process.exit();
