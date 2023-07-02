import { createRouter, createWebHashHistory, RouterOptions, Router, RouteRecordRaw } from 'vue-router'
import Register from "@/components/register.vue"
import Login from "@/components/login.vue"
import AfterLogin from "@/pages/afterLogin.vue"
import Room from "@/components/room.vue"
import OnlineList from "@/components/onlineList.vue"

const routes: RouteRecordRaw[] = [
    { path: '/register', name: 'Register', component: Register },
    { path: '/login', name: 'Login', component: Login },
    {
        path: '/',
        name: 'AfterLogin',
        component: AfterLogin,
        children:
        [
            { path: 'room', name: 'Room', component: Room },
            { path: 'online-list', name: 'OnlineList', component: OnlineList }
        ]
    }
    
   ]
   
   // RouterOptions是路由选项类型
   const options: RouterOptions = {
    history: createWebHashHistory(),
    routes,
   }
   
   // Router是路由对象类型
   const router: Router = createRouter(options)
   
   export default router