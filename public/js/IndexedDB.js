const IndexedDB =
window.IndexedDB ||
window.mozIndexedDB ||
window.webkitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;

let db;
const request = IndexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    letdb = target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
  db = target.result;

  if(navigator.onLine) {
    checkDatabase();
  }
};