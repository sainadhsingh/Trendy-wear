import express from 'express';
import { getDb } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Create Order
router.post('/', async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, totalAmount, discountAmount = 0, deliveryCharge = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }
    if (!deliveryAddress) {
      return res.status(400).json({ error: 'Delivery address is required.' });
    }

    const db = await getDb();

    // Generate unique order number (e.g. TW-2026-8942)
    const orderNumber = `TW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Estimated delivery date (3-5 days from now)
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 4);
    const estimatedDelivery = estDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const result = await db.run(
      `INSERT INTO orders (
        order_number, user_id, total_amount, discount_amount, delivery_charge,
        payment_method, order_status, delivery_address, estimated_delivery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        req.user.id,
        totalAmount,
        discountAmount,
        deliveryCharge,
        paymentMethod || 'Cash on Delivery',
        'Order Placed',
        JSON.stringify(deliveryAddress),
        estimatedDelivery,
      ]
    );

    const orderId = result.lastID;

    // Insert Order Items
    for (const item of items) {
      await db.run(
        `INSERT INTO order_items (
          order_id, product_id, product_name, product_image, quantity, price, selected_size, selected_color
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product.id || item.product_id,
          item.product.name || item.product_name,
          item.product.image || item.product_image,
          item.quantity,
          item.product.price || item.price,
          item.selected_size || 'M',
          item.selected_color || 'Default',
        ]
      );
    }

    // Clear cart for this user
    await db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    res.status(201).json({
      message: 'Order Placed Successfully!',
      orderId,
      orderNumber,
      estimatedDelivery,
      totalAmount,
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Failed to place order.' });
  }
});

// Get User Orders
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const orders = await db.all(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const formattedOrders = [];

    for (const o of orders) {
      const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      formattedOrders.push({
        ...o,
        delivery_address: JSON.parse(o.delivery_address || '{}'),
        items,
      });
    }

    res.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// Get Order Details by ID or Number
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    let order = await db.get(
      'SELECT * FROM orders WHERE (id = ? OR order_number = ?) AND user_id = ?',
      [id, id, req.user.id]
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    res.json({
      order: {
        ...order,
        delivery_address: JSON.parse(order.delivery_address || '{}'),
        items,
      },
    });
  } catch (error) {
    console.error('Get Order Details Error:', error);
    res.status(500).json({ error: 'Failed to fetch order details.' });
  }
});

export default router;
