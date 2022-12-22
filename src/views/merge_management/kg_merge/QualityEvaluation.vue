<template>
    <div style="margin-top: 20px;">
      <el-tabs type="card">
        <el-tab-pane label="质量评估">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-card shadow="hover">
                <div id="radar" style="height:400px; width:500px"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
                准确性评估
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
                一致性评估
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
                完整性评估
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
                时效性评估
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" style="height:100px; margin-bottom: 10px;"> 
                可信度评估
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
                可用性评估
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="实体错误">
          <b>潜在的实体错误</b>
          <p>实体在图谱中没有与其他实体链接，或有极少的边与其他实体链接。</p>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              label="日期"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              width="180">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="100"
            layout="total, prev, pager, next"
            :total="1000"
            style="margin-top:10px">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="链接错误">
          <b>链接错误</b>
          <p>实体对之间链接的关系不合理。</p>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              label="日期"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              width="180">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="100"
            layout="total, prev, pager, next"
            :total="1000"
            style="margin-top:10px">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="属性值错误">
          <b>属性值错误</b>
          <p>实体的属性值格式错误或明显离群。</p>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              label="日期"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              width="180">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="100"
            layout="total, prev, pager, next"
            :total="1000"
            style="margin-top:10px">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="待提交数据">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              label="日期"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              width="180">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage1"
              :page-size="100"
              layout="total, prev, pager, next"
              :total="1000"
              style="margin-top:10px">
            </el-pagination>
            <el-button plain style="margin-top:10px">提交</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>
<script>
  import * as echarts from 'echarts';
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      getKgRadar(){
        var chartDom = document.getElementById('radar');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          title: {
            text: '图谱质量评估'
          },
          radar: {
            // shape: 'circle',
            indicator: [
              { name: '准确性', max: 100 },
              { name: '一致性', max: 100 },
              { name: '完整性', max: 100 },
              { name: '时效性', max: 100 },
              { name: '可信度', max: 100 },
              { name: '可用性', max: 100 }
            ]
          },
          series: [
            {
              name: 'Budget vs spending',
              type: 'radar',
              data: [
                {
                  value: [42, 80, 65, 35, 50, 70],
                  name: 'Allocated Budget'
                },
              ]
            }
          ]
        };
        option && myChart.setOption(option);
      }
    },
    mounted(){
      this.getKgRadar()
    }
  }
</script>