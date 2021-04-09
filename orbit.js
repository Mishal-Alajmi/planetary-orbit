
// Gravitational Constant
const GC = 50;

// Create Solar System
let sun;
let planets = [];
const NUM_PLANETS = 4;

function setup() {
    createCanvas(windowWidth, windowHeight);
    sun = new CellistialObject(200, 100, createVector(0, 0), createVector(0, 0));
    for (let i = 0; i < NUM_PLANETS; ++i) {
        // TODO move this logic into a init_body method
        // Set the distance to the sun to be random position on the canvas
        let distance_star = random(sun.diameter, min(windowWidth / 2, windowHeight / 2));
        // Set the angle to be random between 0 and 2 * pi
        let theta = random(TWO_PI);
        // Calculate the coordinate of the planet
        let planet_coord = createVector(distance_star * cos(theta), distance_star * sin(theta));
        // Set the planet velocity vector
        let planet_vel = createVector(distance_star * cos(theta), distance_star * sin(theta));
        planet_vel.rotate(HALF_PI);
        planet_vel.setMag(sqrt(GC * sun.getMass() / planet_coord.mag()));
        // Set the mass of the planet to be a random number between 10 and the star's mass / 2
        let planet_mass = random(20, sun.getMass() / 2);
        // Set the diameter of the planet between 10 and the star's diameter / 2
        let planet_diameter = random(10, sun.getDiameter() / 2);
        planets.push(new CellistialObject(planet_diameter, planet_mass, planet_vel, planet_coord));
    }
}

function draw() {
    translate(window.innerWidth / 2, window.innerHeight / 2);
    background('#5E4F6D');
    sun.show();
    planets.forEach((planet) => {
        planet.show();
        sun.attract(planet);
        planet.orbit();
    });

}

class CellistialObject {
    constructor (diameter, mass, velocity, coordinate) {
        this.diameter = diameter;
        this.mass = mass;
        this.velocity = velocity;
        this.coordinate = coordinate;
    }

    getMass() { return this.mass; }

    getDiameter() { return this.diameter; }

    getCoordinateHorizontal() { return this.coordinate.x; }

    getCoordinateVertical() { return this.coordinate.y; }

    getHorizontalVelocity() { return this.acc.x; }

    getVerticalAcceleration() { return this.acc.y; }

    drawLine() {
        // TODO draw a line that trails each planets orbit
    }

    show() {
        noStroke();
        fill('#ee8866');
        ellipse(this.coordinate.x, this.coordinate.y, this.diameter, this.diameter);
    }

    orbit() {
        this.coordinate.x += this.velocity.x;
        this.coordinate.y += this.velocity.y;
    }

    setForce(gravitational_force) {
        this.velocity.x += gravitational_force.x / this.mass;
        this.velocity.y += gravitational_force.y / this.mass;
    }
    attract(child_planet) {
        // The distance between the child planet and the star
        let r = dist(this.coordinate.x, this.coordinate.y, child_planet.coordinate.x, child_planet.coordinate.y);
        let f = this.coordinate.copy().sub(child_planet.coordinate);
        f.setMag(GC * (this.mass * child_planet.mass) / Math.pow(r, 2));
        child_planet.setForce(f);
    };

}