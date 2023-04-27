import { createPinia, PiniaPluginContext, defineStore } from 'pinia';
import { toRaw } from 'vue';
import { Names } from './store-name'

// 注册pinia实例
export default createPinia();

// pinia状态缓存
const __piniaKey__ = "pixijs";
type Options = {
    key?:string
}
const setStorage = (key:string, val:any) => {
    localStorage.setItem(key, JSON.stringify(val));
}
const getStorage = (key:string) => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {}
}
export const piniaPlugin = (options:Options) => {
    return (context: PiniaPluginContext) => {
        const { store } = context;
        const data = getStorage(`${options?.key ?? __piniaKey__} - ${store.$id}`)
        store.$subscribe(()=> {
            setStorage(`${options?.key ?? __piniaKey__} - ${store.$id}`, toRaw(store.$state));
        })
        return {
            ...data
        }
    }
}

// store -------
export const useStore = defineStore(Names.TEST, {
    state: () => {
        return {
            baseUrl: "",
            lineMode: false
        }
    },
    // 相当于 computed, 修饰一些值
    getters: {
        newBaseUrl():string {
            return this.baseUrl + "/new"
        },
        otherVal():string {
            return `${this.newBaseUrl}/other`
        }
    },
    // 相当于 method，可以做同步、异步都可以做，提交 state
    actions: {
        modifyUrl(val:string) {
            this.baseUrl = val;
        },
    }
})

