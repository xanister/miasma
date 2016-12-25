import { Dish } from "./Dish";
import { Germ } from "./Germ";

export class Player extends Germ {
    reset() {
        this.z = this.z || 50;
        if (this.radius && this.radius < 10 && this.z > 0) this.z--;
        if (this.radius && this.radius > 256 && this.z < 100) this.z++;
        
        this.color = "red";
        this.radius = 64;
        
        this.warp(
            64,
            window.innerHeight / 2
        );
    }

    run(dish: Dish) {
        if (this.radius < 10) this.reset();
        if (this.radius > 256) this.reset();

        if (dish.isKeydown([37, 65])) this.x -= 10;
        if (dish.isKeydown([38, 87])) this.y -= 10;
        if (dish.isKeydown([39, 68])) this.x += 10;
        if (dish.isKeydown([40, 83])) this.y += 10;

        if (this.left < 0) this.left = 0;
        if (this.right > dish.width) this.right = dish.width;
        if (this.top < 0) this.top = 0;
        if (this.bottom > dish.height) this.bottom = dish.height;
    }
}