<template>
  <div class="empty">
    <van-empty image="error" description="您访问的页面不存在">
      <van-button 
        round icon="home-o" 
        type="danger" 
        class="bottom-button"
        to="/home">返回首页</van-button>
    </van-empty>
  </div>
</template>

<script>
export default {
  name:'empty',
  data() {
    return {

    }
  }
}
</script>

<style scoped>
/deep/.bottom-button {
  width: 1.2rem;
  height: 0.4rem;
}
</style>