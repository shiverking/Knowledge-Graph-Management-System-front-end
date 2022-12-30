<template>
    <div style="margin-top: 20px;">
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="实体错误"></el-step>
        <el-step title="链接错误"></el-step>
        <el-step title="属性值错误"></el-step>
        <el-step title="评估提交"></el-step>
      </el-steps>
      <cache></cache>
      <!--质量评估指标dialog-->
      <el-button @click="qualiatyVisible=true;getKgRadar()">质量评估</el-button>
      <el-dialog title="质量评估" :visible.sync="qualiatyVisible" fullscreen="true">
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
      </el-dialog>
      <div v-if="this.active==0">
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
      </div>
      <div v-if="this.active==1">
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
        </div>
      <div v-if="this.active==2">
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
        </div>
      <div v-if="this.active==3">
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
        </div>
      <div style="text-align: right;">
        <el-button style="margin-top: 12px;" v-if="this.active>=1" @click="previous">上一步</el-button>
        <el-button type="primary" style="margin-top: 12px;" v-if="this.active<3" @click="next">下一步</el-button>
        <el-popover
            placement="left"
            v-model="nextStepVisible">
          <p>确定保存当前操作并将其作为一条版本记录提交吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="nextStepVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="nextStepVisible = false;">确定</el-button>
          </div>
          <el-button type="primary" style="margin-top: 12px;"  v-if="this.active==3" slot="reference" @click="nextStepVisible=true;">提交</el-button>
        </el-popover>
      </div>
    </div>
</template>
<script>
  import Cache from "../../../components/merge_kg/Cache";
  import * as echarts from 'echarts';
  export default {
    components:{
      Cache
    },
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
        }],
        active:0,
        qualiatyVisible:false,
        nextStepVisible:false
      }
    },
    methods: {
      //下一步
      next() {
        if(this.active<3){
          this.active++;
        }
        else if(this.active==3){
          // this.active++;
        }
      },
      //上一步
      previous() {
        this.active--;
      },
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
    }
  }
</script>