import prisma from "../config/prisma.js";

async function main() {
  const productCount = await prisma.product.count();

  console.log("Connected to PostgreSQL successfully");
  console.log("Product count:", productCount);
}

main()
  .catch((error) => {
    console.error("Database connection failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  