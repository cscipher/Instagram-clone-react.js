import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAzGUxgSvkmcHfTvGLPNx-PqVuY5wRX3Qo",
    authDomain: "instagram-clone-7f1f3.firebaseapp.com",
    databaseURL: "https://instagram-clone-7f1f3.firebaseio.com",
    projectId: "instagram-clone-7f1f3",
    storageBucket: "instagram-clone-7f1f3.appspot.com",
    messagingSenderId: "959247592936",
    appId: "1:959247592936:web:63f337d6a81423207c085d",
    measurementId: "G-183D8J2J1E"
  };


const fbApp = firebase.initializeApp(firebaseConfig)
const db = fbApp.firestore();
const auth = fbApp.auth();
const storage = fbApp.storage();

export {db, auth, storage}; 
