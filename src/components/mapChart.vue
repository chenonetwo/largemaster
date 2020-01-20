<template>
  <div style="height:100%;position:relative;">
    <div class="flex-box">
      <div class="flex-item">
        <div>
          <span class="iconfont icon-huiyuan"></span>
          <h5>总用户</h5>
        </div>
        <div class="total-data">{{total.newuser}}</div>
      </div>
      <div class="flex-item">
        <div>
          <span class="iconfont icon-huiyuan-copy"></span>
          <h5>总会员</h5>
        </div>
        <div class="total-data">{{total.vip}}</div>
      </div>
      <div class="flex-item">
        <div>
          <span class="iconfont icon-tingyinle"></span>
          <h5>闻音报告</h5>
        </div>
        <div class="total-data">{{total.wenyin}}</div>
      </div>
      <div class="flex-item">
        <div>
          <span class="iconfont icon-tizhi"></span>
          <h5>体质报告</h5>
        </div>
        <div class="total-data">{{total.tizhi}}</div>
      </div>
      <div class="flex-item">
        <div>
          <span class="iconfont icon-jieguoyemiantubiao_zhengzhuangzhengxing"></span>
          <h5>证型报告</h5>
        </div>
        <div class="total-data">{{total.zhengxing}}</div>
      </div>
    </div>
    <div ref="mapDom" class="map_dom"></div>
    <div class="map_b_con" ref="map_con">
      <div class="map_bottom">
        <img src="../assets/images/map-rootbg.png" />
      </div>
    </div>
  </div>
</template>

