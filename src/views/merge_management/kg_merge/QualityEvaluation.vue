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
      <div v-if="this.active==0" style="margin-top: 10px;">
          <b >实体类型错误</b>
          <el-table
            :data="entity_error"
            border
            style="width: 100%; margin-top: 10px;">
            <el-table-column
              label="检测时间"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="实体"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.ent }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="实体类型"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.ent_typ }}</span>
              </template>
            </el-table-column>     
            <el-table-column
              label="错误类型"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.error_typ }}</span>
              </template>
            </el-table-column>    
            <el-table-column
              label="错误状态"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.error_status }}</span>
              </template>
            </el-table-column>      
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="100"
            layout="total, prev, pager, next"
            :total="1"
            style="margin-top:10px">
          </el-pagination>
      </div>
      <div v-if="this.active==1" style="margin-top: 10px;">
          <b>链接错误</b>
          <el-table
            :data="relation_error"
            border
            style="width: 100%; margin-top: 10px;">
            <el-table-column
              label="检测时间"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="头实体"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关系"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.rel }}</span>
              </template>
            </el-table-column>     
            <el-table-column
              label="尾实体"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail }}</span>
              </template>
            </el-table-column>    
            <el-table-column
              label="错误类型"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.error_typ }}</span>
              </template>
            </el-table-column>   
            <el-table-column
              label="错误状态"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.error_status }}</span>
              </template>
            </el-table-column>        
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="100"
            layout="total, prev, pager, next"
            :total="1"
            style="margin-top:10px">
          </el-pagination>
        </div>
      <div v-if="this.active==2" style="margin-top: 10px;">
          <b>属性值错误</b>
          <el-table
            :data="attribute_error"
            border
            style="width: 100%; margin-top: 10px;" >
            <el-table-column
              label="检测时间"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="实体"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.ent }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="属性"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.attribute }}</span>
              </template>
            </el-table-column>     
            <el-table-column
              label="属性值"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.attribute_val }}</span>
              </template>
            </el-table-column>    
            <el-table-column
              label="错误类型"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.error_typ }}</span>
              </template>
            </el-table-column>   
            <el-table-column
              label="错误状态"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.error_status }}</span>
              </template>
            </el-table-column>        
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="1"
            style="margin-top:10px">
          </el-pagination>
        </div>
      <div v-if="this.active==3" style="margin-top: 10px;">
        <el-table
            :data="data_to_be_submitted"
            border
            style="width: 100%; margin-top: 10px;"
            v-loading = submitLoading
            element-loading-text="正在提交中..."
        >
            <el-table-column
              label="检测时间"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="头实体（旧）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关系（旧）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.rel }}</span>
              </template>
            </el-table-column>     
            <el-table-column
              label="尾实体（旧）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail }}</span>
              </template>
            </el-table-column>    
            <el-table-column
              label="头实体（新）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关系（新）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.rel }}</span>
              </template>
            </el-table-column>     
            <el-table-column
              label="尾实体（新）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail }}</span>
              </template>
            </el-table-column>  
            <el-table-column
              label="错误类型"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.error_typ }}</span>
              </template>
            </el-table-column>         
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
          <p>确定保存当前操作记录并提交至缓存表吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="nextStepVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="nextStepVisible = false;submitToCache();">确定</el-button>
          </div>
          <el-button type="primary" style="margin-top: 12px;"  v-if="this.active==3" slot="reference" @click="nextStepVisible=true;">提交</el-button>
        </el-popover>
      </div>
    </div>
</template>
<script>
  import Cache from "../../../components/merge_kg/Cache";
  import * as echarts from 'echarts';
  import $ from '../../../plugins/jquery.min.js';
  export default {
    components:{
      Cache
    },
    data() {
      return {
        entity_error: [],
        relation_error: [],
        attribute_error: [],
        data_to_be_submitted:[],
        //一张临时的表,用来记录要提交至缓存的东西
        data_to_be_submitted2:[
          {
            head:"AS 365“海豚” 双发涡轮轴中型直升机",
            rel:"产国",
            tail:"德国",
            tail_typ:"",
            tail_typ_new:"",
            head_typ:"",
            head_typ_new:"",
            head_new:"",
            rel_new:"",
            tail_new:"法国",
            update_form:"1",
            error_typ:"1"
          }
        ],
        active:0,
        submitLoading:false,
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
      },
      get_entity_error_list(){
          //axios请求
          axios.post('/pythonApi/get_entity_error_list',{})
          .then((response)=>{
            if (response.status == 200) {
              //赋值给表格
              this.entity_error = response.data.data;
              console.log(this.entity_error)
               //设置文本高亮
              }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      get_relation_error_list(){
          //axios请求
          axios.post('/pythonApi/get_relation_error_list',{})
          .then((response)=>{
            if (response.status == 200) {
              //赋值给表格
              this.relation_error = response.data.data;
               //设置文本高亮
              }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      get_attribute_error_list(){
          //axios请求
          axios.post('/pythonApi/get_attribute_error_list',{})
          .then((response)=>{
            if (response.status == 200) {
              //赋值给表格
              this.attribute_error = response.data.data;
               //设置文本高亮
              }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      submitToCache(){
        this.submitLoading = true;
        axios.post('/api/triples/evaluationCoreKg',{
          res:this.data_to_be_submitted2,
        })
        .then((response) => {
          if (response.status == 200) {
            if(response.data.msg=="success"){
              this.submitLoading = false;
              this.$message({
                showClose: true,
                message: '提交成功!',
                type: 'success'
              });
              $("#detailButton").click()
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      }
    },
    mounted(){
      this.get_entity_error_list()
      this.get_relation_error_list()
      this.get_attribute_error_list()
    }
  }
</script>