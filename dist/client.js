/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Dish_1 = __webpack_require__(1);
	const Player_1 = __webpack_require__(2);
	const Replicator_1 = __webpack_require__(4);
	let conf = {
	    germsPerLayer: 15,
	    layers: 6
	}, germOptions = {
	    defaultColor: "yellow",
	    maxLayer: conf.layers - 1,
	    minRadius: 5,
	    maxRadius: window.innerHeight / 8,
	    maxSpeed: 6
	}, playerOptions = {
	    defaultColor: "white",
	    maxLayer: conf.layers - 1,
	    minRadius: 40,
	    maxRadius: window.innerHeight / 8,
	    maxSpeed: 12
	}, player = new Player_1.Player(playerOptions), dish = new Dish_1.Dish({
	    color: "black",
	    elementSelector: "body",
	    layers: conf.layers,
	    player: player
	});
	Replicator_1.Replicator
	    .generateGerms(conf.germsPerLayer * conf.layers, germOptions)
	    .forEach(g => dish.append(g));
	// Prerun to randomize a bit
	// for (let i = 0; i < 15000; i++) dish.run();
	// let tick = 0;
	let run = () => {
	    // if (tick++ % 2) dish.run();
	    dish.run();
	    dish.render();
	    requestAnimationFrame(run);
	};
	requestAnimationFrame(run);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	class Dish {
	    constructor(options) {
	        this.keyboard = {};
	        this.keyboardCodes = {};
	        this.options = options;
	        this.germs = [];
	        for (let i = 0; i < this.options.layers; i++)
	            this.germs.push([]);
	        this.append(this.options.player);
	        this.setupCanvas();
	        this.bindEvents();
	    }
	    bindEvents() {
	        window.addEventListener("keydown", this.handleKeydown.bind(this));
	        window.addEventListener("keyup", this.handleKeyup.bind(this));
	        window.addEventListener("resize", this.handleResize.bind(this));
	    }
	    handleKeydown(event) {
	        this.keyboard[event.key] = true;
	        this.keyboardCodes[event.keyCode] = true;
	    }
	    handleKeyup(event) {
	        this.keyboard[event.key] = false;
	        this.keyboardCodes[event.keyCode] = false;
	    }
	    handleResize(event) {
	        this.canvas.width = this.el.clientWidth;
	        this.canvas.height = this.el.clientHeight;
	    }
	    setupCanvas() {
	        this.el = document.querySelector(this.options.elementSelector);
	        this.canvas = document.createElement("canvas");
	        this.el.appendChild(this.canvas);
	        this.canvas.width = this.el.clientWidth;
	        this.canvas.height = this.el.clientHeight;
	        this.canvasContext = this.canvas.getContext('2d');
	    }
	    get height() { return this.canvas.clientHeight; }
	    get width() { return this.canvas.clientWidth; }
	    append(germ) {
	        this.germs[germ.z].push(germ);
	    }
	    clearCanvas() {
	        this.canvasContext.fillStyle = this.options.color || "white";
	        this.canvasContext.fillRect(0, 0, this.width, this.height);
	    }
	    getGermScale(germ) {
	        return (this.options.player.z + 1) / (germ.z + 1);
	    }
	    handleCollision(g1, g2) {
	        // TODO: ADD TO OPTIONS
	        if (g1.radius > g2.radius || (g1.radius === g2.radius && g1 === this.options.player)) {
	            g1.radius += 1;
	            g2.radius -= 1;
	            if (g2.radius <= 0)
	                g2.reset(this);
	        }
	        //  else {
	        //     g1.radius -= 1;
	        //     g2.radius += 1;
	        //     if (g1.radius <= 0) g1.reset(this);
	        // }
	    }
	    isGermVisible(germ, scale) {
	        return germ === this.options.player || ((germ.x - germ.radius) * scale < this.width &&
	            (germ.x + germ.radius) * scale > 0 &&
	            (germ.y - germ.radius) * scale < this.height &&
	            (germ.y + germ.radius) * scale > 0);
	    }
	    isKeydown(key) {
	        // TODO: HANDLE STRING ARRAY
	        switch (typeof key) {
	            case "number": return !!this.keyboardCodes[key];
	            case "string": return !!this.keyboard[key];
	            default: return key.some(c => this.keyboard[c]);
	        }
	    }
	    render() {
	        // Clear the canvas
	        this.clearCanvas();
	        // Render germs
	        this.germs
	            .forEach((layer, layerIndex) => layer.forEach(g => {
	            // Scale by z-distance to player and don't render offscreen
	            const scale = this.getGermScale(g), visible = this.isGermVisible(g, scale);
	            // Render the germ
	            if (visible)
	                g.render(this.canvasContext, scale, scale === 1 ? 1 : scale * 0.2);
	        }));
	        // Render UI
	        this.canvasContext.font = "20px Arial";
	        this.canvasContext.fillStyle = "red";
	        this.canvasContext.fillText(`${this.options.player.z.toString()}`, 20, 40);
	    }
	    run() {
	        // Update germs
	        this.germs
	            .forEach((layer, layerIndex) => layer.forEach(g => {
	            // Scale by z-distance
	            const scale = this.getGermScale(g);
	            // Update position
	            g.x += g.xSpeed;
	            g.y += g.ySpeed;
	            // Handle collisions
	            if (g.radius <= g.options.maxRadius)
	                layer.forEach(g2 => g.collides(g2) && this.handleCollision(g, g2));
	            // Reset when offscreen
	            if (this.shouldGermReset(g, scale))
	                g.reset(this, scale);
	            // Handle layer changes
	            if (g.z !== layerIndex) {
	                layer.splice(layer.indexOf(g), 1);
	                this.germs[g.z].push(g);
	            }
	            // Run the germ
	            g.run(this);
	        }));
	    }
	    shouldGermReset(germ, scale) {
	        // TODO: VERIFY SCALING LOGIC
	        return germ.radius * scale <= 5 ||
	            (germ.x * scale) + (germ.radius * scale) < 0 ||
	            ((germ.y * scale) + (germ.radius * scale) < 0 && germ.ySpeed <= 0) ||
	            ((germ.y * scale) - (germ.radius * scale) > this.height && germ.ySpeed >= 0); // Top edge below bottom of screen and ySpeed > 0
	    }
	    size() {
	        let c = 0;
	        this.germs.forEach(layer => c += layer.length);
	        return c;
	    }
	}
	exports.Dish = Dish;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Germ_1 = __webpack_require__(3);
	class Player extends Germ_1.Germ {
	    constructor(options) {
	        super(options);
	        this.z = 2; //options.maxLayer / 2;
	    }
	    reset(dish) {
	        if (this.radius < this.options.minRadius && this.z > 0)
	            this.z--;
	        if (this.radius > this.options.maxRadius && this.z < this.options.maxLayer)
	            this.z++;
	        this.radius = this.options.minRadius;
	        this.warp(this.radius + 1, dish.height / 2);
	    }
	    run(dish) {
	        if (this.radius < this.options.minRadius ||
	            this.radius > this.options.maxRadius)
	            this.reset(dish);
	        if (dish.isKeydown(["w"]))
	            this.y -= this.options.maxSpeed;
	        if (dish.isKeydown(["a"]))
	            this.x -= this.options.maxSpeed;
	        if (dish.isKeydown(["s"]))
	            this.y += this.options.maxSpeed;
	        if (dish.isKeydown(["d"]))
	            this.x += this.options.maxSpeed;
	        if (this.left < 0)
	            this.left = 0;
	        if (this.right > dish.width)
	            this.right = dish.width;
	        if (this.top < 0)
	            this.top = 0;
	        if (this.bottom > dish.height)
	            this.bottom = dish.height;
	    }
	}
	exports.Player = Player;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	class Germ {
	    constructor(options) {
	        this.options = options;
	        this.color = this.options.defaultColor;
	        this.radius = 0;
	        this.x = 0;
	        this.xSpeed = 0;
	        this.y = 0;
	        this.ySpeed = 0;
	        this.z = Math.floor(Math.random() * this.options.maxLayer);
	    }
	    get bottom() {
	        return this.y + this.radius;
	    }
	    set bottom(v) {
	        this.y = v - this.radius;
	    }
	    get left() {
	        return this.x - this.radius;
	    }
	    set left(v) {
	        this.x = v + this.radius;
	    }
	    get right() {
	        return this.x + this.radius;
	    }
	    set right(v) {
	        this.x = v - this.radius;
	    }
	    get top() {
	        return this.y - this.radius;
	    }
	    set top(v) {
	        this.y = v + this.radius;
	    }
	    collides(germ) {
	        return this !== germ &&
	            this.z === germ.z &&
	            // this.radius <= this.options.maxRadius &&
	            // germ.radius <= germ.options.maxRadius &&
	            this.distanceToPoint(germ.x, germ.y) < (this.radius + germ.radius);
	    }
	    distanceToPoint(x, y) {
	        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
	    }
	    render(context, scale = 1, opacity = 1) {
	        // TODO: MOVE TO OPTIONS
	        if (this.radius * scale < 5)
	            return;
	        context.globalAlpha = opacity;
	        context.beginPath();
	        context.arc(this.x * scale, this.y * scale, this.radius * scale, 0, 2 * Math.PI, false);
	        context.fillStyle = this.color;
	        context.fill();
	        context.lineWidth = 5 * scale; // TODO: MOVE TO OPTIONS
	        context.strokeStyle = '#003300'; // TODO: MOVE TO OPTIONS
	        context.stroke();
	        context.globalAlpha = 1;
	    }
	    /**
	     * Randomize the germ's radius, move it offscreen
	     * and set its speed to intersect with the dish.
	     * If too large or small update the layer as well
	     */
	    reset(dish, scale = 1) {
	        // Update the layer if too large or small, randomize 
	        // only if out of range
	        if (this.radius < this.options.minRadius)
	            this.z--;
	        if (this.radius > this.options.maxRadius)
	            this.z++;
	        this.z = this.z > this.options.maxLayer || this.z < 0 ?
	            this.options.maxLayer - 1 :
	            this.z;
	        // Randomize radius
	        this.radius = this.options.minRadius + (Math.random() * (this.options.maxRadius - this.options.minRadius) * 0.5);
	        // Randomize location
	        // TODO: account correctly for scale when determining new location
	        this.x = (dish.width / scale) + this.radius + (Math.random() * dish.width);
	        this.y = Math.round(Math.random() * dish.height * 3 / scale) - (dish.height / scale);
	        this.xSpeed = -Math.round(Math.random() * this.options.maxSpeed);
	        this.ySpeed = Math.floor(Math.random() * this.options.maxSpeed * 2) - this.options.maxSpeed;
	    }
	    run(dish) { }
	    warp(x, y, z) {
	        this.x = x;
	        this.y = y;
	        this.z = z !== undefined ? z : this.z;
	    }
	}
	exports.Germ = Germ;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Germ_1 = __webpack_require__(3);
	exports.Replicator = {
	    generateGerm(options) {
	        let g = new Germ_1.Germ(options);
	        return g;
	    },
	    generateGerms(count, options) {
	        let germs = [];
	        for (let i = 0; i < count; i++)
	            germs.push(exports.Replicator.generateGerm(options));
	        return germs;
	    }
	};


/***/ }
/******/ ]);
//# sourceMappingURL=client.js.map