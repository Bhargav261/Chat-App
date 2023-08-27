// socket.js
import { io } from 'socket.io-client';

export function initializeSocket() {
    return io('http://localhost:4000', {
        transports: ['websocket', 'polling', 'flashsocket'],
    });
}
