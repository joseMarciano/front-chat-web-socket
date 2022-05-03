import SockJS from 'sockjs-client';
import { Client, Frame, Message, over } from 'stompjs';

class SockJs {
    private stompClient = null as unknown as Client;
    private subscriptionInsertedWhileDisconnected: any[] = [];
    private sockJs: any

    constructor() {
        this.connect();

    }

    private connect(): void {
        try {
            this.sockJs = new SockJS('http://localhost:8080/chat-sock-connection');
            this.stompClient = over(this.sockJs);
            this.stompClient.connect({}, this.onConnected.bind(this), this.onError.bind(this));
        } catch (error) {
            console.error(error)
        }
    }

    public subscribe(destinationn: string, cb: (message?: Message) => any) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn('WS is not connected!!')
            this.subscriptionInsertedWhileDisconnected.push({ destination: destinationn, cb: cb })
            return;
        }

        this.stompClient.subscribe(destinationn, cb)
    }

    public send(destination: string, { body }: { body: any }) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn('WS is not connected!!')
            return;
        }

        this.stompClient.send(destination, {}, JSON.stringify(body || {}))
    }


    private onConnected(frame?: Frame): void {
        this.subscriptionInsertedWhileDisconnected.forEach(({ destination, cb }) => this.subscribe(destination, cb))
        this.subscriptionInsertedWhileDisconnected = [];
        console.log('Connected: ' + frame);
    }

    private onError(frame: Frame | string): void {
        console.warn('Error: ' + frame);
        setTimeout(this.retryConnection.bind(this), 1000)
    }

    private retryConnection() {
        console.warn('Trying to reconnect...')

        if (!this.stompClient || !this.stompClient.connected) {
            setTimeout(this.connect.bind(this), 5000)
        }
    }
}

const sockClient = new SockJs()

export { sockClient }; 
