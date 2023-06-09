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
        this.resetDragEvent();

        // callback
        if (callBack) {
            callBack(this);
        }
        return this;
    }

    resetDragEvent() {
        this.off('pointerup');
        this.off('pointerdown');
        this.on("pointerdown", this.onDragStart, this);
    }

    #lastPointerDownTime = 0;
    onDragStart(event) {
        let dblclick = false;
        const currentTime = Date.now();
        if (currentTime - this.#lastPointerDownTime < 300) {
            dblclick = true;
        }
        this.#lastPointerDownTime = currentTime;

        if (!dblclick) {
            this.alpha = 0.5;
            this.dragTarget = event.currentTarget;
            this.#container.parent.off('pointermove');
            this.#container.parent.on('pointermove', this.onDragMove, this);
    
            this.#container.parent.off('pointerup');
            this.#container.parent.on('pointerup', this.onDragEnd.bind(this));
        } else {
           this.dblclick(event);
        }
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

    dblclick(event) {
         console.log(PIXI.utils.uid());
    }

}

export default CoolSprite;