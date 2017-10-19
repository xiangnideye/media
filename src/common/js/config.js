import Vue from 'vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.use(ElementUI);
const localhost = 'http://api.careerchina.com:8066/';
var selectData;
module.exports = {
  port:'http://api.careerchina.com:8066/',
  //获取左侧列表
  getGrouplist:function(_t,a,t,cb){
    var  _this = _t; _this.$http.get(localhost+'/cc/material/grouplist?access_token='+a+'&type='+t).then((response)=>{
       if(response.body.error_code == 200){
         cb(response.body.resultObj);
       };
    })
  },
  //获取右侧图片列表
  getRightPic:function(_t,a,p,s,id,t,cb){
    var  _this = _t;
    _this.$http.get(localhost+'/cc/material/page?access_token='+a+'&page='+p+'&pageSize='+s+'&groupId='+id+'&materialType='+t).then((response)=>{
      if(response.body.error_code == 200){
        selectData = response.body;
        cb(response.body);
      };
    })
  },
  //添加素材体库分组
  addGroup:function (_t,a,n,t,cb){
    var _this = _t;
    _this.$http.post(localhost+'cc/material/addgroup',
    {
      access_token:a,
      groupName:n,
      groupType:t
    },{emulateJSON:true}).then((response)=>{
      if(response.body.error_code == 200){
        cb(response.body)
      }
    })
  },
  //上传图片或者视频
  postFile:function (_t,f,t,e,cb){
    let _this = _t;
    let path;
    if(t === 0){
      path = 'cc/blog/uploadImg';
    }else {
      path = 'cc/blog/uploadVideo';
    }
    _this.$http.post(localhost+path,f,{headers: {'Content-Type': 'multipart/form-data'}}).then((response)=>{
      if(response.body.error_code == 200){
        cb(response.body)
      }
    })
  }
}
