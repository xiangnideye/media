<template>
  <div class="media-Parent">
    <div class="media-Bg"></div>
    <div class="media-Box">
      <div class="media-Box-title">{{mediaBoxtitle}}</div>
      <div class="media-Box-leftMenu">
        <ul class="leftMenu-ul">
          <li v-for='(leftMenu,index) in MenuArr' class="leftMenu-ul-li" @click="clickLeftMenu(leftMenu.id,leftMenu.type,$event,leftMenu.groupName)">{{leftMenu.groupName}}</li>
        </ul>
        <span class="leftMenu-add" @click="AddCategory">
          <span class="leftMenu-add-span">Add Category</span>
        </span>
        <div class="leftMenu-AddCategory" v-show='AddCategoryShow'>
          <span class="leftMenu-border-left"></span>
          <div class="leftMenu-Form">
            <div class="leftMenu-div">
              <span class="leftMenu-div-name">Category Name</span>
              <input type="text" name="" value="" class="leftMenu-div-input" v-model='CategoryName' @click="foucsprompt">
            </div>
            <div class="leftMenu-div">
              <span class="leftMenu-div-name">Retype</span>
              <input type="text" name="" value="" class="leftMenu-div-input" v-model='Retype' @click="foucsprompt">
            </div>
            <p class="leftMenu-prompt" v-show="prompt">Confirmation is not the same</p>
            <p class="leftMenu-prompt" v-show="prompt1">Please fill in the content</p>
          </div>
          <div class="leftMenu-button">
            <span class="leftMenu-button-left" @click="AddCategoryCancel">Cancel</span>
            <span class="leftMenu-button-right" @click="AddCategoryConfirm">Confirm</span>
          </div>
        </div>
      </div>
      <div class="media-Box-rightMain">
        <div class="media-Box-mainTitle">
          <span class="media-Box-leftMenuTitle">{{leftMenuTitle}}</span>
          <div class="mainTitle-Box">
            <input type="file" class="media-Box-input"  @change='ClickUpload($event)' id='AddNewFile'>
            <span class='media-Box-span'>+ Add New</span>
          </div>
        </div>
        <div class="media-Box-PicList clear">
          <div class="media-div-combination" v-for="(Picture,index) in PictureArr">
            <img :src="Picture.materialUrl" :alt="Picture.alt" class="combination-img" v-if="ImgVideoFlag">
            <video :src="Picture.materialUrl" controls v-else class="combination-img"></video>

            <input type="checkbox" name="Picture" :value="Picture.id" class="combination-input" v-model='ButtonArr' v-if="InputTypeFlag" @click="clickPushArr(Picture,index)">

            <input type="radio" name="Picture" :value="Picture.id" class="combination-input" v-model='ButtonArr' v-else @click="clickPushArr(Picture,index)">
            <span class="combination-title">{{Picture.materialName}}</span>
          </div>
        </div>
        <div class="media-Box-Page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[8, 12, 16, 20]"
            :page-size="this.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.currentTotal">
          </el-pagination>
        </div>
        <div class="media-Box-button">
          <span class="button-left" @click="clickCancel">Cancel</span>
          <span class="button-right" @click='clickConfirm'>Confirm</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import {bus} from '../../common/js/bus.js';
  import config from '../../common/js/config.js';
  import cookie from 'jquery.cookie';
  const token = $.cookie('token');

