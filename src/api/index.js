//这个模块用于将所有API接口进行统一管理
import requests from "./request";
//用于请求mock数据
import mockRequests from './mockAjax';
//三级联动的接口
// /api/product/getBaseCategoryList
// get请求 无参数
// 箭头函数 对外暴露->方便别的模块进行使用
export const reqCategoryList = () =>{
    //发请求 由于之前设置了baseurl 这里不用写前面的/api 会自动生成
    //axios发请求返回结果是promise对象
    return requests({url:'/api/product/getBaseCategoryList',method:'get'});
};
//获取banner 首页轮播图
export const reqGetBannerList = () =>mockRequests.get('/banner');
//获取floor 家用电器轮播图数据
export const  reqFloorList = ()=>mockRequests.get('/floor');
//获取搜索模块的数据  地址：/api/list  请求方式：post
//请求需要带参数！！之前的请求都不带参数--params
//给服务器传递至少一个默认参数（空对象）
export const reqGetSearchInfo = (params)=>{
    return requests({url:'/api/list',method:'post',data:params});
};
//获取商品详情页数据 /api/item/{ skuId }
export const reqGoodsInfo = (skuid) =>{
    //发请求
    return requests({
        url:`/api/item/${skuid}`,
        method:'get',
        data:skuid
    })
};
//将产品加入购物车 | 对已有物品进行数量改动
//带参数 产品id 产品个数
export const reqAddOrUpdateShopCart = (skuId,skuNum) =>{
    return requests({
        url:`/api/cart/addToCart/${skuId}/${skuNum}`,
        method:'post',
    })
};
//获取购物车列表 /api/cart/cartList
export const reqCartList = () =>{
    return requests({url:'/api/cart/cartList',method:'get'})
};
//删除购物车中的商品
export const reqDeleteCart = (skuId) =>{
    return requests({url:`/api/cart/deleteCart/${skuId}`,method:'delete'});
};
//切换商品的选中状态
export const reqUpdateChecked = (skuId,isChecked) =>{
    return requests({url:`/api/cart/checkCart/${skuId}/${isChecked}`,method:'get'});
};
//获取验证码
export const reqGetCode = (phone)=>{
    return requests({url:`/api/user/passport/sendCode/${phone}`,method:'get'});
};
//用户注册
export const reqUserRegister = (data) =>{
    return requests({
        url:"/api/user/passport/register",
        method:'post',
        data,
    });
};
//用户登录
export const reqUserLogin = (data) =>{
    return requests({
        url:"/api/user/passport/login",
        method:"post",
        data
    })
};
//利用token获取用户的登录信息
export const reqUserMessage = () =>{
    return requests({
        url:'/api/user/passport/auth/getUserInfo',
        method:'get'
    })
};
//退出登录
export const reqLogout = () =>{
    return requests({
        url:'/api/user/passport/logout',
        method:'get'
    })
};
//获取用户地址信息
export const reqUserAddress = () =>{
    return requests({
        url:"/api/user/userAddress/auth/findUserAddressList",
        method:"get"
    })
};
//获取订单交易页面信息
export const reqUserTrade = () =>{
    return requests({
        url:"/api/order/auth/trade",
        method:"get",
    })
};
//提交订单
export const reqSubmit = (tradeNo,data) =>{
    return requests({
        url:`/api/order/auth/submitOrder?tradeNo=${tradeNo}`,
        method:'post',
        data,
    })
};
//获取订单支付信息
export const reqPayMessage = (orderId) =>{
    return requests({
        url:`/api/payment/weixin/createNative/${orderId}`,
        method:"get",
    })
};
//查询支付订单状态
export const reqPayStatus = (orderId) =>{
    return requests({
        url:`/api/payment/weixin/queryPayStatus/${orderId}`,
        method:"get",
    })
};
//获取我的订单列表
export const reqMyOrder = (page,limit) =>{
    return requests({
        url:`/api/order/auth/${page}/${limit}`,
        method:"get",
    })
}