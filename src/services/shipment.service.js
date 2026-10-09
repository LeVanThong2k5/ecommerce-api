import prisma from "../config/prisma.js";

export async function createShipment(oid) {
  return prisma.shipment.create({
    data: {
      oid,
      status: "PENDING"
    }
  });
}

export async function getShipmentByOrderId(oid) {
  return prisma.shipment.findFirst({
    where: {
      oid
    },
    include: {
      order: true
    }
  });
}

export async function updateShipmentStatus(shipid, status) {
  return prisma.shipment.update({
    where: {
      shipid
    },
    data: {
      status
    }
  });
}