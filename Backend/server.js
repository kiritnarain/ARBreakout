var io = require('socket.io')(process.env.PORT || 4567);
var User = require('./Classes/User.js');
const Vector3 = require('./Classes/Vector3.js');

var users = [];   // Mapping from userID to the User object
var sockets = []; // Mapping from userID to the Socket

var spawnpoints = [];  // Array of possible spawn points

io.on('connection', (socket) => {
    
    console.log('listening');

    var user = new User();

    // Put it into a mapping from id to the object and sockets
    users[user.id] = user;
    sockets[user.id] = socket;

    socket.emit('register', {id: user.id});

    socket.on('sync', (e) => {
        console.log("username is " + e.name + " with position " + e.position);
        user.username = e.name;
        user.relPosition = e.position;
    })

    // Find the spawnpoints that is empty and emit the location to the user
    for (let i = 0; i < spawnpoints.length; i++) {
        // If the spawnpoints is not occupied then spawn
        if (!spawnpoints[i].occupied) {
            spawnpoints[i].occupied = true;

            let spawn = spawnpoints[i];
            user.spawnPointIndex = i;
            user.position = new Vector3(spawn.x, spawn.y, spawn.z);

            console.log(spawnpoints[i]);
            break;
        }
    }
    
    // Triggered when a user update its position. (User Emits an updatePosition event)
    // Set to only update every 50 seconds
    var interval = setInterval(() => {
        socket.on('updatePosition', (pos) => {
            handleUpdatePosition(user, pos); 
        })    
    }, 50);
    

    // Clean up when the user disconnect
    socket.on('disconnect', () => {
        console.log('disconnected');
        spawnpoints[user.spawnPointIndex].occupied = false;
        delete users[user.id];
        delete sockets[user.id];
        clearInterval(interval);
    })
});

// Update the other users positional data and send it back each according to its own sockets.
handleUpdatePosition = (user, pos) => {
    let newPosition = new Vector3(pos.relativeX, pos.relativeY, pos.relativeZ);
    // Assign new position to the user
    let differencePos = newPosition.substract(user.relPosition);

    // Change both of the position accordingly
    user.relPosition = newPosition;
    user.position = differencePos.add(user.position);

    // loop over all other users in the server and calculate positional difference
    for (let userID in users) {
        if (userID !== user.id) {
            // if userID is not the users that change position
            // Handle relative position difference
            let relPosList = users[userID].othersRelativePos;

            let difference = user.position.substract(users[userID]);

            let found = false;
            for (otherPos in relPosList) {
                if (otherPos.id === user.id) {
                    otherPos.x = difference.x;
                    otherPos.y = difference.y;
                    otherPos.z = difference.z;
                    found = true;
                }
            }

            if (!found) {
                relPosList.push({id: user.id, name: user.name, x: difference.x, y: difference.y, z:difference.z})
            }

            let otherSocket = sockets[userID];
            otherSocket.emit('updatePosition', relPosList);
        }
    }
}

// Note spawn points right now is hard coded to 8
generateSpawnPoints = () => {
    for (let i = 0; i < 2; i++) {
        let div = i + 1;  // divisor
        spawnpoints.push({x: 1 - 1/div, y: 0, z: -1/div, occupied : false});
        spawnpoints.push({x: - 1 + 1/div, y: 0, z: 1/div, occupied : false});
        spawnpoints.push({x: 1 / div, y: 0, z: 1 - 1/div, occupied : false});
        spawnpoints.push({x: -1 / div, y: 0, z: -1 + 1/div, occupied : false});    
    }
}

// Generate the spawn points
generateSpawnPoints();