const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { getEcoScore, getBestAlternative } = require("../services/geminiService");

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
//  Helper: find candidates from DB matching a search query
//  Returns products whose name OR category contains the query.
//  Excludes the original product by its _id.
// ─────────────────────────────────────────────────────────────
function findCandidates(searchQuery, excludeId) {
  const products = loadProducts();
  const q = (searchQuery || "").toLowerCase().trim();

  return products.filter((p) => {
    if (excludeId && (p._id === excludeId || String(p._id) === String(excludeId))) {
      return false; // skip the original product
    }
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  });
}

// ═══════════════════════════════════════════════════════════
//  POST /eco/score
//  Body: full product object
//  Returns: ecoScore, carbonFootprint, breakdown, badges, explanation
// ═══════════════════════════════════════════════════════════
router.post("/score", async (req, res) => {
  const product = req.body;

  if (!product || !product.name) {
    return res.status(400).json({
      success: false,
      message: "Request body must include at least a product name.",
    });
  }

  try {
    const result = await getEcoScore(product);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("[/eco/score]", error);
    return res.status(500).json({ success: false, message: "Eco score calculation failed." });
  }
});

// ═══════════════════════════════════════════════════════════
//  POST /eco/alternative
//
//  Body:
//    product     – the product the user is currently viewing
//
//  Flow:
//    1. Find the product in the DB to get its current greenAlternativeId.
//    2. If it has a greenAlternativeId, fetch that alternative from the DB.
//    3. If no greenAlternativeId, it means the product is already eco-friendly or has no alternative.
//    4. Call getEcoScore() for the chosen alternative (if any).
//    5. Return the alternative product + its eco score.
// ═══════════════════════════════════════════════════════════
router.post("/alternative", async (req, res) => {
  const { product } = req.body;

  if (!product || !product._id) {
    return res.status(400).json({
      success: false,
      message: "Product object with _id is required.",
    });
  }

  try {
    const products = loadProducts();
    const dbProduct = products.find(p => String(p._id) === String(product._id));

    if (!dbProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found in database.",
      });
    }

    if (!dbProduct.greenAlternativeId) {
      return res.json({
        success: true,
        data: {
          found: false,
          message: "This product is already eco-friendly or no greener alternative is currently available.",
          alternative: null,
          ecoScore: null,
        },
      });
    }

    const alternativeProduct = products.find(p => String(p._id) === String(dbProduct.greenAlternativeId));

    if (!alternativeProduct) {
      return res.json({
        success: true,
        data: {
          found: false,
          message: "Alternative product record not found in database.",
          alternative: null,
          ecoScore: null,
        },
      });
    }

    // Get eco score for the chosen alternative
    const alternativeEcoScore = await getEcoScore(alternativeProduct);

    return res.json({
      success: true,
      data: {
        found: true,
        alternative: alternativeProduct,
        ecoScore: alternativeEcoScore,
        aiReason: `This alternative uses greener materials and sustainable packaging compared to ${dbProduct.name}.`,
      },
    });
  } catch (error) {
    console.error("[/eco/alternative]", error);
    return res.status(500).json({ success: false, message: "Alternative recommendation failed." });
  }
});

module.exports = router;