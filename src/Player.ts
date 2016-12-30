import { Dish } from "./Dish";
import { Germ, IGermOptions } from "./Germ";

export interface IPlayerOptions extends IGermOptions { }

export class Player extends Germ {
    constructor(options: IPlayerOptions) {
        super(options);
    }

    reset() {
        this.z = this.z || this.options.maxLayer / 2;
        if (this.radius && this.radius < this.options.minRadius && this.z > 0) this.z--;
        if (this.radius && this.radius > this.options.maxRadius && this.z < this.options.maxLayer) this.z++;

        this.color = "red"; // TODO: MOVE TO OPTIONS
        this.radius = this.options.minRadius + Math.floor((this.options.maxRadius - this.options.minRadius) / 2);

        this.warp(this.options.spawnX, this.options.spawnY);
    }

    run(dish: Dish) {
        if (this.radius < this.options.minRadius) this.reset();
        if (this.radius > this.options.maxRadius) this.reset();

        if (dish.isKeydown(["w"])) this.y -= this.options.maxSpeed;
        if (dish.isKeydown(["a"])) this.x -= this.options.maxSpeed;
        if (dish.isKeydown(["s"])) this.y += this.options.maxSpeed;
        if (dish.isKeydown(["d"])) this.x += this.options.maxSpeed;

        if (this.left < 0) this.left = 0;
        if (this.right > dish.width) this.right = dish.width;
        if (this.top < 0) this.top = 0;
        if (this.bottom > dish.height) this.bottom = dish.height;
    }
}