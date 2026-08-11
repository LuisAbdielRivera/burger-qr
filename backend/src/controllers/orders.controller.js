const prisma = require('../config/prisma');
const generateCode = require('../utils/generateCode');

async function getOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
}

async function createOrder(req, res) {
  const { customer, items } = req.body;

  if (!customer?.toString().trim() || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cliente y detalles del pedido son obligatorios' });
  }

  try {
    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
      notes: item.notes?.toString().trim() || null,
    }));

    if (normalizedItems.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
      return res.status(400).json({
        error: 'Cada producto debe tener un productId y una cantidad entera mayor a cero',
      });
    }

    const productIds = [...new Set(normalizedItems.map((item) => item.productId))];

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        available: true,
      },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        error: 'Uno o más productos no existen o no están disponibles',
      });
    }

    const productMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    const orderItems = normalizedItems.map((item) => {
      const product = productMap[item.productId];

      return {
        quantity: item.quantity,
        notes: item.notes,
        unitPrice: product.price,
        product: {
          connect: { id: product.id },
        },
      };
    });

    const total = orderItems.reduce((acc, item) => {
      return acc + Number(item.unitPrice) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        code: generateCode(),
        customer: customer.toString().trim(),
        total: total.toFixed(2),
        status: 'PENDIENTE',
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el pedido' });
  }
}

async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDIENTE', 'PREPARANDO', 'ENTREGADO'];

  if (!status) {
    return res.status(400).json({ error: 'El estado del pedido es obligatorio' });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado del pedido inválido' });
  }

  try {
    const existingOrder = await prisma.order.findUnique({ where: { id } });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
}

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
