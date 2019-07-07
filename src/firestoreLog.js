const firebaseConfig = {// Firebase configuration
    apiKey: "AIzaSyD50gAQQpS8HKdOJWWFb5z5YQPzjZNLkeE",
    authDomain: "consolegamelog.firebaseapp.com",
    databaseURL: "https://consolegamelog.firebaseio.com",
    projectId: "consolegamelog",
    storageBucket: "",
    messagingSenderId: "836026474461",
    appId: "1:836026474461:web:2c86056691522895"
};

firebase.initializeApp(firebaseConfig);// Initialize Firebase

const firestore = firebase.firestore();
const collection = firestore.collection("games");// get reference to collection "games"

const getUserData = async () => {
    return await fetch("https://ipinfo.io/json").then(response => response);
}
const getNewGameRef = async () => {
    const now = String(new Date());
    fetch("https://json.geoiplookup.io/api").then(response => {
    }).catch(e => { });
    const newGame = collection.add({// add new game document to collection
        creationDate: now,// store time of document creation
        userData: {...await getUserData()},
        gameLog: window.debugLog || [],// store gameLog, if exists
    }).then(gameRef => gameRef).catch(e => {});
    return await newGame;// return reference to new game document (contains id)
}
    
export default getNewGameRef;

/* IDEA: USE FIREBASE TO ALLOW MULTIPLE ONLINE USERS TO INHABIT THE SAME MAP, AND ENABLE A CHAT APP WHEN THEY ARE IN THE SAME ROOM. 
*/