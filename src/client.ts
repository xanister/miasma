import { Dish } from "./Dish";
import { Player } from "./Player";
import { Replicator } from "./Replicator";

let conf = {
    layers: 20
};

let player = new Player({ maxLayer: conf.layers }),
    dish = new Dish({
        color: "blue",
        elementSelector: "body",
        layers: conf.layers,
        player: player
    });

Replicator.generateGerms(1500, { maxLayer: conf.layers }).forEach(g => dish.append(g));

(window as any).dish = dish;

let run = () => {
    dish.run();

    requestAnimationFrame(run);
}

requestAnimationFrame(run);