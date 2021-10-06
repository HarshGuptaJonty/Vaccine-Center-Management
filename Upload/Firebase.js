const firebaseConfig = {
    apiKey: "AIzaSyAmUkdgYgIodELimFH5XrszH77GnxT6-ks",
    authDomain: "vaccine-center-managemen-aa63f.firebaseapp.com",
    projectId: "vaccine-center-managemen-aa63f",
    storageBucket: "vaccine-center-managemen-aa63f.appspot.com",
    messagingSenderId: "774962996252",
    appId: "1:774962996252:web:00f14a339e6e102c25abd9",
    measurementId: "G-1QN3Q38EDH"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const database=firebaseApp.database();