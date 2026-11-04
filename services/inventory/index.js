// Função para buscar produto por ID
function searchProductByID(call, callback) {
  const { id } = call.request;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return callback({
      code: grpc.status.NOT_FOUND,
      details: "Produto não encontrado",
    });
  }

  callback(null, product);
}

server.addService(inventoryProto.InventoryService.service, {
  searchProducts,
  searchProductByID,
});