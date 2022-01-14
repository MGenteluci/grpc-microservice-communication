import path from 'path';
import Fastify from 'fastify';
import * as grpc from '@grpc/grpc-js';
import * as grpcProtoLoader from '@grpc/proto-loader';

const paymentProto = grpcProtoLoader.loadSync(path.resolve(__dirname, '../../proto/payment.proto'));
const PaymentDefinition = grpc.loadPackageDefinition(paymentProto);

const fastify = Fastify({ logger: true });

const payments = [
    { _id: '1', userId: '1', isSubscriptionPaid: true },
    { _id: '2', userId: '2', isSubscriptionPaid: false }
];

fastify.get('/', async() => {
    return { message: 'Welcome to Payment Service' };
});

function isSubscriptionPaid(call, callback) {
    console.log('call', call)
    const payment = payments.find(payment => payment.userId === call.request.userId);
    const isPaid = payment ? payment.isSubscriptionPaid : false;
    console.log('isPaid', isPaid)

    callback(null, {isPaid});
}

const server = new grpc.Server();
const PaymentServiceConstructor = <grpc.ServiceClientConstructor> PaymentDefinition.Payment;
server.addService(PaymentServiceConstructor.service, {
    IsSubscriptionPaid: isSubscriptionPaid
});

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});

const start = async() => {
    try {
        await fastify.listen(3000);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
