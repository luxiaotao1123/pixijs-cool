import * as PIXI from 'pixi.js';

class CoolSprite extends PIXI.Sprite {

    #container;
    dragTarget;
    #basket;

    constructor(texture) {
        super(texture);
    }

    static from(imageUrl) {
        const texture = PIXI.Texture.from(imageUrl);
        return new this(texture);
    }

    setBasket(basket) {
        this.#basket = basket;
        return this;
    }

    preprocss(container, callBack) {
        this.#container = container;
        // property
        this.anchor.set(0.5);
        this.interactive = true;
        this.cursor = 'pointer';
        this.lastPosition = new PIXI.Point();
        this.#container.addChild(this);

        // event
        this.on("pointerdown", this.onDragStart, this);

        this.#container.parent.on('pointerup', this.onDragEnd.bind(this));
        this.#container.parent.on('pointerupoutside', this.onDragEnd.bind(this));

        // callback
        if (callBack) {
            callBack(this);
        }
        return this;
    }

    onDragStart(event) {
        this.alpha = 0.5;
        this.dragTarget = event.currentTarget;;
        this.#container.parent.on('pointermove', this.onDragMove, this);
    }

    onDragMove(event) {
        if (this.dragTarget) {
            this.dragTarget.parent.toLocal(event.global, null, this.dragTarget.position);
            if (this.#basket.isCollidingWithBasket(this.dragTarget)) {
                this.dragTarget.position.copyFrom(this.dragTarget.lastPosition);
            }
            this.dragTarget.lastPosition.copyFrom(this.dragTarget.position);
        }
    }

    onDragEnd() {
        if (this.dragTarget) {
            this.#container.parent.off('pointermove', this.onDragMove);
            this.dragTarget.alpha = 1;
            this.dragTarget = null;
        }
    }

    resetDragEvent() {
        this.on("pointerdown", this.onDragStart, this);

        this.#container.parent.on('pointerup', this.onDragEnd.bind(this));
        this.#container.parent.on('pointerupoutside', this.onDragEnd.bind(this));
    }

}

export default CoolSprite;