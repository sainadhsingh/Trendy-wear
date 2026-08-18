import express from 'express';
import { getDb } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth to all wishlist routes
router.use(authenticateToken);

// Get User Wishlist
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const items = await db.all(
      `SELECT w.id as wishlist_id, w.created_at, p.*
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );

    const formatted = items.map((p) => ({
      ...p,
      additional_images: JSON.parse(p.additional_images || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      colors: JSON.parse(p.colors || '[]'),
    }));

    res.json({ wishlist: formatted });
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist.' });
  }
});

// Toggle Item in Wishlist
router.post('/toggle', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const db = await getDb();
    const existing = await db.get(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (existing) {
      await db.run('DELETE FROM wishlist WHERE id = ?', [existing.id]);
      return res.json({ action: 'removed', message: 'Removed from wishlist.' });
    } else {
      await db.run('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, productId]);
      return res.json({ action: 'added', message: 'Added to wishlist!' });
    }
  } catch (error) {
    console.error('Toggle Wishlist Error:', error);
    res.status(500).json({ error: 'Failed to update wishlist.' });
  }
});

// Remove Item from Wishlist
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const db = await getDb();

    await db.run('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
    res.json({ message: 'Removed from wishlist.' });
  } catch (error) {
    console.error('Remove Wishlist Error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist.' });
  }
});

export default router;
