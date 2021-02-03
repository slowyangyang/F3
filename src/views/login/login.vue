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
import {login, isLogin, getcaptchaCode} from '@/network/login'
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
      // APPID :'wxf41afaa220983a6c',
      // APPID :'wx94adebbf72b68282',
      APPID:process.env.VUE_APP_APPID,
      local:'',
      openId:'',
    }
  },
  created(){
    // this.getwxCode()
    
    // document.cookie = 'company=eoitek;max-age=10000;domain=eoitek.com;path=/;secure'
  },
  methods: {
    ...mapMutations(['saveUser']),
    handleSubmit(value){
      let that = this
      let host = 'https://zs.thygps.com'
      fetch(host + '/clbs/getCaptchaString', { credentials: 'include' })
      .then(res => res.text())
      .then(code => {
        code = code.replaceAll('"', '');
        fetch(host + '/clbs/j_spring_security_check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `username=${value.username}&password=${value.password}&captchaCode=` + code, //登录
          credentials: 'include',
        }).then(res => {
          console.log(res);
          return res.json()
          }).then(response => {
            console.log(response);
          if (response.loginFailure) {
            console.log(response.msg);
            return;
          }
        that.$router.push({path:'/home'})
      });
      }).catch(err => console.error(err));

      //axios
      // getcaptchaCode().then(res => {
      //   value.captchaCode = res
      // }).then(()=>{
      //   login(value).then(res => {
      //     console.log(res);
      //   })
      // })
    },
    // 获取用户信息非静默授权，第一次有弹框
    getwxCode() {
      let code = this.getUrlParam('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      let local = window.location.href
      // return false
      if(code == null || code === '') {
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.APPID}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
      }else{
        this.getOpenId(code)
      }
    },
    getOpenId (code) { // 通过code获取 openId等用户信息
      let _this = this
      isLogin({code}).then((res) => {
        console.log(res);
          let data = res.data
          if (data.status === '0') {
            //保存用户信息
            this.saveUser(data.result)
            db.save("USER",data.result)
            db.save("OPENID",data.result.openid)
            this.$router.push({path:'/home'})
          }else{
            this.openId = data.result
            db.save("OPENID",data.result)
            this.$router.push({path:'/login'})
            this.$notify({ type: 'primary', message: data.msg});
          }
      }).catch((error) => {
        console.log(error);
        // this.$notify({ type: 'danger', message: '服务器错误'});
      })
    },
    getUrlParam(name){
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
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