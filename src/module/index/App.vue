<template>
  <div id="app">
    <Media v-show="MediaShow"></Media>
    <div class="ButtonMediaShow" @click="ButtonMediaShow">
      点击
    </div>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  import Media from 'components/Media/Media';
  import {bus} from '../../common/js/bus.js';
  import config from '../../common/js/config.js';
  import $ from 'jquery';
  import cookie from 'jquery.cookie';
  const token = $.cookie('token');
  export default {
    name: 'app',
    components: {Media},
    data(){
      return{
        MediaShow:false,
      }
    },
    created(){
      bus.$on('PropsData',(text)=>{
        console.log(text)
      });
      bus.$on('MediaShow',(text)=>{
        this.MediaShow = text;
      })
    },
    methods:{
      //判断点击是视频还是图片
      ButtonMediaShow(){
        this.MediaShow = true;
        // bus.$emit('VideoPicture',0);
        // bus.$emit('MediaShow',true);
        bus.$emit('arguments',{'VideoPicture':0,'MediaShow':true,'InputTypeFlag':false});
      },
    }
  }
</script>

<style>
  .ButtonMediaShow{
    width: 200px;
    height: 100px;
    background: yellow;
    color: red;
    font-size: 16px;
    text-align: center;
  }
</style>
