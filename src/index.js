const express = require('express');

const clientRouter = require('./routers/router.client.js');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/clients', clientRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
