//引入封装的Api
import { reqCategoryList,reqGetBannerList,reqFloorList} from "@/api";

//home模块的小仓库
const state = {
    //定义categoryList的起始值 默认初始值的数据类型不要乱写 根据服务器返回值类型进行初始化
    categoryList:[],
    //轮播图的数组
    bannerList:[],
    floorList:[],
};
const mutations = {
    CATEGORYLIST(state,categoryList){
        //修改为服务器返回的数据  截取前16个数据
        state.categoryList = categoryList.slice(0,16);
    },
    GETBANNERLIST(state,bannerList){
        // console.log("修改当前数据");
        state.bannerList = bannerList;
    },
    GETFLOORLIST(state,floorList){
        state.floorList = floorList;
    }
};
const actions = {
    async categoryList({commit}){
        //通过API里面接口函数调用 向服务器发请求，获取服务器的数据
        //await会等待promise完成之后返回最终的结果
        let result = await reqCategoryList();
        if(result.code==200){
            //成功的话提交mutation
            commit("CATEGORYLIST",result.data);
        }
    },
    //获取首页轮播图的数据
    async getBannerList({commit}){
        let result = await reqGetBannerList();
        // console.log(result);
        if(result.code==200){
            //成功的话提交mutation
            commit("GETBANNERLIST",result.data);
        }
    },
    async getFloorList({commit}){
        let result = await reqFloorList();
        if(result.code==200){
            commit("GETFLOORLIST",result.data);
        }
    }
};
const getters = {};

//对外暴露
export default{
    state,
    mutations,
    actions,
    getters,
}