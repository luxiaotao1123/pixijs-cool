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

    }

    async requestAsset() {
        return await axios.get("asset.json");
    }

}

export default IconLoader;