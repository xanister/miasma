import { Dish } from "./Dish";

export interface IGermOptions {
    defaultColor: string;
    maxLayer: number;
    minRadius: number;
    maxRadius: number;
    maxSpeed: number;
}

export class Germ {
    readonly options: IGermOptions;

    color: string;
    radius: number;
    x: number;
    xSpeed: number;
    y: number;
    ySpeed: number;
    z: number;

    constructor(options: IGermOptions) {
        this.options = options;

        this.color = this.options.defaultColor;
        this.radius = 0;
        this.x = 0;
        this.xSpeed = 0;
        this.y = 0;
        this.ySpeed = 0;
        this.z = Math.floor(Math.random() * this.options.maxLayer);
    }

    get bottom(): number {
        return this.y + this.radius;
    }

    set bottom(v: number) {
        this.y = v - this.radius;
    }

    get left(): number {
        return this.x - this.radius;
    }

    set left(v: number) {
        this.x = v + this.radius;
    }

    get right(): number {
        return this.x + this.radius;
    }

    set right(v: number) {
        this.x = v - this.radius;
    }

    get top(): number {
        return this.y - this.radius;
    }

    set top(v: number) {
        this.y = v + this.radius;
    }

    collides(germ: Germ): boolean {
        return this !== germ &&
            this.z === germ.z &&
            // this.radius <= this.options.maxRadius &&
            // germ.radius <= germ.options.maxRadius &&
            this.distanceToPoint(germ.x, germ.y) < (this.radius + germ.radius);
    }

    distanceToPoint(x: number, y: number): number {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }

    render(context: CanvasRenderingContext2D, scale: number = 1, opacity: number = 1): void {
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
    reset(dish: Dish, scale: number = 1) {
        // Update the layer if too large or small, randomize 
        // only if out of range
        if (this.radius < this.options.minRadius) this.z--;
        if (this.radius > this.options.maxRadius) this.z++;
        this.z = this.z > this.options.maxLayer || this.z < 0 ? 
            this.options.maxLayer - 1 : // Math.floor(Math.random() * this.options.maxLayer) : 
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

    run(dish: Dish) { }

    warp(x: number, y: number, z?: number): void {
        this.x = x;
        this.y = y;
        this.z = z !== undefined ? z : this.z;
    }
}