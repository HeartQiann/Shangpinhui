<template>
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
</template>

<script>
  export default {
    name: "Pagination",
    // 接收父组件传递过来的数据
    props:["pageNo","pageSize","total","continues"],
    computed:{
        //一共有多少页
        totalPage(){
            return Math.ceil(this.total/this.pageSize);
        },
        //计算连续页码的起始数字和结束数字
        startNumAndEndNum(){
            //这里是解构赋值
            const{pageNo,pageSize,total,continues,totalPage} = this;
            //先定义两个变量存储开始值与结束值
            let start = 0;
            let end = 0;
            if(continues>totalPage){
                //不正常现象  本身页数不足连续页码个数
                start = 1;
                end = totalPage;
            }else{
                start = pageNo-Math.floor(continues/2);
                end = pageNo+Math.floor(continues/2);
                if(start<1){
                    //避免start出现负数的情况
                    start = 1;
                    end = continues;
                }
                if(end>totalPage){
                    end = totalPage;
                    start = totalPage-continues+1;
                }
            }
            return {start,end};
        }
    }
  }
</script>

<style lang="less" scoped>
  .pagination {
    text-align: center;
    button {
      margin: 0 5px;
      background-color: #f4f4f5;
      color: #606266;
      outline: none;
      border-radius: 2px;
      padding: 0 4px;
      vertical-align: top;
      display: inline-block;
      font-size: 13px;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border: 0;

      &[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.active {
        cursor: not-allowed;
        background-color: #409eff;
        color: #fff;
      }
    }
  }
  .active{
    background:#409eff;
  }
</style>
