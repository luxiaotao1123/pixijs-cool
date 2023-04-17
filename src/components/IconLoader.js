import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js';
import axios from 'axios'

class IconLoader {

    #basketContainer;

    constructor(basketContainer) {
        this.#basketContainer = basketContainer;
    }

    load() {

        this.requestAsset().then(res => {
            for (let item of res.data.list) {
                PIXI.Assets.add(item.name, item.src);
            }
            const texturesPromise = PIXI.Assets.backgroundLoad(res.data.list.map(e => {
                return e.name;
            }));
            for (let item of res.data.list) {
                PIXI.Assets.load(item.name).then((texture) => {
                    const character = new PIXI.Sprite(texture);
                    character.anchor.set(0.5);
                    character.scale.set(0.5);
                    character.x = this.#basketContainer.width / 2;
                    character.y = this.#basketContainer.height / 2;
                    character.interactive = true;
                    character.cursor = 'pointer';
                    this.#basketContainer.addChild(character);
                });
            }

        })

        // PIXI.Assets.add('flowerTop', 'flowerTop.png');
        // PIXI.Assets.add('eggHead', 'eggHead.png');

        // const texturesPromise = PIXI.Assets.load(['flowerTop', 'eggHead']);

        // texturesPromise.then((textures) => {
        //     // create a new Sprite from the resolved loaded Textures

        //     const flower = PIXI.Sprite.from(textures.flowerTop);
        //     flower.anchor.set(0.5);
        //     flower.scale.set(0.5);
        //     flower.x = this.#basketContainer.width * 0.25;
        //     flower.y = this.#basketContainer.height / 2;
        //     this.#basketContainer.addChild(flower);

        //     const egg = PIXI.Sprite.from(textures.eggHead);
        //     egg.anchor.set(0.5);
        //     egg.scale.set(0.5);
        //     egg.x = this.#basketContainer.width * 0.75;
        //     egg.y = this.#basketContainer.height / 2;
        //     this.#basketContainer.addChild(egg);
        // });


        // const texturesPromise = PIXI.Assets.backgroundLoad(['flowerTop', 'eggHead']);
        // PIXI.Assets.load('eggHead').then((texture) => {
        //     // create a new Sprite from the resolved loaded texture
        //     const character = new PIXI.Sprite(texture);
        //     character.anchor.set(0.5);
        //     character.scale.set(0.5);
        //     character.x = this.#basketContainer.width / 2;
        //     character.y = this.#basketContainer.height / 2;
        //     character.interactive = true;
        //     character.cursor = 'pointer';
        //     this.#basketContainer.addChild(character);
        // });
    }

    async requestAsset() {
        return await axios.get("asset.json");
    }

}

export default IconLoader;