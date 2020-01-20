<template>
  <div ref="chartDom" style="width:100%;height:100%;"></div>
</template>
<script>
export default {
  name: "zhengSu",
  props: ["qxz", "zf", "isLunbo", "lbTime"],
  data() {
    return {
      myChart: null,
      indexItem: 0, // showTip index
      timer: null // 定时任务初始化
    };
  },
  watch: {
    zf(data) {
      if (data) {
        this.drawChart();
      }
    },
    isLunbo() {
      this.showHighlight();
      this.startAction();
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
      this.$er.listenTo(this.$refs.chartDom, el => {
        let height = el.offsetHeight;
        let width = el.offsetWidth;
        this.$nextTick(() => {
          this.myChart.resize({ width: width, height: height });
        });
      });
    },
    drawChart() {
      let qxz = this.qxz;
      let zf = this.zf;
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}({d}%)",
          textStyle: {
            fontSize: 6
          }
        },
        legend: {
          orient: "vertical",
          x: "left",
          show: false
        },
        grid: {
          top: "30%",
          bottom: "-14%",
          containLabel: true
        },
        series: [
          {
            name: "脏腑证型",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],
            center: ["48%", "43%"],
            label: {
              normal: {
                position: "inner"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: qxz
          },
          {
            name: "脏腑证型",
            type: "pie",
            minAngle: 10,
            startAngle: 40,
            radius: ["40%", "55%"],
            center: ["48%", "43%"],
            label: {
              normal: {
                formatter: "{a|{b}}{abg|}\n{hr|}\n  {b|{c}}  {per|{d}%}  ",
                fontSize: 8,
                rich: {
                  a: {
                    lineHeight: 12,
                    align: "center",
                    fontSize: 8,
                    color: "#fff"
                  },
                  hr: {
                    borderColor: "#fff",
                    width: "100%",
                    borderWidth: 0.5,
                    height: 0,
                    fontSize: 10,
                    margin: [0, 0, 2, 0]
                  },
                  b: {
                    padding: [0, 0, 0, 0],
                    fontSize: 8,
                    color: "#00EDED",
                    lineHeight: 12
                  },
                  per: {
                    color: "#eee",
                    backgroundColor: "rgba(29,71,256,0.8)",
                    padding: [2, 4],
                    borderRadius: 2,
                    fontSize: 6
                  }
                }
              },
              emphasis: {
                show: true,
                rich: {
                  a: {
                    color: "#eaea26",
                    fontSize: 9,
                    lineHeight: 14,
                    align: "center"
                  },
                  hr: {
                    borderColor: "#eaea26",
                    width: "100%",
                    borderWidth: 0.5,
                    height: 0,
                    fontSize: 12,
                    margin: [0, 0, 2, 0]
                  },
                  b: {
                    padding: [0, 0, 0, 0],
                    fontSize: 10,
                    color: "#eaea26",
                    lineHeight: 14
                  },
                  per: {
                    color: "#eaea26",
                    backgroundColor: "rgba(29,71,256,0.8)",
                    padding: [2, 4],
                    borderRadius: 2,
                    fontSize: 7
                  }
                }
              }
            },
            itemStyle: {
              normal: {
                // borderColor: "#fff",
                // borderWidth: 2
              }
            },
            data: zf,
            labelLine: {
              normal: {
                show: true,
                length: 10,
                length2: 24
              }
            }
          },
          {
            type: "pie",
            data: [{ name: "all", value: 100 }],
            center: ["48%", "43%"],
            radius: ["55%", "56%"],
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
                color: "#00ffff",
                borderColor: "#00eded",
                borderWidth: 2
                // shadowColor:"#00eded",
                // shadowBlur:2
              }
            }
          }
        ]
      };
      if (this.myChart) {
        this.myChart.clear();
      }
      this.initChart();
      this.myChart.setOption(option);
      this.myChart.hideLoading();
    },
    showHighlight() {
      this.hideLight();
      if (this.isLunbo) {
        if (this.indexItem >= this.zf.length) {
          this.indexItem = 0;
        }
        this.myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 1,
          dataIndex: this.indexItem
        });
        this.indexItem++;
      }
    },
    hideLight() {
      this.myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 1
      });
    },
    startAction() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      if (this.isLunbo) {
        this.timer = setInterval(() => {
          this.showHighlight();
        }, this.lbTime);
      } else {
        clearInterval(this.timer);
      }
    }
  },
  mounted() {
    this.initChart();
    if (this.zf) {
      this.drawChart();
      this.showHighlight();
      this.startAction();
    }
  },
  beforeDestroy() {}
};
</script>

 <!-- Add "scoped" attribute to limit CSS to this component only -->


