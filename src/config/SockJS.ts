import SockJS from 'sockjs-client';
import { Client, Frame, Message, over } from 'stompjs';

export class SockJs {
    private static instance: SockJs
    private stompClient = null as unknown as Client;
    private subscriptionInsertedWhileDisconnected: any[] = [];
    private sockJs: any

    private constructor() {
        this.connect();
    }

    static getInstance() {
        if (!SockJs.instance) {
            SockJs.instance = new SockJs()
        }

        return SockJs.instance
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

    public subscribe(destination: string, resolve: (message?: Message) => void): void {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn('WS is not connected!!')
            this.subscriptionInsertedWhileDisconnected.push({ destination: destination, resolve })
            return;
        }


        this.stompSubscribe(destination, resolve)

    }

    public send(destination: string, { body }: { body: any }) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn('WS is not connected!!')
            return;
        }

        this.stompClient.send(destination, {}, JSON.stringify(body || {}))
    }



    private stompSubscribe(destination: string, resolve: (message?: Message) => void) {
        this.stompClient.subscribe(destination, (message) => resolve(message))
    }


    private onConnected(frame?: Frame): void {
        this.subscriptionInsertedWhileDisconnected.forEach(({ destination, resolve }) => this.stompSubscribe(destination, resolve))
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

