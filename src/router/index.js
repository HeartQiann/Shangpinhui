// 配置路由的地方
import Vue from 'vue';
import VueRouter from 'vue-router';
//使用插件
Vue.use(VueRouter);
// 避免重复点击相同路由出现的报错
//添加以下代码
//先把VueRouter原型对象的push保存一份
const originPush = VueRouter.prototype.push
//重写push方法
VueRouter.prototype.push = function (location,resolve,reject) {
    //调用保存的push方法
    //但是保存的push方法是挂载在window的方法 所以要通过call修改this的指向
  if(resolve&&reject){
    originPush.call(this,location,resolve,reject);
  }else{
    originPush.call(this,location,()=>{},()=>{});
  }
}
import routes from './routes.js';
//配置路由
let router = new VueRouter({
    //配置路由
    routes:routes,
    //设置滚动行为
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { 
            y : 0
        }
    },
});
//引入store
import store from '@/store';
//全局守卫：全局前置守卫
router.beforeEach(async (to,from,next)=>{
  let token = localStorage.getItem('TOKEN');
  let username = store.state.user.usermessage.name;
  if(token){
    //已经登录 还要去login 就阻止 并且停留在首页
    if(to.path=='/login'){
      next('/home');
      // console.log('已经登录 还要去login 就阻止');
    }else{
      //登录 但是去的不是login
      //如果没有用户信息，需要获取用户信息再跳转
      if(username){
        // console.log('登录 但是去的不是login 有用户信息');
        next();
      }else{
        // 没有用户信息 派发Action让仓库存储用户信息后再跳转
        try {
          await store.dispatch('userMessage');
          // console.log('没有用户信息 派发Action让仓库存储用户信息后再跳转');
          next();
        } catch (error) {
          //token失效了 获取不到用户的信息 要重新登陆 
          //清除token
          await store.dispatch('userLogout');
          // console.log('token失效了');
          next('/login');
        }
        next();
      }
    }
  }else{
    //未登录 不能去交易相关 和支付相关 个人中心：trade/pay/paysuccess/center
    if(to.path=='/trade'||to.path=='/pay'||to.path=='/paysuccess'||to.path=='/center'||to.path=='/center/myorder'||to.path=='/center/grouporder'){
      //把未登录时用户想去的路径给query参数传递过去
      next('/login?redirect='+to.path);
    }else{
      next();
    }
  }
});
export default router;