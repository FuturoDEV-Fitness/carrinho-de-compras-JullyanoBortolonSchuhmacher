# LAB COMERCE

Este é um sistema simples que gerencia pedidos, clientes e produtos, onde é possível cadastrar, listar, atualizar e deletar todos eles.

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- JavaScript

## Configuração do Projeto

### Pré-requisitos

- Node.js instalado
- PostgreSQL instalado e configurado

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/FuturoDEV-Fitness/carrinho-de-compras-JullyanoBortolonSchuhmacher.git
   cd carrinho-de-compras-JullyanoBortolonSchuhmacher
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o ambiente:
   - Atualize o arquivo `connection.js` na pasta `database` do projeto com a seus dados do PostgreSQL:
     ```
     user: 'postgres',     
     host: 'localhost',        
     database: 'carrinho_de_compras',  
     password: 'sua_senha',     
     port: 5432,        
     ```

5. Inicie o servidor:
   ```bash
   npm start
   ```

## Endpoints da API

### Postagem

**Rotas**
```
/orders 
/clients 
/products
```
**Métodos**

- **POST**
  Cria um * novo.

- **GET**
  Lista todos da rota *.

- **GET /:id**
  Retorna um * específico pelo ID.

- **PATCH /:id**
  Atualiza um * existente pelo ID.

- **DELETE /:id**
  Deleta um * existente pelo ID.

## Estrutura do Projeto

```
mini-projeto
├── src
│   ├── controllers
│   │   ├── ClientController.js
│   │   ├── ProductController.js
│   │   └── OrderController.js
│   ├── routes
│   │   ├── client.routes.js
│   │   ├── product.routes.js
│   │   └── order.routes.js
│   ├── database
│   │   └── connection.js
│   │   
│   └── index.js
└── package.json

```

## Autores

- [@Jullyano](https://github.com/JullyanoBortolonSchuhmacher)


### Outros/

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/dNOfMvCD)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15330778&assignment_repo_type=AssignmentRepo)
