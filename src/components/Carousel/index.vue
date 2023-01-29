<template>
  <div class="swiper-container" id="floor2Swiper" ref="mySwiper">
    <div class="swiper-wrapper">
      <!-- 轮播图遍历 -->
      <div
        class="swiper-slide"
        v-for="(carousel, index) in floor"
        :key="carousel.id"
      >
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
// 引入swiper
import Swiper from 'swiper';
export default {
  name: "Carousel",
  //接收父组件传递的floor
  props:['floor'],
  watch:{
    floor:{
      immediate:true,
      handler(){
        //监听到数据已经有了，但是v-for动态渲染的结构我们还是没办法确定-->还要用到nextTick
        this.$nextTick(() => {
          //当执行这个操作的时候，v-for执行完毕了【轮播图结构一定有了】，服务器数据也回来了
          var mySwiper = new Swiper(this.$refs.mySwiper, {
            // direction: 'vertical', // 垂直切换选项
            loop: true, // 循环模式选项
            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              // 点击小球的时候也切换图片
              clickable: true,
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      }
    }
  }
};
</script>

<style>
</style>