<template>
  <div>
    <el-card class="card" style="height:150px;">
      <h3 class="card_label">爬虫数据概览</h3>
      <el-row :gutter="12" class="main_data_row">
        <el-col :span="6">
          <el-card shadow="hover">
            总数:60
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            新增:20
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            运行中:30
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            异常:10
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!--数据流-->
    <el-card class="card" style="height:400px;" id="data_pie">
    </el-card>
    <el-card class="card" style="height:500px; margin-top: 10px" id="cpudata_flow">
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "CrawlerMonitor",
  methods:{
    //绘制数据流图
    draw_datapie(){
      var chartDom = document.getElementById('data_pie');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: '爬虫数量',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 10, name: '异常' },
              { value: 30, name: '运行中' },
              { value: 20, name: '新增' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      option && myChart.setOption(option);

    },
    draw_cpudataflow(){
      var chartDom = document.getElementById('cpudata_flow');
      var myChart = echarts.init(chartDom);
      var option;

      let base = +new Date(1988, 9, 3);
      let oneDay = 24 * 3600 * 1000;
      let data = [[base, Math.random() * 300]];
      for (let i = 1; i < 20000; i++) {
        let now = new Date((base += oneDay));
        data.push([+now, +Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])%100]);
      }
      option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: 'CPU使用率'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          min: 0,
          max: 100,
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 20
          },
          {
            start: 0,
            end: 20
          }
        ],
        series: [
          {
            name: 'Fake Data',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: data
          }
        ]
      };

      option && myChart.setOption(option);
    }
  },
  mounted() {
    this.draw_datapie();
    this.draw_cpudataflow();
  }
}
</script>

<style scoped>

.card{
  margin: 10px;
}

.card_label{
  margin: 0px;
}

.main_data_row{
  margin-top: 6px;
  margin-bottom: 8px;
}
</style>