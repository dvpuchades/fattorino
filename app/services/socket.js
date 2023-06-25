import io from 'socket.io-client';
import { server } from "../environment.js";

// uniqueSocket prevents multiple connections to the server

const uniqueSocket = io(server.uri);

export { uniqueSocket };