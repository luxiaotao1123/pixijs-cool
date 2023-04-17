import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/player',
        name: 'player',
        component: () => import('../components/Player.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: (to, from, savePosition) => {
        if (savePosition) {
            return savePosition;
        } else {
            return {
                top: 0
            }
        }
        // return new Promise((r) => {
        //     setTimeout(() => {
        //         r({
        //             top: 0
        //         })
        //     }, 1000)
        // })
    },
    routes
})

// 前置路由守卫
const whiteList = ['/', '/player']
router.beforeEach((to, from, next) => {
    if(whiteList.includes(to.path) || localStorage.getItem('token')) {
        next();
    } else {
        next('/');
    }
})

// 后置路由守卫
router.afterEach((to, from) => {

})

export default router;