<template>
  <div class="header">
    <a title="开始轮播" class="nav-btn" @click="changeCarouse(true)" href="javascript:void(0)" v-if="!this.carousel">
      <span class="iconfont icon-iconfontkaishi"></span>开启轮播
    </a>
    <a title="停止轮播" class="nav-btn" @click="changeCarouse(false)" href="javascript:void(0)" v-else>
      <span class="iconfont icon-kaishi"></span>暂停轮播
    </a>
    <a @click="reload()" title="刷新页面" class="nav-btn">
      <span class="iconfont icon-shuaxin1"></span>全局刷新
    </a>
    <a class="nav-btn" @click="changeData('isAnalog')"  v-if="this.dataType=='isReal'">
      <span class="iconfont icon-monishuju"></span>数据切换
    </a>
     <a class="nav-btn" @click="changeData('isReal')" :class="['dataType'=='isReal'? 'isActive':'']" v-else>
      <span class="iconfont  icon-xianshangshujuzhuyaofuwu"></span>数据切换
    </a>
  </div>
</template>
<script>
export default {
  name: "navTop",
  props:['carousel','dataType'],
  methods:{
    changeCarouse(data){
      this.$emit("changeC",data);
    },
    reload(){
      window.location.reload();
    },
    changeData(data){
      this.$emit('getData',data);
    }
  }
};
</script>
<style lang="scss">
.header {
  .nav-btn {
    text-decoration: none;
    &:hover,&:active,:focus,:visited{text-decoration: none;}
    margin: 0 6px;
    color: #00ffff;
    font-size: 0.8rem;
    .iconfont {
      font-size: 0.8rem;
      color: #00ffff;
      margin-right:2px;
    }
  }
}
</style>
