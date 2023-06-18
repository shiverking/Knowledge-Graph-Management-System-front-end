<template>
  <!--主图谱-->
  <div>
    <div class="area-left">
      <!--数据概览-->
      <el-card class="box-card card" style="height:200px;">
        <h3 class="card_label">主要数据概览</h3>
        <el-row :gutter="12" class="main_data_row">
          <el-col :span="8">
            <el-card shadow="hover">
              节点数:{{nodeNum}}
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              关系数:{{relationNum}}
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              子图谱数:{{childKg}}
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="main_data_row">
          <el-col :span="8">
            <el-card shadow="hover">
              实体个数:{{entityNum}}
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              更新次数:{{updateTimes}}
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              最后更新时间:{{latest}}
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <!--数据流-->
      <el-card class="box-card card" style="height:400px;" id="data_flow">
      </el-card>
      <component :is="preview"></component>
    </div>
    <div class="area-right">
      <!--更新记录-->
      <el-card class="box-card card" >
        <h3 class="card_label">最近更新记录</h3>
        <el-timeline style="padding: 10px;">
          <el-timeline-item
              v-for="(version, index) in versionTablePageData"
              :key="index"
              :timestamp="dateFormat(version.submit_time)">
            {{stringProcess(version.name)}}
          </el-timeline-item>
        </el-timeline>
        <div style="display: grid;place-items: center;">
          <el-button-group>
            <el-button icon="el-icon-arrow-left" @click="pageDown">更新</el-button>
            <el-button @click="pageUp">更早<i class="el-icon-arrow-right el-icon--right" ></i></el-button>
          </el-button-group>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts';
