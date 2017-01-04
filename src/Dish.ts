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

    keyboard: { [key: string]: boolean } = {};
    keyboardCodes: { [keyCode: number]: boolean } = {};

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
        this.keyboard[event.key] = true;
        this.keyboardCodes[event.keyCode] = true;
    }

    private handleKeyup(event: KeyboardEvent): void {
        this.keyboard[event.key] = false;
        this.keyboardCodes[event.keyCode] = false;
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
        this.germs[germ.z].push(germ);
    }

    clearCanvas(): void {
        this.canvasContext.fillStyle = this.options.color || "white";
        this.canvasContext.fillRect(0, 0, this.width, this.height);
    }

    getGermScale(germ: Germ): number {
        return (this.options.player.z + 1) / (germ.z + 1);
    }

    handleCollision(g1: Germ, g2: Germ): void {
        // TODO: ADD TO OPTIONS
        if (g1.radius > g2.radius || (g1.radius === g2.radius && g1 === this.options.player)) {
            g1.radius += 1;
            g2.radius -= 1;
            if (g2.radius <= 0) g2.reset(this);
        }
        //  else {
        //     g1.radius -= 1;
        //     g2.radius += 1;
        //     if (g1.radius <= 0) g1.reset(this);
        // }
    }

    isGermVisible(germ: Germ, scale: number): boolean {
        return germ === this.options.player || (
            (germ.x - germ.radius) * scale < this.width &&
            (germ.x + germ.radius) * scale > 0 &&
            (germ.y - germ.radius) * scale < this.height &&
            (germ.y + germ.radius) * scale > 0);
    }

    isKeydown(key: number | string | string[]): boolean {
        // TODO: HANDLE STRING ARRAY
        switch (typeof key) {
            case "number": return !!this.keyboardCodes[key as number];
            case "string": return !!this.keyboard[key as string];
            default: return (key as string[]).some(c => this.keyboard[c]);
        }
    }

    render(): void {
        // Clear the canvas
        this.clearCanvas();

        // Render germs
        this.germs
            .forEach((layer, layerIndex) => layer.forEach(g => {
                // Scale by z-distance to player and don't render offscreen
                const scale = this.getGermScale(g),
                    visible = this.isGermVisible(g, scale);

                // Render the germ
                if (visible) g.render(this.canvasContext, scale, scale === 1 ? 1 : scale * 0.2);
            }));

        // Render UI
        this.canvasContext.font = "20px Arial";
        this.canvasContext.fillStyle = "red";
        this.canvasContext.fillText(`${this.options.player.z.toString()}`, 20, 40);
    }

    run(): void {
        // Update germs
        this.germs
            .forEach((layer, layerIndex) => layer.forEach(g => {
                // Scale by z-distance
                const scale = this.getGermScale(g);

                // Update position
                g.x += g.xSpeed;
                g.y += g.ySpeed;

                // Handle collisions
                if (g.radius <= g.options.maxRadius)
                    layer.forEach(g2 => g.collides(g2) && this.handleCollision(g, g2));

                // Reset when offscreen
                if (this.shouldGermReset(g, scale)) g.reset(this, scale);

                // Handle layer changes
                if (g.z !== layerIndex) {
                    layer.splice(layer.indexOf(g), 1);
                    this.germs[g.z].push(g);
                }

                // Run the germ
                g.run(this);
            }));
    }

    shouldGermReset(germ: Germ, scale: number): boolean {
        // TODO: VERIFY SCALING LOGIC
        return germ.radius * scale <= 5 ||                                                  // Too small
            (germ.x * scale) + (germ.radius * scale) < 0 ||                                 // Right edge left of screen
            ((germ.y * scale) + (germ.radius * scale) < 0 && germ.ySpeed <= 0) ||           // Bottom edge above top of screen and ySpeed < 0
            ((germ.y * scale) - (germ.radius * scale) > this.height && germ.ySpeed >= 0);   // Top edge below bottom of screen and ySpeed > 0
    }

    size(): number {
        let c = 0;
        this.germs.forEach(layer => c += layer.length);
        return c;
    }
}