  -- Criação da tabela orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    total DECIMAL(10,2),
    address TEXT,
    observations TEXT,
    client_id INTEGER,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Criação da tabela orders_items
CREATE TABLE orders_items (
    id SERIAL PRIMARY KEY,
    amount INTEGER,
    price DECIMAL(10,2),
    order_id INTEGER,
    product_id INTEGER,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);