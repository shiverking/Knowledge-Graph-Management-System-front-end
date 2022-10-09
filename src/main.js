import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import echarts from 'echarts'
import axios from "axios"
import qs from 'qs'
import '@/axios.js'

Vue.prototype.$echarts =echarts
Vue.prototype.$qs = qs
Vue.prototype.$http = axios
Vue.config.productionTip = false

//设置token过期时间，单位是ms 两小时过期
let time=2*60*1000
router.beforeEach((to, from, next) => {
    let token = window.localStorage.getItem('token')
    //不去登录页且没有token
    if(to.path!='/login' && !token){
        next({path: '/login'})
    } else {
        //去登录页且有token，转向主页
        if(to.path == '/login' && token){
                let newtime = new Date().getTime()
                //当前的时间-存储时的时间=存储了多长时间，如果大于就是超时，小于就不超时
                if (newtime - token.time > time) {
                    //大于就删除本次存储
                    localStorage.removeItem('token')
                    //让他返会首页（登录页）
                    next('/login')
                }
                else{
                    next('/')
                }
        }else{
            //不去登录页有token
            if (token) {
                //获取当前时间
                let newtime = new Date().getTime()
                //当前的时间-存储时的时间=存储了多长时间，如果大于就是超时，小于就不超时
                if (newtime - token.time > time) {
                    //大于就删除本次存储
                    localStorage.removeItem('token')
                    //让他返会首页（登录页）
                    next('/login')
                } else {
                    next()
                }
            }
            //去登录页且没有token
            else{
                next()
            }
        }
    }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
