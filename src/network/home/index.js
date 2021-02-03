import request from '../request'
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
/** Search**/ 
export function queryLocal(bvId){
  return request.get("/app/vehicle/provideBVehicleInfo?bvId="+bvId.join(','))
}
/** 轨迹 **/ 
export function trackQuery(plateno,stime,etime){
  return request.get("/app/track/getCarHistory",{
    plateNo:plateno,
    startTime:stime,
    endTime:etime
  })
}