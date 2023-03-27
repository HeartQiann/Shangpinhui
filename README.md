# 尚品汇web端在线购物商城

## 项目简介
前台项目是一款使用Vue开发的Web端在线商城，主要实现登录与注册/搜索/加入购物车/在线支付等多种功能。

## 首页
1、解决跨域问题。配置proxy代理。
```
//代理服务器解决跨域问题
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
        // pathRewrite: { '^/api': '' },
      },
    },
  }
```
2、使用mock模拟轮播图数据。

3、向服务器发请求并获取数据，对三级联动中的商品属性进行展示。

![image](https://user-images.githubusercontent.com/88093402/227831723-99223fca-26b9-4a0d-ae38-85c26cc110bb.png)

## 搜索模块
1、设置面包屑显示数据。进行面包屑的添加与删除（使用`v-if`控制）。
2、组件通信。涉及兄弟组件通信（使用`$bus`解决）。
```
removeKeyWord(){
  //删除keyword的面包屑
  this.searchParams.keyword = "";
  //再次发请求
  this.getData();
  //通知兄弟组件header清除关键字
  this.$bus.$emit("clear");
  if(this.$route.query){
    this.$router.push({name:"search",params:this.$route.query});
  }
},
```
4、完成分页器组件的封装。
```
<div class="pagination">
    <button :disabled = "pageNo==1" @click="$emit('getPageNo',pageNo-1)">上一页</button>
    <button v-if="startNumAndEndNum.start>1" @click="$emit('getPageNo',1)" :class="{active:pageNo==1}">1</button>
    <button v-if="startNumAndEndNum.start>2">···</button> 
    <!-- 中间部分 -->
    <button v-for="(page,index) in startNumAndEndNum.end" :key="index" v-if="page>=startNumAndEndNum.start" @click="$emit('getPageNo',page)" :class="{active:pageNo==page}">{{page}}</button>
    
    <button v-if="startNumAndEndNum.end+1<totalPage">···</button>
    <button v-if="startNumAndEndNum.end<totalPage" @click="$emit('getPageNo',totalPage)" :class="{active:pageNo==totalPage}">{{totalPage}}</button>
    <button @click="$emit('getPageNo',pageNo+1)" :disabled = "pageNo==totalPage">下一页</button>  
    <button style="margin-left: 30px">共{{total}}条</button>
    <!-- <p>{{startNumAndEndNum}}</p> -->
</div>
```
3、发请求，获取搜索结果数据。


![image](https://user-images.githubusercontent.com/88093402/227832593-a309b829-f234-4b06-9ac5-f5bc16ee7867.png)


## 购物车模块
1、完成购物车中商品数量的修改操作。
2、进行路由的跳转。
3、使用浏览器的会话存储功能，存储用户刚刚加入购物车的数据。
```
this.$router.push({name:'addcartsuccess',query:{skuNum:this.skuNum}});
//浏览器的会话存储  转为字符串
sessionStorage.setItem("SKUINFO",JSON.stringify(this.skuInfo));
```
![image](https://user-images.githubusercontent.com/88093402/227833770-fe76d3aa-a003-4ee1-aec7-ed1a2adea431.png)

![image](https://user-images.githubusercontent.com/88093402/227835401-3c6c374a-770f-4cdd-a1b7-ebfed6f91b5c.png)

## 支付模块
1、获取支付信息成功与失败的返回（如果支付成功则跳转页面，如果支付失败则显示提示信息）：使用 `keep alive +计时器`解决。
```
//向服务器发请求查询订单支付状态
if(!this.timer){
  //如果没有定时器，开启一个新的定时器
  this.timer = setInterval(async ()=>{
    let result = await this.$API.reqPayStatus(this.orderId);
    console.log(result);
    if(result.code==200){
      //清除定时器
      clearInterval(this.timer);
      this.timer = null;
      this.code = result.code;
      //关闭弹出框
      this.$msgbox.close();
      //跳转到下一个路由
      this.$router.push({name:"paysuccess"});
    }
  },1000)
}
```
![image](https://user-images.githubusercontent.com/88093402/227835451-7eb890ab-a61c-4c70-ab3c-35797ade7d7e.png)


## 登录模块
1、用户token的存储：向后端发请求获取用户token数据，并将token存储在请求头中，以便在使用过程中让服务器辨别每个用户。
```
//携带token带给服务器
if(store.state.user.token){
    config.headers.token = store.state.user.token;
}
```
2、路由守卫：当用户通过链接地址访问购物车、支付页面，或者用户token过期时进行拦截，并放行到登录页面。
```
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
    }else{
      //登录 但是去的不是login
      //如果没有用户信息，需要获取用户信息再跳转
      if(username){
        next();
      }else{
        // 没有用户信息 派发Action让仓库存储用户信息后再跳转
        try {
          await store.dispatch('userMessage');
          next();
        } catch (error) {
          //token失效了 获取不到用户的信息 要重新登陆 
          //清除token
          await store.dispatch('userLogout');
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
```
![image](https://user-images.githubusercontent.com/88093402/227830194-4ab4b6fb-0d15-4639-8d99-f2402da76cc8.png)


## 项目初始化
```
npm install
```
## 运行项目
```
npm run serve
```
