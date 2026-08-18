import { getDb } from './db.js';
import bcrypt from 'bcryptjs';

const sampleProducts = [
  // WOMEN - DRESSES
  {
    name: 'Floral Summer Maxi Dress',
    description: 'Breeze through sunny days with this romantic floral printed maxi dress featuring a sweet sweetheart neckline, elasticized waist, and flowy silhouette.',
    category: 'Women',
    subcategory: 'Dresses',
    price: 1499,
    original_price: 2499,
    discount: 40,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.8,
    review_count: 142,
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Pink', 'White', 'Soft Beige']),
    stock: 35
  },
  {
    name: 'Satin Evening Party Dress',
    description: 'Turn heads at your next soirée with this luxurious silk-satin slip dress crafted with cowl neck detailing and adjustable cross-back straps.',
    category: 'Women',
    subcategory: 'Dresses',
    price: 2299,
    original_price: 3499,
    discount: 34,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    review_count: 98,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Soft Lavender', 'Beige', 'Black']),
    stock: 20
  },
  {
    name: 'Cotton Casual Wrap Dress',
    description: 'Effortlessly chic wrap dress in soft breathable cotton blend. Features a flattering tie waist, A-line hem, and delicate ruffle trim.',
    category: 'Women',
    subcategory: 'Dresses',
    price: 1299,
    original_price: 1999,
    discount: 35,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.6,
    review_count: 85,
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Beige', 'Pink', 'White']),
    stock: 45
  },
  {
    name: 'Boho Embroidered Mini Dress',
    description: 'Charming bohemian mini dress crafted with intricate lace inserts, balloon sleeves, and a tiered flared skirt.',
    category: 'Dresses',
    subcategory: 'Mini Dresses',
    price: 1799,
    original_price: 2699,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.7,
    review_count: 67,
    sizes: JSON.stringify(['S', 'M', 'L']),
    colors: JSON.stringify(['White', 'Cream']),
    stock: 25
  },
  {
    name: 'Tailored Blazer Formal Dress',
    description: 'Sleek double-breasted dress inspired by tailored menswear. Sharp lapels, flap pockets, and structured waistline for modern confidence.',
    category: 'Dresses',
    subcategory: 'Formal Dresses',
    price: 2499,
    original_price: 3999,
    discount: 37,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    review_count: 53,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Beige', 'Black', 'Soft Lavender']),
    stock: 18
  },
  {
    name: 'Plum Satin Slip Maxi Dress',
    description: 'Breathtaking floor-length satin dress with high leg slit and elegant draped back neckline.',
    category: 'Dresses',
    subcategory: 'Party Dresses',
    price: 2399,
    original_price: 3599,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify(['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80']),
    rating: 4.9,
    review_count: 110,
    sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
    colors: JSON.stringify(['Pink', 'Soft Lavender']),
    stock: 22
  },

  // WOMEN - TOPS
  {
    name: 'Oversized Pastel Linen Shirt',
    description: 'Lightweight pure linen casual shirt with a relaxed dropped-shoulder cut and curved button hemline.',
    category: 'Tops',
    subcategory: 'Shirts',
    price: 1199,
    original_price: 1799,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.6,
    review_count: 112,
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['White', 'Soft Beige', 'Pink']),
    stock: 50
  },
  {
    name: 'Ribbed Crop Knit Top',
    description: 'Cozy yet flattering fine-ribbed crop knit featuring a subtle square neckline and stretch-fit silhouette.',
    category: 'Tops',
    subcategory: 'Crop Tops',
    price: 799,
    original_price: 1299,
    discount: 38,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.5,
    review_count: 94,
    sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
    colors: JSON.stringify(['Pink', 'White', 'Soft Lavender', 'Beige']),
    stock: 60
  },
  {
    name: 'Silk Blend Ruffle Blouse',
    description: 'Sophisticated blouse in fluid silk-blend fabric with delicate ruffle stand collar and mother-of-pearl buttons.',
    category: 'Women',
    subcategory: 'Tops',
    price: 1599,
    original_price: 2299,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.8,
    review_count: 76,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Soft Lavender', 'White', 'Beige']),
    stock: 30
  },

  // MEN - SHIRTS & T-SHIRTS
  {
    name: 'Oversized Heavyweight Cotton Shirt',
    description: 'Premium 100% organic cotton oversized button-down shirt. Clean design, reinforced stitching, and relaxed aesthetic.',
    category: 'Men',
    subcategory: 'Shirts',
    price: 1399,
    original_price: 1999,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.7,
    review_count: 180,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Beige', 'White', 'Blue', 'Black']),
    stock: 55
  },
  {
    name: 'Minimalist Crewneck T-Shirt',
    description: 'Essential crewneck crafted from combed Supima cotton with ultra-soft handfeel and shrink-resistant finish.',
    category: 'Men',
    subcategory: 'T-Shirts',
    price: 699,
    original_price: 999,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.8,
    review_count: 210,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['White', 'Beige', 'Blue', 'Black']),
    stock: 80
  },
  {
    name: 'Casual Cuban Collar Summer Shirt',
    description: 'Resort-ready open camp collar shirt with subtle waffle texture and breathable linen-cotton weave.',
    category: 'Men',
    subcategory: 'Shirts',
    price: 1299,
    original_price: 1899,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.6,
    review_count: 115,
    sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Soft Beige', 'Green', 'White']),
    stock: 40
  },
  {
    name: 'Linen Blend Short Sleeve Shirt',
    description: 'Breezy short sleeve linen blend casual shirt, ideal for warm weekends and vacations.',
    category: 'Men',
    subcategory: 'Shirts',
    price: 1199,
    original_price: 1699,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify(['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80']),
    rating: 4.7,
    review_count: 92,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['White', 'Beige', 'Blue']),
    stock: 45
  },

  // MEN - HOODIES & JACKETS
  {
    name: 'Relaxed Fleece Pullover Hoodie',
    description: 'Ultra-soft brushed fleece hoodie with double-layer hood, kangaroo pocket, and ribbed cuffs for effortless daily comfort.',
    category: 'Men',
    subcategory: 'Hoodies',
    price: 1899,
    original_price: 2799,
    discount: 32,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    review_count: 165,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Beige', 'Black', 'Soft Lavender']),
    stock: 35
  },
  {
    name: 'Structured Cotton Twill Jacket',
    description: 'Timeless utility jacket constructed from durable cotton twill with chest pocket detail and metal hardware buttons.',
    category: 'Men',
    subcategory: 'Jackets',
    price: 2799,
    original_price: 3999,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.8,
    review_count: 88,
    sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Beige', 'Green', 'Black']),
    stock: 22
  },
  {
    name: 'Silk Jacquard Party Blazer',
    description: 'Tailored luxury blazer crafted with intricate jacquard weave, satin peak lapels, and double back vents.',
    category: 'Men',
    subcategory: 'Jackets',
    price: 3499,
    original_price: 5299,
    discount: 34,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify(['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80']),
    rating: 4.9,
    review_count: 64,
    sizes: JSON.stringify(['M', 'L', 'XL']),
    colors: JSON.stringify(['Black', 'Beige']),
    stock: 15
  },

  // BOTTOMS - JEANS, TROUSERS, CARGO
  {
    name: 'High-Waisted Straight Denim Jeans',
    description: 'Classic 90s vintage wash straight-leg jeans with high waist fit, 5 pockets, and premium non-stretch cotton denim.',
    category: 'Bottoms',
    subcategory: 'Jeans',
    price: 1999,
    original_price: 2999,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.8,
    review_count: 230,
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Blue', 'White', 'Black']),
    stock: 45
  },
  {
    name: 'Relaxed Wide-Leg Tailored Trousers',
    description: 'Contemporary pleated wide-leg trousers with elastic back waistband for high fashion look and maximum movement.',
    category: 'Bottoms',
    subcategory: 'Trousers',
    price: 1799,
    original_price: 2599,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.7,
    review_count: 140,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Beige', 'Black', 'Soft Lavender']),
    stock: 30
  },
  {
    name: 'Utility Multi-Pocket Cargo Pants',
    description: 'Streetwear-inspired cargo pants with 6 functional flap pockets, adjustable drawcord cuffs, and heavy cotton build.',
    category: 'Bottoms',
    subcategory: 'Cargo Pants',
    price: 1899,
    original_price: 2699,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.6,
    review_count: 95,
    sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Beige', 'Green', 'Black']),
    stock: 35
  },
  {
    name: 'Classic Slim Fit Black Denim Jeans',
    description: 'Timeless jet-black stretch denim jeans with mid-rise waist and durable double stitching.',
    category: 'Bottoms',
    subcategory: 'Jeans',
    price: 1799,
    original_price: 2499,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify(['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80']),
    rating: 4.8,
    review_count: 154,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Black']),
    stock: 40
  },

  // SHOES
  {
    name: 'Retro Chunky Leather Sneakers',
    description: 'Iconic low-top leather sneakers with cushioned arch support, perforated toe box, and durable rubber outer sole.',
    category: 'Shoes',
    subcategory: 'Sneakers',
    price: 2499,
    original_price: 3699,
    discount: 32,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    review_count: 310,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['White', 'Beige', 'Pink']),
    stock: 40
  },
  {
    name: 'Retro Platform Canvas Sneakers',
    description: 'Urban platform high-top canvas sneakers featuring thick vulcanized rubber sole and contrast stitching.',
    category: 'Shoes',
    subcategory: 'Sneakers',
    price: 2199,
    original_price: 3199,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify(['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80']),
    rating: 4.8,
    review_count: 125,
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['White', 'Black']),
    stock: 35
  },
  {
    name: 'Minimalist Leather Penny Loafers',
    description: 'Refined handcrafted leather loafers with soft memory foam insoles and sleek modern silhouette.',
    category: 'Shoes',
    subcategory: 'Formal Shoes',
    price: 2999,
    original_price: 4499,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.7,
    review_count: 82,
    sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Beige', 'Black']),
    stock: 20
  },

  // ACCESSORIES
  {
    name: 'Structured Vegan Leather Tote Bag',
    description: 'Spacious everyday tote with magnetic closure, interior zip pouch, and gold-tone metal hardware.',
    category: 'Accessories',
    subcategory: 'Bags',
    price: 1999,
    original_price: 2999,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    review_count: 205,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Beige', 'White', 'Black', 'Soft Lavender']),
    stock: 45
  },
  {
    name: 'Minimalist Leather Crossbody Clutch',
    description: 'Versatile envelope clutch with detachable chain strap, inner card slots, and smooth nappa leather finish.',
    category: 'Accessories',
    subcategory: 'Bags',
    price: 1399,
    original_price: 1999,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify(['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80']),
    rating: 4.8,
    review_count: 88,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Beige', 'Pink', 'Black']),
    stock: 30
  },
  {
    name: 'Rose Gold Minimalist Wristwatch',
    description: 'Sleek 36mm analog watch featuring Japanese quartz movement, rose gold mesh strap, and scratch-resistant glass.',
    category: 'Accessories',
    subcategory: 'Watches',
    price: 2499,
    original_price: 3999,
    discount: 37,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify([
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.8,
    review_count: 140,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Pink', 'Beige', 'White']),
    stock: 30
  },
  {
    name: 'Cat-Eye Designer Sunglasses',
    description: 'Glamorous oversized cat-eye sunglasses with gradient UV400 protective lenses.',
    category: 'Accessories',
    subcategory: 'Sunglasses',
    price: 999,
    original_price: 1599,
    discount: 37,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify(['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80']),
    rating: 4.7,
    review_count: 112,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Black', 'Beige']),
    stock: 40
  },
  {
    name: 'Gold Pearl Drop Earrings Set',
    description: 'Elegant freshwater pearl drop earrings plated in 18k gold with hypoallergenic posts.',
    category: 'Accessories',
    subcategory: 'Jewelry',
    price: 799,
    original_price: 1299,
    discount: 38,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    additional_images: JSON.stringify(['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80']),
    rating: 4.9,
    review_count: 145,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['White', 'Beige']),
    stock: 50
  }
];

