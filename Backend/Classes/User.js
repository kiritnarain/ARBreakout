const shortID = require('shortid');
const Vector3 = require('./Vector3');

class User {

    constructor() {
        this.username = '';
        this.id = shortID.generate(); // Unique shortID
        this.position = new Vector3(0, 0, 0);
        this.relPosition = new Vector3(0, 0, 0);
        this.spawnPointIndex = -1;
        this.othersRelativePos = [];
    }
    
}

module.exports = User;