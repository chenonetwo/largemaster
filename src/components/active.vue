<template>
  <div style="height:98%;width:100%">
    <div ref="activeDom" style="height:100%;width:100%;"></div>
  </div>
</template>
<script>

export default {
  name: "active",
  props: ["dateActiveList", "threndDate", "isLunbo", "lbTime"],
  data() {
    return {
      activeChart: null,
      indexItem: 1,
      timer: null //  定时任务初始化
    };
  },
  watch: {
    dateActiveList(data) {
      if (data) {
        this.setActiveChart();
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
    setActiveChart() {
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: params => {
            let str = params[0].name + "<br/>";
            for (let i = 0; i < params.length; i++) {
              let a =
                params[i].marker +
                params[i].seriesName +
                "：" +
                params[i].value +
                "<br/>";
              str += a;
            }
            return str;
          },
          axisPointer: {
            type: "shadow"
          },
          textStyle: {
            fontSize: 6
          }
        },
        grid: {
          top: "8%",
          right: "2%",
          left: "0%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: this.threndDate,
          z: 10,
          axisLabel: {
            fontSize: 6,
            interval: 2
          },
          splitLine:{
            show:false
          },
          axisLine: {
            show:true,
            lineStyle: {
              color: "#0c3b71"
            }
          }
        },
        yAxis: [
          {
            min: 0,
            // max: 100,
            axisLabel: {
              fontSize: 6
            },
            splitLine:{
              show:false
            }
          },
          {
            type: "value",
            gridIndex: 0,
            min: 0,
            max: 100,
            splitNumber: 12,
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"]
              }
            }
          }
        ],
        series: [
          {
            name: "日活",
            type: "bar",
            barWidth: "30%",
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#00feff"
                  },
                  {
                    offset: 0.5,
                    color: "#027eff"
                  },
                  {
                    offset: 1,
                    color: "#0286ff"
                  }
                ])
              }
            },
            data: this.dateActiveList,
            zlevel: 11,
            label: {
              show: true,
              formatter: "{c}",
              color: "#fff",
              textStyle: {
                fontSize: 6
              },
              position: "top"
            }
          },
          {
            tooltip:{
              show:false
            },
            name: "背景",
            type: "bar",
            barWidth: "40%",
            xAxisIndex: 0,
            yAxisIndex: 1,
            barGap: "-135%",

            data: [
              100,
              100,
              100,
              100,
              100,
              100,
              100,
              100,
              100,
              100,
              100,
              100,
              100,
              100,
              100
            ],
            itemStyle: {
              normal: {
                color: "rgba(255,255,255,0.1)"
              }
            },
            zlevel: 9
          }
        ],
        legend: {
          show: true,
          // orient: "vertical",
          data: ["日活"],
          x: "right",
          itemGap: 3,
          icon: "circle",
          itemWidth: 3,
          itemHeight: 3,
          textStyle: {
            fontSize: 6
          }
        }
      };
      this.activeChart.setOption(option);
      this.activeChart.hideLoading();
    },
    showTip() {
      if (this.isLunbo) {
        if (this.indexItem >= this.threndDate.length) {
          this.indexItem = 0;
        }
        this.activeChart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: this.indexItem
        });
        this.indexItem++;
      }
    },
    startAction() {
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
    this.initChart("activeChart", "activeDom");
    if (this.dateActiveList) {
      this.startAction();
      this.setActiveChart();
      this.showTip();
    }
    this.$er.listenTo(this.$refs.activeDom, el => {
      let height = el.offsetHeight;
      let width = el.offsetWidth;
      this.$nextTick(() => {
        this.activeChart.resize({ width: width, height: height });
      });
    });
  },
  beforeDestroy() {}
};
</script>



