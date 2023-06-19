<template>
  <div>
    <el-dialog title="内容" :visible.sync="contentVisible" top="7vh" width="70%">
      <el-input :rows="20" v-model="content" type="textarea" style="width: 100%" :readonly="read" ></el-input>
    </el-dialog>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="爬虫信息" name="first">
    <el-card class="box-card">
      <h3>历史状态</h3>
<!--      <el-form ref="form" :model="sizeForm" label-width="auto" size="medium" style="margin-top: 10px">-->
<!--        <el-form-item label="爬虫名称">-->
<!--          <el-input v-model="sizeForm.name"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="定时">-->
<!--          <el-select v-model="sizeForm.status" placeholder="请选择">-->
<!--            <el-option label="启用" value="true"></el-option>-->
<!--            <el-option label="关闭" value="false"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="爬取间隔时间">-->
<!--          <el-select v-model="sizeForm.num" placeholder="请选择">-->
<!--            <el-option label="1" value="1"></el-option>-->
<!--            <el-option label="2" value="2"></el-option>-->
<!--            <el-option label="3" value="3"></el-option>-->
<!--            <el-option label="4" value="4"></el-option>-->
<!--            <el-option label="5" value="5"></el-option>-->
<!--          </el-select>-->
<!--          <el-select v-model="sizeForm.data" placeholder="请选择">-->
<!--            <el-option label="天" value="day"></el-option>-->
<!--            <el-option label="周" value="week"></el-option>-->
<!--            <el-option label="月" value="month"></el-option>-->
<!--            <el-option label="年" value="year"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="备注">-->
<!--          <el-input v-model="sizeForm.text"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
      <el-table
          ref="filterTable"
          :data="tableData1"
          style="width: 100%;margin-top: 10px;"
          border
          key="version_table"
      >
        <el-table-column
            prop="_id"
            label="id"
        >
        </el-table-column>
        <el-table-column
            prop="start_time"
            label="开始时间"
        >
        </el-table-column>
        <el-table-column
            prop="end_time"
            label="结束时间"
        >
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
        >
          <template slot-scope="scope">
              <span v-if="scope.row.status== 1 ">
                 <el-tag type="warning">运行中</el-tag>
              </span>
            <span v-if="scope.row.status== 0">
                 <el-tag >正常</el-tag>
              </span>
            <span v-if="scope.row.status== -1">
                 <el-tag type="danger">异常</el-tag>
              </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger">
              <i class="el-icon-circle-close" style="font-size: 20px"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes=pageSizes
          :page-size=pageSize
          layout="total, sizes, prev, pager, next, jumper"
          :total=total1
          style="margin-top: 10px">
      </el-pagination>
    </el-card>
<!--    <el-card class="card" style="height:500px; margin-top: 10px" id="data_flow">-->
<!--    </el-card>-->
        </el-tab-pane>
      <el-tab-pane label="运行结果" name="second">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>半结构化数据</strong>
<!--            <el-button style="float: right; padding: 3px 0" type="text">保存</el-button>-->
          </div>
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
              <el-table-column
                  type="selection"
              >
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="名称"
                  width="100px"
                  :show-overflow-tooltip="true"
              >
              </el-table-column>
                <el-table-column
                    prop="max_speed"
                    label="最大速度"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="weight"
                    label="重量"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="length"
                    label="长度"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="width"
                    label="宽度"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="height"
                    label="高度"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="crew"
                    label="乘员"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="range"
                    label="飞行/发射范围"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="draught"
                    label="吃水"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="displacement"
                    label="排水量"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="service_year"
                    label="服役年份"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="origin"
                    label="来源"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="horsepower"
                    label="马力"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="manufacturer"
                    label="生产商"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="ceiling"
                    label="飞行高度"
                    width="100px"
                    :show-overflow-tooltip="true"
                >
              </el-table-column>
<!--              <el-table-column-->
<!--                  fixed="right"-->
<!--                  label="操作"-->
<!--                  width="100px"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-button @click="textdetail()" type="text" size="big" >编辑</el-button>-->
<!--                  <el-button @click="deleteBook(scope.row)" type="text" size="big">删除</el-button>-->
<!--                </template>-->
<!--              </el-table-column>-->
            </el-table>
            <el-pagination
                @current-change="currentChange"
                :current-page="page" :page-size="size"
                layout="total,prev, pager, next"
                :total="total">
            </el-pagination>

        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>非结构文本</strong>
