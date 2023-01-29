<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <!-- <h1>{{categoryList}}</h1> -->
    <div class="container" @mouseleave="leaveIndex()" @mouseenter="entershow()">
      <h2 class="all">全部商品分类</h2>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
      <!-- 过渡动画 -->
      <transition name="sort">
        <div class="sort" v-show="show">
          <div class="all-sort-list2" @click="goSearch">
            <!-- 一级分类 -->
            <!-- 这里c1写什么都行 只是表示当前遍历的元素 -->
            <div
              class="item"
              v-for="(c1, index) in categoryList"
              :key="c1.categoryId"
              :class="{ cur: currentIndex == index }"
            >
              <!-- 鼠标监听 -->
              <h3 @mouseenter="changeIndex(index)">
                <!-- 声明式导航 -->
                <!-- <router-link to="/search">{{ c1.categoryName }}</router-link> -->
                <!-- 编程式导航 添加自定义属性data-categoryName-->
                <a
                  :data-categoryName="c1.categoryName"
                  :data-category1ID="c1.categoryId"
                  >{{ c1.categoryName }}</a
                >
                <!-- <a href="">{{ c1.categoryName }}</a> -->
              </h3>
              <div
                class="item-list clearfix"
                :style="{ display: currentIndex == index ? 'block' : 'none' }"
              >
                <!-- 二级分类 -->
                <div
                  class="subitem"
                  v-for="c2 in c1.categoryChild"
                  :key="c2.categoryId"
                >
                  <dl class="fore">
                    <dt>
                      <!-- 编程式导航 -->
                      <a
                        :data-categoryName="c2.categoryName"
                        :data-category2ID="c2.categoryId"
                        >{{ c2.categoryName }}</a
                      >
                      <!-- <a href="">{{ c2.categoryName }}</a> -->
                    </dt>
                    <dd>
                      <!-- 三级分类 -->
                      <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                        <!-- 编程式导航 -->
                        <a
                          :data-categoryName="c3.categoryName"
                          :data-category3ID="c3.categoryId"
                          >{{ c3.categoryName }}</a
                        >
                        <!-- <a href="">{{ c3.categoryName }}</a> -->
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//引入lodash全部功能函数
// import _ from 'lodash';
//按需引入
import throttle from "lodash/throttle";
// console.log(_);
export default {
  //组件的名字：typenav
  name: "TypeNav",
  data() {
    return {
      //存储用户鼠标移到哪一个一级分类  注意不取0~15
      currentIndex: -1,
      //控制三级联动的显示与隐藏 当首页-->search中改变
      show: true,
    };
  },
  //组件挂载完毕 可以向服务器发请求
  mounted() {
    //通知vuex发请求 数据存储在仓库中-->已放入根组件app.vue中
    // this.$store.dispatch("categoryList");
    //当首页-->search组件挂载完毕，让show属性变为false
    //判断当前的路由是不是search 若是则变为false
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  computed: {
    //用mapstate获取仓库中的数据
    ...mapState({
      //使用这个计算属性的时候，右侧函数会立即执行一次
      categoryList: (state) => {
        return state.home.categoryList;
      },
    }),
  },
  methods: {
    //鼠标进入三级联动区域修改响应式数据currentIndex
    // changeIndex(index){
    //   this.currentIndex = index;
    // },
    //节流：采用es5的写法  k:v  节流时间50ms
    changeIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 20),
    leaveIndex() {
      if (this.$route.path != "/home") {
        //search默认是隐藏的
        this.show = false;
        this.currentIndex = -1;
      } else {
        //鼠标移除之后currntindex变为-1
        this.currentIndex = -1;
      }
    },
    entershow() {
      this.show = true;
    },
    goSearch() {
      // this.$router.push('/search');
      //获取当前触发该事件的节点-->需要带有data-categoryName的节点-->一定是a标签
      let element = event.target;
      // console.log(element.dataset);
      // 这里浏览器自动解析成小写
      let { categoryname, category1id, category2id, category3id } = element.dataset;
      //如果标签身上有categoryname的一定是a标签
      if (categoryname) {
        //整理路由跳转的参数
        let location = { name: "search" };
        let query = { categoryname: categoryname };
        //区分123级标签
        if (category1id) {
          query.category1id = category1id;
        } else if (category2id) {
          query.category2id = category2id;
        } else {
          query.category3id = category3id;
        }
        //整理完参数  这里只带了query参数
        //如果路由跳转的时候带有params参数 也要捎带着传递过去
        if(this.$route.params){
          location.params = this.$route.params;
          location.query = query;
          this.$router.push(location);
        }
      }
    },
  },
};
</script>

<style lang = less>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            /* display: none; */
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          /* &:hover {
            .item-list {
              display: block;
            }
          } */
        }
        /* 为三级联动添加背景 */
        /* .item:hover{
          background: skyblue;
        } */
        .cur {
          background: skyblue;
        }
      }
    }
    /* 过渡动画样式 */
    /* 过渡动画开始的样式 */
    .sort-enter{
      height: 0px;
    }
    /* 过渡动画结束状态 */
    .sort-enter-to{
      height:461px;
    }
    /* 定义动画时间与速率 */
    .sort-enter-active{
      transition: all .2s linear;
    }
  }
}
</style>