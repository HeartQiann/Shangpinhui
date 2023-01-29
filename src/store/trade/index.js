// 交易页面的小仓库
import {reqUserAddress,reqUserTrade} from "@/api";

const state = {
    useraddress : [],
    usertrade : {},
};
const mutations = {
    USERADDRESS(state,data){
        state.useraddress = data;
    },
    USERTRADE(state,data){
        state.usertrade = data;
    }
};
const actions = {
    //获取用户地址信息
    async userAddress({commit}){
        let result = await reqUserAddress();
        if(result.code==200){
            //提交mutations修改仓库中的数据
            commit('USERADDRESS',result.data);
        }
    },
    //获取交易页面信息
    async userTrade({commit}){
        let result = await reqUserTrade();
        if(result.code==200){
            //提交mutations修改仓库中的数据
            commit('USERTRADE',result.data);
        }
    }
};
//简化数据
const getters = {
    detailArrayList(state){
        return state.usertrade.detailArrayList||[];
    }
};

export default{
    state,
    mutations,
    actions,
    getters
}