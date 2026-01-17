import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const { Pool } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (xf) {
    const parts = Array.isArray(xf) ? xf : String(xf).split(",");
    return parts[0].trim();
  }
  return req.socket?.remoteAddress || req.ip;
}

async function ensureTables() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
      tipo TEXT NOT NULL DEFAULT 'user',
      ip_cadastro TEXT
    )`
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS lojas (
      id SERIAL PRIMARY KEY,
      id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      id_template_checkout INTEGER,
      nome_loja TEXT NOT NULL,
      cnpj_loja TEXT,
      email_loja TEXT,
      logo_loja TEXT,
      banner_loja TEXT,
      cor_topo_loja TEXT,
      id_frete_padrao INTEGER,
      parcelas_maxima INTEGER,
      pagamento_selecionado TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS shopify_products_flat (
      id_loja INTEGER NOT NULL REFERENCES lojas(id) ON DELETE CASCADE,
      variant_id BIGINT PRIMARY KEY,
      product_id BIGINT NOT NULL,
      product_title VARCHAR(255) NOT NULL,
      product_handle VARCHAR(255),
      product_type VARCHAR(255),
      vendor VARCHAR(255),
      body_html TEXT,
      tags TEXT,
      status VARCHAR(50),
      variant_title VARCHAR(255),
      sku VARCHAR(100),
      price NUMERIC(10,2),
      compare_at_price NUMERIC(10,2),
      barcode VARCHAR(100),
      inventory_quantity INTEGER,
      weight NUMERIC(10,2),
      weight_unit VARCHAR(10),
      option1_name VARCHAR(50),
      option1_value VARCHAR(100),
      option2_name VARCHAR(50),
      option2_value VARCHAR(100),
      main_image_url TEXT,
      variant_image_url TEXT,
      created_at TIMESTAMP,
      updated_at TIMESTAMP,
      synced_at TIMESTAMP DEFAULT NOW()
    )`
  );
}

ensureTables().catch((e) => {
  console.error("Erro ao criar tabelas:", e);
});