export async function seedDatabase() {
  const db = await getDb();
  console.log('Seeding products database...');

  for (const p of sampleProducts) {
    const existing = await db.get('SELECT id FROM products WHERE name = ?', [p.name]);
    if (!existing) {
      await db.run(
        `INSERT INTO products (
          name, description, category, subcategory, price, original_price, discount,
          image, additional_images, rating, review_count, sizes, colors, stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.name, p.description, p.category, p.subcategory, p.price, p.original_price, p.discount,
          p.image, p.additional_images, p.rating, p.review_count, p.sizes, p.colors, p.stock
        ]
      );
    }
  }

  // Create demo user if missing
  const existingUsers = await db.get('SELECT COUNT(*) as count FROM users');
  if (!existingUsers || existingUsers.count === 0) {
    const defaultPassword = await bcrypt.hash('password123', 10);
    const result = await db.run(
      `INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)`,
      ['Demo User', 'demo@trendywear.com', '+91 9876543210', defaultPassword]
    );

    await db.run(
      `INSERT INTO addresses (user_id, full_name, phone, address, city, state, pincode, address_type, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        result.lastID,
        'Demo User',
        '+91 9876543210',
        '102 Fashion Boulevard, Bandra West',
        'Mumbai',
        'Maharashtra',
        '400050',
        'Home',
        1
      ]
    );

    console.log('Default demo user created: demo@trendywear.com / password123');
  }
}

// Run direct if called from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
