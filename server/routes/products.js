const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "..", "src", "data", "products_with_images.json");
let productsCache = null;

function loadProducts() {
  if (!productsCache) {
    const raw = fs.readFileSync(jsonPath, "utf8");
    productsCache = JSON.parse(raw);
  }
  return productsCache;
}

// ─────────────────────────────────────────────────────────────
//  Relevance scorer
//  Returns a numeric score so name-matches rank higher than
//  description-matches (mirrors typical search UX).
// ─────────────────────────────────────────────────────────────
function relevanceScore(product, query) {
  const q = query.toLowerCase();
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const description = (product.description || "").toLowerCase();

  let score = 0;
  if (name === q) score += 100;           // exact name match
  else if (name.startsWith(q)) score += 60; // prefix match
  else if (name.includes(q)) score += 40;  // substring match

  if (category === q) score += 30;
  else if (category.includes(q)) score += 15;

  if (description.includes(q)) score += 5;

  return score;
}

// ═══════════════════════════════════════════════════════════
//  GET /products?q=&category=&page=&limit=
//
//  Query params:
//    q        – search term (searched in name, category, description)
//    category – exact category filter (optional)
//    page     – page number, default 1
//    limit    – results per page, default 20
// ═══════════════════════════════════════════════════════════
router.get("/", (req, res) => {
  const q = (req.query.q || "").trim();
  const categoryFilter = (req.query.category || "").toLowerCase().trim();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 100));

  const products = loadProducts();

  let filtered = products;

  // ── Text search ───────────────────────────────────────────
  if (q) {
    const qLower = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(qLower) ||
        (p.description || "").toLowerCase().includes(qLower) ||
        (p.category || "").toLowerCase().includes(qLower)
    );

    // Sort by relevance (most relevant first)
    filtered.sort((a, b) => relevanceScore(b, q) - relevanceScore(a, q));
  }

  // ── Category filter ───────────────────────────────────────
  if (categoryFilter) {
    filtered = filtered.filter(
      (p) => (p.category || "").toLowerCase() === categoryFilter
    );
  }

  // ── Pagination ────────────────────────────────────────────
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return res.json({
    success: true,
    meta: {
      total,
      page,
      limit,
      totalPages,
      query: q || null,
      category: categoryFilter || null,
    },
    data: paginated,
  });
});

// ═══════════════════════════════════════════════════════════
//  GET /products/:id
// ═══════════════════════════════════════════════════════════
router.get("/:id", (req, res) => {
  const products = loadProducts();
  const id = req.params.id;

  const product = products.find(
    (p) => String(p._id) === String(id)
  );

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  return res.json({ success: true, data: product });
});

module.exports = router;