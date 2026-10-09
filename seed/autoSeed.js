const bcrypt = require("bcryptjs");
const Product = require("../models/product.js");
const User = require("../models/user.js");
const products = require("./product.js");
const { getDescription, getProductInfo } = require("./helper.js");

async function autoSeed() {
  try {
    // 1. Check and seed products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("🌱 Database has 0 products. Auto-seeding initial products catalog...");
      await Product.insertMany(
        products.map((p) => ({
          ...p,
          description: getDescription(p.category, p.name),
          productInfo: getProductInfo(p.category),
        })),
      );
      console.log(`✅ Seeded ${products.length} products successfully!`);
    } else {
      console.log(`ℹ️ Products already seeded (${productCount} products found).`);
    }

    // 2. Check and seed admin user
    const adminEmail = "admin@shopnest.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log("🌱 Creating default Admin account (admin@shopnest.com)...");
      const hashedPassword = await bcrypt.hash("Admin@12345", 10);
      await User.create({
        name: "ShopNest Admin",
        email: adminEmail,
        phone: "9876543210",
        password: hashedPassword,
        role: "Admin",
        isAdmin: true,
      });
      console.log("✅ Admin account created: admin@shopnest.com / Admin@12345");
    } else {
      // Ensure isAdmin & role are Admin
      if (!existingAdmin.isAdmin || existingAdmin.role !== "Admin") {
        existingAdmin.isAdmin = true;
        existingAdmin.role = "Admin";
        await existingAdmin.save();
        console.log("✅ Updated existing admin account permissions to Admin role.");
      }
    }

    // 3. Check and seed demo customer
    const userEmail = "user@shopnest.com";
    const existingUser = await User.findOne({ email: userEmail });
    if (!existingUser) {
      console.log("🌱 Creating demo customer account (user@shopnest.com)...");
      const hashedPassword = await bcrypt.hash("User@12345", 10);
      await User.create({
        name: "Demo Customer",
        email: userEmail,
        phone: "9876543211",
        password: hashedPassword,
        role: "User",
        isAdmin: false,
      });
      console.log("✅ Demo customer created: user@shopnest.com / User@12345");
    }
  } catch (err) {
    console.error("⚠️ Error during auto-seeding:", err.message);
  }
}

module.exports = autoSeed;
