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


export const deepClone = (obj) => {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepClone(obj[key]);
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}
/**
 * 函数节流
 * @param {*} fn 
 * @param {*} interval 
 */
export const throttle = (fn, interval = 300) => {
    let canRun = true;
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, interval);
    };
}
/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export const debounce = (fn, t) => {
    let delay = t || 500;
    let timer;
    console.log(fn)
    console.log(typeof fn)
    return function () {
        let args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    }
};

/**
 * 数字转整数 如 100000 转为10万
 * @param {需要转化的数} num 
 * @param {需要保留的小数位数} point 
 */
export const tranNumber = (num, point) => {
    let numStr = num.toString()
    // 十万以内直接返回 
    if (numStr.length < 6) {
        return numStr;
    }
    //大于8位数是亿
    else if (numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
    }
    //大于6位数是十万 (以10W分割 10W以下全部显示)
    else if (numStr.length > 5) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
    }
}