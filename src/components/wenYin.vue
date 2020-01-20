
<template>
  <div ref="chartDom" style="height:100%;width:100%"></div>
</template>
<script>
export default {
  name: "wenYin",
  props: ["collateral", "isLunbo", "lbTime"],
  data() {
    return {
      myChart: null, // chart 初始化
      indexItem: 1, // 轮播下标
      name: [], //总类名称
      nameF: [], //子类名称
      CountF: [], // 子类 值
      total: [], //合计
      source: {}, // 查询子类
      timer: null
    };
  },
  watch: {
    collateral(data) {
      this.getData(data);
    },
    isLunbo(data) {
      this.startTimer();
    },
    myChart(data) {
    }
  },
  
  methods: {
    getData(data) {
      if (data) {
        this.nameF = data.NameF;
        this.CountF = data.CountF;
        this.name = data.name;
        this.total = data.name.map((item, index) => {
          let obj = { name: item, value: data.total[0][index] };
          return obj;
        });
        let source = {};
        data.name.forEach((value, index) => {
          let arr = [];
          let itemsName = data.NameF[index];
          let itemsCount = data.CountF[index];
          itemsName.forEach((item, idx) => {
            let itemArr = [item, itemsCount[idx]];
            arr.push(itemArr);
          });
          arr.sort((a, b) => {
            return b[1] - a[1];
          });
          arr.unshift(["product", "nums"]);
          source[value] = arr;
        });
        this.source = source;
        this.setOption();
        this.startTimer();
      }
    },
    initChart() {
      this.myChart = this.$echarts.init(this.$refs.chartDom, "dark");
      this.myChart.showLoading({
        text: "加载中...",
        maskColor: "rgba(0, 0, 0, 0.3)",
        textColor: "#fff"
      });
    },
    setOption() {
      if( this.myChart){
        this.myChart.clear();
      }
      let option = {
        dataset: {
          source: this.source["宫"]
        },
        color: [
          "#d74e67",
          "#0092ff",
          "#eba954",
          "#21b6b9",
          "#60a900",
          "#01949b",
          " #f17677"
        ],
        grid: {
          // left: "55%",
          top: 0,
          bottom: 10,
          right: "10%",
          width:"60"
        },
        xAxis: [
          {
            show: false
          },
          {
            show: false
          }
        ],
        yAxis: {
          type: "category",
          inverse: true,
          show: false
        },
        series: [
          {
            type: "pie",
            data: [{ name: "all", value: 100 }],
            center: ["35%", "50%"],
            radius: ["25%", "26%"],
            label: {
              normal: {
                show: false
              }
            },
            silent: true,
            selectedOffset: 2,
            hoverOffset: 2,
            itemStyle: {
              normal: {
                color: "#00ffff"
              }
            }
          },
          {
            tooltip: {
              trigger: "item",
              formatter: "{b}：{c} ({d}%)"
            },
            type: "pie",
            center: ["35%", "50%"],
            radius: ["30%", "40%"],
            avoidLabelOverlap: false,
            startAngle: 70,
            minAngle: 40,
            label: {
              normal: {
                formatter: "{b}：{c}\n{d}%",
                fontSize: 8
              },
              emphasis:{
                fontSize:10
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            lineStyle: {
              length: 2,
              length2: 5
            },
            data: this.total
          },
          //展示名称
          {
            show: true,
            type: "bar",
            barGap: "-100%",
            barWidth: "20%",
            z: 2,
            itemStyle: {
              barBorderRadius: [30, 30, 30, 30]
            },
            color: function(params) {
              // build a color map as your need.
              var colorList = [
                "#d74e67",
                "#0092ff",
                "#eba954",
                "#21b6b9",
                "#60a900",
                "#01949b",
                " #f17677"
              ];
              return colorList[params.dataIndex];
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#fff",
                  fontSize: 8
                  // fontWeight: "bold"
                },
                position: "right"
              }
            },
            encode: {
              x: "nums"
            }
          },
          //年份
          {
            show: true,
            type: "bar",
            xAxisIndex: 1, //代表使用第二个X轴刻度
            barGap: "-100%",
            barWidth: "5%",
            itemStyle: {
              normal: {
                color: "transparent"
              }
            },
            label: {
              normal: {
                show: true,
                position: [0, "-10"],
                formatter: "{b}",
                textStyle: {
                  fontSize: 8,
                  color: "#fff"
                }
              }
            },
            encode: {
              y: "product"
            }
          }
        ]
      };
      this.myChart.setOption(option);
      this.myChart.hideLoading();
      this.action("宫");
      this.myChart.on("click", params => {
        this.action(params.name);
      });
    },
    action(name) {
      if (!this.name) {
        return;
      }
      this.myChart.setOption({
        dataset: {
          source: this.source[name]
        }
      });
      this.myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 1
      });
      this.myChart.dispatchAction({
        type: "highlight",
        name: name
      });
    },
    startTimer() {
      if( this.timer ){
        clearInterval( this.timer );
      }
      if (this.isLunbo) {
        this.timer = setInterval(() => {
          if (this.indexItem >= this.name.length) {
            this.indexItem = 0;
          }
          let name = this.name[this.indexItem];
          this.action(name);
          this.indexItem++;
        }, this.lbTime);
      } else {
        clearInterval(this.timer);
      }
    }
  },
  mounted() {
    this.initChart();
    this.getData(this.collateral);
    this.$er.listenTo(this.$refs.chartDom, el => {
      let height = el.offsetHeight;
      let width = el.offsetWidth;
      this.$nextTick(() => {
        this.myChart.resize({ width: width, height: height });
      });
    });
  },
  beforeDestroy() {
    this.myChart.clear();
    clearInterval( this.timer );
    this.timer = null; 
  }
};
</script>

 <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  height: 80px;
  width: 100%;
  padding-top: 13px;
  font-size: 36px;
  color: #00ffff;
  text-align: center;
  background: url(../assets/images/top_bg.png) bottom center no-repeat;
  background-size: cover;
}
</style>


