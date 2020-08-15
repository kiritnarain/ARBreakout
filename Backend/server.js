var io = require('socket.io')(process.env.PORT || 4567);
var User = require('./Classes/User.js');
const Vector3 = require('./Classes/Vector3.js');

var users = [];   // Mapping from userID to the User object
var sockets = []; // Mapping from userID to the Socket

io.on('connection', (socket) => {
    
    console.log('listening');

    var user = new User();

    // Put it into a mapping from id to the object and sockets
    users[user.id] = user;
    sockets[user.id] = socket;

    socket.emit('register', {id: user.id});
    socket.emit('join', user);
    socket.broadcast.emit('join', user);

    
    // Triggered when a user update its position. (User Emits an updatePosition event)
    // socket.once('updatePosition', () => {
    //     console.log("updating position");
    //     updateOtherPositionalData(socket); 
        
    // })

    socket.on('disconnect', () => {
        console.log('disconnected');
        delete users[user.id];
        delete sockets[user.id];
    })

});


// Takes in the new position of the user and updates and send updates relative position of other
// users to the socket
updateUserPositionalData = (socket) => {
    // for (let userID in users) {
    //     if (userID != user.id) {
    //         // loop over all other users in the server and calculate positional difference
    //     }
    // }
}

// Update the other users positional data and send it back each according to its own sockets.
updateOtherPositionalData = (position, socket, thisUserID) => {
    for (let userID in users) {
        if (userID != thisUserID) {
            // loop over all other users in the server and calculate positional difference
            let userPosition = position;
            // Handle relative position difference

            let otherSocket = sockets[userID];
            otherSocket.emit('updatePosition', userPosition);
        }
    }
}
