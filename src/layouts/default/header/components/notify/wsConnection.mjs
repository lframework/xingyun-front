export const WS_READY_STATE = Object.freeze({
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
});

export function shouldReconnectSocket(socket, daemonFlag) {
  if (daemonFlag) {
    return false;
  }

  if (!socket) {
    return true;
  }

  return ![WS_READY_STATE.CONNECTING, WS_READY_STATE.OPEN].includes(socket.readyState);
}

export function shouldClearSocketReference(currentSocket, closingSocket) {
  return currentSocket === closingSocket;
}
