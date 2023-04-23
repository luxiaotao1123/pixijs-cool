import * as PIXI from 'pixi.js';

class CoolSprite extends PIXI.Sprite {

    constructor(texture) {
        super(texture);
    }

    static from(imageUrl) {
        const texture = PIXI.Texture.from(imageUrl);
        return new this(texture);
    }

    preprocss(container, callBack) {
        this.anchor.set(0.5);
        this.interactive = true;
        this.cursor = 'pointer';
        this.lastPosition = new PIXI.Point();

        container.addChild(this);

        if (callBack) {
            callBack(this);
        }
        return this;
    }

}

export default CoolSprite;