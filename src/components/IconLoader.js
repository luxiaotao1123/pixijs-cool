import * as PIXI from 'pixi.js';
import * as TWEEDLE from 'tweedle.js';
import axios from 'axios'

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
                for (let i = 0; i<list.length; i++) {
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

                        let backupCharacter = null;

                        character.on('pointerdown', (event) => {
                          backupCharacter = new PIXI.Sprite(texture);
                          backupCharacter.anchor.set(0.5);
                          backupCharacter.scale.set(0.2);
                          backupCharacter.x = character.x;
                          console.log(character.x);
                          console.log(backupCharacter.x);
                          backupCharacter.y = character.y;
                          this.#basketContainer.addChild(backupCharacter);
                          character.alpha = 0.5;
                        });
            
                        character.on('pointermove', (event) => {
                          if (backupCharacter) {
                            console.log(event.data.global.x);
                            backupCharacter.x = event.data.global.x;
                            backupCharacter.y = event.data.global.y;
                          }
                        });
            
                        character.on('pointerup', (event) => {
                          if (backupCharacter) {
                            this.#basketContainer.removeChild(backupCharacter);
                            backupCharacter = null;
                            character.alpha = 1;
                            if (this.#basketContainer.getBounds().contains(event.data.global.x, event.data.global.y)) {
                              this.#basketContainer.addChild(character);
                              character.x = event.data.global.x - this.#basketContainer.x;
                              character.y = event.data.global.y - this.#basketContainer.y;
                            } else {
                              character.x = x - offset;
                              character.y = y;
                            }
                          }
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

}

export default IconLoader;