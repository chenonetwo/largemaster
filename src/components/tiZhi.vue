
<template>
  <div ref="chartDom" style="width:100%;height:100%;"></div>
</template>
<script>
export default {
  name: "tiZhi",
  props: ["somatotype", "isLunbo", "lbTime"],
  data() {
    return {
      myChart: null,
      indexItem: 0,
      timer: null // 定时任务初始化
    };
  },
  watch: {
    somatotype(data) {
      if (data) {
        this.setOption();
      }
    },
    isLunbo() {
      this.showTip();
      this.active();
    }
  },
  methods: {
    initChart() {
      this.myChart = this.$echarts.init(this.$refs.chartDom, "dark");
      this.myChart.showLoading({
        text: "加载中...",
        maskColor: "rgba(0, 0, 0, 0.3)",
        textColor: "#fff"
      });
    },
    setOption() {
      let data = [].concat(this.somatotype);
      data.sort((a, b) => {
        return b.value - a.value;
      });
      let option = {
        grid: {
          top: "8%",
          right: "2%",
          left: "0",
          bottom: "8%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: 6
          }
        },
        legend: {
          show: false,
          textStyle: {
            fontSize: 6
          },
          icon: "circle",
          itemWidth: 3,
          itemHeight: 5,
          top: 0,
          right: 0
        },
        xAxis: [
          {
            type: "category",
            data: data.map(item => {
              return item.name;
            }),
            boundaryGap: true,
            axisLabel: {
              // rotate: 50,
              interval: 0,
              fontSize: 6,
              showMinLabel: true,
              showMaxLabel: true,
              // margin:[8,4]
            },
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            nameLocation: "center",
            nameTextStyle: {
              fontSize: 8,
              lineHeight: 10
            },
            min: 0,
            // interval: 50,
            axisLabel: {
              formatter: "{value}",
              fontSize: 6
            }
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: 8,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,244,255,1)" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(0,77,167,1)" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                barBorderRadius: [30, 30, 30, 30],
                shadowColor: "rgba(0,160,221,1)",
                shadowBlur: 4
              }
            },
            data: data.map(item => {
              return item.value;
            }),
            label: {
              show: true,
              fontSize: 8,
              color: "#fff",
              position: "top"
            }
          }
        ]
      };
      if (this.myChart) {
        this.myChart.clear();
      }
      this.myChart.setOption(option);
      this.myChart.hideLoading();
      this.myChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: 0
      });
    },
    showTip() {
      if (this.isLunbo) {
        if (this.indexItem >= this.somatotype.length) {
          this.indexItem = 0;
        }
        this.myChart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: this.indexItem
        });
        this.indexItem++;
      }
    },
    active() {
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
    this.initChart();
    this.indexItem = 1;
    if (this.somatotype) {
      this.setOption();
    }
    if (this.myChart) {
      this.showTip();
      this.active();
    }
    this.$er.listenTo(this.$refs.chartDom, el => {
      let height = el.offsetHeight;
      let width = el.offsetWidth;
      this.$nextTick(() => {
        this.myChart.resize({ width: width, height: height });
      });
    });
  },
  beforeDestroy() {}
};
</script>




