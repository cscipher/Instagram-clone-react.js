import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   // add Firebase config
};


const fbApp = firebase.initializeApp(firebaseConfig)
const db = fbApp.firestore();
const auth = fbApp.auth();
const storage = fbApp.storage();

export {db, auth, storage}; 
