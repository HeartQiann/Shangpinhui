<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(cartInfo,index) in cartInfoList" :key="cartInfo.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cartInfo.isChecked==1" @change="updateChecked(cartInfo,$event)"/>
          </li>
          <li class="cart-list-con2">
            <img :src="cartInfo.imgUrl" />
            <div class="item-msg">
              {{cartInfo.skuName}}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{cartInfo.skuPrice}}.00</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="changeSkuNum('minus',-1,cartInfo)">-</a>
            <input
              autocomplete="off"
              type="text"
              :value="cartInfo.skuNum"
              minnum="1"
              class="itxt"
              @change="changeSkuNum('change',$event.target.value,cartInfo)"
            />
            <a href="javascript:void(0)" class="plus" @click="changeSkuNum('add',1,cartInfo)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{cartInfo.skuPrice*cartInfo.skuNum}}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCart(cartInfo)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>

      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked&&cartInfoList.length>0" @click="updateCheckedAll" />
        <span>全选</span>
      </div>
      <div class="option">
        <a  @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{totalPrice}}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn"  @click="$router.push({name:'trade'})">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from 'lodash/throttle';
export default {
  name: "ShopCart",
  mounted() {
    this.getData();
  },
  computed:{
    ...mapGetters(['cartList']),
    cartInfoList(){
      return this.cartList.cartInfoList||[];
    },
    //计算购买产品的总价格
    totalPrice(){
      let sum = 0;
      for(let i = 0;i<this.cartInfoList.length;i++){
        sum+=this.cartInfoList[i].skuNum*this.cartInfoList[i].skuPrice;
      }
      return sum;
    },
    //判断是不是全选
    isAllChecked(){
      // every也是遍历
      return this.cartInfoList.every(item=>item.isChecked==1);
    }
  },
  methods:{
    //获取个人购物车数据
    getData(){
      //派发action
      this.$store.dispatch("getCartList");
    },
    //改变购物车商品数量  
    //优化：函数的防抖与节流
    changeSkuNum:throttle(async function(type,changenum,cartInfo){
      if(type=='change'){
        if(isNaN(changenum)){
          changenum = 0;
        }else{
          changenum = parseInt(changenum) -cartInfo.skuNum;
        }
      }else if(type=='minus'){
        // changenum = cartInfo.skuNum>1?-1:0;
        if(cartInfo.skuNum<=1){
          //产品个数<=1
          changenum = 0;
        }
      }
      // console.log("派发action，通知服务器修改数据",type,changenum,cartInfo);
      try {
        //派发action
        await this.$store.dispatch('getShopCart',{skuId:cartInfo.skuId,skuNum:changenum});
        //请求服务器 修改数据
        this.getData();
      } catch (error) {}
    },300),
    // 删除购物车中的数据 这里注意成功与失败的情况 -- 使用try/catch
    async deleteCart(cartInfo){
      try {
        //如果删除成功 再次发请求 -- 使用async/await
        await this.$store.dispatch('deleteCart',cartInfo.skuId);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 修改商品的勾选状态
    async updateChecked(cartInfo,event){
      try {
        let checked = event.target.checked ? 1 : 0 ;
        await this.$store.dispatch('changechecked',{skuId:cartInfo.skuId,isChecked:checked});
        this.getData();
      } catch (error) {
        //如果失败 进行提示
        alert(error.message);
      }
    },
    //删除全部选中的商品
    async deleteAllCheckedCart(){
      try {
        await this.$store.dispatch('deleteAllCheckedCart');
        //再次发请求
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //全选产品的勾选状态修改
    async updateCheckedAll(event){
      try {
        let checked = event.target.checked ? "1" : "0";
        console.log(checked);
        await this.$store.dispatch('updateCheckedAll',checked);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
  }
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>