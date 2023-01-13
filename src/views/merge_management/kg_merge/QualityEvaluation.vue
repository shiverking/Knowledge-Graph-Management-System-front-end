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
                  @click="dailog_receive_entity_error(scope.row)">编辑</el-button>
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
          <el-dialog title="错误修改" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="实体">
                <el-input disabled v-model="form.ent" style="width:300px;"></el-input>
              </el-form-item>
              <el-form-item label="实体类型">
                <el-input disabled v-model="form.ent_typ" style="width:300px;"></el-input>
              </el-form-item>
              <p><b>修改后的结点名称和结点类别:</b></p>
              <el-form-item label="实体">
                <el-input v-model="form.ent_new" style="width:300px;"></el-input>
              </el-form-item>
              <el-form-item label="实体类型">
                <el-input v-model="form.ent_typ_new" style="width:300px;"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false;submit_an_entity_error_modification();">确 定</el-button>
            </div>
          </el-dialog>
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
              label="头实体类型"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head_typ}}</span>
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
              label="尾实体类型"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail_typ }}</span>
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
                  @click="dailog_receive_relation_error(scope.row)">编辑</el-button>
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
          <el-dialog title="错误修改" :visible.sync="dialogRelationErrorFormVisible">
            <el-form :model="form_of_relation_error">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="头实体">
                    <el-input disabled v-model="form_of_relation_error.head" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="头实体类型" style="margin-left:100px;">
                    <el-input disabled v-model="form_of_relation_error.head_typ" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="尾实体">
                    <el-input disabled v-model="form_of_relation_error.tail" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="尾实体类型" style="margin-left:100px;">
                    <el-input disabled v-model="form_of_relation_error.tail_typ" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="关系">
                <el-input disabled v-model="form_of_relation_error.rel" style="width:300px;"></el-input>
              </el-form-item>
              <el-form-item label="操作形式">
                <el-radio-group v-model="form_of_relation_error.resource" size="medium">
                  <el-radio border label="修改"></el-radio>
                  <el-radio border label="删除"></el-radio>
                </el-radio-group>
              </el-form-item>
              <p><b>修改后的结点名称和结点类别:</b></p>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="头实体">
                    <el-input v-model="form_of_relation_error.head_new" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="头实体类型" style="margin-left:100px;">
                    <el-input v-model="form_of_relation_error.head_typ_new" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="尾实体">
                    <el-input v-model="form_of_relation_error.tail_new" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="尾实体类型" style="margin-left:100px;">
                    <el-input v-model="form_of_relation_error.tail_typ_new" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="关系">
                <el-input v-model="form_of_relation_error.rel_new" style="width:300px;"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogRelationErrorFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogRelationErrorFormVisible = false;submit_an_relation_error_modification();">确 定</el-button>
            </div>
          </el-dialog>
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
              label="实体类型"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.ent_typ }}</span>
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
                  @click="dailog_receive_attribute_error(scope.row)">编辑</el-button>
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
          <el-dialog title="错误修改" :visible.sync="dialogAttributeErrorFormVisible">
            <el-form :model="form_of_attribute_error">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="实体">
                    <el-input disabled v-model="form_of_attribute_error.ent" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="实体类型" style="margin-left:100px;">
                    <el-input disabled v-model="form_of_attribute_error.ent_typ" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="属性">
                    <el-input disabled v-model="form_of_attribute_error.attribute" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="属性值" style="margin-left:100px;">
                    <el-input disabled v-model="form_of_attribute_error.attribute_val" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="操作形式">
                <el-radio-group v-model="form_of_attribute_error.resource" size="medium">
                  <el-radio border label="修改"></el-radio>
                  <el-radio border label="删除"></el-radio>
                </el-radio-group>
              </el-form-item>
              <p><b>修改后的结点名称和结点类别:</b></p>
              <el-row> 
                <el-col :span="8">
                  <el-form-item label="实体">
                    <el-input v-model="form_of_attribute_error.ent_new" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="实体类型" style="margin-left:100px;">
                    <el-input v-model="form_of_attribute_error.ent_typ_new" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="属性">
                    <el-input v-model="form_of_attribute_error.attribute_new" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="属性值" style="margin-left:100px;">
                    <el-input v-model="form_of_attribute_error.attribute_val_new" style="width:300px;"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAttributeErrorFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogAttributeErrorFormVisible = false;submit_an_attribute_error_modification();">确 定</el-button>
            </div>
          </el-dialog>
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
              label="头实体（旧）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="头实体类型（旧）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head_typ }}</span>
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
              label="尾实体类型（旧）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail_typ }}</span>
              </template>
            </el-table-column>   
            <el-table-column
              label="头实体（新）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head_new }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="头实体类型（新）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head_typ_new }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关系（新）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.rel_new }}</span>
              </template>
            </el-table-column>     
            <el-table-column
              label="尾实体（新）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail_new }}</span>
              </template>
            </el-table-column>  
            <el-table-column
              label="尾实体类型（新）"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail_typ_new }}</span>
              </template>
            </el-table-column>  
            <el-table-column
              label="错误类型"
              width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.error_typ=='0'">实体错误</span>
                <span v-if="scope.row.error_typ=='1'">链接错误</span>
                <span v-if="scope.row.error_typ=='2'">属性值错误</span>
              </template>
            </el-table-column>         
            <el-table-column
              label="更新方式"
              width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.update_form=='0'">修改</span>
                <span v-if="scope.row.update_form=='1'">删除</span>
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
        selectedRowOfEntityError:[],
        active:0,
        submitLoading:false,
        qualiatyVisible:false,
        nextStepVisible:false,
        dialogFormVisible: false,
        dialogRelationErrorFormVisible: false,
        dialogAttributeErrorFormVisible: false,
        form: {
          ent: '',
          ent_typ: '',
          ent_new: '',
          ent_typ_new: '',
        },
        form_of_relation_error: {
          head: '',
          head_typ: '',
          rel:'',
          tail:'',
          tail_typ:'',
          head_new: '',
          head_typ_new: '',
          rel_new:'',
          tail_new: '',
          tail_typ_new: '',
          resource: '修改',
        },
        form_of_attribute_error: {
          ent: '',
          ent_typ: '',
          attribute:'',
          attribute_val:'',
          ent_new: '',
          ent_typ_new: '',
          attribute_new: '',
          attribute_val_new: '',
          resource: '修改',
        },
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
      //提交到缓存
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
      },
      dailog_receive_entity_error(row){
        this.form.ent = row.ent;
        this.form.ent_typ = row.ent_typ;
        this.form.ent_new = row.ent;
        this.form.ent_typ_new = row.ent_typ;
        this.dialogFormVisible = true;
        this.selectedRowOfEntityError = row;
      },
      dailog_receive_relation_error(row){
        this.form_of_relation_error.head = row.head;
        this.form_of_relation_error.head_typ = row.head_typ;
        this.form_of_relation_error.tail = row.tail;
        this.form_of_relation_error.tail_typ = row.tail_typ;
        this.form_of_relation_error.rel = row.rel;
        this.form_of_relation_error.head_new = row.head;
        this.form_of_relation_error.head_typ_new = row.head_typ;
        this.form_of_relation_error.tail_new = row.tail;
        this.form_of_relation_error.tail_typ_new = row.tail_typ;
        this.form_of_relation_error.rel_new = row.rel;
        this.dialogRelationErrorFormVisible = true;
        this.selectedRowOfEntityError = row;
      },
      dailog_receive_attribute_error(row){
        this.form_of_attribute_error.ent = row.ent;
        this.form_of_attribute_error.ent_typ = row.ent_typ;
        this.form_of_attribute_error.attribute = row.attribute;
        this.form_of_attribute_error.attribute_val = row.attribute_val;
        this.form_of_attribute_error.ent_new = row.ent;
        this.form_of_attribute_error.ent_typ_new = row.ent_typ;
        this.form_of_attribute_error.attribute_new = row.attribute;
        this.form_of_attribute_error.attribute_val_new = row.attribute_val;
        this.dialogAttributeErrorFormVisible = true;
        this.selectedRowOfEntityError = row;
      },
      submit_an_entity_error_modification(){
        this.selectedRowOfEntityError.error_status = '待提交';
        var content = new Array();
        content['head'] = this.form.ent;
        content['head_typ'] = this.form.ent_typ;
        content['rel'] = 'null';
        content['tail'] = 'null';
        content['tail_typ'] = 'null';
        content['head_new'] = this.form.ent_new;
        content['head_typ_new'] = this.form.ent_typ_new;
        content['rel_new'] = 'null';
        content['tail_new'] = 'null';
        content['tail_typ_new'] = 'null';
        content['error_typ'] = '0';
        content['update_form'] = '0';
        this.data_to_be_submitted.push(content)
      },
      submit_an_relation_error_modification(){
        this.selectedRowOfEntityError.error_status = '待提交';
        var content = new Array();
        content['head'] = this.form_of_relation_error.head;
        content['head_typ'] = this.form_of_relation_error.head_typ;
        content['rel'] = this.form_of_relation_error.rel;
        content['tail'] = this.form_of_relation_error.tail;
        content['tail_typ'] = this.form_of_relation_error.tail_typ;
        content['error_typ'] = '1';
        if(this.form_of_relation_error.resource == '修改'){
          content['head_new'] = this.form_of_relation_error.head_new;
          content['head_typ_new'] = this.form_of_relation_error.head_typ_new;
          content['rel_new'] = this.form_of_relation_error.rel_new;
          content['tail_new'] = this.form_of_relation_error.tail_new;
          content['tail_typ_new'] = this.form_of_relation_error.tail_typ_new;
          content['update_form'] = '0';
        }else{
          content['head_new'] = 'null';
          content['head_typ_new'] = 'null';
          content['rel_new'] = 'null';
          content['tail_new'] = 'null';
          content['tail_typ_new'] = 'null';
          content['update_form'] = '1';
        }
        this.data_to_be_submitted.push(content)
      },
      submit_an_attribute_error_modification(){
        this.selectedRowOfEntityError.error_status = '待提交';
        var content = new Array();
        content['head'] = this.form_of_attribute_error.ent;
        content['head_typ'] = this.form_of_attribute_error.ent_typ;
        content['rel'] = this.form_of_attribute_error.attribute;
        content['tail'] = this.form_of_attribute_error.attribute_val;
        content['tail_typ'] = 'null';
        content['error_typ'] = '2';
        if(this.form_of_relation_error.resource == '修改'){
          content['head_new'] = this.form_of_attribute_error.ent_new;
          content['head_typ_new'] = this.form_of_attribute_error.ent_typ_new;
          content['rel_new'] = this.form_of_attribute_error.attribute_new;
          content['tail_new'] = this.form_of_attribute_error.attribute_val_new;
          content['tail_typ_new'] = 'null';
          content['update_form'] = '0';
        }else{
          content['head_new'] = 'null';
          content['head_typ_new'] = 'null';
          content['rel_new'] = 'null';
          content['tail_new'] = 'null';
          content['tail_typ_new'] = 'null';
          content['update_form'] = '1';
        }
        this.data_to_be_submitted.push(content)
      },
    },
    mounted(){
      this.get_entity_error_list()
      this.get_relation_error_list()
      this.get_attribute_error_list()
    }
  }
</script>