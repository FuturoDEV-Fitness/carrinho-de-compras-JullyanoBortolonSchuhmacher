--criando a tabela dentro do pgadmin
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  amount VARCHAR(150) UNIQUE DEFAULT '0',
  color VARCHAR(50),
  voltage INTEGER CHECK (voltage IN (110, 220)),
  description TEXT,
  category_id INTEGER NOT NULL,
  CONSTRAINT fk_category
    FOREIGN KEY(category_id) 
	REFERENCES categories(id)
);