// shopcart的小仓库
import {reqCartList,reqUpdateChecked} from '@/api';
//封装临时游客身份模块
import {getUUID} from '@/utils/uuid_token';
// 删除购物车中的商品
import {reqDeleteCart} from '@/api'
import { Promise } from 'core-js';

const state = {
    cartList:[],
    //游客临时身份
    uuid_token:getUUID(),

};
const mutations = {
    GETCARTLIST(state,cartList){
        state.cartList = cartList;
    }
};
const actions = {
    //获取购物车列表数据
    async getCartList({commit}){
        let result = await reqCartList();
        // console.log(result);
        if(result.code == 200){
            commit('GETCARTLIST',result.data);
        }
    },
    //删除购物车中的数据
    async deleteCart({commit},skuId){
        let result = await reqDeleteCart(skuId);
        if(result.code==200){
            return 'ok';
        }else{
            return Promise.reject(new Error("fail"));
        }
        // console.log(result.code);
    },
    //切换商品的选中状态
    async changechecked({commit},{skuId,isChecked}){
        let result = await reqUpdateChecked(skuId,isChecked);
        if(result.code==200){
            return 'ok';
        }else{
            return Promise.reject(new Error('fail'));
        }
    },
    //删除全部选中的商品
    async deleteAllCheckedCart({dispatch,getters}){
        let cartInfoList = getters.cartList.cartInfoList;
        let promiseAll = [];
        for(let i = 0;i<cartInfoList.length;i++){
            if(cartInfoList[i].isChecked==1){
                //选中 删除
                let promise = await dispatch('deleteCart',cartInfoList[i].skuId);
                // console.log(promise);
                //将返回结果加入数组
                promiseAll.push(promise);
            }
        }
        //如果有一个失败，返回即为失败
        return Promise.all(promiseAll);
    },
    //全部产品的勾选状态修改
    updateCheckedAll({dispatch,getters},checked){
        let cartInfoList = getters.cartList.cartInfoList;
        let promiseAll = [];
        // console.log(cartInfoList);
        for(let i = 0;i<cartInfoList.length;i++){
            let promise = dispatch('changechecked',{skuId:cartInfoList[i].skuId,isChecked:checked});
            promiseAll.push(promise);
        }
        return Promise.all(promiseAll);
    }
};
const getters = {
    // 简化数据
    cartList(state){
        return state.cartList[0]||{};
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}