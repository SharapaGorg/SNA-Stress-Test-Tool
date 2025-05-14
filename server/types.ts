export enum AttackWorker {
    HTTPFlood = "./workers/httpFloodAttack.js"
}


export enum AttackMethod {
    HTTPFlood = "http_flood",
}

export type ProxyProtocol = "http" | "https" | "socks4" | "socks5" | string;

export interface Proxy {
    username?: string;
    password?: string;
    protocol: ProxyProtocol;
    host: string;
    port: number;
}
