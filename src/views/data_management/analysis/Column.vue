<template>
  <div id="group_11">
 <div class="ele-admin-main">
   <div class="ele-admin-body">
     <div class="ele-admin-content">
       <div class="ele-admin-content-view">
         <div data-v-7b70ec21="" class="el-row" style="margin-left: -7.5px;margin-right: -7.5px;">
           <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-12 el-col-md-6" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
           {{ data1[0] }}</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " >总计划数</div></div></div>
         </div>
           <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-12 el-col-md-6" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
             {{ data1[1] }}</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " >总任务数</div></div></div>
           </div>
           <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-12 el-col-md-6" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
             {{ data1[2] }}</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " >执行任务人员数</div></div></div>
           </div>
           <div data-v-7b70ec21="" class="el-col el-col-24 el-col-sm-12 el-col-md-6" style="padding-left: 7.5px; padding-right: 7.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"><div data-v-7b70ec21="" class="el-card monitor-count-card is-never-shadow"><!----><div class="el-card__body"><span data-v-7b70ec21="" class="ele-tag-round el-tag el-tag--large el-tag--light"><i data-v-7b70ec21="" class="el-icon-s-custom"></i></span><div data-v-7b70ec21="" class="monitor-count-card-num" style="font-size:20px;text-align: center; " >
             {{ data1[3] }}</div><div data-v-7b70ec21="" class="monitor-count-card-text ele-text-secondary" style="font-size:30px;text-align: center; " >执行任务舰船数</div></div></div>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
    <br/>
    <div style="position: relative; width: 555px; height: 438px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
      <div id="myChart" :style="{width:'1000px',height:'500px'}">
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Column",
    mounted() {
      this.drawLine();
      this.task();
    },
    data(){
      return{
        msg: 'Welcome use Echarts',
        data1:1
      }
    },
    methods:{
      task(){
        const _this =this
        axios.get('/api/task/count').then(function (resp){
          _this.data1 =resp.data
      })},
      drawLine(){
        const _this =this
        axios.get('/api/artillery/count').then(function (resp){

          let myChart = _this.$echarts.init(document.getElementById('myChart'))
          myChart.setOption(
            {
              title: {
                text: '武器装备数量'
              },
              xAxis: {
                type: 'category',
                data: ['飞机', '火炮', '爆炸物', '舰船']
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: resp.data,
                  type: 'bar'
                }
              ]
            }

          )

        })

        }
      },

    }
</script>

<style scoped>

</style>
