var shortID = require('shortid');

class User {
    constructor() {
        this.username = '';
        this.id = shortID.generate(); // Unique shortID
        this.position = {x: 0, y:0, z:0};
        this.spawnPointIndex = -1;
    }
}

module.exports = User;