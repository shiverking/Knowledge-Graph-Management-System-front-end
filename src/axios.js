// 配置请求的根路径
import store from "./store";
import router from "./router";

// axios.defaults.baseURL="/api";
//axios 拦截器
//http request 拦截器
axios.interceptors.request.use(
    config =>{
        const token = window.localStorage.getItem('token')
        if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers['Authorization'] =token
        }
        return config;
    },
    err=> {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use((response) =>{
        return response
    },
    function(error){
        if (error) {
            store.commit('logout')
            router.replace('/login')
        }
        // 返回接口返回的错误信息
        return Promise.reject(error)
    })
