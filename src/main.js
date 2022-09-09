import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import echarts from 'echarts'
import axios from "axios";
Vue.prototype.$echarts =echarts
Vue.config.productionTip = false

// 配置请求的根路径
axios.defaults.baseURL="/api"
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
