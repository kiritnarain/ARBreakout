var shortID = require('shortid');

class User {

    constructor() {
        this.username = '';
        this.id = shortID.generate();
        this.position = {x: 0, y:0, z:0};
    }
    
}

module.exports = User;