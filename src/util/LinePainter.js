import * as PIXI from 'pixi.js';
import { watch } from 'vue';
import { useStore } from '../store/index';

class LinePainter {

    #mapContainer;
    #lineContainer;

    #lineStyle;
    #defaultColor = 0x2d3436;
    #defaultLineWidth = 2;

    #startPoint;
    #endPoint;

    constructor(app, mapContainer) {
        this.#mapContainer = mapContainer;
        this.#lineContainer = new PIXI.Container();
        app.stage.addChild(this.#lineContainer);

        this.#lineStyle = new PIXI.Graphics();
        this.#lineStyle.lineStyle(this.#defaultLineWidth, this.#defaultColor);

        app.ticker.add(() => {
            this.#lineContainer.removeChildren();

            if (this.#startPoint && this.#endPoint) {
                this.#lineStyle.clear();
                this.#lineStyle.lineStyle(this.#defaultLineWidth, this.#defaultColor);
                this.#lineStyle.moveTo(this.#startPoint.x, this.#startPoint.y);
                this.#lineStyle.lineTo(this.#endPoint.x, this.#endPoint.y);
                this.#lineStyle.alpha = .5;
                this.#lineContainer.addChild(this.#lineStyle);
            }
        });

        watch(() => useStore().lineMode, (newVal, oldVal) => {
            if (newVal) {
                this.draw(this.#mapContainer);
            }
          }, {
            deep: true
          })
          
    }

    draw(container) {
        console.log("====>>");
        container.children.forEach(sprite => {
            if (sprite instanceof PIXI.Sprite) {
                sprite.off('pointerdown');
                sprite.on('pointerdown', () => {
                    if (!this.#startPoint) {
                        this.#startPoint = sprite.position;
                    }

                    this.#lineContainer.parent.off('pointermove');
                    this.#lineContainer.parent.on('pointermove', (event) => {
                        this.#endPoint = event.global;
                    }, this);
            
                    this.#lineContainer.parent.off('pointerup');
                    this.#lineContainer.parent.on('pointerup', (event) => {
                        this.#startPoint = null;
                        this.#endPoint = null;

                        this.#lineStyle.alpha = 1;
                        container.addChild(this.#lineStyle)
                    }, this);

                });
            }
        });

    }

}

export default LinePainter;