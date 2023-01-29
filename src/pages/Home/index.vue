<template>
  <!-- 三级联动组件 已经注册为全局组件 不需要再引入-->
  <div>
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
    <Floor v-for="(floor,index) in floorList" :key="floor.id" :floor="floor"></Floor>
    <Brand></Brand>
   
  </div>
</template>

<script>
//引入其余的组件
import ListContainer from '@/pages/Home/ListContainer';
import Recommend from '@/pages/Home/Recommend';
import Rank from '@/pages/Home/Rank';
import Like from '@/pages/Home/Like';
import Floor from '@/pages/Home/Floor';
import Brand from '@/pages/Home/Brand';

import {mapState} from 'vuex';

export default {
  //注册组件 非全局组件都要注册
  name:"",
  components:{
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  //派发action 获取floor组件的数据
  mounted(){
    this.$store.dispatch("getFloorList");
    //利用token获取用户的信息 在导航守卫中获取
    // this.$store.dispatch('userMessage');
  },
  computed:{
    ...mapState({
      floorList:state=>state.home.floorList,
    })
  }
}
</script>

<style>

</style>