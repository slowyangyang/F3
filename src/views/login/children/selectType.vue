<template>
  <div class="select">
    <van-form 
      @submit="onSubmit"
      validate-trigger="onSubmit">
      <!-- <van-field name="radio" label="账户类型">
        <template #input>
          <van-radio-group 
            v-model="radio" 
            direction="horizontal"
            @change="radioChange">
            <van-radio name="1">按用户</van-radio>
            <van-radio name="2">按车牌</van-radio>
          </van-radio-group>
        </template>
    </van-field> -->
    <van-field
      v-model="username"
      name="username"
      :label="label"
      :placeholder="placeholder"
      :rules="[{ required: true, message: '请填写用户名' }]"/>
    <van-field
      v-model="password"
      type="password"
      name="password"
      label="密码"
      placeholder="密码"
      :rules="[{ required: true, message: '请填写密码'},{validator:passwordLength,message:'请设置6~10位密码'}]"/>
      <!-- <slider :successFun="handleSuccessFun" :errorFun="handleErrorFun"/> -->
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit">
        提交
      </van-button>
    </div>
</van-form>
  </div>
</template>

<script>
import slider from './slider'
export default {
  name:'selelct',
  components: {
    slider
  },
  data() {
    return {
      radio: '1',
      label:'用户名',
      username: '',
      password: '',
      placeholder:'用户名',
    }
  },
  methods: {
    radioChange(e){
      this.label = e == 1 ? '用户名' : '车牌号'
      this.placeholder = e == 1 ? '用户名' : '车牌号'
    },
    onSubmit(values) {
      this.$emit('login',values)
    },
    passwordLength(val){
      if(val.length < 6 || val.length > 10){
        return false
      }else{
        return true
      }
    },
    handleSuccessFun(){

    },
    handleErrorFun(){

    }
  },
}
</script>

<style>

</style>