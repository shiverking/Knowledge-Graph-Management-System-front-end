import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import * as echarts from 'echarts'
import axios from "axios"
import qs from 'qs'
import '@/axios.js'
import contextmenu from 'v-directive-contextmenu'
Vue.use(contextmenu)

Vue.prototype.$echarts =echarts
Vue.prototype.$qs = qs
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  el:"#app",
  router,
  render: h => h(App),
}).$mount('#app')


