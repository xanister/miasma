import { Germ } from "./Germ";

export class Player extends Germ {
    color = "red";
    immuneTimeout: number;
    
    reset(): void {
        this.immuneTimeout = 50;

        this.radius = 32;
        this.xSpeed = 0;
        this.ySpeed = 0;

        this.warp( 
            this.radius * 2, 
            this.options.dish.height / 2
        );
    }

    run() {
        this.updatePosition();
        this.handleCollisions();

        if (this.options.dish.isKeydown([37, 65])) this.x -= 10;
        if (this.options.dish.isKeydown([38, 87])) this.y -= 10;
        if (this.options.dish.isKeydown([39, 68])) this.x += 10;
        if (this.options.dish.isKeydown([40, 83])) this.y += 10;

        if (this.immuneTimeout) this.immuneTimeout--;
        if (this.radius < this.options.limits.radius.min) this.reset();
    }
}