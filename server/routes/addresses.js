import express from 'express';
import { getDb } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get User Addresses
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const addresses = await db.all(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC',
      [req.user.id]
    );
    res.json({ addresses });
  } catch (error) {
    console.error('Get Addresses Error:', error);
    res.status(500).json({ error: 'Failed to fetch addresses.' });
  }
});

// Add Address
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, address, city, state, pincode, addressType = 'Home', isDefault = 0 } = req.body;

    if (!fullName || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ error: 'All address fields are required.' });
    }

    const db = await getDb();

    if (isDefault) {
      await db.run('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
    }

    const result = await db.run(
      `INSERT INTO addresses (user_id, full_name, phone, address, city, state, pincode, address_type, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, fullName, phone, address, city, state, pincode, addressType, isDefault ? 1 : 0]
    );

    const newAddress = await db.get('SELECT * FROM addresses WHERE id = ?', [result.lastID]);
    res.status(201).json({ message: 'Address saved successfully!', address: newAddress });
  } catch (error) {
    console.error('Add Address Error:', error);
    res.status(500).json({ error: 'Failed to save address.' });
  }
});

// Delete Address
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    await db.run('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Address deleted successfully.' });
  } catch (error) {
    console.error('Delete Address Error:', error);
    res.status(500).json({ error: 'Failed to delete address.' });
  }
});

export default router;
