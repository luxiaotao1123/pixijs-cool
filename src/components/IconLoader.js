import * as PIXI from 'pixi.js';
import CoolSprite from '../util/CoolSprite';
import { getAsset, getTools } from '../api/draw/index'

class IconLoader {

  #basketContainer;
  #mapContainer;
  #basket;

  constructor(basketContainer, mapContainer, basket) {
    this.#basketContainer = basketContainer;
    this.#mapContainer = mapContainer;
    this.#basket = basket;
  }

  load() {
    let containerWidth = this.#basketContainer.width;
    let containerHeight = this.#basketContainer.height;
    let columnNum = Math.floor(6);
    let unitLen = containerWidth / columnNum;

    getAsset().then(res => {
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
              draggingSprite = new CoolSprite(event.currentTarget.texture.clone()).setBasket(this.#basket);
              draggingSprite.preprocss(this.#mapContainer, function (sprite) {
                sprite.scale.set(originSprite.scale.x);

                sprite.dragData = event.data;
                sprite.dragging = true;
                sprite.x = originSprite.x;
                sprite.y = originSprite.y;
              });

              this.#basketContainer.parent.addChild(draggingSprite);

              this.#basketContainer.parent.on('pointermove', (event) => {
                if (draggingSprite && draggingSprite.dragging) {
                  draggingSprite.parent.toLocal(event.global, null, draggingSprite.position);
                }
              });

              draggingSprite.on('pointerup', (event) => {
                this.#basketContainer.parent.off('pointermove');
                if (originSprite) {
                  originSprite.alpha = 1;
                  originSprite = null;
                }
                if (draggingSprite) {
                  this.#basketContainer.parent.removeChild(draggingSprite);
                  if (!this.isCollidingWithBasket(draggingSprite)) {
                    this.#mapContainer.addChild(draggingSprite);
                    draggingSprite.resetDragEvent();
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

    const hrHeight = this.buildHrLine(containerWidth, containerHeight);

    this.newReact(0, hrHeight)

    getTools().then(res => {
      let list = res.data.list;
      if (list?.length > 0) {
        for (let i = 0; i < list.length; i++) {
          console.log(list[i].name);
        }
      }
    })
  }

  buildHrLine(baskWidth, baskHeight) {
    const hrHeight = baskHeight / 3
    const hrLine = new PIXI.Graphics();
    hrLine.lineStyle(1, 0x7f8fa6);
    hrLine.moveTo(0, hrHeight);
    hrLine.lineTo(baskWidth, hrHeight);
    hrLine.alpha = .8;
    hrLine.interactive = true;
    hrLine.cursor = 'pointer';
    this.#basketContainer.addChild(hrLine);
    return hrHeight;
  }

  newReact(x, y) {
    let fillColor;
    this.#basketContainer.children.forEach((child) => {
      if (child instanceof PIXI.Graphics) {
        if (child.name === "bg") {
          fillColor = child.fill.color;
        }
      }
    });
    console.log(PIXI.utils.hex2string(fillColor));
    const square = new PIXI.Graphics();
    square.lineStyle(2, 0xffffff);
    square.beginFill(fillColor);
    square.drawRoundedRect(x, y, 50, 50, 5); // 绘制矩形
    square.endFill();
    square.interactive = true;
    square.cursor = 'pointer';
    this.#basketContainer.addChild(square);

    const line = new PIXI.Graphics();
    line.lineStyle(2, 0xffffff); // 设置线条样式
    line.moveTo(x, y + 10); // 设置起点
    line.lineTo(x + 50, y + 40); // 绘制斜线
    this.#basketContainer.addChild(line);


  }

  isCollidingWithBasket(sprite) {
    const spriteBounds = sprite.getBounds();
    const basketBounds = this.#basketContainer.getBounds();
    return spriteBounds.x < basketBounds.x + basketBounds.width;
  }

}

export default IconLoader;