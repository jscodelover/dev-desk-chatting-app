export function addSessionData(id, data) {
  sessionStorage.setItem(id, data);
}

export function removeSessionData(id) {
  sessionStorage.removeItem(id);
}

export function getSessionData(id) {
  return sessionStorage.getItem(id);
}
