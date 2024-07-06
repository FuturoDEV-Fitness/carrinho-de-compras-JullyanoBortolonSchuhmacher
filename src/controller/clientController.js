const BaseDeDados = require('../database/connection');

class clientController {
  constructor() {
    this.db = new BaseDeDados().database;
  }
  // tratando os dados
  async tratamentoDosDados(name, email, cpf, contact) {
    const dados = {};
  
    if (name) {
      dados.name = name.toLowerCase();
    }
  
    if (email) {
      dados.email = email.toLowerCase();
    }
    if (cpf) {
      dados.cpf = cpf
    }
    if (contact) {
      dados.contact = contact;
    }
    return dados;
  }

  // Criando
  async create(req, res) {
    const { name, email, cpf, contact } = req.body;
  
    const dados = await this.tratamentoDosDados(name, email, cpf, contact);
    
    if (!dados.name || !dados.email || !dados.cpf || !dados.contact) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
  
    try {
      const result = await this.db.query(`
        INSERT INTO clients (name, email, cpf, contact) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `, [dados.name, dados.email, dados.cpf, dados.contact]);
      return res.status(201).json({ message: 'Cliente criado com sucesso.', data: result.rows[0] });
    } catch (err) {
      return res.status(400).json({ error: err.message, message: 'Ocorreu um erro ao criar o cliente' });
    }
  }

  // Listando cliente por ID  
  async listId(req, res) { 
    const { id } = req.params; 
    if (!id) { 
      return res.status(400).json({ error: 'Por favor, insira o ID do cliente.' }); 
    } 
    try { 
      const result = await this.db.query('SELECT * FROM clients WHERE id = $1', [id]); 
      if (result.rows.length === 0) { 
        return res.status(404).json({ error: 'Cliente não encontrado' }); 
      } 
      return res.status(200).json({ data: result.rows[0] }); 
    } catch (err) { 
      return res.status(400).json({ error: err.message, message: 'Ocorreu um erro ao listar o cliente' }); 
    } 
  } 

  // Listando todos os clientes
  async list(req, res) {
    try {
      const result = await this.db.query('SELECT * FROM clients');
      return res.status(200).json({ message: 'Listagem de todos os clientes.', data: result.rows });
    } catch (err) {
      return res.status(400).json({ error: err.message, message: 'Ocorreu um erro ao listar os clientes' });
    }
  }

  // Atualizando cliente
  async update(req, res) {
    const { id } = req.params;
    const { name, email, cpf, contact } = req.body;
    
    const dados = await this.tratamentoDosDados(name, email, cpf, contact);
    if (Object.keys(dados).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar foi fornecido' });
    }
    
    const setClauses = [];
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(dados)) {
      setClauses.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
    values.push(id);
    
    const query = `
      UPDATE clients
      SET ${setClauses.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `;
    try {
      const result = await this.db.query(query, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      return res.status(200).json({ message: 'Cliente atualizado com sucesso.', data: result.rows[0] });
    } catch (err) {
      return res.status(400).json({ error: err.message, message: 'Ocorreu um erro ao atualizar o cliente' });
    }
  }

  // Deletando cliente
  async delete(req, res) {
    const { id } = req.params;
    try {
      const result = await this.db.query(`
        DELETE FROM clients
        WHERE id = $1
        RETURNING *
      `, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      return res.status(200).json({ message: 'Cliente deletado com sucesso' });
    } catch (err) {
      return res.status(400).json({ error: err.message, message: 'Ocorreu um erro ao deletar o cliente' });
    }
  }
}

module.exports = new clientController();