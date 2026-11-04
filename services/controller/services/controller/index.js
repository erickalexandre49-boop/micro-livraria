const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const app = express();
app.use(express.json());

const inventoryProtoPath = path.resolve(__dirname, '../../proto/inventory.proto');
const inventoryPackageDef = protoLoader.loadSync(inventoryProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const inventoryProto = grpc.loadPackageDefinition(inventoryPackageDef).inventory;
const inventoryClient = new inventoryProto.InventoryService(
  'localhost:3001',
  grpc.ServerCredentials.createInsecure()
);

app.get('/product/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  inventoryClient.searchProductByID({ id }, (err, response) => {
    if (err) {
      return res.status(404).json({ error: err.details || 'Produto não encontrado' });
    }
    res.json(response);
  });
});

const reviewRoutes = require('./review');
reviewRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Controller HTTP escutando na porta ${PORT}`);
});