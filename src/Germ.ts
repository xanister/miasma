import { Dish } from "./Dish";

export class Germ {
    color: string;
    radius: number;
    x: number;
    xSpeed: number;
    y: number;
    ySpeed: number;
    z: number;

    constructor() {
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
        if (this.radius <= 0 ||
            this.right < 0 || 
            this.top > window.innerHeight || 
            this.left > window.innerWidth || 
            this.bottom < 0) 
            return;

        context.globalAlpha = opacity;
        context.beginPath();
        context.arc(this.x * scale, this.y * scale, this.radius * scale, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
        context.lineWidth = 5 * scale;
        context.strokeStyle = '#003300';
        context.stroke();
        context.globalAlpha = 1;
    }

    reset() {
        this.z = this.z || (50 + (Math.floor(Math.random() * 40) - 20));
        if (this.radius && this.radius < 10) this.z--;
        if (this.radius && this.radius > 256) this.z++;
        if (this.z <= 0 || this.z >= 100) this.z = 50;

        this.radius = 32 + (Math.random() * 32);
        this.color = "green";
        
        this.xSpeed = -(Math.random() * 5);
        this.ySpeed = (Math.random() * 10) - 5;

        this.warp(
            window.innerWidth + (Math.random() * window.innerWidth * 2),
            (Math.random() * window.innerHeight * 3) - window.innerHeight
        );
    }

    run(dish: Dish) {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.right < 0 || this.radius > (window.innerWidth / 2)) this.reset();
    }

    warp(x: number, y: number, z?: number): void {
        this.x = x;
        this.y = y;
        this.z = z || this.z || 50;
    }
}