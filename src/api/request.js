//对axios进行二次封装
import axios from 'axios';
//引入进度条
import nprogress from 'nprogress';
//start 进度条开始 
//done 进度条结束
//引入进度条的样式
import "nprogress/nprogress.css";
//引入store
import store from '@/store';

//利用axios对象的create方法下创建一个axios实例
const requests = axios.create({
    //配置对象
    //基础路径：在请求路径上自动带上/api
    // baseURL:"/api",
    //代表请求超时时间5s
    timeout:5000,
});

//请求拦截器
//在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情 interceptors就是拦截器
requests.interceptors.request.use((config)=>{
    //进度条开始
    nprogress.start();
    //config是配置对象，对象里面有一个属性很重要就是headers请求头 也就是config中包含headers
    // console.log(store.state.shopcart.uuid_token);
    // 将uuid游客身份放入请求头
    if(store.state.shopcart.uuid_token){
        //如果有 在请求头添加一个字段（不能改）
        config.headers.userTempId = store.state.shopcart.uuid_token;
    }
    //携带token带给服务器
    if(store.state.user.token){
        //如果有 在请求头添加一个字段（不能改）
        config.headers.token = store.state.user.token;
    }
    return config;
});
//响应拦截器
requests.interceptors.response.use((res)=>{
    //成功的回调函数：服务器响应数据回来之后，响应拦截器可以检测到，可以做一些事情
    //进度条结束
    nprogress.done();
    return res.data;
},(error)=>{
    //响应失败的回调函数
    return Promise.reject(new Error('faile'));
})

//对外暴露
//这里对外暴露的不是axios 而是二次封装之后的requests
export default requests;