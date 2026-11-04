const express = require('express');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
app.use(express.json());

// ==========================================
// 1. CONFIGURAÇÃO DO CLIENTE INVENTORY (gRPC)
// ==========================================
const inventoryProtoPath = path.resolve(__dirname, '../../proto/inventory.proto');
const inventoryPackageDef = protoLoader.loadSync(inventoryProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const inventoryProto = grpc.loadPackageDefinition(inventoryPackageDef).inventory;

// Conecta ao serviço de Inventory (porta 3001)
const inventoryClient = new inventoryProto.InventoryService(
  'localhost:3001',
  grpc.ServerCredentials.createInsecure()
);

// ==========================================
// 2. ROTAS DO INVENTORY (TAREFA #1)
// ==========================================

// Rota existente: Buscar lista de produtos
app.get('/products', (req, res) => {
  const query = req.query.q || '';
  inventoryClient.searchProducts({ query }, (err, response) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
  });
});

// Rota Nova (Tarefa #1): Buscar produto por ID
app.get('/product/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  inventoryClient.searchProductByID({ id }, (err, response) => {
    if (err) {
      return res.status(404).json({ error: err.details || 'Produto não encontrado' });
    }
    res.json(response);
  });
});

// ==========================================
// 3. ROTAS DE REVIEWS (TAREFA #2)
// ==========================================
// Importa e registra o arquivo services/controller/review.js
const reviewRoutes = require('./review');
reviewRoutes(app);

// ==========================================
// 4. INICIALIZAÇÃO DO SERVIDOR HTTP
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Controller escutando na porta ${PORT}`);
});