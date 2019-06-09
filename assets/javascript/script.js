// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCZ70epQwR1bmkOCrovGX9xQ55CHoN-Qrc",
    authDomain: "super-original-project.firebaseapp.com",
    databaseURL: "https://super-original-project.firebaseio.com",
    projectId: "super-original-project",
    storageBucket: "super-original-project.appspot.com",
    messagingSenderId: "442170095409",
    appId: "1:442170095409:web:4371a828a6f599ab"
}

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var players = database.ref('players');
var playerCount = database.ref('playerCount');
var gameResultsRef = database.ref('gameResults');

