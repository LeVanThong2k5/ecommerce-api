import prisma from "../config/prisma.js";

export async function createOrder(uid, items) {
  return prisma.$transaction(async (tx) => {
    // 1. Tạo Order
    const order = await tx.order.create({
      data: {
        uid,
        createat: new Date()
      }
    });

    // 2. Tạo OrderDetail và trừ tồn kho
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: {
          pid: item.pid
        }
      });

      if (!product) {
        throw new Error(`PRODUCT_NOT_FOUND:${item.pid}`);
      }

      if (item.qty <= 0) {
        throw new Error(`INVALID_QTY:${item.pid}`);
      }

      if (product.quantity < item.qty) {
        throw new Error(`INSUFFICIENT_STOCK:${item.pid}`);
      }

      await tx.orderDetail.create({
        data: {
          oid: order.oid,
          pid: product.pid,
          qty: item.qty,
          unit_price: product.price
        }
      });

      await tx.product.update({
        where: {
          pid: product.pid
        },
        data: {
          quantity: {
            decrement: item.qty
          }
        }
      });
    }

    // 3. Đặt hàng thành công -> tự động tạo Shipment
    await tx.shipment.create({
      data: {
        oid: order.oid,
        status: "PENDING"
      }
    });

    // 4. Trả về Order + Detail + Product + Shipment
    return tx.order.findUnique({
      where: {
        oid: order.oid
      },
      include: {
        orderDetails: {
          include: {
            product: true
          }
        },
        shipments: true
      }
    });
  });
}

export async function getOrdersByUser(uid) {
  return prisma.order.findMany({
    where: {
      uid
    },
    orderBy: {
      oid: "desc"
    },
    include: {
      orderDetails: {
        include: {
          product: true
        }
      },
      shipments: true
    }
  });
}

export async function getOrderById(oid) {
  return prisma.order.findUnique({
    where: {
      oid
    },
    include: {
      orderDetails: {
        include: {
          product: true
        }
      },
      shipments: true
    }
  });
}