// 程序的入口文件 最先执行的文件
import Vue from 'vue'
import App from './App.vue'
//注册三级联动的组件-->注册为全局组件
import TypeNav from '@/components/TypeNav';
import Carousel from '@/components/Carousel';
//注册分页器为全局组件
import Pagination from '@/components/Pagination';
import { Button,MessageBox} from 'element-ui';
//第一个参数是全局组件的名字 第二个参数是哪一个组件
Vue.component(TypeNav.name,TypeNav)
Vue.component(Carousel.name,Carousel)
Vue.component(Pagination.name,Pagination)
//注册全局组件
Vue.component(Button.name,Button)
//elementUI注册组件的时候的第二种写法：挂载在原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
//引入vuex仓库
import store from '@/store';
//引入路由
import router from '@/router';
Vue.config.productionTip = false
// 允许vue调试
Vue.config.devtools = true
//mockserve对外暴露
import "@/mock/mockServe";
//引入swiper样式
import "swiper/css/swiper.css";
//统一引入接口api文件夹中全部的请求函数
import * as API from '@/api';
//引入图片懒加载插件
import VueLazyload  from 'vue-lazyload';
//引入懒加载的图片
import klm from '@/assets/lazy_load.jpg';
//注册懒加载插件 第二个参数是配置对象
Vue.use(VueLazyload,{
  //懒加载默认图片
  loading:klm,
});
// 测试 自定义插件
import myPlugin from './plugins/myPlugin';
Vue.use(myPlugin);
//引入表单验证插件
import "@/plugins/validate.js";
// //测试ue.use(
// import {reqCategoryList, reqGetSearchInfo} from '@/api';
// //调用函数 向服务器发请求
// console.log(reqGetSearchInfo({}))
// 将根组件挂载到挂载点上  public->index.html
new Vue({
  render: h => h(App),
  //注册路由：底下的写法kv一致省略v 这里的r是小写的
  router,
  //注册仓库
  store,
  //全局事件总线$bus的配置 这里的this是vm
  beforeCreate(){
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  }
}).$mount('#app')
