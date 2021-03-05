<template>
  <div class="login">
    <nav-bar 
      :title="title"/>
    <select-type @login="handleSubmit"></select-type>
  </div>
</template>
<script>
import selectType from './children/selectType'
import navBar from '@/components/navBar'
import {login, isLogin, getcaptchaCode, getToken} from '@/network/login'
import { mapMutations  } from 'vuex'
import db from 'common/localstorage'
export default {
  name: 'login',
  components: {
    navBar,
    selectType,
  },
  data(){
    return {
      title:'登录',
      code:'',
      local:'',
      openId:'',
    }
  },
  created(){
    
  },
  methods: {
    ...mapMutations(['saveUser', "saveExpireTime", "saveToken"]),
    handleSubmit(value){
      // let that = this
      // let host = 'https://zs.thygps.com'
      // fetch(host + '/clbs/getCaptchaString', { credentials: 'include' })
      // .then(res => res.text())
      // .then(code => {
      //   code = code.replaceAll('"', '');
      //   fetch(host + '/clbs/j_spring_security_check', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //     body: `username=${value.username}&password=${value.password}&captchaCode=` + code, //登录
      //     credentials: 'include',
      //   }).then(res => {
      //     console.log(res);
      //     return res.json()
      //     }).then(response => {
      //       console.log(response);
      //     if (response.loginFailure) {
      //       console.log(response.msg);
      //       return;
      //     }
      //     db.save("USER_INFO",value)
      //     this.isExpire()
      //     that.$router.push({path:'/home'})
      // });
      // }).catch(err => console.error(err));
      let data = {
        client_id:"mobile_1",
        client_secret:"secret_1",
        grant_type:'password',
        username:value.username,
        password:value.password
      }
      getToken(data).then(res=>{
        let data = res.data
        console.log(res.status);
        console.log(res.data);
        if(res.status == 200){
          db.save("expireTime",data.expiration)
          db.save("TOKEN",data.value)
          this.saveExpireTime(data.expiration)
          this.saveToken(data.value)
          //保存用户信息
          db.save("USER_INFO",value)
          this.$Toast("登录成功",1500)
          this.$router.push({path:'/home'})
        }
      }).catch(err=>{
        console.log(err);
      })
    }
  },
}
</script>

<style scoped>
/deep/.van-nav-bar__title{
  color: #fff;
}
/deep/.van-nav-bar__content{
  background: #1989fa;
}
/deep/.van-tabbar--fixed{
  display: none;
}
/deep/ .van-hairline--top-bottom{
  display: none;
}
/deep/.van-button--normal{
  height: 0.4rem;
}
</style>