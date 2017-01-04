import { Dish } from "./Dish";
import { Germ, IGermOptions } from "./Germ";

export interface IPlayerOptions extends IGermOptions { }

export class Player extends Germ {
    constructor(options: IPlayerOptions) {
        super(options);

        this.z = 2; //options.maxLayer / 2;
    }

    reset(dish: Dish) {
        if (this.radius < this.options.minRadius && this.z > 0) this.z--;
        if (this.radius > this.options.maxRadius && this.z < this.options.maxLayer) this.z++;
        this.radius = this.options.minRadius;
        this.warp(this.radius + 1, dish.height / 2);
    }

    run(dish: Dish) {
        if (this.radius < this.options.minRadius ||
            this.radius > this.options.maxRadius) this.reset(dish);

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