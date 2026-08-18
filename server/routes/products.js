import express from 'express';
import { getDb } from '../db.js';

const router = express.Router();

// Get Products (with Search, Filter, Sort)
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, search, minPrice, maxPrice, size, color, rating, sortBy } = req.query;
    const db = await getDb();

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Filter Category
    if (category) {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    // Filter Subcategory
    if (subcategory) {
      query += ' AND LOWER(subcategory) = LOWER(?)';
      params.push(subcategory);
    }

    // Live Search (Name, Category, Subcategory, Description)
    if (search) {
      const searchPattern = `%${search.toLowerCase().trim()}%`;
      query += ' AND (LOWER(name) LIKE ? OR LOWER(category) LIKE ? OR LOWER(subcategory) LIKE ? OR LOWER(description) LIKE ?)';
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Price Filter
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    // Rating Filter
    if (rating) {
      query += ' AND rating >= ?';
      params.push(Number(rating));
    }

    // Size Filter (in JSON string)
    if (size) {
      query += ' AND sizes LIKE ?';
      params.push(`%"${size}"%`);
    }

    // Color Filter (in JSON string)
    if (color) {
      query += ' AND colors LIKE ?';
      params.push(`%"${color}"%`);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low-high':
        query += ' ORDER BY price ASC';
        break;
      case 'price-high-low':
        query += ' ORDER BY price DESC';
        break;
      case 'newest':
        query += ' ORDER BY id DESC';
        break;
      case 'rating':
        query += ' ORDER BY rating DESC';
        break;
      case 'recommended':
      default:
        query += ' ORDER BY rating DESC, review_count DESC';
        break;
    }

    const products = await db.all(query, params);

    // Parse JSON string arrays
    const formattedProducts = products.map((p) => ({
      ...p,
      additional_images: JSON.parse(p.additional_images || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      colors: JSON.parse(p.colors || '[]'),
    }));

    res.json({ count: formattedProducts.length, products: formattedProducts });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// Get Trending Products (top 8)
router.get('/trending', async (req, res) => {
  try {
    const db = await getDb();
    const products = await db.all('SELECT * FROM products ORDER BY rating DESC LIMIT 8');

    const formattedProducts = products.map((p) => ({
      ...p,
      additional_images: JSON.parse(p.additional_images || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      colors: JSON.parse(p.colors || '[]'),
    }));

    res.json({ products: formattedProducts });
  } catch (error) {
    console.error('Get Trending Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch trending products.' });
  }
});

// Get Single Product Details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const formattedProduct = {
      ...product,
      additional_images: JSON.parse(product.additional_images || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]'),
    };

    res.json({ product: formattedProduct });
  } catch (error) {
    console.error('Get Single Product Error:', error);
    res.status(500).json({ error: 'Failed to fetch product details.' });
  }
});

export default router;
