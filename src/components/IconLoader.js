import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js';
import axios from 'axios';
import CoolSprite from '../util/CoolSprite';

class IconLoader {

  #basketContainer;
  #mapContainer;

  constructor(basketContainer, mapContainer) {
    this.#basketContainer = basketContainer;
    this.#mapContainer = mapContainer;
  }

  load() {
    let containerWidth = this.#basketContainer.width;
    let containerHeight = this.#basketContainer.height;
    let columnNum = Math.floor(6);
    let unitLen = containerWidth / columnNum;

    this.requestAsset().then(res => {
      let list = res.data.list;
      if (list?.length > 0) {
        for (let item of list) {
          PIXI.Assets.add(item.name, item.src);
        }
        const texturesPromise = PIXI.Assets.backgroundLoad(list.map(e => {
          return e.name;
        }));
        for (let i = 0; i < list.length; i++) {
          PIXI.Assets.load(list[i].name).then((texture) => {
            const character = new PIXI.Sprite(texture);
            character.anchor.set(0.5);
            character.scale.set(0.2);

            // position
            let row = Math.floor(i / columnNum);
            let column = i % columnNum;
            let x = column * unitLen + unitLen / 2;
            let y = row * unitLen + unitLen / 2;
            character.x = x;
            character.y = y;

            // action
            character.interactive = true;
            character.cursor = 'pointer';

            let originSprite;
            let draggingSprite;

            character.on('pointerdown', (event) => {
              originSprite = event.currentTarget;
              originSprite.alpha = 0.5;

              // clone
              draggingSprite = new CoolSprite(event.currentTarget.texture.clone());
              draggingSprite.preprocss(this.#mapContainer, function(sprite) {

              });
              draggingSprite.scale.set(originSprite.scale.x);

              draggingSprite.dragData = event.data;
              draggingSprite.dragging = true;
              draggingSprite.x = originSprite.x;
              draggingSprite.y = originSprite.y;
              this.#basketContainer.parent.addChild(draggingSprite);

              this.#basketContainer.parent.on('pointermove', (event) => {
                if (draggingSprite && draggingSprite.dragging) {
                  draggingSprite.parent.toLocal(event.global, null, draggingSprite.position);
                }
              });

              draggingSprite.on('pointerup', (event) => {
                if (originSprite) {
                  originSprite.alpha = 1;
                  originSprite = null;
                }
                if (draggingSprite) {
                  if (this.isCollidingWithBasket(draggingSprite)) {
                    this.#basketContainer.parent.removeChild(draggingSprite);
                  }
                  draggingSprite.dragging = false;
                  draggingSprite = null;
                }
              });
            });

            this.#basketContainer.addChild(character);
          });
        }
      }

    })
  }

  async requestAsset() {
    return await axios.get("asset.json");
  }

  isCollidingWithBasket(sprite) {
    const spriteBounds = sprite.getBounds();
    const basketBounds = this.#basketContainer.getBounds();
    return spriteBounds.x < basketBounds.x + basketBounds.width;
  }

}

export default IconLoader;