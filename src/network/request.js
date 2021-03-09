import axios from 'axios'
import store from '../store'
import {Toast,Notify} from 'vant'
import db from 'common/localstorage'
import qs from 'qs'
Toast.setDefaultOptions({
  forbidClick: true,
  duration:0
})

let FEBS_REQUEST = axios.create({
  // baseURL: process.env.VUE_APP_BASEURL,
  // baseURL: `http://gzh.thygps.com`,
  baseURL: `https://zs.thygps.com/clbs`,
  responseType: 'json',
  withCredentials: true, // 允许携带cookie
  crossDomain: true,
  validateStatus (status) {
    // 200 外的状态码都认定为失败
    return status === 200
  }
})

// 拦截请求
FEBS_REQUEST.interceptors.request.use((config) => {
  Toast.loading();
  // 有 token就带上
  let token = store.state.TOKEN
  if(token){
    config.url = config.url+(config.method == 'post' ? "?access_token="+token : "access_token="+token)
  }
  let newTime = new Date()
  let expireTime = store.state.expire_time
  if(expireTime){
    if (newTime.getTime() > new Date(expireTime).getTime()) {
      Notify({ type: 'primary', message: '登录已过期，请重新登录'});
      db.remove("expireTime")
      setTimeout(()=>{
        location.reload()
      },1000)
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 拦截响应
FEBS_REQUEST.interceptors.response.use((config) => {
  let token = config.headers['authentication']
  let TOKEN_INVALID = config.data
  if(config.status == 200){
    if(token){  //获取响应头里面的数据
      db.save("token",token)
      store.commit({type:'saveToken',token})
    }
  }
  // if(config.data.status == '5'){
  //   db.remove('token')
  //   db.remove('USER')
  //   db.remove('OPENID')
  //   Notify({ type: 'primary', message: '登录已过期，请重新登录'});
  //   setTimeout(()=>{
  //     location.reload()
  //   },1000)
  // }
  Toast.clear()
  return config
}, (error) => {
  if (error.response) {
    console.log(error.response);
    let errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
    Toast({message:errorMessage,duration:1500})
  }
  Toast.clear()
  return Promise.reject(error)
})

const request = {
  postForm(url, data) {
    return FEBS_REQUEST({
      method:"post",
      url:url,
      params:data,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      }
    })
  },
  post (url, params) {
    let contentType = url.indexOf('token') > -1 ? 'application/x-www-form-urlencoded' : 'application/json'
    return FEBS_REQUEST.post(url, params, {
      transformRequest: [(params) => {
        let result = ''
        if (url.indexOf('token') > -1) {
          Object.keys(params).forEach((key) => {
            if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
              result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
            }
          })
        } else {
          result = JSON.stringify(params)
        }
        return result
      }],
      headers: {
        'Content-Type': contentType
      }
    })
  },
  put (url, params) {
    let contentType = (url.indexOf('login') > -1 || url.indexOf('avatar') > -1 || url.indexOf('password') > -1 || url.indexOf('password/reset') > -1) ? 'application/x-www-form-urlencoded' : 'application/json'
    return FEBS_REQUEST.put(url, params, {
      transformRequest: [(params) => {
        let result = ''
        if (url.indexOf('login') > -1 || url.indexOf('avatar') > -1 || url.indexOf('password') > -1 || url.indexOf('password/reset') > -1) {
          Object.keys(params).forEach((key) => {
            if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
              result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
            }
          })
        } else {
          result = JSON.stringify(params)
        }
        return result
      }],
      headers: {
        'Content-Type': contentType
      }
    })
  },
  get (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return FEBS_REQUEST.get(`${url}${_params}`)
  },
  delete (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return FEBS_REQUEST.delete(`${url}${_params}`)
  }
}

export default request