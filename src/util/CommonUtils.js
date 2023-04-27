import * as PIXI from 'pixi.js';

export const queryGraphics = (container, name) => {
    let res;
    container.children.forEach((child) => {
        if (child instanceof PIXI.Graphics) {
            if (child.name === name) {
                res = child;
            }
        }
    });
    return res;
}

export const querySprite = (container, name) => {
    let res;
    container.children.forEach((child) => {
        if (child instanceof PIXI.Sprite) {
            if (child.name === name) {
                res = child;
            }
        }
    });
    return res;
}