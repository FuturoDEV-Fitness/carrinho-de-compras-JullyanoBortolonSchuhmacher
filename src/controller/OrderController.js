const BaseDeDados = require('../database/connection');

class OrderController {
  constructor() {
    this.db = new BaseDeDados().database;
  }
  //validando
  async validandoDados(order) {
    const dados = {};

    // Validar dados do cliente
    const client = await this.db.query("SELECT * FROM clients WHERE id = $1", [order.client_id]);
    if (client.rows.length === 0) {
      throw new Error('Cliente não encontrado');
    }

    // Validar itens do pedido
    if (order.items.length === 0) {
      throw new Error('Nenhum item foi selecionado');
    }

    // Validar endereço
    if (!order.address) {
      throw new Error('Endereço não informado');
    }

    // Montar objeto de dados para o pedido
    dados.client_id = order.client_id;
    dados.address = order.address;
    dados.observations = order.observations || '';

    dados.items = order.items.map(item => {
      if (!item.amount || !item.product_id || !item.price) {
        throw new Error(`Item inválido: ${JSON.stringify(item)}`);
      }
      return item;
    });

    return dados;
  }

  // criando
  async create(req, res) {
    try {
      const order = req.body;
      const dados = await this.validandoDados(order);

      // Calculando total
      let totalOrder = 0;
      for (const item of dados.items) {
        totalOrder += item.price * item.amount;
      }

      // Inserindo na tabela orders
      const inserindoPedido = `
        INSERT INTO orders (
          total, 
          address, 
          observations, 
          client_id
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id;`;
      const valuesOrder = [totalOrder, dados.address, dados.observations, dados.client_id];
      const orderResult = await this.db.query(inserindoPedido, valuesOrder);

      const orderId = orderResult.rows[0].id;

      // Inserindo na tabela orders_items
      for (const item of dados.items) {
        const inserindoPedidoItens = `
          INSERT INTO orders_items (
            amount, 
            price, 
            order_id, 
            product_id
          ) 
          VALUES ($1, $2, $3, $4)
          RETURNING id;`;
        const ordemValores = [item.amount, item.price, orderId, item.product_id];
        await this.db.query(inserindoPedidoItens, ordemValores);
      }

      res.status(201).json({ message: "Pedido cadastrado com sucesso!" });

    } catch (error) {
      res.status(500).json({ message: "Erro ao cadastrar o pedido.", error: error.message });
    }
  }

  // listando
  async list(req, res) {
    try {
      const query = `
        SELECT orders.id, orders.total, orders.address, orders.observations, orders.client_id,
               orders_items.amount, orders_items.price, orders_items.product_id
        FROM orders
        LEFT JOIN orders_items ON orders.id = orders_items.order_id
        ORDER BY orders.id ASC;`;

      const result = await this.db.query(query);

      // Formata os dados para enviar como resposta
      const orders = [];
      let currentOrderId = null;
      let currentOrder = null;

      result.rows.forEach(row => {
        if (row.id !== currentOrderId) {
          // Novo pedido encontrado, cria novo pedido
          currentOrderId = row.id;
          currentOrder = {
            id: row.id,
            total: row.total,
            address: row.address,
            observations: row.observations,
            client_id: row.client_id,
            items: []
          };
          orders.push(currentOrder);
        }

        if (row.amount !== null && row.price !== null && row.product_id !== null) {
          currentOrder.items.push({
            amount: row.amount,
            price: row.price,
            product_id: row.product_id
          });
        }
      });

      res.status(200).json(orders);

    } catch (error) {
      res.status(500).json({ message: "Erro ao listar os pedidos.", error: error.message });
    }
  }

  //lisatndo p/id
  async listId(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT orders.id, orders.total, orders.address, orders.observations, orders.client_id,
               orders_items.amount, orders_items.price, orders_items.product_id
        FROM orders
        LEFT JOIN orders_items ON orders.id = orders_items.order_id
        WHERE orders.id = $1;`;

      const result = await this.db.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      // Formatar os dados para enviar como resposta
      const order = {
        id: result.rows[0].id,
        total: result.rows[0].total,
        address: result.rows[0].address,
        observations: result.rows[0].observations,
        client_id: result.rows[0].client_id,
        items: []
      };

      result.rows.forEach(row => {
        if (row.amount !== null && row.price !== null && row.product_id !== null) {
          order.items.push({
            amount: row.amount,
            price: row.price,
            product_id: row.product_id
          });
        }
      });

      res.status(200).json(order);

    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar o pedido.", error: error.message });
    }
  }

  // deletando
  async delete(req, res) {
    try {
      const { id } = req.params;
      const query = `DELETE FROM orders WHERE id = $1;`
      const result = await this.db.query(query, [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }
      res.status(200).json({ message: "Pedido deletado com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar o pedido.", error: error.message });
    }
  }

  //atualizando
  async update(req, res) {
    try {
      const { id } = req.params;
      const order = req.body;

      const dados = await this.validandoDados(order);

      const checkOrderQuery = "SELECT * FROM orders WHERE id = $1";
      const checkOrderResult = await this.db.query(checkOrderQuery, [id]);

      if (checkOrderResult.rows.length === 0) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      const updateOrderQuery = `
        UPDATE orders
        SET total = $1, address = $2, observations = $3
        WHERE id = $4
        RETURNING id;`;

      const updateOrderValues = [dados.total, dados.address, dados.observations, id];
      await this.db.query(updateOrderQuery, updateOrderValues);

      const deleteItemsQuery = "DELETE FROM orders_items WHERE order_id = $1";
      await this.db.query(deleteItemsQuery, [id]);

      for (const item of dados.items) {
        const insertItemQuery = `
          INSERT INTO orders_items (amount, price, order_id, product_id)
          VALUES ($1, $2, $3, $4);`;

        const insertItemValues = [item.amount, item.price, id, item.product_id];
        await this.db.query(insertItemQuery, insertItemValues);
      }

      res.status(200).json({ message: "Pedido atualizado com sucesso." });

    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar o pedido.", error: error.message });
    }
  }

}

module.exports = new OrderController();
