import { Dish } from "./Dish";

export interface IGermOptions {
    maxLayer: number;
    minRadius: number;
    maxRadius: number;
    maxSpeed: number;
    spawnX: number;
    spawnY: number;
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

        this.reset();
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
            this.distanceToPoint(germ.x, germ.y) < (this.radius + germ.radius);
    }

    distanceToPoint(x: number, y: number): number {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }

    render(context: CanvasRenderingContext2D, scale: number = 1, opacity: number = 1): void {
        // TODO: MOVE TO OPTIONS
        if (this.radius * scale < 5 || this.x * scale + (this.radius * scale) < 0.1)
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

    reset() {
        // TODO: MOVE TO OPTIONS
        this.z = this.z ||
            (Math.floor(Math.random() * this.options.maxLayer * 0.2) + Math.floor(this.options.maxLayer * 0.2));
        if (this.radius && this.radius < this.options.minRadius) this.z--;
        if (this.radius && this.radius > this.options.maxRadius) this.z++;
        if (this.z <= 0 || this.z >= this.options.maxLayer) this.z = this.options.maxLayer / 2;

        this.radius = (Math.random() * (this.options.maxRadius - this.options.minRadius)) + this.options.minRadius;
        this.color = "green"; // TODO: MOVE TO OPTIONS

        this.xSpeed = -(Math.random() * this.options.maxSpeed);
        this.ySpeed = (Math.random() * this.options.maxSpeed * 2) - this.options.maxSpeed;

        this.warp(
            this.options.spawnX + Math.floor(Math.random() * this.options.spawnX), 
            Math.floor(Math.random() * this.options.spawnY * 3) - this.options.spawnY
        );
    }

    run(dish: Dish) {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.right < 0 || this.radius > this.options.maxRadius) this.reset();
    }

    warp(x: number, y: number, z?: number): void {
        this.x = x;
        this.y = y;
        this.z = z || this.z;
    }
}