import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js'

class Basket {

    #container;
    #box;

    constructor(app) {
        this.#container = new PIXI.Container({
        });
        // this.#container.width = 300;
        // this.#container.height = window.innerHeight;
        // this.#container.position.set(0, 0);
        app.stage.addChild(this.#container);
    }

    init() {
        this.#box = new PIXI.Graphics();
        this.#box.beginFill(0xDE3249);
        this.#box.drawRect(0, 0, 300, window.innerHeight);
        this.#box.endFill();
        this.#container.addChild(this.#box);

        new TWEEDLE.Tween(this.#box).to({ x: 500 }, 2000)
            .repeat(Infinity)
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