export default {
  name: 'media-Parent',
  data () {
    return {
      MediaShow:false,
      prompt:false,
      prompt1:false,
      CategoryName:'',
      Retype:'',
      AddCategoryShow:false,
      ReturnArr:[],
      ImgVideoFlag:true,
      InputTypeFlag:true,
      mediaBoxtitle: 'Add Picture',
      leftMenuTitle:'All',
      PictureArr:[],
      ButtonArr:[],
      midarr:[],
      MenuArr:[],
      page:1,
      pageSize:8,
      type:0,
      currentPage: 1,
      currentTotal:0,
      groupId:0,

    }
  },
  created (){
    bus.$on('arguments',(data)=>{
      this.InputTypeFlag = data.InputTypeFlag;
      this.type = data.VideoPicture;
      this.MediaShow = data.MediaShow;
    })
  },
  mounted (){
    // bus.$on('VideoPicture',(text)=>{
    //   this.type = text;
    //   this.CreatedFunction(this.type);
    // });
    // bus.$on('MediaShow',(text)=>{
    //   this.MediaShow = text;
    // });
  },
  methods:{
    CreatedFunction (type){
      let _this = this;
      //获取左侧导航栏
      config.getGrouplist(_this,token,type,function(response){
         _this.MenuArr = response;
         _this.clickLeftMenu(1,type);
      });
    },
    //获取右测图片或者视频
    clickLeftMenu(groupId,type,e,name){
      let _this = this;
      let _aLiArr = document.getElementsByClassName('leftMenu-ul-li');
      this.leftMenuTitle = name;
      if(e){
        for(let i = 0;i<_aLiArr.length;i++){
          _aLiArr[i].className = 'leftMenu-ul-li'
          if(_aLiArr[i] == e.target){
            _aLiArr[i].className += ' active';
          }
        };
      }
      this.groupId = groupId;
      this.ImgVideoFlag = type===0?true:false;
      config.getRightPic(_this,token,this.page,this.pageSize,groupId,this.type,function(response){
        _this.PictureArr = response.resultObj.data;
        _this.currentTotal = response.resultObj.recordsTotal;
        _this.pageSize = response.resultObj.pageSize;
        // bus.$emit('tip',response.resultObj.data)
      });
    },
    //上传图片或者视频
    UploadFile (filrPaht,e){
      // var path;
      //随机数
      let random = this.randomNumber();
      //创建实例
      let formData = new FormData();
      let _this = this;
      // if(this.type === 0){
      //   path = 'cc/blog/uploadImg';
      // }else {
      //   path = 'cc/blog/uploadVideo';
      // }
      formData.append('imgMediaFile', filrPaht);
      formData.append('groupId', this.groupId);
      formData.append('progressId', random);
      formData.append('access_token', token);
      // this.$http.post(config.port+path,formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((response)=>{
      //   if(response.body.error_code == 200){
      //     let responseData = response.body.resultObj;
      //     this.clickLeftMenu(this.groupId,this.type,e);
      //   }
      // })

      config.postFile(_this,formData,_this.type,e,(response)=>{
        console.log(response)
        // let responseData = response.body.resultObj;
        this.clickLeftMenu(_this.groupId,_this.type,e);
      });
    },
    //新增
    AddCategory(){
      this.AddCategoryShow = true;
    },
    //取消
    AddCategoryCancel(){
      this.AddCategoryShow = false;
    },
    //确定
    AddCategoryConfirm(){
      let _this = this;
      if(this.CategoryName != this.Retype){
        this.prompt = true;
      }else if (this.CategoryName == '' && this.Retype == '') {
        this.prompt1 = true;
      }
      if(this.prompt == true || this.prompt1 == true){
        return false
      }else {
        config.addGroup(_this,token,this.CategoryName,_this.type,(data)=>{
          this.AddCategoryShow = false;
          this.CreatedFunction(_this.type);
        })
      }
    },
    //每页 ${val} 条
    handleSizeChange(val) {
      let _this = this;
      this.pageSize = val;
      config.getRightPic(_this,token,this.page,this.pageSize,this.groupId,this.type,function(response){
        _this.PictureArr = response.resultObj.data;
        _this.currentTotal = response.resultObj.recordsTotal;
        _this.pageSize = response.resultObj.pageSize;
      })
      console.log(`每页 ${val} 条`);
    },
    //当前页: ${val}
    handleCurrentChange(val) {
      let _this = this;
      this.page = val;
      config.getRightPic(_this,token,this.page,this.pageSize,this.groupId,this.type,function(response){
        _this.PictureArr = response.resultObj.data;
        _this.currentTotal = response.resultObj.recordsTotal;
        _this.pageSize = response.resultObj.pageSize;
      })
      console.log(`当前页: ${val}`);
    },
    //保存 输出model
    clickConfirm(){
      bus.$emit('PropsData',this.ReturnArr)
    },
    //获取要返回的数据
    clickPushArr (list,index){
      let arrayindex = this.midarr.indexOf(list.id);
      if(arrayindex == -1){
        this.midarr.push(list.id);
        this.ReturnArr.push({
          'url':list.materialUrl,
          'id':list.id,
        })
      }else{
        this.midarr.splice(arrayindex,1);
        this.ReturnArr.splice(arrayindex,1);
      }
    },
    //点击上传
    ClickUpload (e){
      //文件路径
      let filrPaht = document.getElementById('AddNewFile').files[0];
      //调用判断上传文件大小
      this.fileSize(filrPaht,500,e);
    },
    //获取随机数字
    randomNumber() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    //上传文件判断格式、大小
    fileSize(file, maxSize,e){
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
        alert('请上传JPG、PNG、GIF格式的图片～');
        return false
      } else if (file.size > maxSize * 1024) {
        alert('上传图片不得大于500KB～');
        return false
      } else {
        this.upload_btn = false;
        this.photo_con = true;
        this.notice = false;
        this.UploadFile(file,e);
      }
    },
    //
    foucsprompt (){
      this.prompt = false;
      this.prompt1 = false;
    },
    clickCancel(){
      this.MediaShow = false;
      bus.$emit('MediaShow',this.MediaShow);
    }
  }
}
</script>

