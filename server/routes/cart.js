import express from 'express';
import { getDb } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get User Cart
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const items = await db.all(
      `SELECT c.id as cart_item_id, c.quantity, c.selected_size, c.selected_color, p.*
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    const formatted = items.map((item) => ({
      cart_item_id: item.cart_item_id,
      quantity: item.quantity,
      selected_size: item.selected_size,
      selected_color: item.selected_color,
      product: {
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        original_price: item.original_price,
        discount: item.discount,
        image: item.image,
        rating: item.rating,
      },
    }));

    res.json({ cart: formatted });
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
});

// Add Item to Cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1, selectedSize, selectedColor } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const db = await getDb();

    // Check if product exists
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const size = selectedSize || JSON.parse(product.sizes || '[]')[0] || 'M';
    const color = selectedColor || JSON.parse(product.colors || '[]')[0] || 'Default';

    // Check if item already exists in cart with same size and color
    const existing = await db.get(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND selected_size = ? AND selected_color = ?',
      [req.user.id, productId, size, color]
    );

    if (existing) {
      const newQty = existing.quantity + Number(quantity);
      await db.run(
        'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQty, existing.id]
      );
    } else {
      await db.run(
        'INSERT INTO cart (user_id, product_id, quantity, selected_size, selected_color) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, productId, Number(quantity), size, color]
      );
    }

    res.json({ message: 'Added to cart successfully!' });
  } catch (error) {
    console.error('Add Cart Error:', error);
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});

// Update Quantity
router.put('/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      const db = await getDb();
      await db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartItemId, req.user.id]);
      return res.json({ message: 'Item removed from cart.' });
    }

    const db = await getDb();
    await db.run(
      'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [Number(quantity), cartItemId, req.user.id]
    );

    res.json({ message: 'Cart updated.' });
  } catch (error) {
    console.error('Update Cart Error:', error);
    res.status(500).json({ error: 'Failed to update cart.' });
  }
});

// Remove Cart Item
router.delete('/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const db = await getDb();

    await db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartItemId, req.user.id]);
    res.json({ message: 'Item removed from cart.' });
  } catch (error) {
    console.error('Delete Cart Item Error:', error);
    res.status(500).json({ error: 'Failed to remove item.' });
  }
});

// Clear Cart
router.delete('/', async (req, res) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared.' });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
});

export default router;
