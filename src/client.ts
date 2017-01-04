import { Dish } from "./Dish";
import { Player } from "./Player";
import { Replicator } from "./Replicator";

let conf = {
    germsPerLayer: 5,
    layers: 5
}, germOptions = {
    defaultColor: "yellow",
    maxLayer: conf.layers - 1,
    minRadius: 5,
    maxRadius: window.innerHeight,
    maxSpeed: 16
}, playerOptions = {
    defaultColor: "white",
    maxLayer: conf.layers - 1,
    minRadius: 40,
    maxRadius: window.innerHeight / 4,
    maxSpeed: 12
}, player = new Player(playerOptions),
    dish = new Dish({
        color: "black",
        elementSelector: "body",
        layers: conf.layers,
        player: player
    });

Replicator
    .generateGerms(conf.germsPerLayer * conf.layers, germOptions)
    .forEach(g => dish.append(g));

// Prerun to randomize a bit
// for (let i = 0; i < 5000; i++) dish.run();

// let tick = 0;
let run = () => {
    // if (tick++ % 2) dish.run();
    dish.run();
    dish.render();

    requestAnimationFrame(run);
}
requestAnimationFrame(run);