app.get("/api/health/db", async (req, res) => {
  try {
    const r = await pool.query("SELECT 1 as ok");
    res.json({ ok: true, result: r.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body || {};
  if (!nome || !email || !senha || !nome_loja) {
    return res.status(400).json({ ok: false, error: "Dados incompletos" });
  }
  try {
    await ensureTables();
    const existing = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (existing.rows.length) {
      return res.status(409).json({ ok: false, error: "E-mail já cadastrado" });
    }
    const hash = await bcrypt.hash(senha, 10);
    const ip = getClientIp(req);
    const userInsert = await pool.query(
      "INSERT INTO usuarios (nome, email, senha, tipo, ip_cadastro) VALUES ($1, $2, $3, 'user', $4) RETURNING id, nome, email, tipo, data_cadastro",
      [nome, email, hash, ip]
    );
    const user = userInsert.rows[0];
    const storeInsert = await pool.query(
      "INSERT INTO lojas (id_usuario, nome_loja) VALUES ($1, $2) RETURNING id, id_usuario, nome_loja",
      [user.id, nome_loja]
    );
    const store = storeInsert.rows[0];
    const token = jwt.sign({ uid: user.id, email: user.email, tipo: user.tipo }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ ok: true, user, store, token });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) {
    return res.status(400).json({ ok: false, error: "Dados incompletos" });
  }
  try {
    const q = await pool.query("SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = $1", [email]);
    if (!q.rows.length) {
      return res.status(401).json({ ok: false, error: "Credenciais inválidas" });
    }
    const u = q.rows[0];
    const ok = await bcrypt.compare(senha, u.senha);
    if (!ok) {
      return res.status(401).json({ ok: false, error: "Credenciais inválidas" });
    }
    const token = jwt.sign({ uid: u.id, email: u.email, tipo: u.tipo }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ ok: true, user: { id: u.id, nome: u.nome, email: u.email, tipo: u.tipo }, token });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/shopify/config", async (req, res) => {
  const { id_loja, url_shopify, api_key, client_secret } = req.body || {};
  if (!id_loja || !url_shopify || !api_key || !client_secret) {
    return res.status(400).json({ ok: false, error: "Dados incompletos" });
  }
  try {
    await pool.query(
      "CREATE TABLE IF NOT EXISTS shopify_configuracao (id SERIAL PRIMARY KEY, id_loja INTEGER UNIQUE NOT NULL, url_shopify TEXT NOT NULL, api_key TEXT NOT NULL, client_secret TEXT NOT NULL, updated_at TIMESTAMP NOT NULL DEFAULT NOW())"
    );
    await pool.query("ALTER TABLE shopify_configuracao DROP CONSTRAINT IF EXISTS shopify_configuracao_id_loja_fkey");
    await pool.query(
      "INSERT INTO shopify_configuracao (id_loja, url_shopify, api_key, client_secret, updated_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (id_loja) DO UPDATE SET url_shopify = EXCLUDED.url_shopify, api_key = EXCLUDED.api_key, client_secret = EXCLUDED.client_secret, updated_at = NOW()",
      [id_loja, url_shopify, api_key, client_secret]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/shopify/config/:id_loja", async (req, res) => {
  const { id_loja } = req.params;
  try {
    await pool.query(
      "CREATE TABLE IF NOT EXISTS shopify_configuracao (id SERIAL PRIMARY KEY, id_loja INTEGER UNIQUE NOT NULL, url_shopify TEXT NOT NULL, api_key TEXT NOT NULL, client_secret TEXT NOT NULL, updated_at TIMESTAMP NOT NULL DEFAULT NOW())"
    );
    await pool.query("ALTER TABLE shopify_configuracao DROP CONSTRAINT IF EXISTS shopify_configuracao_id_loja_fkey");
    const r = await pool.query(
      "SELECT id, id_loja, url_shopify, api_key, client_secret, updated_at FROM shopify_configuracao WHERE id_loja = $1",
      [id_loja]
    );
    res.json({ ok: true, config: r.rows[0] || null });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/stores/by-user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const r = await pool.query("SELECT id, id_usuario, nome_loja, id_template_checkout, cnpj_loja FROM lojas WHERE id_usuario = $1", [id]);
    res.json({ ok: true, lojas: r.rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/stores", async (req, res) => {
  const { id_usuario, nome_loja } = req.body || {};
  if (!id_usuario || !nome_loja) {
    return res.status(400).json({ ok: false, error: "Dados incompletos" });
  }
  try {
    await ensureTables();
    const r = await pool.query(
      "INSERT INTO lojas (id_usuario, nome_loja) VALUES ($1, $2) RETURNING id, id_usuario, nome_loja, id_template_checkout, cnpj_loja",
      [id_usuario, nome_loja]
    );
    res.json({ ok: true, loja: r.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/shopify/sync/products", async (req, res) => {
  const { id_loja } = req.body || {};
  if (!id_loja) {
    return res.status(400).json({ ok: false, error: "Informe id_loja" });
  }
  try {
    await ensureTables();
    const cfg = await pool.query("SELECT url_shopify, api_key, client_secret FROM shopify_configuracao WHERE id_loja = $1", [id_loja]);
    if (!cfg.rows.length) {
      return res.status(400).json({ ok: false, error: "Loja sem configuração Shopify" });
    }
    const { url_shopify, client_secret } = cfg.rows[0];
    const apiVersion = "2026-01";
    const url = `https://${url_shopify}/admin/api/${apiVersion}/products.json?limit=250`;
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": client_secret,
      },
    });
    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(resp.status).json({ ok: false, error: `Shopify erro: ${txt}` });
    }
    const data = await resp.json();
    const products = Array.isArray(data.products) ? data.products : [];
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const p of products) {
        const mainImage = p.image?.src || null;
        const imagesById = new Map((p.images || []).map((img) => [img.id, img.src]));
        const opt1 = p.options?.[0]?.name || null;
        const opt2 = p.options?.[1]?.name || null;
        for (const v of (p.variants || [])) {
          const variantImage = v.image_id ? imagesById.get(v.image_id) || null : null;
          await client.query(
            `INSERT INTO shopify_products_flat (
              id_loja, variant_id, product_id,
              product_title, product_handle, product_type, vendor, body_html, tags, status,
              variant_title, sku, price, compare_at_price, barcode, inventory_quantity, weight, weight_unit,
              option1_name, option1_value, option2_name, option2_value,
              main_image_url, variant_image_url, created_at, updated_at, synced_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, NOW())
            ON CONFLICT (variant_id) DO UPDATE SET
              id_loja = EXCLUDED.id_loja,
              product_id = EXCLUDED.product_id,
              product_title = EXCLUDED.product_title,
              product_handle = EXCLUDED.product_handle,
              product_type = EXCLUDED.product_type,
              vendor = EXCLUDED.vendor,
              body_html = EXCLUDED.body_html,
              tags = EXCLUDED.tags,
              status = EXCLUDED.status,
              variant_title = EXCLUDED.variant_title,
              sku = EXCLUDED.sku,
              price = EXCLUDED.price,
              compare_at_price = EXCLUDED.compare_at_price,
              barcode = EXCLUDED.barcode,
              inventory_quantity = EXCLUDED.inventory_quantity,
              weight = EXCLUDED.weight,
              weight_unit = EXCLUDED.weight_unit,
              option1_name = EXCLUDED.option1_name,
              option1_value = EXCLUDED.option1_value,
              option2_name = EXCLUDED.option2_name,
              option2_value = EXCLUDED.option2_value,
              main_image_url = EXCLUDED.main_image_url,
              variant_image_url = EXCLUDED.variant_image_url,
              created_at = EXCLUDED.created_at,
              updated_at = EXCLUDED.updated_at,
              synced_at = NOW()`,
            [
              id_loja,
              v.id,
              p.id,
              p.title || null,
              p.handle || null,
              p.product_type || null,
              p.vendor || null,
              p.body_html || null,
              p.tags || null,
              p.status || null,
              v.title || null,
              v.sku || null,
              v.price != null ? Number(v.price) : null,
              v.compare_at_price != null ? Number(v.compare_at_price) : null,
              v.barcode || null,
              v.inventory_quantity != null ? Number(v.inventory_quantity) : null,
              v.weight != null ? Number(v.weight) : null,
              v.weight_unit || null,
              opt1,
              v.option1 || null,
              opt2,
              v.option2 || null,
              mainImage,
              variantImage,
              p.created_at ? new Date(p.created_at) : null,
              p.updated_at ? new Date(p.updated_at) : null,
            ]
          );
        }
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
    res.json({ ok: true, total: products.reduce((acc, p) => acc + (Array.isArray(p.variants) ? p.variants.length : 0), 0) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/products/by-store/:id_loja", async (req, res) => {
  const { id_loja } = req.params;
  const page = Number(req.query.page || 1);
  const pageSize = Math.min(100, Number(req.query.pageSize || 20));
  const offset = (page - 1) * pageSize;
  try {
    const r = await pool.query(
      `SELECT variant_id, product_id, product_title, product_handle, vendor, product_type, status,
              variant_title, sku, price, compare_at_price, inventory_quantity, main_image_url, variant_image_url, updated_at
       FROM shopify_products_flat
       WHERE id_loja = $1
       ORDER BY updated_at DESC NULLS LAST, variant_id DESC
       LIMIT $2 OFFSET $3`,
      [id_loja, pageSize, offset]
    );
    res.json({ ok: true, items: r.rows, page, pageSize });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
