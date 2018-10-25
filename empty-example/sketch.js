let img;
let gamepad;
let tank;
function preload() {
	img = loadImage('assets/tank.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	imageMode(CENTER);
	gamepad = new Joy();
	tank = new Tank(img);
	document.getElementsByTagName('body')[0].addEventListener('touchmove', function(e) {
		e.preventDefault()
	})
}

function draw() {
	background(0);
	// This is supposed to be the main loop
	gameloop();

	tank.render();
	// image(img, width / 2, height / 2);
	gamepad.render();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
	if(gamepad.inRange(mouseX, mouseY)) {
		joyOn = true;
		gamepad.input(mouseX, mouseY);
	}
}

function mouseDragged() {
	if(joyOn) {
		gamepad.input(mouseX, mouseY);
	}
}

function mouseReleased() {
	joyOn = false;
	gamepad.setValues(0, 0);
}

p5.prototype.Joy = class Joy {
	constructor() {
		this.value = createVector(0, 0);
		this.position = createVector(110, height - 110);
		this.size = 200;
		this.stickSize = this.size / 3;
	}

	render() {
		push();
		ellipseMode(CENTER);
		fill(60);
		stroke(30);
		strokeWeight(5);
		ellipse(this.position.x, this.position.y, this.size);
		fill(80);
		ellipse(
			this.position.x + map(-this.value.x, -1, 1, (-this.size / 2) + (this.stickSize / 2), (this.size / 2) - (this.stickSize / 2), true),
			this.position.y + map(-this.value.y, -1, 1, (-this.size / 2) + (this.stickSize / 2), (this.size / 2) - (this.stickSize / 2), true),
			this.size / 3);
		pop();
	}

	setValues(x, y) {
		let vec;
		if(x instanceof p5.Vector) {
			vec = x.clone();
		} else {
			vec = createVector(x, y);
		}
		if(vec.magSq() > 1) {
			vec.normalize()
		}
		return this.value = vec;
	}

	input(x, y) {
		let vec;
		if(x instanceof p5.Vector) {
			vec = x.clone();
		} else {
			vec = createVector(x, y);
		}
		vec.sub(this.position);
		vec.div(-this.size / 2);
		if(vec.magSq() > 1) {
			vec.normalize()
		}
		return this.value = vec;
	}

	inRange(x, y) {
		let vec;
		if(x instanceof p5.Vector) {
			vec = x.clone();
		} else {
			vec = createVector(x, y);
		}
		vec.sub(this.position);
		vec.div(-this.size / 2);
		if(vec.magSq() > 1) {
			return false;
		} else {
			return true;
		}
	}
}

p5.prototype.Tank = class Tank {
	constructor(img) {
		this.tank = img;
		this.dcmotor = {left: 0, right: 0};
		this.position = createVector(width / 2, width / 2 );
	}

	render() {
		push();
		imageMode(CENTER);
		image(this.tank, this.position.x, this.position.y);
		// 84x92
		stroke(255, 255, 255);
		strokeWeight(10);
		line(this.position.x - 52, this.position.y, this.position.x - 52, 
			map(-this.dcmotor.left, 1, -1, this.position.y + 46, this.position.y - 46));
		
		line(this.position.x + 52, this.position.y, this.position.x + 52, 
				map(-this.dcmotor.right, 1, -1, this.position.y + 46, this.position.y - 46));
		pop();
	}

	setLeft(val) {
		this.dcmotor.left = constrain(val, -1, 1);
	}

	setRight(val) {
		this.dcmotor.right = constrain(val, -1, 1);
	}
}







/**
 * This is supposed to be the main loop
 */

 function gameloop() {
	let t = tank;
	let v = createVector(gamepad.value.x, gamepad.value.y);
	// angleMode(DEGREES);
	// Messy transformation of the angle... so the angle results is cleaner. sorry...
	let r = v.heading();
	r += HALF_PI * 3
	r = r % (PI * 2);
	//JoyStick goes from 0π (top) to 2π (going clockwise) something that seems more like what we'll get out of the API
	
	// "a" is Angle
	let a;
	// "m" is Magnitude
	let m = gamepad.value.mag();

	if(r >= 0 && r < HALF_PI) {
		a = r / HALF_PI;
		tank.setRight(
			map(a, 0, 1, 1, -1) * m
		);
		tank.setLeft(m);
	} else if ( r >= HALF_PI && r < PI) {
		a = (r - HALF_PI) / HALF_PI;
		tank.setLeft(
			map(a, 0, 1, 1, -1) * m
		);
		tank.setRight(-m);
	} else if (r >= PI && r < HALF_PI * 3) {
		a = (r - PI) / HALF_PI;
		tank.setRight(
			map(a, 0, 1, -1, 1) * m
		);
		tank.setLeft(-m);
	} else if (r >= HALF_PI * 3 && r < PI * 2) {
		a = (r - HALF_PI * 3) / HALF_PI;
		tank.setLeft(
			map(a, 0, 1, -1, 1) * m
		);
		tank.setRight(m)
		console.log(m);
		
	}
	
}