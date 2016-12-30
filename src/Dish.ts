import { Germ } from "./Germ";
import { Player } from "./Player";

export interface IDishOptions {
    color?: string;
    elementSelector: string;
    layers: number;
    player: Player;
}

export class Dish {
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private el: Element;
    private germs: Germ[][];

    readonly options: IDishOptions;

    keyboard: { [keyCode: number]: boolean } = {};

    constructor(options: IDishOptions) {
        this.options = options;

        this.germs = [];
        for (let i = 0; i < this.options.layers; i++)
            this.germs.push([]);

        this.append(this.options.player);

        this.setupCanvas();
        this.bindEvents();
    }

    private bindEvents(): void {
        window.addEventListener("keydown", this.handleKeydown.bind(this));
        window.addEventListener("keyup", this.handleKeyup.bind(this));
        window.addEventListener("resize", this.handleResize.bind(this));
    }

    private handleKeydown(event: KeyboardEvent): void {
        this.keyboard[event.keyCode] = true;
    }

    private handleKeyup(event: KeyboardEvent): void {
        this.keyboard[event.keyCode] = false;
    }

    private handleResize(event?: Event): void {
        this.canvas.width = this.el.clientWidth;
        this.canvas.height = this.el.clientHeight;
    }

    private setupCanvas(): void {
        this.el = document.querySelector(this.options.elementSelector);
        this.canvas = document.createElement("canvas");
        this.el.appendChild(this.canvas);
        this.canvas.width = this.el.clientWidth;
        this.canvas.height = this.el.clientHeight;
        this.canvasContext = this.canvas.getContext('2d');
    }

    get height() { return this.canvas.clientHeight; }
    get width() { return this.canvas.clientWidth; }

    append(germ: Germ): void {
        console.log(germ.z);
        this.germs[germ.z].push(germ);
    }

    clearCanvas(): void {
        this.canvasContext.fillStyle = this.options.color || "white";
        this.canvasContext.fillRect(0, 0, this.width, this.height);
    }

    handleCollision(g1: Germ, g2: Germ): void {
        if (g1.radius > g2.radius || (g1.radius === g2.radius && g1 === this.options.player)) {
            g1.radius += 1;
            g2.radius -= 1;
            if (g2.radius <= 0) g2.reset();
        } else {
            g1.radius -= 1;
            g2.radius += 1;
            if (g1.radius <= 0) g1.reset();
        }
    }

    isKeydown(key: number | number[] | string): boolean {
        switch(typeof key) {
            case "number": return !!this.keyboard[key as number];
            // case "string": return true;
            default: return (key as number[]).some(c => this.keyboard[c]);
        }   
    }

    run(): void {
        this.clearCanvas();

        this.germs
            .forEach((layer, layerIndex) => layer.forEach(g => {
                // Handle collisions
                layer.forEach(g2 => { if (g.collides(g2)) this.handleCollision(g, g2); });

                // Run the germ
                g.run(this);

                // Handle layer changes
                if (g.z !== layerIndex) {
                    layer.splice(layer.indexOf(g), 1);
                    this.append(g);
                }

                // Render the germ
                g.render(
                    this.canvasContext, 
                    this.options.player.z / g.z, 
                    g.z === this.options.player.z ? 1 : 0.2
                );
            }));

        this.canvasContext.font = "20px Arial";
        this.canvasContext.fillText(`${this.options.player.z.toString()}`, 20, 20);            
    }

    size(): number {
        let c = 0;
        this.germs.forEach(layer => c += layer.length);
        return c;
    }
}