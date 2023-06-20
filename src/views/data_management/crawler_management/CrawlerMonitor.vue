<template>
  <div>
    <el-card class="card" style="height:150px;">
      <h3 class="card_label">爬虫数据概览</h3>
      <el-row :gutter="12" class="main_data_row">
        <router-link to="/data/crawler_management/CrawlerList?status=" class="routerlink">
          <el-col :span="6" >
            <el-card shadow="hover">
              总数:{{sum}}
            </el-card>
          </el-col>
        </router-link>
        <router-link to="/data/crawler_management/CrawlerList?status=0" class="routerlink">
          <el-col :span="6">
            <el-card shadow="hover">
              正常:{{normal}}
            </el-card>
          </el-col>
        </router-link>
        <router-link to="/data/crawler_management/CrawlerList?status=1" class="routerlink">
          <el-col :span="6">
            <el-card shadow="hover">
              运行中:{{running}}
            </el-card>
          </el-col>
        </router-link>
        <router-link to="/data/crawler_management/CrawlerList?status=-1" class="routerlink">
          <el-col :span="6">
            <el-card shadow="hover">
              异常:{{abnormal}}
            </el-card>
          </el-col>
        </router-link>
      </el-row>
    </el-card>
    <!--数据流-->
    <el-card class="card" style="height:400px;" id="data_pie">
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "CrawlerMonitor",
  data() {
    return {
      normal:'',
      running:'',
      abnormal:'',
      sum:'',
    }
  },
  methods:{
    //绘制数据流图
    draw_datapie(normal, running, abnormal){
      const _this= this;
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
              { value: normal, name: '正常' },
              { value: running, name: '运行中' },
              { value: abnormal, name: '异常' },
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

      option && myChart.setOption(option, true);

    },
  },
  mounted() {
    setTimeout(() =>{
      this.draw_datapie(this.normal, this.running, this.abnormal);
    }, 1000)
  },
  created() {
    const _this = this
    _this.axios.get('/api/crawl/statistic').then(function(resp){
      _this.normal = resp.data['正常']
      _this.abnormal = resp.data['异常']
      _this.running = resp.data['运行中']
      _this.sum = _this.normal + _this.abnormal + _this.running
    })
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