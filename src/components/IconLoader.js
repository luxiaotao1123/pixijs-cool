import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js';
import axios from 'axios';

class IconLoader {

  #basketContainer;


  constructor(basketContainer) {
    this.#basketContainer = basketContainer;
  }

  load(offset) {
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
            character.x = x - offset;
            character.y = y;

            // action
            character.interactive = true;
            character.cursor = 'pointer';

            let draggingSprite;

            character.on('pointerdown', (event) => {
              // draggingSprite = new PIXI.Sprite(event.currentTarget.texture.clone());
              draggingSprite = event.currentTarget;
              draggingSprite.alpha = 0.5;
              draggingSprite.dragData = event.data;
              draggingSprite.dragging = true;
            });

            character.on('pointermove', (event) => {
              if (draggingSprite && draggingSprite.dragging) {
                const newPosition = draggingSprite.dragData.getLocalPosition(this.#basketContainer.parent);
                draggingSprite.x = newPosition.x;
                draggingSprite.y = newPosition.y;
              }
            });

            character.on('pointerup', (event) => {
              if (draggingSprite) {
                draggingSprite.alpha = 1;
                draggingSprite.dragging = false;
                draggingSprite = null;
              }
            });

            // .on('pointerupoutside', this.onDragEnd.bind(this))

            this.#basketContainer.addChild(character);
          });
        }
      }


    })

  }

  async requestAsset() {
    return await axios.get("asset.json");
  }


  createBackup(sprite) {
    const backupSprite = new PIXI.Sprite(sprite.texture.clone());
    backupSprite.anchor.set(0.5);
    backupSprite.scale.set(sprite.scale.x);
    backupSprite.x = sprite.x;
    backupSprite.y = sprite.y;
    this.#basketContainer.addChild(backupSprite);
  }

}

export default IconLoader;