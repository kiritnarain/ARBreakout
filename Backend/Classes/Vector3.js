class Vector3 {

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    magnitude() {
        return Math.cbrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }

    normalized() {
        var magnitude = this.magnitude();
        return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
    }

    add(vect) {
        let newX = this.x + vect.x;
        let newY = this.y + vect.y;
        let newZ = this.z + vect.z;
        return new Vector3(newX, newY, newZ);
    }

    substract(vect) {
        let newX = this.x - vect.x;
        let newY = this.y - vect.y;
        let newZ = this.z - vect.z;
        return new Vector3(newX, newY, newZ);
    }
}

module.exports = Vector3;