$(function() {
    var FADE_TIME = 150; // ms
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    // Initialize variables
    var $window = $(window);
    // var $usernameInput = $('.usernameInput'); // Input for username
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box

    var $loginPage = $('.login.page'); // The login page
    var $chatPage = $('.chat.page'); // The chatroom page
    var $usersPage = $('.users.page'); // List of online users

    // Prompt for setting a username
    var username;
    var connected = false;
    var $currentInput;

    var socket = io();

    $(document).ready(function () {
        $("#enterButton").click(enterRoom);
    });

    function enterRoom() {
        setUsername();
        $loginPage.fadeOut();
        $chatPage.show();
        $usersPage.show();
        $loginPage.off('click');
        $currentInput = $inputMessage.focus();
    }


    function addParticipantsMessage (data) {
        var message = '';
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        log(message);
    }

    // Sets the client's username
    function setUsername () {
        // Tell the server your username
        socket.emit('add user', function (data) {
            username = data;
        });

    }

    // Sends a chat message
    function sendMessage () {
        var message = $inputMessage.val();

        // if there is a non-empty message and a socket connection
        if (message && connected) {
            if (message.toString().indexOf('/nick') == 0) {
                var splitMessage = message.toString().split(' ');
                var requestedUsername = splitMessage[1];
                $inputMessage.val('');
                socket.emit('change username', requestedUsername);
            }
            else if (message.toString().indexOf('/nickcolor') == 0) {
                var splitMessage = message.toString().split(' ');
                var requestedColor = splitMessage[1];
                $inputMessage.val('');
                socket.emit('change color', requestedColor);
            }

            else {
                $inputMessage.val('');
                // tell server to execute 'new message' and send along one parameter
                socket.emit('new message', message);
            }
        }
    }
    function addOnlineUser (data) {
        var $el = $('<li>').addClass('user').text(data.username);
        $chatPage.append($el);
    }
    // Log a message
    function log (message, options) {
        var $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }
    function addLoggedMessages(arrayOfMessages) {
        for (var i=0; i<arrayOfMessages.length; i++) {
            addChatMessage(arrayOfMessages[i]);
        }
    }

    // Adds the visual chat message to the message list
    function addChatMessage (data, options) {

        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text("[" + data.timeStamp + "]" + ":" + data.message);

        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    function addMessageElement (el, options) {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }


    // Gets the color of a username through our hash function
    function getUsernameColor (username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    // Keyboard events

    $window.keydown(function (event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                sendMessage();
            } else {
                setUsername();
            }
        }
    });

    // Click events

    // Focus input when clicking anywhere on login page
    $loginPage.click(function () {
        $currentInput.focus();
    });

    // Focus input when clicking on the message input's border
    $inputMessage.click(function () {
        $inputMessage.focus();
    });

    // Socket events

    // Whenever the server emits 'login', log the login message
    socket.on('login', function (data) {
        connected = true;
        // Display the welcome message
        var message = "Welcome";
        addLoggedMessages(data.chatLog);
        log(message, {
            prepend: true
        });

        addParticipantsMessage(data);
    });

    socket.on('updateLog', function (data) {
        connected = true;
        addChatMessage(data);
    })

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', function (data) {
        addChatMessage(data);
    });

    //When a user successfully changes their username
    socket.on('request accepted', function (data) {
        log('Name changed to: ' + data.name)
    });

    //When a user unsuccessfully changes their username
    socket.on('request denied', function (data) {
        log('That name is already taken')
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', function (data) {
        log(data.username + ' joined');
        addOnlineUser(data);
        addParticipantsMessage(data);
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', function (data) {
        log(data.username + ' left');
        addParticipantsMessage(data);
    });


    socket.on('disconnect', function () {
        log('you have been disconnected');
    });

    socket.on('reconnect', function () {
        log('you have been reconnected');
        if (username) {
            socket.emit('add user', username);
        }
    });

    socket.on('reconnect_error', function () {
        log('attempt to reconnect has failed');
    });

});