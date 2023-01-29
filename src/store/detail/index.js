// detail的小仓库
import { reqGoodsInfo,reqAddOrUpdateShopCart } from "@/api";

const state = {
    //初始值为一个空对象
    goodinfo:{},
};
const mutations = {
    GETGOODINFO(state,goodinfo){
        state.goodinfo = goodinfo;
    },
};
const actions = {
    //获取产品详情页的action
    async getGoodInfo({commit},skuid){
        let result = await reqGoodsInfo(skuid);
        if(result.code==200){
            commit("GETGOODINFO",result.data);
        }
    },
    //加入购物车
    async getShopCart({commit},{skuId,skuNum}){
        let result = await reqAddOrUpdateShopCart(skuId,skuNum);
        // console.log(result);
        if(result.code==200){
            return "ok";
        }else{
            //请求失败的标记
            return Promise.reject(new Error('fail'));
        }
    }
};
// getters为简化数据而生
const getters = {
    categoryView(state){
        // state.goodinfo初始状态是空对象 空对象的categoryView属性值是undefined
        return state.goodinfo.categoryView||{};
    },
    skuInfo(state){
        return state.goodinfo.skuInfo||{};
    },
    spuSaleAttrList(state){
        return state.goodinfo.spuSaleAttrList||[];
    }
};

export default{
    state,
    mutations,
    actions,
    getters
}