<template>
  <div>
    <!-- 商品分类三级列表 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread 面包屑：带有X的结构-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <!-- 处理面包屑中的数据 -->
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryname">
              {{searchParams.categoryname}}
              <i @click="removeCategoryName">x</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{searchParams.keyword}}
              <i @click="removeKeyWord">x</i>
            </li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              <!-- 分割字符串 split -->
              {{searchParams.trademark.split(":")[1]}}
              <i @click="removeTradeMark">x</i>
            </li>
            <!-- 平台售卖属性的面包屑 -->
            <li class="with-x" v-for="(attrvalue,index) in searchParams.props" :key="index">
              {{attrvalue.split(":")[1]}}
              <i @click="removeAttrValue(index)">x</i>
            </li>
          </ul>
        </div>
        <!--selector-->
        <SearchSelector @trademarkInfo = "trademarkInfo" @attrInfo="attrInfo" />
        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- <li class="active"> -->
                <li :class="{active:searchParams.order.indexOf('1')!=-1}" @click="changeOrder('1')">
                  <a href="#">综合<span v-show="searchParams.order.indexOf('1')!=-1" class="iconfont" :class="{'icon-up':isAsc,'icon-down':isDesc}"></span></a>
                </li>
                <li :class="{active:searchParams.order.indexOf('2')!=-1}" @click="changeOrder('2')">
                  <a href="#">价格<span v-show="searchParams.order.indexOf('2')!=-1" class="iconfont" :class="{'icon-up':isAsc,'icon-down':isDesc}"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li
                class="yui3-u-1-5"
                v-for="(good, index) in goodsList"
                :key="good.id"
              >
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg"/>
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ " " + good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" :title="good.title">{{
                      good.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 设置自定义事件【子向父通信】-->
          <Pagination @getPageNo = "getPageNo" :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5"  />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapGetters,mapState} from "vuex";
export default {
  name: "Search",
  data() {
    return {
      //带给服务器的参数
      searchParams: {
        //一级分类ID
        category1Id: "",
        category2Id: "",
        category3id: "",
        //分类名字
        categoryname: "",
        //关键字
        keyword: "",
        //排序 价格升序/价格降序
        order: "1:desc",
        //分页器 代表当前是第几页
        pageNo: 1,
        //每一页展示数据的个数
        pageSize: 10,
        //平台售卖属性的参数
        props: [],
        //品牌
        trademark: "",
      },
    };
  },
  components: {
    SearchSelector,
  },
  beforeMount(){
    //先于mounted，在挂载完毕之前修改这些参数
    //复杂写法
    // this.searchParams.category1Id = this.$route.query.category1Id;
    // this.searchParams.category2Id = this.$route.query.category2Id;
    // this.searchParams.category3Id = this.$route.query.category3Id;
    // this.searchParams.categoryName = this.$route.query.categoryName;
    // this.searchParams.keyword = this.$route.params.keyword;
    //Object.asign  -- ES6新增的写法
    Object.assign(this.searchParams,this.$route.query,this.$route.params);
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters(["goodsList"]),
    isAsc(){
      return this.searchParams.order.indexOf('asc')!=-1;
    },
    isDesc(){
      return this.searchParams.order.indexOf('desc')!=-1;
    },
    //获取vuex中的数据
    ...mapState({
      total:state=>state.search.searchList.total,
    })
  },
  methods: {
    getData() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    removeCategoryName(){
      //删除面包屑
      this.searchParams.categoryname = '';
      //置空
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3id = undefined;
      //需要再发一次请求
      this.getData();
      //地址栏也要修改 进行路由跳转
      //本意是删除query参数 但是如果路径中有params参数 应该保留
      if(this.$route.params){
        this.$router.push({name:"search",params:this.$route.params});
      }
    },
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
    removeTradeMark(){
      //删除trademark的面包屑  将品牌信息置空
      this.searchParams.trademark = "";
      //再次发送请求
      this.getData();
    },
    removeAttrValue(index){
      //删除props售卖属性的面包屑
      this.searchParams.props.splice(index,1);
      this.getData();
    },
    //自定义事件的回调
    trademarkInfo(trademark){
      //整理品牌字段的参数  “ID：品牌名称”
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      //再次发送请求
      this.getData();
    },
    attrInfo(attr,attrvalue){
      //自定义事件的回调 接收两个参数
      // console.log("我是父组件",attr,attrvalue);
      //整理参数  ["属性ID:属性值:属性名"]
      let props = `${attr.attrId}:${attrvalue}:${attr.attrName}`;
      // 数组去重
      if(!this.searchParams.props.includes(props)){
        this.searchParams.props.push(props);
      }
      //再次发送请求
      this.getData();
    },
    //改变升序/降序
    changeOrder(flag){
      // flag:1综合 2价格
      //设置起始的值
      let originFlag = this.searchParams.order.split(":")[0];
      let originSort = this.searchParams.order.split(":")[1];
      //准备一个新的order属性值
      let newOrder = "";
      if(flag==originFlag){
        //改变升降序
        newOrder = `${flag}:${originSort=="desc"?"asc":"desc"}`;
      }else{
        //改变排序方式
        newOrder = `${flag}:${'desc'}`;
      }
      //修改带给服务器的参数
      this.searchParams.order = newOrder;
      //再次发请求
      this.getData();
    },
    //自定义事件的回调函数 获取当前是第几页
    getPageNo(pageNo){
      //整理带给服务器的参数
      this.searchParams.pageNo = pageNo;
      this.getData();
    }
  },
  watch:{
    //数据监听 监听组件实例身上的属性的属性值的变化
    $route(newValue,oldValue){
      //置空
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3id = undefined;
      //计算属性和监听属性都不写this
      //再次发请求之前 整理带给服务器的参数
      Object.assign(this.searchParams,this.$route.query,this.$route.params);
      // console.log(this.searchParams);
      //再次发送ajax请求
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>