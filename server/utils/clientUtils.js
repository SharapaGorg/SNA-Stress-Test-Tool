import axios from "axios";
import net from "net";
import {SocksProxyAgent} from "socks-proxy-agent";

// Misc
export function createAgent(proxy) {
  if (proxy.protocol !== "socks4" && proxy.protocol !== "socks5") {
    throw new Error("Unsupported proxy protocol for agent: " + proxy.protocol);
  }

  const uri = `${proxy.protocol}://${
    proxy.username && proxy.password
      ? `${proxy.username}:${proxy.password}@`
      : ""
  }${proxy.host}:${proxy.port}`;

  return new SocksProxyAgent(uri);
}

// HTTP Client
export function createMimicHttpClient(proxy, userAgent) {
  return createHttpClient({
    headers: {"User-Agent": userAgent},
    proxy: (proxy ? proxy : {}),
    timeout: 5000,
    validateStatus: (status) => {
      return status < 500;
    },
    maxRedirects: 3,
  });
}

export function createHttpClient(
  clientConfig = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    },
    timeout: 5000,
    validateStatus: (status) => {
      return status < 500;
    },
    maxRedirects: 0,
    proxy: {},
  }
) {
  const config = {...clientConfig};
  const proxy = config.proxy;

  if (proxy.protocol == "http" || proxy.protocol == "https") {
    config.proxy = {
      host: proxy.host,
      port: proxy.port,
      auth: proxy.username ? {username: proxy.username} : null,
    };
  } else if (proxy.protocol == "socks4" || proxy.protocol == "socks5") {
    const agent = createAgent(proxy);
    config.proxy = false;
    config.httpAgent = agent;
    config.httpsAgent = agent;
  } else {
    throw new Error(
      "Unsupported proxy protocol for HTTP client: " + proxy.protocol
    );
  }

  const client = axios.create(config);
  return client;
}
