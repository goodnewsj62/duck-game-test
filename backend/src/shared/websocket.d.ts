interface AuthenticatedWebSocket extends WebSocket {
  user?: {
    id: string;
    username: string;
  };
}
