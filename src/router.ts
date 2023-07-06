import { createRouter, createWebHashHistory, RouterOptions, Router, RouteRecordRaw } from 'vue-router'
import Register from "@/components/register.vue"
import Login from "@/components/login.vue"
import Room from "@/components/room.vue"
import OnlineList from "@/components/onlineList.vue"
import Index from "@/components/index.vue"

const routes: RouteRecordRaw[] = [
    { path: '/register', name: 'Register', component: Register },
    { path: '/login', name: 'Login', component: Login },
    { path: '/room', name: 'Room', component: Room, meta: { auth:true } },
    { path: '/online-list', name: 'OnlineList', component: OnlineList, meta: { auth:true } },
    {
        path: '',
        name: 'Index',
        component: Index,
    },
    { path: '/:pathMatch(.*)*',name: 'NotFound', component: Index },
    
   ]
   
   // RouterOptions是路由选项类型
   const options: RouterOptions = {
    history: createWebHashHistory(),
    routes,
   }
   
   // Router是路由对象类型
   const router: Router = createRouter(options)
   
   export default router