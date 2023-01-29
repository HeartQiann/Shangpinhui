//search模块的小仓库
import { reqGetSearchInfo } from "@/api";
const state = {
    searchList:{},
};
const mutations = {
    GETSEARCHLIST(state,searchList){
        state.searchList = searchList;
    }
};
const actions = {
    async getSearchList({commit},params={}){
        //至少传递一个空对象
        var result = await reqGetSearchInfo(params);
        if(result.code==200){
            //请求成功
            //提交mutation  注意这里一定要加单引号！！！
            commit('GETSEARCHLIST',result.data);
        }
    }
};
const getters = {
    //当前形参 是当前仓库中的state 而不是大仓库中的state！！！！
    goodsList(state){
        return state.searchList.goodsList||[];
    },
    trademarkList(state){
        return state.searchList.trademarkList;
    },
    attrsList(state){
        return state.searchList.attrsList;
    }
};

//对外暴露
export default{
    state,
    mutations,
    actions,
    getters,
}