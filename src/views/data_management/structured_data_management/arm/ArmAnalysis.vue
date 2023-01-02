<template>
  <div id="group_11">
    <div class="ele-admin-main">
      <div class="ele-admin-body">
        <div class="ele-admin-content">
          <div class="ele-admin-content-view">
            <div data-v-7b70ec21="" class="el-row" style="margin-left: -7.5px;margin-right: -7.5px;">
              <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-16 el-col-md-8" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
                {{ 21 }}</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " ><router-link to="/data/arm/Aircraft" style= "color:black;text-decoration:none">飞机数量</router-link></div></div></div>
              </div>
              <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-16 el-col-md-8" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
                {{ 14 }}</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " ><router-link to="/data/arm/ArmAnalysis" style= "color:black;text-decoration:none">舰船数量</router-link></div></div></div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ele-admin-main">
      <div class="ele-admin-body">
        <div class="ele-admin-content">
          <div class="ele-admin-content-view">
            <div data-v-7b70ec21="" class="el-row" style="margin-left: -7.5px;margin-right: -7.5px;">
              <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-16 el-col-md-8" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
                37</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " ><router-link to="/data/datasource" style= "color:black;text-decoration:none">火炮数量</router-link></div></div></div>
              </div>
              <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-16 el-col-md-8" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
                20</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " ><router-link to="/data/arm/ArmAnalysis" style= "color:black;text-decoration:none">爆炸物数量</router-link></div></div></div>
              </div>
              <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-16 el-col-md-8" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
                31</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " ><router-link to="/data/TripleData" style= "color:black;text-decoration:none">导弹数量</router-link></div></div></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <br/>
    <div style="position: relative; width: 555px; height: 438px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
      <b>武器装备数量</b>
      <div id="myChart" :style="{width:'800px',height:'400px'}">
      </div>
    </div>
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple">
      <div id="airlengthChart" :style="{width:'400px',height:'400px'}"></div>
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
      <div id="airheightChart" :style="{width:'400px',height:'400px'}"></div>
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
      <div id="airwinspanChart" :style="{width:'400px',height:'400px'}"></div>
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
      let airlengthChart = _this.$echarts.init(document.getElementById('airlengthChart'))
      let airheightChart = _this.$echarts.init(document.getElementById('airheightChart'))
      let airwinspanChart = _this.$echarts.init(document.getElementById('airwinspanChart'))
      let myChart = _this.$echarts.init(document.getElementById('myChart'))
      var airheightoption = {
        title: {
          text: '飞机高度',
          subtext: '单位（米）',
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
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '6米以上' },
              { value: 735, name: '5-6米' },
              { value: 580, name: '4-5米' },
              { value: 484, name: '4米以下' },
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
      var airwinspanoption = {
        title: {
          text: '飞机翼展',
          subtext: '单位（米）',
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
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '30-40米' },
              { value: 735, name: '20-30米' },
              { value: 580, name: '20米以下' },
              { value: 484, name: '40米以上' },

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
      var airlengthoption = {
        title: {
          text: '飞机长度',
          subtext: '单位（米）',
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
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '20米以上' },
              { value: 735, name: '15-18米' },
              { value: 580, name: '15米以下' },
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
      var option = {
        xAxis: {
          data: ['飞机', '舰船', '火炮','爆炸物','导弹']
        },
        yAxis: {},
        dataGroupId: '',
        animationDurationUpdate: 500,
        series: {
          type: 'bar',
          id: 'sales',
          data: [
            {
              value: 21,
              groupId: '飞机'
            },
            {
              value: 14,
              groupId: '舰船'
            },
            {
              value: 37,
              groupId: '火炮'
            },
            {
              value: 20,
              groupId: '爆炸物'
            },
            {
              value: 31,
              groupId: '导弹'
            }
          ],
          universalTransition: {
            enabled: true,
            divideShape: 'clone'
          }
        }
      };
      var drilldownData = [
        {
          dataGroupId: '飞机',
          data: [
            ['战斗机', 4],
            ['舰载机', 2],
            ['预警机', 1],
            ['直升机', 2],
            ['运输机', 1]
          ]
        },
        {
          dataGroupId: '舰船',
          data: [
            ['航空母舰', 4],
            ['驱逐舰', 2],
            ['巡洋舰', 2],
            ['补给舰', 2],
          ]
        },
        {
          dataGroupId: '火炮',
          data: [
            ['舰载火炮', 4],
            ['航空火炮', 2],
          ]
        },
        {
          dataGroupId: '爆炸物',
          data: [
            ['集束炸弹', 4],

          ]
        },
        {
          dataGroupId: '导弹',
          data: [
            ['舰空导弹', 4],
            ['巡航导弹', 2],
            ['反潜导弹', 2],
            ['反舰导弹', 2],
            ['空空导弹', 2],
            ['空地导弹', 2],
          ]
        }
      ];
      myChart.on('click', function (event) {
        if (event.data) {
          var subData = drilldownData.find(function (data) {
            return data.dataGroupId === event.data.groupId;
          });
          if (!subData) {
            return;
          }
          myChart.setOption({
            xAxis: {
              data: subData.data.map(function (item) {
                return item[0];
              })
            },
            series: {
              type: 'bar',
              id: 'sales',
              dataGroupId: subData.dataGroupId,
              data: subData.data.map(function (item) {
                return item[1];
              }),
              universalTransition: {
                enabled: true,
                divideShape: 'clone'
              }
            },
            graphic: [
              {
                type: 'text',
                left: 50,
                top: 20,
                style: {
                  text: 'Back',
                  fontSize: 18
                },
                onclick: function () {
                  myChart.setOption(option);
                }
              }
            ]
          });
        }
      });
      myChart.setOption(option);
      airlengthChart.setOption(airlengthoption);
      airheightChart.setOption(airheightoption);
      airwinspanChart.setOption(airwinspanoption)
    }
  }
}

</script>

<style scoped>

</style>
