<template>
  <div>
    <Header></Header>
    <!-- 书写路由组件出口的地方 -->
    <router-view></router-view>
    <!-- footer在home search时是显示 在登录 注册时是隐藏的 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
// 引入
import Header from "./components/Header";
import Footer from "./components/Footer";

// 注册
export default {
  // kv一致 省略v
  name: "",
  components: {
    Header,
    Footer,
  },
  mounted(){
    //派发一个action 获取商品分类的三级列表的数据
    this.$store.dispatch("categoryList");
  }
};
</script>

<style>
</style>