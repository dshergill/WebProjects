// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;
var usernames = [];
var chatLog = [];
var usernameColors = {};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

io.on('connection', function (socket) {
    var addedUser = false;


    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        var currentTime = new Date().toTimeString();
        // we tell the client to execute 'new message'
        chatLog.push({
            username: socket.username,
            timeStamp: currentTime,
            message: data
        });

        io.emit('new message', {
            username: socket.username,
            timeStamp: currentTime,
            message: data,
            color: usernameColors[socket.username]
        });
    });

    // when the client types /nick to change their username
    socket.on('change username', function (requestedUsername) {
        var nameAlreadyExists = false;
        var oldName = socket.username;
        for (var i = 0; i<usernames.length; i++) {
            if (usernames[i] == requestedUsername) {
                nameAlreadyExists = true;
            }
        }
        if (!nameAlreadyExists) {
            usernames.push(requestedUsername);
            usernameColors[requestedUsername] = getRandomColor();
            var index = usernames.indexOf(socket.username);
            if (index > -1) {
                usernames.splice(index, 1)
            }
            socket.username = requestedUsername;
            io.emit('request accepted', {
                name: requestedUsername,
                oldName: oldName
            });
        }
        else {
            socket.emit('request denied');
        }
    });

    socket.on('change color', function (requestedColor) {
        usernameColors[socket.username] = "#" + requestedColor;
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (callback) {

        var username = "person" + numUsers.toString();
        usernames.push(username);
        usernameColors[username] = getRandomColor();
        console.log(usernameColors[username]);
        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        socket.emit('login', {
            username: socket.username,
            numUsers: numUsers,
            chatLog: chatLog,
            usernames: usernames
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });

        callback(socket.username);
    });


    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});