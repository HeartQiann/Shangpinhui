<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 判断是否登录 显示相应的内容 -->
          <p v-if="!name">
            <span>请</span>
            <!-- 声明式导航 必须要有to属性 -->
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <p v-else>
            <a >{{name}}</a>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <!-- <a href="###">我的购物车</a> -->
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <!-- 声明式导航 -->
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="gosearch">
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name:"",
  // 使用双向绑定获取表单数据
  data(){
    return{
      keyword:''
    }
  },
  methods:{
    //搜索按钮的回调函数：需要向search路由进行跳转
    // 编程式导航
    gosearch(){
      // 第一种 字符串形式 keyword是params参数 k是query参数
      // this.$router.push("/search/"+this.keyword+"?k="+this.keyword.toUpperCase())
      //第二种 模板字符串
      // this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)
      // 第三种 对象写法 常用
      // this.$router.push({name:"search",params:{keyword:this.keyword},query:{k:this.keyword.toUpperCase()}})
      //尝试1：面试题1 params+path使用 xxx
      // this.$router.push({path:'/search',query:{k:this.keyword.toUpperCase()}})
      //尝试2：面试题3  params传空串
      // this.$router.push({name:"search",params:{keyword:''||undefined},query:{k:this.keyword.toUpperCase()}})
      //尝试3：面试题4 路由传递props参数
      // this.$router.push({name:"search",params:{keyword:this.keyword}});
      var location = {name:"search",params:{keyword:this.keyword}};
      if(this.$route.query){
        location.query = this.$route.query;
      }
      this.$router.push(location);
    },
    // 退出登录
    logout(){
      try {
        let result = this.$store.dispatch('userLogout');
        //跳转到首页
        this.$router.push({name:'home'});
      } catch (error) {
        alert(error.message);
      }
    }
  },
  mounted(){
    //通过全局事件总线清除关键字
    this.$bus.$on("clear",()=>{
      this.keyword = "";
    })
  },
  computed:{
    //用户名
    name(){
      return this.$store.state.user.usermessage.name;
    }
  }
};
</script>

<style lang = "less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>