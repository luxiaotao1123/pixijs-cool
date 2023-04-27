import * as PIXI from 'pixi.js';
import CoolSprite from '../util/CoolSprite';
import { getAsset, getTools } from '../api/draw/index'
import { queryGraphics } from '../util/CommonUtils'
import * as Constant from '../util/Constant'
import CoolGpt from '../util/CoolGpt';
import { useStore } from '../store/index'

class IconLoader {

  #basketContainer;
  #mapContainer;
  #basket;
  store;

  constructor(basketContainer, mapContainer, basket) {
    this.#basketContainer = basketContainer;
    this.#mapContainer = mapContainer;
    this.#basket = basket;
    this.store = useStore();
  }

  load() {

    // CoolGpt.ask("hello chatgpt, can you tell me what your version?").then(res => {
    //   console.log(res);
    // });

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
            let y = row * unitLen + unitLen / 2 + 5;
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

    getTools().then(res => {
      let list = res.data.list;
      if (list?.length > 0) {
        for (let i = 0; i < list.length; i++) {
          // position
          let row = Math.floor(i / columnNum);
          let column = i % columnNum;
          let x = column * unitLen;
          let y = row * unitLen + hrHeight + 5;

          
          const item = list[i];
          let react = this.newReact(x, y, unitLen, item.name);
          this.#basketContainer.addChild(react);

          switch (item.name) {
            case "line":
              const offset = unitLen / 5;
              const line = new PIXI.Graphics();
              line.lineStyle(2, Constant.toolsColor);
              const d = 10;
              line.moveTo(x + offset / 2, y + offset / 2 + d);
              line.lineTo(x + unitLen - offset / 2, y + (unitLen - offset / 2 - d));
              this.#basketContainer.addChild(line);
              let that = this;
              this.reactPointerdown(react, () => that.store.lineMode, () => {
                that.store.negateLineMode();
              }); 
              break
            default:
              break
          }

        }
      }
    })
  }

  newReact(x, y, unitLen, name) {
    const offset = unitLen / 5;
    const bounds = {
      x: x + offset / 2,
      y: y + offset / 2,
      width: unitLen - offset,
      height: unitLen - offset,
      radius: 5
    }
    const react = new PIXI.Graphics();
    react.name = name;
    react.lineStyle(1, Constant.toolsColor);
    react.beginFill(Constant.baskBgColor);
    react.drawRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, bounds.radius);
    react.endFill();
    react.interactive = true;
    react.cursor = 'pointer';
    react.data = bounds;
    return react;
  }

  reactPointerdown(react, fn, fn0) {
    react.on("pointerdown", (event) => {
      const data = react.data;
      react.clear();
      react.lineStyle(1, Constant.toolsColor);
      if (fn()) {
        react.beginFill(Constant.baskBgColor);
        react.drawRoundedRect(data.x, data.y, data.width, data.height, data.radius);
        fn0();
      } else {
        react.beginFill(0x636e72);
        react.drawRoundedRect(data.x, data.y, data.width, data.height, 0);
        fn0();
      }
      react.endFill();
    }, this);
  }

  isCollidingWithBasket(sprite) {
    const spriteBounds = sprite.getBounds();
    const basketBounds = this.#basketContainer.getBounds();
    return spriteBounds.x < basketBounds.x + basketBounds.width;
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

}

export default IconLoader;