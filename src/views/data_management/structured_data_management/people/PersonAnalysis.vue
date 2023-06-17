<template>
  <div id="group_11">
    <div class="ele-admin-main">
      <div class="ele-admin-body">
        <div class="ele-admin-content">
          <div class="ele-admin-content-view">
            <div data-v-7b70ec21="" class="el-row" style="margin-left: -7.5px;margin-right: -7.5px;">
              <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-16 el-col-md-8" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
                {{ 32}}</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " ><router-link to="/data/structure/people/person" style= "color:black;text-decoration:none">人员</router-link></div></div></div>
              </div>
<!--              <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-16 el-col-md-8" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow">&lt;!&ndash;&ndash;&gt;<div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag&#45;&#45;large el-tag&#45;&#45;light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >-->
<!--                {{ 15 }}</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " ><router-link to="/data/arm/ArmAnalysis" style= "color:black;text-decoration:none">执行计划人员</router-link></div></div></div>-->
<!--              </div>-->


            </div>
          </div>
        </div>
      </div>
    </div>

    <br/>
    <el-row>
      <el-col :span="8"><div class="grid-content bg-purple">
        <div id="rankChart" :style="{width:'400px',height:'400px'}"></div>
      </div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple">
        <div id="postChart" :style="{width:'400px',height:'400px'}"></div>
      </div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple">
        <div id="edubackChart" :style="{width:'400px',height:'400px'}"></div>
      </div></el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: "Column",
  mounted() {
    this.drawLine();
    this.task();
  },
  data() {
    return {
      msg: 'Welcome use Echarts',
      data1: 1
    }
  },
  methods: {
    // task(){
    //   const _this =this
    //   axios.get('/api/task/count').then(function (resp){
    //     _this.data1 =resp.data
    // })},
    drawLine() {
      const _this = this
      // axios.get('/api/artillery/count').then(function (resp){

      let edubackChart = _this.$echarts.init(document.getElementById('edubackChart'))
      let rankChart = _this.$echarts.init(document.getElementById('rankChart'))
      let postChart = _this.$echarts.init(document.getElementById('postChart'))
      var rankoption = {
        title:{
          text: '军衔',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['准将', '上尉','军士长' ,'中校', '上校', ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            data: [10, 21, 23,45,42 ]
          }
        ]
      };
      var postoption = {
        title:{
          text: '职务',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['指挥官', '执行官','指挥军士长' ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            data: [10, 21, 23]
          }
        ]
      };
      var edubackoption = {
        title:{
          text: '学历',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['学士学位', '硕士学位', ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            data: [32,21]
          }
        ]
      };
      rankChart.setOption(rankoption);
      postChart.setOption(postoption);
      edubackChart.setOption(edubackoption);
    }
  }
}

</script>

<style scoped>

</style>