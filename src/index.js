const express = require('express');

const clientRouter = require('./routers/clients.routes.js');
const productsRouter = require('./routers/products.routes.js')

const app = express();
const port = 3000;

app.use(express.json());

app.use('/clients', clientRouter);
app.use('/products', productsRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});