<script>
import china from "echarts/map/js/china.js";
export default {
  name: "mapChart",
  props: ["mapData", "isLunbo", "lbTime"],
  data() {
    return {
      mapChart: null,
      geoCoordMap: {
        北京: [116.4551, 40.2539],
        上海: [121.48, 31.22],
        天津: [117.4219, 39.4189],
        重庆: [108.384366, 30.439702],
        内蒙古: [110.3467, 41.4899],
        黑龙江: [127.9688, 45.368],
        吉林: [125.8154, 44.2584],
        辽宁: [123.1238, 42.1216],
        河北: [114.4995, 38.1006],
        河南: [113.4668, 34.6234],
        山西: [112.3352, 37.9413],
        陕西: [109.1162, 34.2004],
        山东: [117.1582, 36.8701],
        甘肃: [103.5901, 36.3043],
        宁夏: [106.3586, 38.1775],
        青海: [101.4038, 36.8207],
        新疆: [87.9236, 43.5883],
        西藏: [91.11, 29.97],
        四川: [103.9526, 30.7617],
        江苏: [118.8062, 31.9208],
        安徽: [117.29, 32.0581],
        湖北: [114.3896, 30.6628],
        湖南: [113.0823, 28.2568],
        浙江: [119.5313, 29.8773],
        "福建": [119.4543, 25.9222],
        江西: [116.0046, 28.6633],
        贵州: [106.6992, 26.7682],
        云南: [102.9199, 25.4663],
        广东: [113.12244, 23.009505],
        广西: [108.479, 23.1152],
        海南: [110.3893, 19.8516],
        台湾: [121.4648, 25.563]
      },
      indexItem: 1, // 轮播下标
      graph: null, // 地图数据
      hasValueData: [], // 省份存在数据
      total: [],
      jingluo: null, //省份闻音报告
      tizhi: null, //省份体质报告
      cert: null, //省份证型报告
      timer: null // 定时任务初始化
    };
  },
  watch: {
    mapData() {
      this.hasMapData();
    },
    isLunbo() {
      this.actionTips();
    }
  },
  methods: {
    hasMapData() {
      if (this.mapData) {
        this.graph = this.mapData.graph;
        this.total = this.mapData.total;
        this.jingluo = this.mapData.jingluo;
        this.cert = this.mapData.cert;
        this.tizhi = this.mapData.tizhi;
        this.getData();
        this.actionTips();
      }
    },
    initChart() {
      this.mapChart = this.$echarts.init(this.$refs.mapDom);
      this.mapChart.showLoading({
        text: "加载中...",
        maskColor: "rgba(0, 0, 0, 0.3)",
        textColor: "#fff"
      });
      this.$er.listenTo(this.$refs.mapDom, el => {
        let height = el.offsetHeight;
        let width = el.offsetWidth;
        this.$nextTick(() => {
          this.mapChart.resize({ width: width, height: height });
        });
      });
    },
    drawMapChart() {
      let self = this;
      var convertData = function(data, type) {
        /*type:1 地图参数；type:2数据参数*/
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = self.geoCoordMap[data[i].name];
          if (geoCoord) {
            if (type == 2) {
              res.push({
                name: data[i].name,
                // value: geoCoord.concat(data[i].value),
                value: Math.random(100),
                address: data[i].address
              });
            } else {
              res.push({
                name: data[i].name,
                // value: geoCoord.concat(data[i].value)
                value: Math.random(100)
              });
            }
          }
        }
        return res;
      };
      var yData = [];
      var barData = this.graph;
      for (var j = 0; j < barData.length; j++) {
        if (j < 10) {
          yData.push("0" + j + barData[j].name);
        } else {
          yData.push(j + barData[j].name);
        }
      }
      let option = {
        grid: {
          right: 0,
          top: 3,
          bottom: 0,
          left: "75.5%",
          containLabel: true
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(29,71,256,0.8)"
        },
        yAxis: {
          areaStyle: {
            color: ["rgba(0,0,0,0.3)"]
          },
          type: "category",
          inverse: true,
          nameGap: 16,
          width: 30,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#ddd"
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: "#ddd"
            }
          },
          axisLabel: {
            interval: 0,
            margin: 34,
            textStyle: {
              color: "#fff",
              align: "left",
              fontSize: 6
            },
            rich: {
              a: {
                color: "#fff",
                backgroundColor: "#ef2cb4",
                width: 10,
                height: 10,
                align: "center",
                borderRadius: 2,
                fontSize: 6
              },
              b: {
                color: "#fff",
                backgroundColor: "#66cf37",
                width: 10,
                height: 10,
                align: "center",
                borderRadius: 2,
                fontSize: 6
              }
            },
            formatter: function(params) {
              if (parseInt(params.slice(0, 2)) < 3) {
                return [
                  "{a|" +
                    (parseInt(params.slice(0, 2)) + 1) +
                    "}" +
                    "" +
                    params.slice(2)
                ].join("\n");
              } else {
                return [
                  "{b|" +
                    (parseInt(params.slice(0, 2)) + 1) +
                    "}" +
                    "" +
                    params.slice(2)
                ].join("\n");
              }
            }
          },
          data: yData
        },
        xAxis: [
          {
            show: false,
            type: "value",
            scale: true,
            name: "用户数",
            min: 0,
            boundaryGap: [0, 0],
            containLabel: true
          }
        ],
        geo: {
          map: "china",
          center: [113.83531246, 34.0267395887],
          label: {
            show: true,
            fontSize: 6,
            color: "#ffffff",
            emphasis: {
              color: "white",
              show: false
            }
          },
          roam: false, //是否允许缩放
          top: 50,
          left: "13.5%",
          right: "4%",
          // right: "210",
          zoom: 1, //默认显示级别
          //缩放级别
          itemStyle: {
            normal: {
              borderColor: "rgba(147, 235, 248, 1)",
              borderWidth: 1,
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(147, 235, 248, 0)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(147, 235, 248, .2)" // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              shadowColor: "rgba(128, 217, 248, 1)",
              // shadowColor: 'rgba(255, 255, 255, 1)',
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10
            },
            emphasis: {
              areaColor: "#389BB7",
              borderWidth: 0
            }
          },
          tooltip: {
            show: true,
            fromatter: ""
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo",
            z: 10,
            data: this.hasValueData.map(item => {
              let obj = {};
              let name = item.name;
              obj.name = item.name;
              obj.value = this.geoCoordMap[item.name];
              obj.tizhi = this.tizhi[name];
              obj.wenyin = this.jingluo[name];
              obj.zhengxing = this.cert[name];
              if (obj.value) {
                obj.value[2]=item.value;
                return obj;
              } else {
                return;
              }
            }),
            tooltip: {
              trigger: "item",
              formatter( params ) {
                let str =
                  "<div style='font-size:0.2rem;line-height:0.5rem;padding:0.01rem;'>";
                str +=
                  '<span style="display:inline-block; width:2.5rem; ">' +
                  "<b style='display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffeb3b;margin-right:4px;'></b><b style='font-size:0.6rem;'>" +
                  params.name +
                  " </b></span><span style='color:#fff;'>|</span> 用户数：" +
                  params.data.value[2];
                let tizhi = "",
                  wenyin = "",
                  zhengxing = "";
                if (params.data.tizhi) {
                  tizhi =
                    "<div style='margin-left:0.1rem; line-height:0.8rem;'>" +
                    "体质报告：<span style='display:inline-block; width:1.2rem; font-size:0.2rem;'>" +
                    params.data.tizhi +
                    "</span></div>";
                }
                if (params.data.wenyin) {
                  wenyin =
                    "<div style='margin-left:0.1rem; line-height:0.8rem;'>" +
                    "闻音报告：<span style='display:inline-block; width:1.2rem;'>" +
                    params.data.wenyin +
                    "</span></div>";
                }
                if (params.data.zhengxing) {
                  zhengxing =
                    "<div style='margin-left:0.1rem; line-height:0.8rem;'>" +
                    "证型报告：<span style='display:inline-block; width:1.2rem;'>" +
                    params.data.zhengxing +
                    "</span></div>";
                }
                if (tizhi || wenyin || zhengxing) {
                  str += "<hr style='margin:6px 0;'/>";
                  str += tizhi;
                  str += wenyin;
                  str += zhengxing;
                }
                return str;
              },
              borderColor: "#fff",
              borderWidth: 1
            },
            symbolSize: function(val) {
              if (val) {
                if (val[2] / 2 > 10) {
                  return 10;
                } else if (val[2] == 0) {
                  return 0;
                } else if (val[2] / 2 < 5) {
                  return 5;
                } else {
                  return val[2] / 2;
                }
              }
            },
            itemStyle: {
              color: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255,235,59,1)" // 0% 处的颜色
                  },
                   {
                    offset: 0.5,
                    color: "rgba(255,235,59,1)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(255,235,59,0.3)" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
              // color: "#feae21"
            }
          },
          {
            type: "scatter", // 添加钓鱼岛
            coordinateSystem: "geo",
            data: [{ name: "钓鱼岛", value: [123.0254, 25.1986, 30] }],
            symbolSize: 1,
            itemStyle: {
              color: "#050a2b"
            },
            label: {
              normal: {
                show: true,
                formatter: params => {
                  return params.name;
                },
                position: "top",
                textStyle: {
                  color: "#fff",
                  fontSize: 6
                }
              },
              emphasis: {
                show: false
              }
            }
          },
          {
            name: "用户数",
            type: "bar",
            roam: false,
            animation: false,
            visualMap: false,
            zlevel: 2,
            barWidth: 8,
            barMaxWidth: 28,
            barGap: 0,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: "#ef2cb4"
                        },
                        {
                          offset: 1,
                          color: "#ef8554"
                        }
                      ]
                    },
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: "#66cf37"
                        },
                        {
                          offset: 1,
                          color: "#24a5cd"
                        }
                      ]
                    }
                  ];
                  if (params.dataIndex < 3) {
                    return colorList[0];
                  } else {
                    return colorList[1];
                  }
                },
                barBorderRadius: [0, 15, 15, 0]
              }
            },
            label: {
              normal: {
                fontSize: 8,
                show: true,
                textBorderColor: "#fff",
                textBorderWidth: 0,
                textStyle: {
                  lineHeight: 10
                },
                position: [0, 0],
                color: "#fff"
              }
            },
            data: barData.sort((a, b) => {
              return b.value - a.value;
            })
          }
        ]
      };

      if (this.mapChart) {
        this.mapChart.clear();
      }
      this.initChart();
      if (option && typeof option === "object") {
        this.mapChart.setOption(option, true);
      }
      this.mapChart.hideLoading();
      this.mapChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: 0
      });
      // this.actionTips();
    },
    actionTips() {
      if (this.isLunbo) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        if (this.hasValueData.length > 0) {
          this.timer = setInterval(() => {
            if (this.indexItem >= this.hasValueData.length) {
              this.indexItem = 0;
            }
            this.mapChart.dispatchAction({
              type: "showTip",
              seriesIndex: 0,
              dataIndex: this.indexItem
            });
            this.indexItem++;
          }, this.lbTime);
        }
      } else {
        clearInterval(this.timer);
      }
    },
    getData() {
      this.hasValueData = [];
      let arr = this.graph;
      arr.sort((a, b) => {
        return b.value - a.value;
      });

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value > 0 && arr[i].name != "未知") {
          this.hasValueData.push(arr[i]);
        } else {
          continue;
        }
      }
      this.drawMapChart();
    }
  },
  mounted() {
    this.hasMapData();
  },
  created() {},
  beforeDestroy() {
    if (this.mapChart) {
      this.mapChart.clear();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map_dom {
  position: absolute !important;
  top: 4.1rem;
  bottom: 0;
  width: 100%;
}
.flex-box {
  display: flex;
  height: 3.5rem;
  margin-bottom: 0.6rem;
}
.flex-item {
  &:last-child {
    margin-right: 0;
  }
  &:first-child {
    margin-left: 0;
  }
  .iconfont {
    color: #f25454;
    float: left;
    padding-right: 0.1rem;
    font-size: 0.8rem;
    margin-top: 0.1rem;
  }
  background: rgba(10, 29, 68, 0.45);
  .total-data {
    font-size: 0.8rem;
    font-weight: 600;
    color: #54dcf2;
    text-align: center;
  }
  flex: 1;
  height: 3.4rem;
  border: 1px solid #54dcf2;
  box-shadow: 0 0 4px 1px #54dcf2;
  margin: 0rem 0.1rem 0;
  padding: 0.3rem;
  border-radius: 4px;
  h5 {
    margin-top: 0.18rem;
    margin-bottom: 0.3rem;
    font-size: 0.6rem;
    color: #f2ba54;
    font-weight: 600;
    line-height: 1rem;
  }
}

.map_b_con {
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
  margin-top: -4rem;

  .map_bottom {
    height: 100%;
    transform: rotateX(80deg);
    -webkit-transform: rotateX(80deg);
    margin-top: 7rem;
    img {
      position: absolute;
      bottom: 0px;
      left: 5%;
      right: 0;
      margin: auto;
      display: inline-block;
      width: 75%;
      -webkit-animation: fa-spin-dir 12s infinite linear;
      animation: fa-spin-dir 12s infinite linear;
      margin-left: -0.1rem;
    }
  }
}
@-webkit-keyframes fa-spin-dir {
  0% {
    -webkit-transform: rotate(359deg);
    transform: rotate(359deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}

@keyframes fa-spin-dir {
  0% {
    -webkit-transform: rotate(359deg);
    -moz-transform: rotate(359deg);
    transform: rotate(359deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}
</style>

