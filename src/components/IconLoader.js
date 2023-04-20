import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js';
import axios from 'axios';

class IconLoader {

  #basketContainer;
  #draggingSprite;

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
            character
              .on('pointerdown', this.onDragStart.bind(this))
              .on('pointerup', this.onDragEnd.bind(this))
              .on('pointerupoutside', this.onDragEnd.bind(this))
              .on('pointermove', this.onDragMove.bind(this));

            this.#basketContainer.addChild(character);
          });
        }
      }


    })

  }

  async requestAsset() {
    return await axios.get("asset.json");
  }

  onDragStart(event) {
    this.#draggingSprite = event.currentTarget;
    this.#draggingSprite.alpha = 0.5;
    this.#draggingSprite.dragData = event.data;
    this.#draggingSprite.dragging = true;
  }

  onDragMove(event) {
    if (this.#draggingSprite && this.#draggingSprite.dragging) {
      const newPosition = this.#draggingSprite.dragData.getLocalPosition(this.#basketContainer.parent);
      this.#draggingSprite.x = newPosition.x;
      this.#draggingSprite.y = newPosition.y;
    }
  }

  onDragEnd(event) {
    if (this.#draggingSprite) {
      this.#draggingSprite.alpha = 1;
      this.#draggingSprite.dragging = false;
      this.#draggingSprite = null;
    }
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