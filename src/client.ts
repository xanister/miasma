import { Dish } from "./Dish";
import { Player } from "./Player";
import { Replicator } from "./Replicator";

let player = new Player(),
    dish = new Dish({
        color: "blue",
        elementSelector: "body",
        layers: 100,
        player: player
    });

Replicator.generateGerms(1500).forEach(g => dish.append(g));

(window as any).dish = dish;

let run = () => {
    dish.run();

    requestAnimationFrame(run);
}

requestAnimationFrame(run);