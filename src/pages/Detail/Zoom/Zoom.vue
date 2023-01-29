<template>
  <div class="spec-preview">
    <!-- 这里应该写成动态的路径 -->
    <img :src="skuImageList[currentIndex].imgUrl" />
    <!-- event是大图的整个方块 -->
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="skuImageList[currentIndex].imgUrl" ref="big"/>
    </div>
    <!-- 遮罩层 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    props:['skuImageList'],
    data(){
      return{
        currentIndex:0,
      }
    },
    mounted(){
      //全局事件总线 获取兄弟组件传递过来的索引值
      this.$bus.$on('getIndex',(index)=>{
        this.currentIndex = index;
      })
    },
    methods:{
      //鼠标移动触发放大镜的方法
      handler(event){
        // console.log(123);
        //定义mask为遮罩层
        let mask = this.$refs.mask;
        let big = this.$refs.big;
        //遮罩层距离外面边框的左边界宽度
        let left = event.offsetX-mask.offsetWidth/2;
        //遮罩层距离外面边框的上边界宽度
        let top = event.offsetY-mask.offsetHeight/2;
        //约束left与top的值 使其不超出指定范围
        if(left<=0){
          left = 0;
        }else if(left>mask.offsetWidth){
          left = mask.offsetWidth;
        }
        if(top<=0){
          top = 0;
        }else if(top>mask.offsetHeight){
          top = mask.offsetHeight;
        }
        //修改元素的left与top
        mask.style.left = left+"px";
        mask.style.top = top+"px";
        //修改放大图的left与top
        big.style.left = -2*left+"px";
        big.style.top = -2*top+"px";
      }
    }
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      // background: aqua;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>