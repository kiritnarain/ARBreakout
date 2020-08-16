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
    
    let interval;

    // get user information from the client to
    socket.on('sync', (e) => {
        console.log('User spawned');

        user.username = e.name;
        user.relPosition = new Vector3(parseFloat(e.relativeX), parseFloat(e.relativeY), parseFloat(e.relativeZ));
        user.rotationOrientation = new Vector3(parseFloat(e.rotationX), parseFloat(e.rotationY), parseFloat(e.rotationZ))

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

        // Send position list to users every 50 seconds
        interval = setInterval(() => {
            if (user.othersRelativePos !== undefined) {
                console.log('syncing position: '+user.othersRelativePos);
                socket.emit('syncPosition', {users: user.othersRelativePos});
            }
        }, 50);
    });

    // Update the user position and updates the user relative position in all other users
    socket.on('updatePosition', (pos) => {
        console.log('updating position');
        handleUpdatePosition(user, pos);
    });
    


    // Clean up when the user disconnect
    socket.on('disconnect', () => {
        console.log('disconnected');
        console.log(user);
        if (spawnpoints[user.spawnPointIndex] !== undefined) {
            spawnpoints[user.spawnPointIndex].occupied = false;
        }
        delete users[user.id];
        delete sockets[user.id];
        if(interval!==undefined && interval!=null){
            clearInterval(interval);
        }

    })
});

// Update the other users positional data.
// user : the user that position changes
// pos : the position it changes to
handleUpdatePosition = (user, pos) => {
    let newPosition = new Vector3(parseFloat(pos.relativeX), parseFloat(pos.relativeY), parseFloat(pos.relativeZ));
    let newRotation = new Vector3(parseFloat(pos.rotationX), parseFloat(pos.rotationY), parseFloat(pos.rotationZ));

    // Change both of the position accordingly
    user.relPosition = newPosition;

    // Find the rotation difference of the user
    let deltaRot = newRotation.substract(users[userID].rotationOrientation);

    // Update the user rotation
    user.rotationOrientation = newRotation;

    // Translate the change into the translation vector;
    user.position = user.relPosition.add(user.translationVector);

    // loop over all other users in the server and calculate positional difference
    for (let userID in users) {
        if (userID !== user.id) {
                        // if userID is not the users that change position
            // Handle relative position difference
            let relPosListOther = users[userID].othersRelativePos;
            if (relPosListOther === undefined) {
                relPosListOther = [];
            }

            // Find the difference in position
            let difference = user.position.substract(users[userID].position);


            // Check whether the id exists or not
            // if the id exists in the list then update everything
            let found = false;
            for (i in relPosListOther) {
                let otherPos = relPosListOther[i];
                if (otherPos.id === user.id) {
                    otherPos.relativeX = difference.x;
                    otherPos.relativeY = difference.y;
                    otherPos.relativeZ = difference.z;
                    otherPos.deltaRotationX = deltaRot.x;
                    otherPos.deltaRotationY = deltaRot.y;
                    otherPos.deltaRotationZ = deltaRot.z;
                    found = true;
                }
            }

            // if not found then push a new object to the list
            if (!found) {
                relPosListOther.push(
                {
                    id: user.id,
                    name: user.name,
                    relativeX: difference.x,
                    relativeY: difference.y,
                    relativeZ: difference.z,
                    deltaRotationX: deltaRot.x,
                    deltaRotationY: deltaRot.y,
                    deltaRotationZ: deltaRot.z
                })
            }

            users[userID].othersRelativePos = relPosListOther;
        }
    }

};

// Generate 4n spawnpoints
generateSpawnPoints = (n) => {
    let div = 1;
    for (let i = 0; i < n; i++) {
        // Make endpoints as uniformly distributed as possible
        spawnpoints.push({x: 1 - div, y: 0, z: -1 * div, occupied : false});
        spawnpoints.push({x: - 1 + div, y: 0, z: div, occupied : false});
        spawnpoints.push({x: div, y: 0, z: 1 - div, occupied : false});
        spawnpoints.push({x: -1 * div, y: 0, z: -1 + div, occupied : false});    
        div -= 1 / n;
    }
}

// Generate the spawn points
generateSpawnPoints(4);