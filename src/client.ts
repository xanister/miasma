import { Dish } from "./Dish";
import { Player } from "./Player";
import { Replicator } from "./Replicator";

let conf = {
    layers: 11,
    germOptions: {
        defaultColor: "yellow",
        maxLayer: 10,
        minRadius: 10,
        maxRadius: window.innerHeight / 2,
        maxSpeed: 16
    },
    playerOptions: {
        defaultColor: "white",
        maxLayer: 10,
        minRadius: 30,
        maxRadius: window.innerHeight / 4,
        maxSpeed: 12
    }
};

let player = new Player(conf.playerOptions),
    dish = new Dish({
        color: "black",
        elementSelector: "body",
        layers: conf.layers,
        player: player
    });

Replicator
    .generateGerms(5 * conf.layers, conf.germOptions)
    .forEach(g => dish.append(g));

// Prerun to randomize a bit
for (let i = 0; i < 5000; i++) dish.run();

// let tick = 0;
let run = () => {
    // if (tick++ % 2) dish.run();
    dish.run();
    dish.render();

    requestAnimationFrame(run);
}
requestAnimationFrame(run);