<!--            <el-button style="float: right; padding: 3px 0" type="text">保存</el-button>-->
          </div>
          <el-table
              ref="multipleTable"
              :data="tableData3"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              >
            <el-table-column
                type="selection"
            >
            </el-table-column>
            <el-table-column
                label="标题"
                width="400"
                show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.title}}</template>
            </el-table-column>
            <el-table-column
                label="作者"
                width="400"
                show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.author}}</template>
            </el-table-column>
            <el-table-column
                label="内容">
              <template slot-scope="scope">
                <el-button type="text" @click = "displayContent(scope.row.content)">查看</el-button></template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.create_time!=null">{{scope.row.create_time}}</span>
                <span v-if="scope.row.create_time==null">暂无</span>
              </template>
            </el-table-column>
            <el-table-column
                label="发布时间"
                show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.create_time!=null">{{scope.row.publish_time}}</span>
                <span v-if="scope.row.create_time==null">暂无</span>
              </template>
            </el-table-column>
            <el-table-column
                label="来源" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.origin}}</template>
            </el-table-column>
<!--            <el-table-column type="expand">-->
<!--              <template slot-scope="props">-->
<!--                <el-form label-position="left" inline class="demo-table-expand">-->
<!--                  <el-form-item label="全文">-->
<!--                    <span style="white-space: normal">{{ props.row.content }}</span>-->
<!--                  </el-form-item>-->
<!--                </el-form>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                v-for="key in keys3"-->
<!--                :prop="key"-->
<!--                :label="key"-->
<!--                width="100px"-->
<!--                :show-overflow-tooltip="true"-->
<!--            >-->

<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                fixed="right"-->
<!--                label="操作"-->
<!--                width="100px"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <el-button @click="textdetail()" type="text" size="big" >编辑</el-button>-->
<!--                <el-button @click="deleteBook(scope.row)" type="text" size="big">删除</el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
          </el-table>
          <el-pagination
              @current-change="currentChange3"
              :current-page="page3" :page-size="size3"
              layout="total,prev, pager, next"
              :total="total3">
          </el-pagination>

        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>非结构图片</strong>
            <!--            <el-button style="float: right; padding: 3px 0" type="text">保存</el-button>-->
          </div>
          <div class="image-item" v-for="(item, index) in tableData4" :key="index" :style="reactiveImage">
          <el-image :src="serviceurl+item.path" :preview-src-list="previewImageUrL" class="image" style="float: left ;width:200px;height: 100px">