<style lang='less'>
  @width1100:1100px;
  @height684:684px;
  @height624:624px;
  .media-Parent{
    .media-Bg{
      position: fixed;
      top:0;
      left: 0;
      background: #000;
      opacity: 0.4;
      width: 100%;
      height: 100%;
      z-index:100;
    }
    .media-Box{
      width: @width1100;
      height: @height684;
      background: #fff;
      margin:100px auto;
      position: relative;
      z-index: 500;
      .media-Box-title{
        position: relative;
        z-index: 10;
        width: @width1100;
        height: 60px;
        line-height: 60px;
        background: #F9FAFC;
        box-shadow: 0 2px 6px 0 rgba(0,0,0,0.08);
        border-radius: 4px 4px 0 0;
        text-align: center;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #283644;
      }
      .media-Box-leftMenu{
        float: left;
        width: 200px;
        height:@height624;
        background: #F9FAFC;
        border-radius: 4px 4px 0 4px;
        position: relative;
        .leftMenu-ul{
          margin-top: 26px;
          .leftMenu-ul-li{
            width: 180px;
            height: 44px;
            line-height: 44px;
            font-family: 微软雅黑;
            font-size: 14px;
            color: #616161;
            text-align: left;
            padding-left: 20px;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.active{
              background: #fff;
              color: #4C9DFF;
            }
            &:hover{
              color: #4C9DFF;
            }
          }
        }
        .leftMenu-add{
          position: relative;
          .leftMenu-add-span{
            width: 160px;
            height: 32px;
            background: #4C9DFF;
            border-radius: 2px;
            text-align: center;
            line-height: 32px;
            display: block;
            margin: 40px auto;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: #FFFFFF;
            cursor: pointer;
          }
        }
        .leftMenu-AddCategory{
          position: absolute;
          bottom:120px;
          left: 200px;
          width: 362px;
          height: 235px;
          background: #404750;
          box-shadow: 0 0 10px 0 rgba(0,22,56,0.30);
          border-radius: 4px;
          z-index: 10;
          .leftMenu-border-left{
            position: absolute;
            top: 50%;
            left: -16px;
            width: 0;
            height: 0;
            border: 8px solid #404750;
            border-left-color: transparent;
            border-top-color: transparent;
            border-bottom-color: transparent;
            margin-top: -4px;
          }
          .leftMenu-Form{
            margin-top: 35px;
            position: relative;
            .leftMenu-div{
              width: 100%;
              height: 40px;
              margin-bottom: 26px;
              .leftMenu-div-name{
                font-family: MicrosoftYaHei;
                font-size: 14px;
                color: #FFFFFF;
                float: left;
                width: 106px;
                height: 40px;
                line-height: 40px;
                margin-left: 20px;
                text-align: right;
              }
              .leftMenu-div-input{
                width: 176px;
                height: 16px;
                margin-left: 16px;
                padding: 12px;
              }
            }
            .leftMenu-prompt{
              position: absolute;
              bottom: -22px;
              left: 141px;
              font-size: 12px;
              color: #FC3A3A;
            }
          }
          .leftMenu-button{
            width: 260px;
            height: 34px;
            display: block;
            margin: 30px auto;
            .leftMenu-button-left,.leftMenu-button-right{
              width: 120px;
              height: 34px;
              background: #FFFFFF;
              border: 1px solid #E6ECF2;
              border-radius: 2px;
              font-family: MicrosoftYaHei;
              font-size: 14px;
              color: #283644;
              float: left;
              text-align: center;
              line-height: 34px;
              cursor: pointer;
            }
            .leftMenu-button-right{
              background: #4C9DFF;
              color: #FFFFFF;
              margin-left: 16px;
              border: none;
            }
          }
        }
      }
      .media-Box-rightMain{
        float: left;
        width: 840px;
        height:@height624;
        .media-Box-mainTitle{
          margin-left: 30px;
          height: 72px;
          border-bottom: 1px solid #E6ECF2;
          .mainTitle-Box{
            position: relative;
            float: right;
            width: 120px;
            height: 32px;
            .media-Box-input,.media-Box-span{
              position: absolute;
              top:20px;
              right: 20px;
              width: 120px;
              height: 32px;
              line-height: 32px;
              text-align: center;
              color: #fff;
              cursor: pointer;
              background: #4C9DFF;
              border-radius: 2px;
              z-index: 100;
              opacity: 0;
            }
            .media-Box-span{
              z-index: 10;
              opacity: 1;
            }
          }
          .media-Box-leftMenuTitle{
            margin-top: 26px;
            font-family: AvenirNext-DemiBold;
            font-size: 14px;
            color: #283644;
            line-height: 14px;
            float: left;
          }
        }
        .media-Box-PicList{
          width: 867px;
          height: 350px;
          overflow-y: auto;
          margin: 30px 0 30px 30px;
          .media-div-combination{
            position: relative;
            width:200px;
            height: 165px;
            float: left;
            margin:0px 13px 20px 0px;
            background: #FFFFFF;
            box-shadow: 0 1px 6px 0 rgba(0,0,0,0.06);
            .combination-img{
              margin:10px;
              width: 180px;
              height: 115px;
            }
            .combination-input{
              position: absolute;
              top:16px;
              right: 16px;
              width: 20px;
              height: 20px;
            }
            .combination-title{
              position: absolute;
              bottom: 14px;
              left: 10px;
              width: 180px;
              height: 12px;
              line-height: 12px;
              text-align: center;
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #283644;
            }
          }
        }
        .media-Box-button{
          width: 270px;
          height: 32px;
          margin:30px auto;
          .button-left,.button-right{
            width: 120px;
            height: 32px;
            display: inline-block;
            background: #FFFFFF;
            border: 1px solid #E6ECF2;
            border-radius: 2px;
            line-height: 32px;
            text-align: center;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: #283644;
            cursor: pointer;
          }
          .button-right{
            background: #4C9DFF;
            color: #FFFFFF;
            margin-left: 16px;
          }
        }
      }
    }
  }
</style>
