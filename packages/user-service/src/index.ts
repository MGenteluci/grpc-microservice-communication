import path from 'path';
import Fastify from 'fastify';
import * as grpc from '@grpc/grpc-js';
import * as grpcProtoLoader from '@grpc/proto-loader';

const paymentProto = grpcProtoLoader.loadSync(path.resolve(__dirname, '../../proto/payment.proto'));
const PaymentDefinition = grpc.loadPackageDefinition(paymentProto);

const fastify = Fastify({ logger: true });

fastify.get('/', async() => {
    return { message: 'Welcome to User Service' };
});

fastify.get('/login', async() => {
    return { message: 'login endpoint' };
});

const payment = <grpc.ServiceClientConstructor> PaymentDefinition.Payment;
const stub = new payment('127.0.0.1:50051', grpc.credentials.createInsecure());

stub.IsSubscriptionPaid({ userId: '1' }, (err, feature) => {
    if (err) console.log('err', err)
    console.log('feature', feature);
});

const start = async() => {
    try {
        await fastify.listen(3001);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
