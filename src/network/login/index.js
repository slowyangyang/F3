import request from '../request'

export function getcaptchaCode(){
  return request.get("/clbs/getCaptchaString?date="+ new Date().getTime())
}
export function login(data){
  // return request.post(`/clbs/oauth/token?client_id=mobile_1&client_secret=secret_1&grant_type=password&username=${data.username}&password=${data.password}`)
  return request.post("/clbs/j_spring_security_check",data)
}
//是否登录过
export function isLogin(code){
  return request.post("/app/login/loginByCode",code)
}
//退出登录
export function exitLogin(code){
  return request.post("/app/login/loginByCode",code)
}

