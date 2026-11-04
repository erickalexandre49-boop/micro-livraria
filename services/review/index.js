const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.resolve(__dirname, '../../proto/review.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const reviewProto = grpc.loadPackageDefinition(packageDefinition).review;

// Base de dados simulada para as avaliações
const reviews = [
  { id: 1, productId: 1, author: 'Alice', rating: 5, comment: 'Excelente livro!' },
  { id: 2, productId: 1, author: 'Bob', rating: 4, comment: 'Muito bom, recomendo.' },
  { id: 3, productId: 2, author: 'Carlos', rating: 5, comment: 'Leitura obrigatória!' },
];

function getReviewsByProductID(call, callback) {
  const { productId } = call.request;
  const productReviews = reviews.filter((r) => r.productId === productId);
  callback(null, { reviews: productReviews });
}

function main() {
  const server = new grpc.Server();
  server.addService(reviewProto.ReviewService.service, {
    getReviewsByProductID,
  });

  const address = '0.0.0.0:3004';
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Review service running on ${address}`);
  });
}

main();