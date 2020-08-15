var io = require('socket.io')(process.env.PORT || 4567);
var User = require('./Classes/User.js');
const Vector3 = require('./Classes/Vector3.js');

var users = [];   // Mapping from userID to the User object
var sockets = []; // Mapping from userID to the Socket

var spawnpoints = [];

io.on('connection', (socket) => {
    
    console.log('listening');

    var user = new User();

    // Put it into a mapping from id to the object and sockets
    users[user.id] = user;
    sockets[user.id] = socket;

    socket.emit('register', {id: user.id});

    // Find the spawnpoints that is empty and emit the location to the user
    for (let i = 0; i < spawnpoints.length; i++) {
        // If the spawnpoints is not occupied then spawn
        if (!spawnpoints[i].occupied) {
            spawnpoints[i].occupied = true;
            let spawn = spawnpoints[i];
            socket.emit('spawn', {x: spawn.x, y: spawn.y, z: spawn.z});
            user.spawnPointIndex = i;
            // socket.broadcast.emit('join', {x: spawn.x, y: spawn.y, z: spawn.z});
            console.log(spawnpoints[i]);
            break;                    
        }
    }
    
    // Triggered when a user update its position. (User Emits an updatePosition event)
    socket.on('updatePosition', (pos) => {
        console.log("updating position");
        handleOtherUsers(user, pos, user.id); 
    })

    socket.on('disconnect', () => {
        console.log('disconnected');
        spawnpoints[user.spawnPointIndex].occupied = false;
        delete users[user.id];
        delete sockets[user.id];
    })

});

generateSpawnPoints = () => {
    for (let i = 0; i < 1; i++) {
        let div = i + 1;  // divisor
        spawnpoints.push({x: 1 - 1/div, y: 0, z: -1/div, occupied : false});
        spawnpoints.push({x: - 1 + 1/div, y: 0, z: 1/div, occupied : false});
        spawnpoints.push({x: 1 / div, y: 0, z: 1 - 1/div, occupied : false});
        spawnpoints.push({x: -1 / div, y: 0, z: -1 + 1/div, occupied : false});    
    }
    for (let i = 0; i < 4; i++) {
        console.log(spawnpoints[i]);
    }
}
// Generate the spawn points
generateSpawnPoints();

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
handleOtherUsers = (user, newPosition, thisUserID) => {
    for (let userID in users) {
        if (userID != thisUserID) {
            // loop over all other users in the server and calculate positional difference
            // Handle relative position difference

            let otherSocket = sockets[userID];
            otherSocket.emit('updatePosition', userPosition);
        }
    }
}