import Preview from "../../../components/core_kg/Preview";
// import graph from "../../../data/mainkg_example.json";
import moment from "moment";
export default {
  name: "core_kg_display",
  components:{
    Preview,
  },
  data(){
    return{
       nodeNum:"",
       entityNum:"",
       relationNum:"",
       latest:"",
       updateTimes:"",
       childKg:"",
       //更新记录
        versionTablePageData:[],
        versionCurrentPage:1,
        versionPageSize:7,
        versionTotal:0,
        //主图谱-更新记录
        activities: [{
          content: '版本更新V1.0.7',
          timestamp: '2022-07-23'
        }, {
          content: '版本更新V1.0.6',
          timestamp: '2022-07-01'
        }, {
          content: '版本更新V1.0.5',
          timestamp: '2022-06-14'
        }, {
          content: '版本更新V1.0.4',
          timestamp: '2022-05-30'
        }, {
          content: '版本更新V1.0.3',
          timestamp: '2022-05-07'
        }, {
          content: '版本更新V1.0.2',
          timestamp: '2022-04-18'
        }, {
          content: '版本更新V1.0.1',
          timestamp: '2022-03-11'
        }],
        viz: {}, //定义一个viz对象
        preview:Preview,
    }
  },
  methods:{
    //绘制数据流图
    draw_dataflow(){
      let chartDom = document.getElementById('data_flow');
      let myChart = echarts.init(chartDom,{renderer:'svg'});
      var option;
      // prettier-ignore
      const data = [["2022-06-05", 116], ["2022-06-06", 129], ["2022-06-07", 135], ["2022-06-08", 86], ["2022-06-09", 73], ["2022-06-10", 85], ["2022-06-11", 73], ["2022-06-12", 68], ["2022-06-13", 92], ["2022-06-14", 130], ["2022-06-15", 245], ["2022-06-16", 139], ["2022-06-17", 115], ["2022-06-18", 111], ["2022-06-19", 309], ["2022-06-20", 206], ["2022-06-21", 137], ["2022-06-22", 128], ["2022-06-23", 85], ["2022-06-24", 94], ["2022-06-25", 71], ["2022-06-26", 106], ["2022-06-27", 84], ["2022-06-28", 93], ["2022-06-29", 85], ["2022-06-30", 73], ["2022-07-01", 83], ["2022-07-02", 125], ["2022-07-03", 107], ["2022-07-04", 82], ["2022-07-05", 44], ["2022-07-06", 72], ["2022-07-07", 106], ["2022-07-08", 107], ["2022-07-09", 66], ["2022-07-10", 91], ["2022-07-11", 92], ["2022-07-12", 113], ["2022-07-13", 107], ["2022-07-14", 131], ["2022-07-15", 111], ["2022-07-16", 64], ["2022-07-17", 69], ["2022-07-18", 88], ["2022-07-19", 77], ["2022-07-20", 83], ["2022-07-21", 111], ["2022-07-22", 57], ["2022-07-23", 55], ["2022-07-24", 60]];
      const dateList = data.map(function (item) {
        return item[0];
      });
      const valueList = data.map(function (item) {
        return item[1];
      });
      option = {
        // Make gradient line here
        visualMap: [
          {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 400
          }
        ],
        title: [
          {
            left: 'center',
            text: '数据流'
          },
        ],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            data: dateList
          },
        ],
        yAxis: [
          {},
        ],
        grid: [
          {
            bottom: '10%'
          },
        ],
        series: [
          {
            type: 'line',
            showSymbol: false,
            data: valueList
          },
        ]
      };
      option && myChart.setOption(option);
    },
    //绘制图谱样例
    // draw_kg_example(){
    //   let chartDom_KGPreview = document.getElementById('limit_preview');
    //   let myChart_KGPreivew = echarts.init(chartDom_KGPreview);
    //   let option;
    //
    //   myChart_KGPreivew.showLoading();
    //   var graph  = require('../../../data/mainkg_example.json')
    //   myChart_KGPreivew.hideLoading();
    //   graph.nodes.forEach(function (node) {
    //     node.label = {
    //       show: node.symbolSize > 30
    //     };
    //   });
    //   option = {
    //     title: {
    //       text: '主图谱预览',
    //       subtext: '部分节点',
    //       top: 'top',
    //       left: 'left'
    //     },
    //     tooltip: {},
    //     legend: [
    //       {
    //         // selectedMode: 'single',
    //         data: graph.categories.map(function (a) {
    //           return a.name;
    //         })
    //       }
    //     ],
    //     animationDuration: 1500,
    //     animationEasingUpdate: 'quinticInOut',
    //     series: [
    //       {
    //         name: 'Les Miserables',
    //         type: 'graph',
    //         layout: 'none',
    //         data: graph.nodes,
    //         links: graph.links,
    //         categories: graph.categories,
    //         roam: true,
    //         label: {
    //           position: 'right',
    //           formatter: '{b}'
    //         },
    //         lineStyle: {
    //           color: 'source',
    //           curveness: 0.3
    //         },
    //         emphasis: {
    //           focus: 'adjacency',
    //           lineStyle: {
    //             width: 10
    //           }
    //         }
    //       }
    //     ]
    //   };
    //   myChart_KGPreivew.setOption(option);
    // },
    getBrefInformation(){
      //axios请求
      axios.post('/api/coredata/briefInformation',{})
      .then((response)=>{
        if (response.status == 200) {
          if(response.data.msg ="success") {
            this.nodeNum = response.data.data.nodeNum;
            this.childKg = response.data.data.childKg;
            this.entityNum = response.data.data.entityNum;
            this.relationNum = response.data.data.relationNum;
            this.updateTimes = response.data.data.updateTimes;
            this.latest = response.data.data.latest;
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    //向后端请求版本数据
    get_version_time_desc(num, limit) {
      //axios请求
      axios.request({
        method:"POST",
        url:'/api/version/getVersionByPageByTimeDesc',
        params:{page:num,limit:limit}
      })
      .then((response) => {
        if (response.status == 200) {
          //修改数据
          this.versionTablePageData = response.data.data
          this.versionTotal = response.data.count
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    pageDown() {
      if(this.versionPageSize>0){
        this.versionCurrentPage--;
        this.get_version(this.versionPageSize,this.versionPageSize);
      }
    },
    //版本翻页动作
    pageUp() {
      if(this.versionCurrentPage<(this.versionTotal/this.versionPageSize)) {
        this.versionCurrentPage++;
        this.get_version(this.versionPageSize,this.versionPageSize);
      }
    },
    dateFormat(data) {
      return moment(new Date(data).getTime()).format('YYYY-MM-DD');
    },
    stringProcess(data) {
      var arr = data.split("_");
      var M = parseInt(arr[3].substr(1)).toString();
      var C = parseInt(arr[4].substr(1)).toString();
      var E = parseInt(arr[5].substr(1)).toString();
      var str = "融合:"+M+" 补全:"+C+" 质量评估:"+ E;
      return str;
    },
  },
  mounted() {
    this.draw_dataflow();
    // this.draw();
    // this.draw_kg_example();
    //获取简要信息
    this.getBrefInformation();
    //时间降序获取版本列表
    this.get_version_time_desc(this.versionCurrentPage,this.versionPageSize);
  }
}
</script>
<!--<script src="src/plugins/neovis.js"></script>-->
<!--<script src="src/plugins/jquery.min.js"></script>-->
<!--<script type="text/javascript">-->
<!--var viz;-->
<!--$().ready(function draw() {-->
<!--  console.log("开始执行draw")-->
<!--  var config = {-->
<!--    containerId: "viz",-->
<!--    neo4j: {-->
<!--      serverUrl: "bolt://localhost:7687",-->
<!--      serverUser: "neo4j",-->
<!--      serverPassword: "123456"-->
<!--    },-->
<!--    labels: {-->
<!--      all:{-->
<!--        caption: "name", //节点显示的内容-->
<!--        size:"pagerank",-->
<!--        community:"community"-->
<!--      }-->
<!--    },-->
<!--    relationships: {-->
<!--      all: {-->
<!--        caption:true,-->
<!--        thickness: 'weight',-->
<!--      },-->
<!--    },-->
<!--    initialCypher: "match (n)-[r]->(m) return n,r,m"-->
<!--  };-->
<!--  viz = new NeoVis.default(config);-->
<!--  viz.render();-->
<!--  console.log(viz);-->
<!--})-->
<!--</script>-->
<style scoped>
.area-left{
  width:70%;
  float: left;
}
.area-right{
  width:30%;
  float: right;
}
.card{
  margin: 10px;
}
.to_update{
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