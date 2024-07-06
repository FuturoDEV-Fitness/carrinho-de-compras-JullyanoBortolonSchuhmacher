-- Criando a tabela de categorias no postgreSQL:
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

-- Inserindo os dados:
INSERT INTO categories (name) VALUES 
('Eletrônicos'),
('Eletrodomésticos'),
('Móveis'),
('Roupas'),
('Calçados'),
('Livros'),
('Brinquedos'),
('Esportes'),
('Beleza'),
('Saúde');
