import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";
import Branch from "./models/Branch.js";
import Sale from "./models/Sale.js";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🌱 Connected to MongoDB");

    // Clear old data
    await Branch.deleteMany();
    await Sale.deleteMany();

    // Insert branches
    const branches = await Branch.insertMany([
      { city: "Salem", area: "Hasthampatti" },
      { city: "Chennai", area: "Anna Nagar" },
      { city: "Coimbatore", area: "RS Puram" },
    ]);

    console.log("🏪 Branches inserted");

    // Insert sales linked to branches
    await Sale.insertMany([
      { branch: branches[0]._id, flavor: "Vanilla", unitsSold: 500 },
      { branch: branches[0]._id, flavor: "Chocolate", unitsSold: 300 },
      { branch: branches[1]._id, flavor: "Strawberry", unitsSold: 450 },
      { branch: branches[1]._id, flavor: "Vanilla", unitsSold: 200 },
      { branch: branches[2]._id, flavor: "Mango", unitsSold: 350 },
      { branch: branches[2]._id, flavor: "Butterscotch", unitsSold: 400 },
    ]);

    console.log("🍦 Sales inserted");

    await mongoose.disconnect();
    console.log("✅ Seed completed, DB ready!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding:", error.message);
    process.exit(1);
  }
};

seedData();
