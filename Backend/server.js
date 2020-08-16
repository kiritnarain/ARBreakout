var io = require('socket.io')(process.env.PORT || 4567);
var User = require('./Classes/User.js');
const Vector3 = require('./Classes/Vector3.js');

var users = [];   // Mapping from userID to the User object
var sockets = []; // Mapping from userID to the Socket

var spawnpoints = [];  // Array of possible spawn points

console.log('Starting server');

io.on('connection', (socket) => {
    console.log('listening');

    var user = new User();

    // Put a mapping from id to the object and sockets
    users[user.id] = user;
    sockets[user.id] = socket;

    // Emit userID to the client for initialization
    socket.emit('register', {id: user.id});

    // get user information from the client to
    socket.on('sync', (e) => {
        console.log('User spawned');
        // console.log("username is " + e.name + " with position " + e.position);
        user.username = e.name;
        user.relPosition = new Vector3(parseInt(e.relativeX), parseInt(e.relativeY), parseInt(e.relativeZ));
        //console.log(`Got relative position (${e.relativeX}, ${e.relativeY}, ${e.relativeZ})`);
        // Find the spawnpoints that is empty and emit the location to the user
        for (let i = 0; i < spawnpoints.length; i++) {
            // If the spawnpoints is not occupied then spawn
            if (!spawnpoints[i].occupied) {
                spawnpoints[i].occupied = true;

                let spawn = spawnpoints[i];
                user.spawnPointIndex = i;
                user.position = new Vector3(spawn.x, spawn.y, spawn.z);
                user.translationVector = user.position.substract(user.relPosition);
                
                break;
            }
        }
    });

    // Update the user position and updates the user relative position in all other users
    socket.on('updatePosition', (pos) => {
        console.log('updating position');
        handleUpdatePosition(user, pos);
    });
    
    // Send position list to users every 50 seconds
    var interval = setInterval(() => {
        if (user.relPosList !== undefined) {
            console.log('syncing position');
            socket.emit('syncPosition', user.relPosList);
        }
    }, 50);

    // Clean up when the user disconnect
    socket.on('disconnect', () => {
        console.log('disconnected');
        console.log(user);
        if (spawnpoints[user.spawnPointIndex] !== undefined) {
            spawnpoints[user.spawnPointIndex].occupied = false;
        }
        delete users[user.id];
        delete sockets[user.id];
        clearInterval(interval);
    })
});

// Update the other users positional data.
// user : the user that position changes
// pos : the position it changes to
handleUpdatePosition = (user, pos) => {
    let newPosition = new Vector3(parseInt(pos.relativeX), parseInt(pos.relativeY), parseInt(pos.relativeZ));

    // Change both of the position accordingly
    user.relPosition = newPosition;

    // Translate the change into the translation vector;
    user.position = user.relPosition.add(user.translationVector);

    // loop over all other users in the server and calculate positional difference
    for (let userID in users) {
        if (userID !== user.id) {
            // if userID is not the users that change position
            // Handle relative position difference
            let relPosListOther = users[userID].othersRelativePos;

            let difference = user.position.substract(users[userID].position);

            let found = false;
            for (i in relPosListOther) {
                let otherPos = relPosListOther[i];
                if (otherPos.id === user.id) {
                    otherPos.x = difference.x;
                    otherPos.y = difference.y;
                    otherPos.z = difference.z;
                    found = true;
                }
            }

            if (!found) {
                relPosListOther.push({id: user.id, name: user.name, x: difference.x, y: difference.y, z:difference.z})
            }
        }
    }
}

// Generate 4n spawnpoints
generateSpawnPoints = (n) => {
    let div = 1;
    for (let i = 0; i < n; i++) {
        spawnpoints.push({x: 1 - div, y: 0, z: -1 * div, occupied : false});
        spawnpoints.push({x: - 1 + div, y: 0, z: div, occupied : false});
        spawnpoints.push({x: div, y: 0, z: 1 - div, occupied : false});
        spawnpoints.push({x: -1 * div, y: 0, z: -1 + div, occupied : false});    
        div -= 1 / n;
    }
}

// Generate the spawn points
generateSpawnPoints(4);