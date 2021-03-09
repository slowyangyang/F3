import request from '../request'
import qs from 'qs'
export function getSDK(url){
  return request.post("/app/login/getTicket",url)
}

/**获取所有父节点**/
export function getPNodes(){
  return request.post("/clbs/m/functionconfig/fence/bindfence/bigDataMonitorTree")
}
/**根据id获取子节点**/
export function getCNodes(data){
  return request.post("clbs/m/functionconfig/fence/bindfence/new/putMonitorByAssign",data)
}
// 车牌搜索
export function searchPalteNo(search=""){
  return request.get("/app/track/provideShowData?search="+search)
}
/** Search 车辆信息**/ 
export function queryLocal(bvId){
  return request.get("/swagger/m/monitoring/monitor/location/latest",bvId)
}
/** 轨迹 **/ 
export function trackQuery(plateno,stime,etime){
  return request.get("/swagger/m/monitoring/monitor/location/history",{
    name:plateno,
    startTime:stime,
    endTime:etime
  })
}
//获取车辆树
export function getTrees(data){
  return request.postForm("/swagger/m/bindfence/vehicelTree",data)
}
//首页获取分组组织树
export function getOrgTree(data){
  return request.postForm("/swagger/m/assignment/assignmentTree",data)
}
//查询组织下的车辆
export function getVehicle(data){
  return request.postForm(`/m/functionconfig/fence/bindfence/new/putMonitorByAssign`,data)
}