<!--            <div slot="placeholder" class="image-slot" element-loading-text="图片加载中..." v-loading="true"-->
<!--                 style="margin-top:40%">-->
<!--            </div>-->
          </el-image>
          </div>
          <el-pagination
              @current-change="currentChange2"
              :current-page="page4" :page-size="size4"
              layout="total,prev, pager, next"
              :total="total4"
          style="clear: both">
          </el-pagination>

        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {

  name: "TaskList",
  methods: {
    getTableData() {
      this.tableData = this.jsonData.slice(
          (this.page - 1) * this.size,
          this.page * this.size
      );
      this.total=this.jsonData.length
    },
    getTableData3() {
      this.tableData3 = this.jsonData3.slice(
          (this.page3 - 1) * this.size3,
          this.page3 * this.size3
      );
      this.total3=this.jsonData3.length
    },
    currentChange(val) {
      const _this=this
      _this.axios.get('/api/semistructure/getSemistructuredDataBycid/'+(val)+'/10/'+this.$route.query.cid).then(function(resp){
        console.log(resp)
        _this.tableData = resp.data.data
        _this.total = resp.data.count
      })
    },
    currentChange3(val) {
      const _this=this
      _this.axios.get('/api/unstructure/getAllTextByPageandcid/'+(val)+'/10/'+this.$route.query.cid).then(function(resp){
        console.log(resp)
        _this.tableData3 = resp.data.data
        _this.total3 = resp.data.count
      })
    },
    currentChange2(val) {
      const _this=this
      _this.axios.get('/api/image/getimage/'+(val)+'/21/'+this.$route.query.cid).then(function(resp){
        console.log(resp)
        _this.tableData4 = resp.data.data
        _this.total4 = resp.data.count
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    displayContent(content){
      this.contentVisible = true;
      this.content = content;
    },
  //   draw_dataflow(){
  //     var chartDom = document.getElementById('data_flow');
  //     var myChart = echarts.init(chartDom);
  //     var option;
  //
  //     option = {
  //       title: {
  //         text: '请求监控'
  //       },
  //       tooltip: {
  //         trigger: 'axis'
  //       },
  //       legend: {
  //         data: ['下载成功', '下载异常', '下载总量', '解析异常']
  //       },
  //       grid: {
  //         left: '3%',
  //         right: '4%',
  //         bottom: '3%',
  //         containLabel: true
  //       },
  //       xAxis: {
  //         type: 'category',
  //         boundaryGap: false,
  //         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //       },
  //       yAxis: {
  //         type: 'value'
  //       },
  //       series: [
  //         {
  //           name: '下载成功',
  //           type: 'line',
  //           stack: 'Total',
  //           data: [0, 0, 0, 20, 50, 78, 0]
  //         },
  //         {
  //           name: '下载异常',
  //           type: 'line',
  //           stack: 'Total',
  //           data: [0, 0, 0, 3, 13, 12, 0]
  //         },
  //         {
  //           name: '下载总量',
  //           type: 'line',
  //           stack: 'Total',
  //           data: [0, 0, 0, 23, 63, 90, 0]
  //         },
  //         {
  //           name: '解析异常',
  //           type: 'line',
  //           stack: 'Total',
  //           data: [0, 0, 0, 0, 10, 13, 0]
  //         },
  //       ]
  //     };
  //
  //     option && myChart.setOption(option);
  //   },
  },
  // mounted() {
  //   this.draw_dataflow();
  // },
  data() {
    return {
      total4:0,
      serviceurl:"http://localhost:12345/images",
      tableData4:[],
      contentVisible:false,
      keys3:null,
      keys:null,
      page:1,
      size:10,
      total:10,
      page3:1,
      size3:10,
      total3:10,
      jsonData3:[],
      activeName: 'first',
      sizeForm: {
        name: '',
        status: '',
        num: '',
        data: '',
        text: '',
      },
      tableData:[],
      tableData3:[],
      tableData1: [{
        id: '1',
        ip: '169.254.86.1',
        starttime: '2022-08-24 15:24:25',
        endtime: '2022-08-24 15:24:30',
        duration: '5',
        status: '成功',
      }],
    }
  },
  created(){
    // const _this =this
    // const keys = new Set()
    // const keys3 = new Set()
    // try{
    //   this.jsonData   = require("E:\\代码\\FKFD\\militory_factory\\militory_factory\\militory_text.json")
    //   this.jsonData3   = require("E:\\代码\\FKFD\\militory_factory\\militory_factory\\text.json")
    // }
    // catch (error){
    // }
    // console.log(this.jsonData3)
    // for(var i=0; i<_this.jsonData.length; i++){
    //   for(var key in _this.jsonData[i]){
    //     if (key != "图片" & key != "简介" & key != "content" & key != "variant" & key != "data_origin"){
    //       keys.add(key)
    //     }
    //
    //   }
    // }
    // for(var j=0; j<_this.jsonData3.length; j++){
    //   for(var key3 in _this.jsonData3[j]){
    //     if (key3 != "图片" & key3 != "简介"  & key3 != "variant" & key3 != "data_origin"){
    //       keys3.add(key3)
    //     }
    //
    //   }
    // }
    // this.keys=keys
    // this.keys3=keys3
    // this.getTableData()
    // this.getTableData3()
    const _this = this
    _this.axios.get('/api/crawl/findrecordbycid/0/10/'+this.$route.query.cid).then(function(resp){
      console.log(resp)
      _this.tableData1 = resp.data.data
      _this.total1 = resp.data.count
    })
    _this.axios.get('/api/semistructure/getSemistructuredDataBycid/0/10/'+this.$route.query.cid).then(function(resp){
      console.log(resp)
      _this.tableData = resp.data.data
      _this.total = resp.data.count
    })
    _this.axios.get('/api/unstructure/getAllTextByPageandcid/0/10/'+this.$route.query.cid).then(function(resp){
      console.log(resp)
      _this.tableData3 = resp.data.data
      _this.total3 = resp.data.count
    })
    _this.axios.get('/api/image/getimage/0/21/'+this.$route.query.cid).then(function(resp){
      console.log(resp)
      _this.tableData4 = resp.data.data
      _this.total4 = resp.data.count
    })
  }

}
</script>

<style scoped>

</style>