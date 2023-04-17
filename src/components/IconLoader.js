import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js'

class IconLoader {

    #basketContainer;

    constructor(basketContainer) {
        this.#basketContainer = basketContainer;
    }

    load() {
        PIXI.Assets.add('flowerTop', 'flowerTop.png');
        PIXI.Assets.add('eggHead', 'eggHead.png');

        const texturesPromise = PIXI.Assets.load(['flowerTop', 'eggHead']);

        texturesPromise.then((textures) => {
            // create a new Sprite from the resolved loaded Textures
        
            const flower = PIXI.Sprite.from(textures.flowerTop);
            flower.anchor.set(0.5);
            flower.scale.set(0.5);
            flower.x = this.#basketContainer.width * 0.25;
            flower.y = this.#basketContainer.height / 2;
            this.#basketContainer.addChild(flower);
        
            const egg = PIXI.Sprite.from(textures.eggHead);
            egg.anchor.set(0.5);
            egg.scale.set(0.5);
            egg.x = this.#basketContainer.width * 0.75;
            egg.y = this.#basketContainer.height / 2;
            this.#basketContainer.addChild(egg);
        });
    }

}

export default IconLoader;