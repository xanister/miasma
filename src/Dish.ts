import { Germ } from "./Germ";

export interface IDishOptions {
    color: string;
    elementSelector: string;
    layers: number;
}

export const dishDefaultOptions: IDishOptions = {
    color: "blue",
    elementSelector: "body",
    layers: 1
}

export class Dish {
    private canvasContext: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private el: Element;

    readonly options: IDishOptions;

    germs: Germ[] = [];
    keyboard: { [keyCode: number]: boolean } = {};

    get height() { return this.canvas.clientHeight; }
    get width() { return this.canvas.clientWidth; }

    constructor(options: IDishOptions = dishDefaultOptions) {
        this.options = options;

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

    clearCanvas(): void {
        this.canvasContext.fillStyle = this.options.color;
        this.canvasContext.fillRect(0, 0, this.width, this.height);
    }

    isKeydown(keycode: number | number[]): boolean {
        return typeof keycode === "number" ? 
            !!this.keyboard[keycode] :
            keycode.some(c => this.keyboard[c]);
    }

    render(): void {
        this.clearCanvas();

        this.germs.forEach(g => g.render(this.canvasContext));
    }

    run(): void {
        this.germs.forEach(g => g.run());
    }
}