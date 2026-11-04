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
const client = new reviewProto.ReviewService(
  'localhost:3004',
  grpc.ServerCredentials.createInsecure()
);

module.exports = function (app) {
  app.get('/reviews/:productId', (req, res) => {
    const productId = parseInt(req.params.productId, 10);

    client.getReviewsByProductID({ productId }, (err, response) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(response);
    });
  });
};