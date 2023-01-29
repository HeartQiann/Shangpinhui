// 登录与注册的小仓库
import {reqGetCode, reqUserRegister,reqUserLogin,reqUserMessage,reqLogout} from '@/api';
import {setToken,getToken,removeToken} from '@/utils/token';
const state = {
    code:"",
    // token:localStorage.getItem('TOKEN'),           //每个用户的标识符
    token:getToken(),       //每个用户的标识符 从本地存储中获取 函数有返回值，记得加小括号！！！
    usermessage:{},     //每个用户的信息
};
const mutations = {
    //获取验证码
    GETCODE(state,code){
        state.code = code
    },
    USERLOGIN(state,token){
        state.token = token;
    },
    USERMESSAGE(state,usermessage){
        state.usermessage = usermessage;
    },
    //退出登录 清除数据
    USERLOGOUT(state){
        state.token = "";
        state.usermessage = {};
        // 本地存储也要清除
        removeToken();
    }
};
const actions = {
    //获取验证码
    async getCode({commit},phone){
        let result = await reqGetCode(phone);
        // console.log(result);
        if(result.code==200){
            //请求成功，获取验证码
            commit('GETCODE',result.data);
        }
    },
    //用户注册
    async userRegister({commit},user){
        let result = await reqUserRegister(user);
        if(result.code==200){
            return 'ok';
        }else{
            return Promise.reject(new Error('fail to register'));
        }
        // console.log(result);
    },
    //用户登录
    async userLogin({commit},user){
        let result = await reqUserLogin(user);
        // console.log(result);
        if(result.code==200){
            //用户已经登录成功，且获取到了token
            commit('USERLOGIN',result.data.token);
            //持久化存储token
            setToken(result.data.token);
            // localStorage.setItem('TOKEN',result.data.token);
            return 'ok';
        }else{
            return Promise.reject(new Error('fail to login'));
        }
    },
    //利用toktn获取用户信息
    async userMessage({commit}){
        let result = await reqUserMessage();
        // console.log(result);
        if(result.code==200){
            commit('USERMESSAGE',result.data);
            return 'ok';
        }else{
            return Promise.reject(new Error('用户信息获取失败！'));
        }
    },
    //退出登录
    async userLogout({commit}){
        //向服务器发一次请求，通知服务器清除token
        let result = await reqLogout();
        if(result.code==200){
            //清除state中的数据 注意不能在action中清除
            commit('USERLOGOUT');
            return 'ok';
        }else{
            return Promise.reject(new Error('退出登录失败！'));
        }
    },
};
const getters = {};

export default{
    state,
    mutations,
    actions,
    getters,
}