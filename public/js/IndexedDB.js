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

request.onerror = (event) => {
    console.log('It broke... ', event.target.errorCode)
}

const checkDB = () => {
  const transaction = db.transaction(["pending"], ["readwrite"]);
  const store = transaction.objectStore('pending');
  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if(getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: 'application/json'
      })
      .then(response => {
          return response.json();
      })
      .then(() => {
          // delete records if successful
          store.clear();
      })
    } 
  }
}

// listening for application coming back online
window.addEventListener('online', checkDB)