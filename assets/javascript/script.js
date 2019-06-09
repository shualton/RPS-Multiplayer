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

var player = {

    name: "",
    choice: "",
    wins: 0,
    losses: 0,
    uid: ""
};

var currentPlayer = "";
var otherPlayer = "";
var numPlayers = "";
var otherName = "";

var gameResults = "";
$('.choice-1').hide();
$('.choice-2').hide();

$(document).ready(function() {

    gameResultsRef.set({
        gameResults: gameResults
    })


    //Check player count value in database. Trigger startGame function once value equal to 2
    playerCount.on("value", function(snapshot) {
        numPlayers = snapshot.val();
        if (numPlayers === 2) {
            startGame();
        }
    });

    $('#start').on('click', addPlayers);

    var chatRef = database.ref().child('chat');
    var messageField = $('#message');
    var chatLog = $('#chat-log');
    var nameField = $('#username');
    var addPlayerButton = $('#start');

    chatRef.onDisconnect().remove();

    function addPlayers() {
        firebase.auth().signInAnonymously();
        var playerName = $('#username').val().trim();
        player.name = playerName;
        player.uid = firebase.auth().currentUser.uid;

        database.ref().once('value').then(function(snapshot) {

            if (!snapshot.child('players/1').exists()) {
                database.ref('players/1/').update(player);
                var currentPlayerBox = $('#player-1');
                var otherPlayerBox = $('#player-2');
                currentPlayerBox.html('<h2>' + playerName)
                    .append('<h5>Wins: ' + player.wins)
                    .append('<h5>Losses: ' + player.losses);
                currentPlayer = 1;
                otherPlayer = 2;
                nameField.hide();
                addPlayerButton.hide();
                $('#status').html('<h3>Hi, ' + player.name + '! You are Player ' + currentPlayer + '</h3>');

                //Snapshot of database for player count
                playerCount.once('value').then(function(snapshot) {
                    numPlayers = snapshot.val();
                    if (numPlayers === null) {
                        numPlayers = 1;
                        playerCount.set(numPlayers);
                    } else {
                        numPlayers++;
                        playerCount.set(numPlayers);
                    }
                });

            } else if (!snapshot.child('players/2').exists()) {

                database.ref('players/2/').update(player);
                var currentPlayerBox = $('#player-2');
                var otherPlayerBox = $('#player-1');
                currentPlayerBox.html('<h2>' + playerName)
                    .append('<h5>Wins: ' + player.wins)
                    .append('<h5>Losses: ' + player.losses);
                currentPlayer = 2;
                otherPlayer = 1;

                nameField.hide();
                addPlayerButton.hide();
                $('#status').html('<h3>Hi, ' + player.name + '! You are Player ' + currentPlayer);

                //Snapshot of database for player count after Player 2 is added

                playerCount.once('value').then(function(snapshot) {
                    numPlayers = snapshot.val();
                    if (numPlayers === null) {
                        numPlayers = 1;
                        playerCount.set(numPlayers);
                    } else {
                        numPlayers++;
                        playerCount.set(numPlayers);
                    }
                });

            } else {

                alert('Sorry, this game is full.  Try again later.');
                return;
            }

        });
    }


    function startGame() {

        //Sets up a listener for the game results
        gameResultsRef.on('value', function(snapshot) {

            $('#game-results').html('<h2>' + snapshot.val().gameResults);
        })


        var otherGuy = database.ref('players/' + otherPlayer + '/');
        var currentGuy = database.ref('players/' + currentPlayer + '/');

        currentGuy.on('value', function(snapshot) {

            var data = snapshot.val();
            var currentGuyName = data.name;
            var currentGuyWins = data.wins;
            var currentGuyLosses = data.losses;

            $('#game-results').html('<h4 id="results"></h4>');
            if (currentPlayer === 1) {
                $('#player-1').html('<h2>' + currentGuyName)
                    .append('<h5>Wins: ' + currentGuyWins)
                    .append('<h5>Losses: ' + currentGuyLosses);
            } else {
                $('#player-2').html('<h2>' + currentGuyName)
                    .append('<h5>Wins: ' + currentGuyWins)
                    .append('<h5>Losses: ' + currentGuyLosses);
            }
        })

        otherGuy.on('value', function(snapshot) {
            var data = snapshot.val();
            var otherGuyName = data.name;
            var otherGuyWins = data.wins;
            var otherGuyLosses = data.losses;
            $('#game-results').html('<h4 id="results"></h4>');
            if (currentPlayer === 1) {
                $('#player-2').html('<h2>' + otherGuyName)
                    .append('<h5>Wins: ' + otherGuyWins)
                    .append('<h5>Losses: ' + otherGuyLosses);
            } else {
                $('#player-1').html('<h2>' + otherGuyName)
                    .append('<h5>Wins: ' + otherGuyWins)
                    .append('<h5>Losses: ' + otherGuyLosses);
            }
        });

        //Empties out the player Database if user leaves the game
        if (currentGuy.onDisconnect().remove()) {

            playerCount.set(numPlayers - 1);
            choice = null;
        }

        database.ref('turn').set(1);

        database.ref('turn').on('value', function(snapshot) {

            var turn = snapshot.val();

            if (turn === currentPlayer) {

                $('#box-' + currentPlayer).addClass('turn');
                $('#box-' + otherPlayer).removeClass('turn');
                $('.choice-' + currentPlayer).show();
                $('#status').html('<h3>It is ' + player.name + '\'s turn</h3>');

            } else {
                $('#box-' + currentPlayer).removeClass('turn');
                $('#box-' + otherPlayer).addClass('turn');
                $('.choice-' + currentPlayer).hide();

                var otherName = database.ref('players/' + otherPlayer + '/name');
                otherName.once('value', function(snapshot) {
                    otherName = snapshot.val();
                    //Indicate that it is the opponent's turn
                    $('#status').html('<h3>It is ' + otherName + '\'s turn</h3>');
                });

            }
        })
    };

    