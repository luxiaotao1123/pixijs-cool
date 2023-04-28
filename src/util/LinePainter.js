import * as PIXI from 'pixi.js';
import { watch } from 'vue';
import { useStore } from '../store/index';

class LinePainter {

    #mapContainer;
    #lineContainer;

    #line;
    #defaultLineWidth = 2;
    #defaultColor = 0x2d3436;

    #startPoint;
    #endPoint;

    #currSprite;

    constructor(app, mapContainer) {
        this.#mapContainer = mapContainer;
        this.#lineContainer = new PIXI.Container();
        this.#lineContainer.name = "lineContainer";
        app.stage.addChild(this.#lineContainer);

        app.ticker.add(() => {
            this.#lineContainer.removeChildren();

            if (this.#line && this.#startPoint && this.#endPoint) {
                this.newLine(this.#endPoint.x, this.#endPoint.y)
            }
        });

        watch(() => useStore().lineMode, (newVal, oldVal) => {
            if (newVal) {
                this.draw(this.#mapContainer);
            } else {
                this.cancelDraw(this.#mapContainer);
            }
        }, {
            deep: true
        })

    }

    draw(container) {
        container.children.forEach(sprite => {
            if (sprite instanceof PIXI.Sprite) {
                sprite.alpha = .7;
                sprite.off('pointerdown');
                sprite.on('pointerdown', () => {
                    this.#currSprite = sprite;
                    this.#line = new PIXI.Graphics();

                    if (!this.#startPoint) {
                        this.#startPoint = sprite.position;
                    }

                    this.#lineContainer.parent.off('pointermove');
                    this.#lineContainer.parent.on('pointermove', (event) => {
                        this.#endPoint = event.global;
                    }, this);

                    this.#lineContainer.parent.off('pointerup');
                    this.#lineContainer.parent.on('pointerup', (event) => {
                        this.#lineContainer.parent.off('pointermove');
                        if (this.#line && this.#startPoint && this.#endPoint) {
                            container.children.forEach((child) => {
                                if (child.containsPoint(this.#endPoint)) {
                                    if (child !== this.#currSprite) {
                                        this.newLine(child.position.x, child.position.y);
                                        this.#line.alpha = 1;
                                        container.addChild(this.#line);
                                    }
                                }
                            });
                        }

                        this.#startPoint = null;
                        this.#endPoint = null;
                        this.#currSprite = null;
                    }, this);

                });
            }
        });

    }

    cancelDraw(container) {
        container.children.forEach(sprite => {
            if (sprite instanceof PIXI.Sprite) {
                sprite.alpha = 1;
                sprite.resetDragEvent();
            }
        });
    }

    newLine(x, y) {
        this.#line.clear();
        this.#line.lineStyle(this.#defaultLineWidth, this.#defaultColor);
        this.#line.moveTo(this.#startPoint.x, this.#startPoint.y);
        this.#line.lineTo(x, y);
        this.#line.alpha = .5;
        this.#lineContainer.addChild(this.#line);
    }

}

export default LinePainter;