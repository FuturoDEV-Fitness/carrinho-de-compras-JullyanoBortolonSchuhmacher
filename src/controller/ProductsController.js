const BaseDeDados = require('../database/connection');

class ProductsController {
  constructor() {
    this.db = new BaseDeDados().database;
  }

  // Tratando os dados
  tratamentoDosDados(name, amount, color, voltage, description, category_id) {
    const dados = {};

    if (name) {
      dados.name = name.toLowerCase();
    }

    if (amount) {
      dados.amount = amount.toLowerCase();
    }

    if (color) {
      dados.color = color.toLowerCase();
    }

    if (voltage) {
      dados.voltage = voltage;
    }

    if (description) {
      dados.description = description.toLowerCase();
    }

    if (category_id) {
      dados.category_id = parseInt(category_id, 10);
    }

    return dados;
  }

  // Listando todos
  async list(req, res) {
    try {
      const result = await this.db.query('SELECT * FROM products');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Listando p/ id
  async listId(req, res) {
    const { id } = req.params;
    try {
      const result = await this.db.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Criando 
  async create(req, res) {
    const { name, amount, color, voltage, description, category_id } = req.body;
    const dados = await this.tratamentoDosDados(name, amount, color, voltage, description, category_id);

    if (!dados.category_id) {
      return res.status(400).json({ error: 'category_id é obrigatório e deve ser um número inteiro.' });
    }

    try {
      const result = await this.db.query(`
        INSERT INTO products (
          name, 
          amount, 
          color, 
          voltage, 
          description, 
          category_id
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *
        `,[dados.name, dados.amount, dados.color, dados.voltage, dados.description, dados.category_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Deletando 
  async delete(req, res) {
    const { id } = req.params;
    try {
      const result = await this.db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Atualizando 
  async update(req, res) {
    const { id } = req.params;
    const { name, amount, color, voltage, description, category_id } = req.body;
    const dados = await this.tratamentoDosDados(name, amount, color, voltage, description, category_id);

    if (!dados.category_id) {
      return res.status(400).json({ error: 'category_id é obrigatório e deve ser um número inteiro.' });
    }

    try {
      const result = await this.db.query(`
        UPDATE products 
        SET name = $1, amount = $2, color = $3, voltage = $4, description = $5, category_id = $6 
        WHERE id = $7 
        RETURNING *
        `,[dados.name, dados.amount, dados.color, dados.voltage, dados.description, dados.category_id, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ProductsController();
