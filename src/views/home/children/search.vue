<template>
  <div class="search">
    <form action="/">
      <van-search
        v-model="value"
        shape="round"
        placeholder="请输入车牌号"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
        @blur="onBlur"
        ref="search"/>
    </form>
    <!-- 搜索记录 -->
    <div class="record" v-show="cordShow">
      <ul id="ztree" class="ztree"></ul>
      <div class="cord_bottom">
        <van-row type="flex" gutter="30" justify="center">
          <van-col :span="6">
            <van-button type="info" plain @click="btnCancel">取消</van-button>
          </van-col>
          <van-col :span="6">
            <van-button type="info" @click="btnConfirm">确定</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
import '@/assets/css/zTreeStyle.css'
import "@/assets/js/jquery.ztree.core.min.js"
import "@/assets/js/jquery.ztree.excheck.min.js"
import "@/assets/js/jquery.ztree.exhide.min.js"
import { getPNodes, queryLocal, searchPalteNo, getTrees, getOrgTree, getVehicle } from 'network/home'
import toTreeByRecursion from './tree'
import pako from 'pako'
import axios from 'axios'
import qs from 'qs'

export default {
  name:'search',
  data(){
    return {
      vehicles:[],
      value:'',
      cordShow:false,
      isfetch:true,
      treeObj:null,
      noData: false,
      treeId: 'ztree',
      treeObj: '',
      nodes: [],
      allNodes: [],
      nodesShow: [],
      setting:{
        check: { 
          enable: true, 
          nocheckInherit: false ,
          chkboxType: { "Y": "", "N": "" }
          },
        data: { 
          simpleData: { 
            enable: true,
            idKey: 'id',
            pIdKey: 'pId',
            rootPId: 0 
          } 
        },
        callback: {
          onClick: this.zTreeOnClick,
          onCollapse:this.Collapse,
          onCheck:this.onchecked,
          onExpand:this.Expand
			  },
        view: {
          showIcon: false,
          nameIsHTML: true,            
          selectedMulti: false,
          dblClickExpand:false
        },
        // async: {
        //   enable: true,
        //   autoParam: ["id=treeCode"],
        //   url:'/app/track/provideShowData',
        //   // otherParam:{"treeCode":"1"},
        //   type:'post',
        //   dataFilter:function(treeId, parentNode, childNodes){
        //     console.log(parnetNode);
        //   }
        // }
      },
      zNodes:[
              { id:1,pid:0,name:"大良造菜单",open:true,nocheck:true,iconOpen:"/src/assets/image/increase.png", iconClose:"/src/assets/image/reduce.png",
                children: [
                    { id:11,pid:1,name:"当前项目"},
                    { id:12,pid:1,name:"工程管理",open:true,nocheck:true,
                        children: [
                            { id:121,pid:12,name:"我的工程"},
                            { id:122,pid:12,name:"施工调度"},
                            { id:1211,pid:12,name:"材料竞价"}
                        ]
                    },
                    { id:13,pid:1,name:"录入管理",nocheck:true,open:true,
                        children: [
                            { id:131,pid:13,name:"用工录入"},
                            { id:132,pid:13,name:"商家录入"},
                            { id:1314,pid:13,name:"机构列表"}
                        ]
                    },
                    { id:14,pid:1,name:"审核管理",nocheck:true,open:true,
                        children: [
                            { id:141,pid:14,name:"用工审核"},
                            { id:142,pid:14,name:"商家审核"},
                            { id:145,pid:14,name:"机构审核"}
                        ]
                    },
                    { id:15,pid:1,name:"公司管理",open:true,nocheck:true,
                        children: [
                            { id:1517,pid:15,name:"我的工程案例"},
                            { id:1518,pid:15,name:"联系人设置"},
                            { id:1519,pid:15,name:"广告设置"}
                        ]
                    },
                    { id:16,pid:1,name:"业务管理",nocheck:true,open:true,
                        children: [
                            { id:164,pid:16,name:"合同范本"},
                            { id:165,pid:16,name:"合同列表"},
                            { id:166,pid:16,name:"需求调度"}
                        ]
                    },
                    { id:17,pid:1,name:"订单管理",open:true,
                        children: [
                            { id:171,pid:17,name:"商品订单"},
                            { id:172,pid:17,name:"用工订单"},
                            { id:175,pid:17,name:"供应菜单"}
                        ]
                    },
                    { id:18,pid:1,name:"我的功能",open:true,nocheck:true,
                        children: [
                            { id:181,pid:18,name:"免费设计"},
                            { id:182,pid:18,name:"装修报价"},
                            { id:1817,pid:18,name:"项目用工"}
                        ]
                    },
                    { id:19,pid:1,name:"分润管理",open:true,nocheck:true,
                        children: [
                            { id:191,pid:19,name:"分润列表"}
                        ]
                    },
                    { id:110,pid:1,name:"运营管理",open:true,nocheck:true,
                        children: [
                            { id:1101,pid:110,name:"代理列表"},
                            { id:1102,pid:110,name:"代售商品"}
                        ]
                    },
                ]
              }
      ],
      bvId:[],
      timer:null,
      autoParam:[]
    }
  },
  mounted(){
    // this.initzTree()
    this.getTred()
    
  },
  activated(){
    if(this.bvId.length){
      this.polling()
    }
  },
  deactivated(){
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    getTred(){
      getTrees({type:'single'}).then(res => {
        console.log(res);
      })
    },
    onSearch(e){
      this.$emit('Search',e)
    },
    onCancel(e){
      this.$emit('Cancel',e)
    },
    //搜索框得到焦点时
    onFocus(){
      if(this.isfetch){
        this.isfetch = false
        this.cordShow = true
        //
        this.fetch()
      }
    },
    onBlur(){
      return false
    },
    //关闭按钮
    btnCancel(){
      this.cordShow = false
      this.isfetch = true
    },
    //确定按钮
    btnConfirm(){
      let str = ''
      this.bvId = []
      //获取选中的项
      let checked = this.treeObj.getChangeCheckedNodes(true)
      //筛选叶子节点
      checked = checked.filter(item => !item.children)
      if(checked.length){
        checked.forEach(val => {
          str+=val.name+','
          this.bvId.push(val.id)
        })
        str = str.substr(0,str.length-1)
        this.value = str
        this.queryCar(this.bvId)
      }
      this.cordShow = false
      this.isfetch = true
    },
    queryCar(bvId){
      queryLocal(bvId).then(res => {
        console.log(res);
        let data = res.data
        if(data.status === '0'){
          this.$Bus.$emit('getlocal',data.result.vehicle)
          this.polling()
        }else{
          this.$notify({ type: 'primary', message: data.msg});
        }
      })
    },
    //被折叠
    Collapse(event, treeId, treeNode){
      console.log(treeNode);
    },
    //展开时请求子节点
    Expand(event, treeId, treeNode){
      if(treeNode.children){
        return false
      }
      // this.getZNodes(treeNode)
    },
    getZNodes(treeNode){
      getVehicle({assignmentId:treeNode.id}).then(res => {
        let data = res.data
        let result = this.unzip(res.data.msg)
        console.log(result);
        let nodes = []
        // if(data.status == 0){
        //   let org = result.data.org
        //   let bv = result.data.bv
        //   if(org){
        //     org.forEach(val => {
        //       let obj = {}
        //       obj.id = val.id
        //       obj.name = val.orgName
        //       obj.pid = val.parentId
        //       obj.isParent = true
        //       obj.nocheck = true
        //       nodes.push(obj)
        //     })
        //     this.treeObj.addNodes(treeNode,-1,nodes,true)
        //   }
        //   if(bv){
        //     nodes = []
        //     bv.forEach(val=>{
        //       let obj = {}
        //       obj.id = val.ve.id
        //       obj.name = val.ve.plateNo
        //       obj.simNo = val.ve.simNo
        //       obj.orgId = val.ve.orgId
        //       nodes.push(obj)
        //     })
        //     console.log(nodes);
        //     this.treeObj.addNodes(treeNode,-1,nodes,true)
        //   }
          // this.treeObj.updateNode(treeNode,false)
          // console.log(this.zNodes);
        // }
      })
    },
    initzTree(){
      $.fn.zTree.init($("#"+this.treeId), this.setting, this.zNodes).expandAll(false);
      this.treeObj = $.fn.zTree.getZTreeObj("ztree")
      var nodes = this.treeObj.getNodes()
      this.allNodes = this.queryFun(nodes)
      this.nodes = []
    },
    zTreeOnClick(event, treeId, treeNode){
      let checked = this.treeObj.getCheckedNodes(true)
      console.log(treeNode);
      if(treeNode.isParent){
        if(treeNode.open){
          this.treeObj.expandNode(treeNode,false)
        }else{
          if(treeNode.children){
            this.treeObj.expandNode(treeNode,true)
            return false
          }
          this.treeObj.expandNode(treeNode,true)
          this.getZNodes(treeNode)
        }
        return
      }
      if(checked.length > 2){
        if(!treeNode.checked){
          this.$Toast({message:'请最多选择三个',duration:1500})
          this.treeObj.cancelSelectedNode(treeNode)
        }else{
          this.treeObj.checkNode(treeNode,'',false)
        }
      }else{
        this.treeObj.checkNode(treeNode,'',true)
      }
    },
    onchecked(event, treeId, treeNode){
      let checked = this.treeObj.getCheckedNodes()
      console.log(checked);
      if(checked.length > 3){
        if(treeNode.checked){
          this.$Toast({message:'请最多选择三个',duration:1500})
          this.treeObj.checkNode(treeNode,'',true)
          // this.treeObj.cancelSelectedNode(treeNode)
        }
      }
    },
    queryFun(node) {
      for (var i in node) {
        this.nodes.push(node[i])
        if (node[i].children) {
          this.queryFun(node[i].children)
        }
      }
      return this.nodes
    },
    //无限级菜单遍历
    getTreeData(list){
        var treeData=[];
        var map={};
        list.forEach(function (item) {
          item.nocheck = true
            item['name']=item.name;
            item["isParent"] = true
            map[item.id]=item;
        })
        list.forEach(function (item) {
            var parent = map[item.pId];
            if (parent) {
                (parent.children || ( parent.children = [] )).push(item);
            } else {
                treeData.push(item);
            }
        })
        return treeData;
    },
    //
    fetch(){
      getOrgTree({isOrg:1}).then(res => {
        console.log(res);
        let data = res.data
        if(data.success){
          if(data.obj){
            this.zNodes = []
            let treenode = []
            this.zNodes = this.getTreeData(data.obj)
            //初始化树组织
            this.initzTree()
          }
        }else{
          this.$notify({type:'primary',message:data.message})
        }
      })
    },
    //对车辆位置做轮询
    polling(){
      if(this.timer){
        clearInterval(this.timer)
      }
      this.timer = setInterval(()=> {
        queryLocal(this.bvId).then(res => {
          console.log(res);
          let data = res.data
          if(data.status == 0){
            this.$Bus.$emit('getlocal',data.result.vehicle)
          }else{
            this.$notify({ type: 'primary', message: data.msg});
          }
        })
      },30000)
    },
    // 解析压缩包数据
    unzip(key) {
      if(key){
        let charData = key.split('').map(item => item.charCodeAt(0))
        let array = pako.inflate(charData)
        // 如果字符太大，会导致内存溢出报错，这里使用分片处理
        return this.Utf8ArrayToStr(array)
      }
    },
    Utf8ArrayToStr(array) {
      var out, i, len, c;
      var char2, char3;
      out = "";
      len = array.length;
      i = 0;
      while (i < len) {
        c = array[i++];
        switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
          case 12:
          case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
          case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(((c & 0x0F) << 12) |
              ((char2 & 0x3F) << 6) |
              ((char3 & 0x3F) << 0));
            break;
        }
      }
      return JSON.parse(out)
    },
  },
  watch: {
    value(newV) {
      //本地搜索
      // this.searchFun(newV, false, false)
      if(newV.length>=3 && newV){
        searchPalteNo(newV).then(res=>{
          console.log(res);
          let data = res.data
          let result = this.unzip(res.data.result)
          if(data.status === '0'){
            let bv = result.data.bv
            // let bv = res.data.result.data.bv
            if(bv){
              this.zNodes = []
              bv.forEach(val=>{
                let obj = {}
                obj.id = val.ve.id
                obj.name = val.ve.plateNo
                obj.simNo = val.ve.simNo
                obj.orgId = val.ve.orgId
                this.zNodes.push(obj)
              })
              this.initzTree()
            }
          }else{
            this.$notify("无此车辆信息")
          }
        })
      }
    },
    cordShow(newVal){
      if(newVal){
        $(".van-tabbar--fixed").hide()
      }else{
        $(".van-tabbar--fixed").show()
      }
    }
  },
}
</script>

<style scopd>
.search{
}
.record{
  width: 100%;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 50px;
  z-index: 111;
  background: #fff;
}
.cord_bottom{
  width: 100%;
  position: absolute;
  bottom: 0.1rem;
  left: 0;
}
.ztree{
  width:90%;
  padding-left: 0.2rem;
  padding-top: 0.08rem;
  height: calc(100% - 50px);
  overflow-y: auto;
}
.van-button--normal{
  height: 30px;
  width: 100%;
}
.ztree li span.button{
  /* width: 0.2rem;
  height: 0.2rem;
  border: 0.01rem solid #ccc; */
  /* background: url("~assets/image/increase.png"); */
}
</style>