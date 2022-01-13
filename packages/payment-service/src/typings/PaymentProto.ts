import { GrpcObject } from '@grpc/grpc-js';

export interface PaymentProtoDefinition extends GrpcObject {
    Payment: {
        service
    }
};
