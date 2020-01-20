<template>
  <div style="height:100%;width:100%">
    <div ref="startDom" style="height:100%;width:100%;"></div>
  </div>
</template>
<script>
export default {
  name: "yongHu",
  props: [
    "dateActiveList",
    "monthActiveList",
    "threndDate",
    "isLunbo",
    "lbTime"
  ],
  data() {
    return {
      startChart: null, //
      indexItem: 0,
      timer: null //  定时任务初始化
    };
  },
  watch: {
    dateActiveList(data) {
      if (data) {
        this.drawStart();
      }
    },
    isLunbo() {
      this.showTip();
      this.startAction();
    }
  },
  methods: {
    initChart(name, el) {
      this[name] = this.$echarts.init(this.$refs[el], "dark");
      this[name].showLoading({
        text: "加载中...",
        maskColor: "rgba(0, 0, 0, 0.3)",
        textColor: "#fff"
      });
    },

    drawStart() {
      if (this.startChart) {
        this.startChart.clear();
      }
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          textStyle: {
            fontSize: 6
          }
        },
        legend: {
          data: ["日活", "月活"],
          itemGap: 3,
          itemWidth: 14,
          itemHeight: 6,
          textStyle: {
            fontSize: 6
          },
          x: "right",
          top: 0
        },
        grid: {
          top: "18%",
          right: "1%",
          left: "0",
          bottom: "2",
          containLabel: true
        },
        xAxis: {
          data: this.threndDate,
          axisLabel: {
            fontSize: 6,
            interval: 0,
            rotate:18,
            showMinLabel: true,
            showMaxLabel: true,
          }
        },
        yAxis: {
          splitLine: { show: false },
          axisLabel: {
            fontSize: 6
          }
        },
        series: [
          {
            name: "月活",
            type: "line",
            smooth: true,
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 10,
            hoverAnimation: false,
            color: "#0092ff",
            data: this.monthActiveList,
            label: {
              show: true,
              fontSize: 8,
              position: "top",
              offset: [0, 6],
              emphasis: {
                color: "#f0515e"
              }
            },
            itemStyle: {
              emphasis: {
                color: "#f0515e"
              }
            }
          },
          {
            name: "日活",
            type: "bar",
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#14c8d4" },
                  { offset: 1, color: "#43eec6" }
                ])
              },
              emphasis: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#f0515e" },
                  { offset: 1, color: "#ef8554" }
                ])
              }
            },
            data: this.dateActiveList,
            // data: [0,2,1,2,1,1,1],
            label: {
              show: true,
              position: "insideTop",
              fontSize: 8,
              offset: [0, -14],
              color: "#fff",
              emphasis: {
                color: "#f0515e"
              }
            }
          },
          {
            name: "月活",
            type: "bar",
            barGap: "-100%",
            barWidth: 10,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(20,200,212,0.5)" },
                  { offset: 0.2, color: "rgba(20,200,212,0.2)" },
                  { offset: 1, color: "rgba(20,200,212,0)" }
                ])
              }
            },
            z: -12,
            data: this.monthActiveList,
            tooltip: {
              show: false
            }
          },
          {
            name: "月活",
            type: "pictorialBar",
            symbol: "rect",
            itemStyle: {
              normal: {
                color: "#0f375f"
              }
            },
            symbolRepeat: true,
            symbolSize: [12, 4],
            symbolMargin: 1,
            z: -10,
            data: this.monthActiveList,
            tooltip: {
              show: false
            }
          }
        ]
      };
      this.startChart.setOption(option);
      this.startChart.hideLoading();
      this.showTip();
    },

    showTip() {
      if (this.indexItem >= Object.keys(this.dateActiveList).length) {
        this.indexItem = 0;
      }
      this.startChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: this.indexItem
      });
      this.indexItem++;
    },

    startAction() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      if (this.isLunbo) {
        this.timer = setInterval(() => {
          this.showTip();
        }, this.lbTime);
      } else {
        clearInterval(this.timer);
      }
    }
  },
  mounted() {
    this.initChart("startChart", "startDom");
    if (this.dateActiveList) {
      this.drawStart();
      this.startAction();
      this.showTip();
    }

    this.$er.listenTo(this.$refs.startDom, el => {
      let height = el.offsetHeight;
      let width = el.offsetWidth;
      this.$nextTick(() => {
        this.startChart.resize({ width: width, height: height });
      });
    });
  },
  beforeDestroy() {}
};
</script>


