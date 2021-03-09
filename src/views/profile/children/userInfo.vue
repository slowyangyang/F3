<template>
  <div class="userInfo">
    <van-card
      :desc="'你好~！'+infoList.username"
      :thumb="infoList.headimgurl || defaultImg"/>
  </div>
</template>

<script>
export default {
  name:'userInfo',
  props:{
    infoList:{
      required:true,
      default(){
        return {}
      }
    }
  },
  data(){
    return {
      defaultImg:require("assets/image/defaultImg.jpg"),
    }
  }
}
</script>

<style scoped>
.van-card__content{
  min-height: 60px;
  justify-content: center;
}
.van-card__thumb{
  /* width: 60px;
  height: 60px; */
}
.van-card__desc{
  font-size: 14px;
}


</style>