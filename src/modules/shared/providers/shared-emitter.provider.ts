// shared-emitter.provider.ts
import { EventEmitter } from 'events';
import { SHARED_EMITTER } from 'src/constants/socket.constants';

const sharedEmitter = new EventEmitter();
sharedEmitter.setMaxListeners(10000); // Increase the limit to 20, or any number you prefer

export const sharedEmitterProvider = {
    provide: SHARED_EMITTER,
    useValue: sharedEmitter
};
