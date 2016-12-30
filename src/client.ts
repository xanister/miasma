import { Dish } from "./Dish";
import { Player } from "./Player";
import { Replicator } from "./Replicator";

let conf = {
    layers: 4,
    germOptions: {
        maxLayer: 4,
        minRadius: 10,
        maxRadius: window.innerHeight / 2,
        maxSpeed: 16,
        spawnX: window.innerWidth * 2,
        spawnY: window.innerHeight
    },
    playerOptions: {
        maxLayer: 4,
        minRadius: 10,
        maxRadius: window.innerHeight / 4,
        maxSpeed: 6,
        spawnX: 100,
        spawnY: window.innerHeight / 2
    }
};

let player = new Player(conf.playerOptions),
    dish = new Dish({
        color: "blue",
        elementSelector: "body",
        layers: conf.layers,
        player: player
    });

Replicator
    .generateGerms(750, conf.germOptions)
    .forEach(g => dish.append(g));

// let tick = 0;
let run = () => {
    // if (tick++ % 2) 
    dish.run();

    requestAnimationFrame(run);
}
requestAnimationFrame(run);