const shortID = require('shortid');
const Vector3 = require('./Vector3');

class User {

    constructor() {
        this.username = '';           // Username (not unique)
        this.id = shortID.generate(); // Unique shortID
        this.position = new Vector3(); // Position stored in the server
        this.relPosition = new Vector3(); // Position relative to the user origin
        this.spawnPointIndex = -1;       // SpawnPoint index indicating which spawn points the user spawned in
        this.othersRelativePos = [];            // Array of objects containing relative position to the obj
        this.translationVector = new Vector3(); // Translation vector from relPosition to position
        this.rotationOrientation = new Vector3(); // Rotation in x axis, y axis, and z axis respectively.
    }
    
}

module.exports = User;