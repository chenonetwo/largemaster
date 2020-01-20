<template>
  <div>
    <nav-top :carousel="carousel" :dataType="dataType" @getData="getData" @changeC="changeC"></nav-top>
    <div class="main-container">
      <div class="main-left main-item">
        <div class="border-container flex-item-1">
          <div class="name-title">经络音型视图(单位：人)</div>
          <div class="chart-contianer">
            <wen-yin :collateral="collateral" :isLunbo="carousel" :lbTime="lbTime"></wen-yin>
          </div>
          <span class="top-left border-span"></span>
          <span class="top-right border-span"></span>
          <span class="bottom-left border-span"></span>
          <span class="bottom-right border-span"></span>
        </div>
        <div class="border-container flex-item-1">
          <div class="name-title">体质类型视图(单位：人)</div>
          <div class="chart-contianer">
            <ti-zhi :somatotype="somatotype" :isLunbo="carousel" :lbTime="lbTime"></ti-zhi>
          </div>
          <span class="top-left border-span"></span>
          <span class="top-right border-span"></span>
          <span class="bottom-left border-span"></span>
          <span class="bottom-right border-span"></span>
        </div>
        <div class="border-container flex-item-1">
          <div class="name-title">脏腑证型视图(单位：人)</div>
          <zheng-su :qxz="qxz" :zf="zf" :isLunbo="carousel" :lbTime="lbTime"></zheng-su>
          <span class="top-left border-span"></span>
          <span class="top-right border-span"></span>
          <span class="bottom-left border-span"></span>
          <span class="bottom-right border-span"></span>
        </div>
      </div>
      <div class="main-center main-item">
        <div class="border-container flex-item-lg">
          <map-chart :mapData="map" :isLunbo="carousel" :lbTime="lbTime"></map-chart>
          <span class="top-left border-span"></span>
          <span class="top-right border-span"></span>
          <span class="bottom-left border-span"></span>
          <span class="bottom-right border-span"></span>
        </div>
      </div>
      <div class="main-right main-item">
        <div class="border-container flex-item-1">
          <div class="name-title">用户画像视图</div>
          <user-portriat :userData="userData" :isLunbo="carousel" :lbTime="lbTime"></user-portriat>
          <span class="top-left border-span"></span>
          <span class="top-right border-span"></span>
          <span class="bottom-left border-span"></span>
          <span class="bottom-right border-span"></span>
        </div>
        <div class="border-container flex-item-1">
          <div class="name-title" style="position:absolute;">活跃用户视图</div>
          <yong-hu
            :dateActiveList="dataActive"
            :monthActiveList="monthActiveList"
            :threndDate="threndDate"
            :lbTime="lbTime"
            :isLunbo="carousel"
          ></yong-hu>

          <span class="top-left border-span"></span>
          <span class="top-right border-span"></span>
          <span class="bottom-left border-span"></span>
          <span class="bottom-right border-span"></span>
        </div>
        <div class="border-container flex-item-1">
          <div class="name-title" style="position:absolute;">渠道分析视图</div>
          <qudao :isLunbo="carousel" :lbTime="lbTime" :channel="channel"></qudao>
          <span class="top-left border-span"></span>
          <span class="top-right border-span"></span>
          <span class="bottom-left border-span"></span>
          <span class="bottom-right border-span"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navTop from "./components/navTop.vue";
import mapChart from "./components/mapChart.vue";
import wenYin from "./components/wenYin.vue";
import zhengSu from "./components/zhengSu.vue";
import tiZhi from "./components/tiZhi.vue";
import yongHu from "./components/yongHu.vue";
import userPortriat from "./components/user_portriat.vue";
import active from "./components/active.vue";
import qudao from "./components/qudao.vue";

export default {
  name: "app",
  components: {
    mapChart,
    navTop,
    wenYin,
    zhengSu,
    tiZhi,
    userPortriat, //用户画像
    yongHu,
    active, // 活跃用户
    qudao
  },
  data() {
    return {
      carousel: false, // 轮播
      map: null,
      somatotype: null,
      collateral: null,
      userData: null,
      dataActive: null,
      monthActiveList: null,
      threndDate: null,
      startUserGrouplist: null,
      channel: null,
      qxz: null,
      zf: null,
      lbTime: 5000, // 轮播时间
      getDataTimer: 60 * 60 * 1000, // 获取数据定时间隔时间
      setTimer: null, //初始化获取数据定时任务
      dataType: "isReal", // 数据类型
      date: +new Date()
    };
  },
  methods: {
    changeC(data) {
      this.carousel = data;
    },
    getData(data) {
      let realBaseurl = "/getmax/getfakecount";
      let AnalogBaseurl = "/getmax/getcountmax";
      let url = realBaseurl;
      if(data == this.dataType){
        return;
      }
      if (data && data != this.dataType) {
        this.dataType = data;
        if (data == "isAnalog") {
          url = AnalogBaseurl;
        }
      }
      this.$http.get(url).then(res => {
        const {
          map,
          zangfu,
          collateral,
          somatotype,
          personas,
          useractive,
          channel // 渠道
        } = res.data.data;
        this.map = map; //地图
        this.collateral = collateral; //经络
        this.somatotype = somatotype.projectmap; //体质
        this.userData = personas; //性别
        this.qxz = zangfu.qxz; // qianxianzheng
        this.zf = zangfu.zf; // 脏腑类型
        this.channel = channel.total; // 渠道统计
        this.dataActive = useractive.dateActiveList; // 日活启动用户数
        this.monthActiveList = useractive.monthActiveList; //月活启动用户数
        this.threndDate = useractive.acitveDate; //活跃用户时间轴
      });
    }
  },
  created() {
    this.getData();
    this.setTimer = setInterval(() => {
      this.date = +new Date();
      this.getData();
    }, this.getDataTimer);
  },
  beforeDestroy() {
    clearInterval(this.setTimer);
  }
};
</script>
