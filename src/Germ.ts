import { Dish } from "./Dish";

export interface IGermLimits {
    radius: {
        min: number;
        max: number;
    }
    xSpeed: {
        min: number;
        max: number;
    }
    ySpeed: {
        min: number;
        max: number;
    }
}

export const defaultGermLimits: IGermLimits = {
    radius: {
        min: 5,
        max: 128
    },
    xSpeed: {
        min: 1,
        max: 10
    },
    ySpeed: {
        min: 1,
        max: 10
    }
}

export interface IGermOptions {
    dish: Dish;
    limits?: IGermLimits;
}

export class Germ {
    readonly options: IGermOptions;

    color: string = "green";
    radius: number;
    x: number;
    xSpeed: number;
    y: number;
    ySpeed: number;
    z: number = 0;

    get bottom(): number {
        return this.y + this.radius;
    }

    get left(): number {
        return this.x - this.radius;
    }

    get right(): number {
        return this.x + this.radius;
    }

    get top(): number {
        return this.y - this.radius;
    }

    constructor(options: IGermOptions) {
        this.options = options;

        this.options.limits = this.options.limits || defaultGermLimits;

        this.reset();
    }

    collides(germ: Germ): boolean {
        return this !== germ && 
            this.z === germ.z && 
            this.distanceToPoint(germ.x, germ.y) < (this.radius + germ.radius);
    }

    distanceToPoint(x: number, y: number): number {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }

    handleCollisions(): void {
        this.options.dish.germs.forEach(g => {
            if (this.collides(g)) {
                if (this.radius >= g.radius) {
                    // TODO: Increment
                    this.radius += (g.radius / 2);
                    if (this.radius > this.options.limits.radius.max)
                        this.radius = this.options.limits.radius.max;
                    g.radius /= 2;
                }
            }
        })
    }

    render(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#003300';
        context.stroke();
    }

    reset(): void {
        this.radius = Math.random() * this.options.limits.radius.max;
        this.xSpeed = -Math.random() * this.options.limits.xSpeed.max;
        this.ySpeed = Math.random() * (this.options.limits.ySpeed.max * 2) - this.options.limits.ySpeed.max;

        this.warp( 
            (Math.random() * this.options.dish.width  * 2) + this.options.dish.width, 
            (Math.random() * this.options.dish.height * 3) - this.options.dish.height
        );
    }

    run(): void {
        this.updatePosition();
        this.handleCollisions();

        if (this.right < 0) this.reset();
        if (this.radius < this.options.limits.radius.min) this.reset();
    }

    updatePosition(): void {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    warp(x: number, y: number, z?: number): void {
        this.x = x;
        this.y = y;
        this.z = z !== undefined ? z : this.z;
    }
}