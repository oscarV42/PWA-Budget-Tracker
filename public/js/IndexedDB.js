const IndexedDB = window.indexedDB;

let db;
const request = IndexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    let db = target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
  db = target.result;

  if(navigator.onLine) {
    checkDB();
  }
};

request.onerror = (event) => {
    console.log('It broke... ', event.target.errorCode)
}

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
  
    store.add(record);
  }
  

const checkDB = () => {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore('pending');
  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if(getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: { Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
        }
      })
      .then(response => {
          return response.json();
      })
      .then(() => {
        // delete records if successful
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore('pending');
        store.clear();
      })
    } 
  }
}

// listening for application coming back online
window.addEventListener('online', checkDB)