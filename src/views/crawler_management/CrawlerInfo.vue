<template>
  <div>
    <el-card class="box-card">
      <h3>爬虫信息</h3>
      <el-form ref="form" :model="sizeForm" label-width="auto" size="medium" style="margin-top: 10px">
        <el-form-item label="爬虫名称">
          <el-input v-model="sizeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="定时">
          <el-select v-model="sizeForm.status" placeholder="请选择">
            <el-option label="启用" value="true"></el-option>
            <el-option label="关闭" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="爬取间隔时间">
          <el-select v-model="sizeForm.num" placeholder="请选择">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
          <el-select v-model="sizeForm.data" placeholder="请选择">
            <el-option label="天" value="day"></el-option>
            <el-option label="周" value="week"></el-option>
            <el-option label="月" value="month"></el-option>
            <el-option label="年" value="year"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="sizeForm.text"></el-input>
        </el-form-item>
      </el-form>
      <el-table
          ref="filterTable"
          :data="tableData"
          style="width: 100%;margin-top: 10px;"
          border
          key="version_table"
      >
        <el-table-column
            prop="id"
            label="ID"
        >
        </el-table-column>
        <el-table-column
            prop="ip"
            label="IP"
        >
        </el-table-column>
        <el-table-column
            prop="starttime"
            label="开始时间"
        >
        </el-table-column>
        <el-table-column
            prop="endtime"
            label="结束时间"
        >
        </el-table-column>
        <el-table-column
            prop="duration"
            label="运行时长(秒)"
        >
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
        >
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
          :total=total
          style="margin-top: 10px">
      </el-pagination>
    </el-card>
    <el-card class="card" style="height:500px; margin-top: 10px" id="data_flow">
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "TaskList",
  methods: {
    draw_dataflow(){
      var chartDom = document.getElementById('data_flow');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: '请求监控'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['下载成功', '下载异常', '下载总量', '解析异常']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '下载成功',
            type: 'line',
            stack: 'Total',
            data: [0, 0, 0, 20, 50, 78, 0]
          },
          {
            name: '下载异常',
            type: 'line',
            stack: 'Total',
            data: [0, 0, 0, 3, 13, 12, 0]
          },
          {
            name: '下载总量',
            type: 'line',
            stack: 'Total',
            data: [0, 0, 0, 23, 63, 90, 0]
          },
          {
            name: '解析异常',
            type: 'line',
            stack: 'Total',
            data: [0, 0, 0, 0, 10, 13, 0]
          },
        ]
      };

      option && myChart.setOption(option);
    },
  },
  mounted() {
    this.draw_dataflow();
  },
  data() {
    return {
      sizeForm: {
        name: '',
        status: '',
        num: '',
        data: '',
        text: '',
      },
      tableData: [{
        id: '1',
        ip: '169.254.86.1',
        starttime: '2022-08-24 15:24:25',
        endtime: '2022-08-24 15:24:30',
        duration: '5',
        status: '成功',
      }],
    }
  },

}
</script>

<style scoped>

</style>