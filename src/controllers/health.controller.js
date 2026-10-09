import prisma from "../config/prisma.js";

export async function healthCheck(req, res) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      status: "UP",
      database: "UP"
    });
  } catch (error) {
    console.error(error);

    return res.status(503).json({
      success: false,
      status: "DOWN",
      database: "DOWN"
    });
  }
}