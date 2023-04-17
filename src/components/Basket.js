import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js'

class Basket {

    #container;
    #box;
    #offset;

    constructor(app, offset) {
        this.#container = new PIXI.Container({
        });
        app.stage.addChild(this.#container);
        this.#offset = offset;
    }

    init() {
        this.#box = new PIXI.Graphics();
        this.#box.beginFill(0xDE3249);
        this.#box.drawRect(-this.#offset, 0, this.#offset, window.innerHeight);
        this.#box.endFill();
        this.#container.addChild(this.#box);

        new TWEEDLE.Tween(this.#box).to({ x: this.#offset }, 1000)
            // .repeat(1)
            // .repeat(Infinity)
            .yoyo(true)
            .start();
    }

    isCollidingWithBasket(sprite) {
        const spriteBounds = sprite.getBounds();
        const basketBounds = this.#box.getBounds();
        return spriteBounds.x + spriteBounds.width > basketBounds.x &&
            spriteBounds.x < basketBounds.x + basketBounds.width &&
            spriteBounds.y + spriteBounds.height > basketBounds.y &&
            spriteBounds.y < basketBounds.y + basketBounds.height;
    }

}

export default Basket;