import { Dish } from "./Dish";
import { Player } from "./Player";
import { Replicator } from "./Replicator";

let dish = new Dish(),
    player = new Player({ dish: dish });

dish.germs = Replicator.generateGerms(500, { dish: dish });
dish.germs.push(player);

let run = () => {
    dish.run();
    dish.render();    

    requestAnimationFrame(run);
}

run();