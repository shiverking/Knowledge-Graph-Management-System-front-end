<template>
    <div style="margin-top: 20px;">
      <cache></cache>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基于本体规则检测" name="first">
      <el-steps :active="active" finish-status="success" simple>
        <!-- <el-step title="实体错误"></el-step> -->
        <el-step title="链接异常"></el-step>
        <el-step title="属性值异常"></el-step>
        <el-step title="评估提交"></el-step>
      </el-steps> 
      <!-- 质量评估指标dialog-->
      <!-- <el-button @click="qualiatyVisible=true;dispalyEvaluation()">质量评估</el-button>
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
              <p style="fontSize:20px; color:blue">65</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
              一致性评估
              <p style="fontSize:20px; color:blue">80</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
              完整性评估
              <p style="fontSize:20px; color:blue">65</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
              时效性评估
              <p style="fontSize:20px; color:blue">55</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
              可信度评估
              <p style="fontSize:20px; color:blue">70</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" style="height:100px; margin-bottom: 10px;">
              可用性评估
              <p style="fontSize:20px; color:blue">60</p>
            </el-card>
          </el-col>
        </el-row>
      </el-dialog> -->
      <div v-if="this.active==0" style="margin-top: 10px;">
        <el-button type="primary" @click="get_relation_error_list()">开始检测</el-button>
        <el-popover
            placement="top"
            v-model="isJoin">
            <p>是否应用链接异常的修改结果？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="isJoin = false">取消</el-button>
              <el-button type="primary" size="mini" @click="isJoin = false; join_submission_form(); link_modified_successfully();">确定</el-button>
            </div>
            <el-button type="success" slot="reference" style="margin-top: 10px; margin-left: 10px;">应用</el-button>
          </el-popover>
          <keep-alive>
            <el-table
              :data="tableData2"
              :row-class-name="tableRowClassName"
              border
              style="width: 100%; margin-top: 10px;">
              <!-- <el-table-column
                label="检测时间"
                width="180">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.time }}</span>
                </template>
              </el-table-column> -->
              <el-table-column
                label="头实体"
                width="400"
                >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.head }}</span>
                  <el-tag size="small" type="sucess">{{ scope.row.head_typ }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="关系"
                >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.rel }}</span>
                </template>
              </el-table-column>     
              <el-table-column
                label="尾实体"
                width="400">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.tail }}</span>
                  <el-tag size="small" type="info">{{ scope.row.tail_typ }}</el-tag>
                </template>
              </el-table-column>    
              <el-table-column
                label="异常类型"
                >
                <template slot-scope="scope">
                  <span v-if="scope.row.error_typ=='0'" style="margin-left: 10px">链接异常</span>
                  <span v-if="scope.row.error_typ=='1'" style="margin-left: 10px">属性值异常</span>

                </template>
              </el-table-column>   
              <el-table-column
                label="错误状态"
                >
                <template slot-scope="scope">
                  <span v-if="scope.row.error_status == 0" style="margin-left: 10px">待处理</span>
                  <span v-if="scope.row.error_status == 1" style="margin-left: 10px">待提交</span>
                </template>
              </el-table-column>        
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary" plain
                    size="mini"
                    :disabled="scope.row.error_status"
                    @click="dailog_receive_relation_error(scope.row);draw_graph(scope.row);">编辑</el-button>
                    <el-button
                    type="success" plain
                    size="mini"
                    :disabled="whether_can_revoked(scope.row)"
                    @click="revoke_selection(scope.row)">撤销</el-button>
                </template>
              </el-table-column>
            </el-table>
          </keep-alive>
          <el-pagination
            @size-change="sizeChange2"
            @current-change="currentChange2"
            :current-page="tableData2_page"
            :page-size="tableData2_size"
            :page-sizes="pageSizes"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData2_total"
            style="margin-top: 10px;">
          </el-pagination>
          <el-dialog title="异常修改" :visible.sync="dialogRelationErrorFormVisible" customClass="customWidth" fullscreen>
            <el-card shadow="never" style="float: left;margin-right:10px;" class="graphWidth">
              <h4 class="triples_label">结点周边预览</h4>
              <div id="triples_show" style="height: 700px; width: 750px" ><el-empty description="暂无预览"></el-empty></div>
            </el-card>
            <el-card shadow="never" style="">
              <el-table
                :data="single_relation_error"
                border
                style="width: 100%">
                <el-table-column
                  label="头实体"
                  >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.head }}</span>
                    <el-tag size="small" type="sucess">{{ scope.row.head_typ }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="关系"
                  >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.rel }}</span>
                  </template>
                </el-table-column>     
                <el-table-column
                  label="尾实体"
                  >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.tail }}</span>
                    <el-tag size="small" type="info">{{ scope.row.tail_typ }}</el-tag>
                  </template>
                </el-table-column> 
              </el-table>
              <el-form :model="form_of_relation_error">
                <el-form-item label="操作形式">
                  <el-radio-group v-model="form_of_relation_error.rel_radio">
                    <el-radio :label="0" >删除</el-radio>
                    <el-radio :label="1">修改实体类别</el-radio>
                    <el-radio :label="2">修改链接</el-radio>
                  </el-radio-group>
                </el-form-item>
                <p><b>修改后的结点名称和结点类别:</b></p>
                <el-row>
                  <el-col :span="8">
                    <el-form-item  label="头实体">
                      <el-input disabled v-model="form_of_relation_error.head" style="width:300px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item  label="头实体类型" style="margin-left:100px;">
                      <el-input :disabled="form_of_relation_error.rel_radio == 0 || form_of_relation_error.rel_radio == 2" v-model="form_of_relation_error.head_typ" style="width:300px;"></el-input>
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
                      <el-input :disabled="form_of_relation_error.rel_radio == 0 || form_of_relation_error.rel_radio == 2" v-model="form_of_relation_error.tail_typ" style="width:300px;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="关系">
                  <el-input :disabled="form_of_relation_error.rel_radio == 0 || form_of_relation_error.rel_radio == 1" v-model="form_of_relation_error.rel" style="width:300px;"></el-input>
                </el-form-item>
              </el-form>
            </el-card>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogRelationErrorFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogRelationErrorFormVisible = false;submit_an_relation_error_modification();">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      <div v-if="this.active==1" style="margin-top: 10px;">
        <el-button type="primary" @click="get_attribute_error_list()">开始检测</el-button>
        <el-popover
          placement="top"
          v-model="isJoin">
          <p>是否应用属性值异常的修改结果？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="isJoin = false">取消</el-button>
            <el-button type="primary" size="mini" @click="isJoin = false; join_submission_form_of_attr(); link_modified_successfully();">确定</el-button>
          </div>
          <el-button type="success" slot="reference" style="margin-top: 10px; margin-left: 10px;">应用</el-button>
        </el-popover>
        <keep-alive>
          <el-table
            :data="tableData3"
            border
            :row-class-name="tableRowClassName"
            style="width: 100%; margin-top: 10px;" >
            <!-- <el-table-column
              label="检测时间"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column> -->
            <el-table-column
              label="实体"
              width="400px"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.ent }}</span>
                <el-tag size="small" type="sucess">{{ scope.row.ent_typ }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="属性"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.attribute }}</span>
              </template>
            </el-table-column>     
            <el-table-column
              label="属性值"
              >
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>属性分布区间: {{ scope.row.normal_range }}</p>
                  <div slot="reference" class="name-wrapper">
                    <span style="margin-left: 10px">{{ scope.row.attribute_val }}</span>
                  </div>
                </el-popover>
              </template>
            </el-table-column>    
            <!-- <el-table-column
              label="检测方法"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.normal_range }}</span>
              </template>
            </el-table-column>   -->
            <el-table-column
              label="错误类型"
              >
              <template slot-scope="scope">
                <span v-if="scope.row.error_typ=='0'">链接错误</span>
                <span v-if="scope.row.error_typ=='1'">属性值错误</span>
              </template>
            </el-table-column>   
            <el-table-column
                label="错误状态"
                >
                <template slot-scope="scope">
                  <span v-if="scope.row.error_status == 0" style="margin-left: 10px">待处理</span>
                  <span v-if="scope.row.error_status == 1" style="margin-left: 10px">待提交</span>
                </template>
              </el-table-column>   
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary" plain
                  size="mini"
                  :disabled="scope.row.error_status"
                  @click="dailog_receive_attribute_error(scope.row);draw_graph_of_attr(scope.row);">编辑</el-button>
                  <el-button
                  type="success" plain
                  size="mini"
                  :disabled="whether_can_revoked(scope.row)"
                  @click="revoke_selection_of_attr(scope.row)">撤销</el-button>
              </template>
            </el-table-column>
          </el-table>
        </keep-alive>
          <el-pagination
            @size-change="sizeChange3"
            @current-change="currentChange3"
            :current-page="tableData3_page"
            :page-size="tableData3_size"
            :page-sizes="pageSizes"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData3_total"
            style="margin-top: 10px;">
          </el-pagination>
          <el-dialog title="异常修改" :visible.sync="dialogAttributeErrorFormVisible" fullscreen>
            <el-card shadow="never" style="float: left;margin-right:10px;" class="graphWidth" >
              <h4 class="triples_label">结点属性预览</h4>
              <div id="triples_show" style="height: 700px; width: 750px" ><el-empty description="暂无预览"></el-empty></div>
            </el-card>
            <el-card shadow="never" style="">
              <el-table
                :data="single_attribute_error"
                border
                style="width: 100%">
                <el-table-column
                  label="实体"
                  >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.ent }}</span>
                  <el-tag size="small" type="sucess">{{ scope.row.ent_typ }}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                  prop="attribute"
                  label="属性">
                </el-table-column>
                <el-table-column
                  prop="attribute_val"
                  label="属性值">
                </el-table-column>
              </el-table>
              <el-form :model="form_of_attribute_error">
                <el-form-item label="操作形式">
                  <el-radio-group v-model="form_of_attribute_error.attr_radio">
                    <el-radio :label="3">删除属性值</el-radio>
                    <el-radio :label="4">修改属性值</el-radio>
                  </el-radio-group>
                </el-form-item>
                <p><b>修改后的结点名称和结点类别:</b></p>
                <el-row> 
                  <el-col :span="8">
                    <el-form-item label="实体">
                      <el-input :disabled="form_of_attribute_error.attr_radio == 3 || form_of_attribute_error.attr_radio == 4" v-model="form_of_attribute_error.ent" style="width:300px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="实体类型" style="margin-left:100px;">
                      <el-input :disabled="form_of_attribute_error.attr_radio == 3 || form_of_attribute_error.attr_radio == 4" v-model="form_of_attribute_error.ent_typ" style="width:300px;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="属性">
                      <el-input :disabled="form_of_attribute_error.attr_radio == 3 || form_of_attribute_error.attr_radio == 4" v-model="form_of_attribute_error.attribute" style="width:300px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="属性值" style="margin-left:100px;">
                      <el-input :disabled="form_of_attribute_error.attr_radio == 3" v-model="form_of_attribute_error.attribute_val" style="width:300px;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
              <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAttributeErrorFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogAttributeErrorFormVisible = false;submit_an_attribute_error_modification();">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      <div v-if="this.active==2" style="margin-top: 10px;" v-loading = submitLoading element-loading-text="正在提交中...">
        <el-table
            :data="tableData4"
            border
            style="width: 100%; margin-top: 10px;"
        >
            <el-table-column
              label="头实体（旧）"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head }}</span>
                <el-tag style="margin-left: 10px">{{ scope.row.head_typ }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="关系（旧）"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.rel }}</span>
              </template>
            </el-table-column>     
            <el-table-column
              label="尾实体（旧）"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail }}</span>
                <el-tag v-if="scope.row.error_typ!=1" style="margin-left: 10px">{{ scope.row.tail_typ }}</el-tag>
              </template>
            </el-table-column>    
            <el-table-column
              label="头实体（新）"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head_new }}</span>
                <el-tag v-if="scope.row.head_typ_new!= '-' && scope.row.error_typ!=1" style="margin-left: 10px">{{ scope.row.head_typ_new }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="关系（新）"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.rel_new }}</span>
              </template>
            </el-table-column>     
            <el-table-column
              label="尾实体（新）"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail_new }}</span>
                <el-tag v-if="scope.row.error_typ!=1 && scope.row.head_typ_new!= '-'" style="margin-left: 10px">{{ scope.row.tail_typ_new }}</el-tag>
              </template>
            </el-table-column>  
            <el-table-column
              label="错误类型"
              >
              <template slot-scope="scope">
                <span v-if="scope.row.error_typ==0">链接错误</span>
                <span v-if="scope.row.error_typ==1">属性值错误</span>
              </template>
            </el-table-column>         
            <el-table-column
              label="更新方式"
              >
              <template slot-scope="scope">
                <span v-if="scope.row.update_form==0">删除链接</span>
                <span v-if="scope.row.update_form==1">修改实体类别</span>
                <span v-if="scope.row.update_form==2">修改链接</span>
                <span v-if="scope.row.update_form==3">删除属性值</span>
                <span v-if="scope.row.update_form==4">修改属性值</span>
              </template>
            </el-table-column>    
          </el-table>
          <el-pagination
            @size-change="sizeChange4"
            @current-change="currentChange4"
            :current-page="tableData4_page"
            :page-size="tableData4_size"
            :page-sizes="pageSizes"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData4_total"
            style="margin-top: 10px;">
          </el-pagination>
        </div>
        <div style="text-align: right;">
        <el-button style="margin-top: 12px;" v-if="this.active>=1" @click="previous">上一步</el-button>
        <el-button type="primary" style="margin-top: 12px;" v-if="this.active<2" @click="next">下一步</el-button>
        <el-popover
            placement="left"
            v-model="nextStepVisible"
            v-if="this.active==2">
          <p>确定保存当前操作记录并提交至缓存表吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="nextStepVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="nextStepVisible = false;submitToCache();handoff=true;">确定</el-button>
          </div>
          <el-button type="primary" style="margin-top: 12px; margin-left: 10px;" slot="reference">提交</el-button>
        </el-popover>
      </div>
        </el-tab-pane>
        <el-tab-pane disabled="handoff" label="基于智能匹配检测" name="fourth">
          <el-table
            :data="tableData1"
            border
            style="width: 100%">
            <el-table-column
              prop="head"
              label="头实体"
              width="180">
            </el-table-column>
            <el-table-column
              prop="head_typ"
              label="头实体类别">
            </el-table-column>
            <el-table-column
              prop="rel"
              label="关系"
              width="180">
            </el-table-column>
            <el-table-column
              prop="tail"
              label="尾实体">
            </el-table-column>
            <el-table-column
              prop="tail_typ"
              label="尾实体类别"
              width="180">
            </el-table-column>
            <el-table-column
              prop="abnormal_score"
              label="异常分数">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="tableData1_page"
            :page-size="tableData1_size"
            :page-sizes="pageSizes"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData1_total"
            style="margin-top: 10px;">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>
<style>
.graphWidth{
  width:50%;
  height:80%;
}
.formWidth{
  width:40%;
  height:80%;
}
.el-table .warning-row {
    background: oldlace;
  }
.el-table .success-row {
  background: FFFFFF;
}
</style>
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
        handoff:false,
        isJoin: false, //是否应用链接异常修改的flag
        activeName: 'first', //基于本体or基于算法选项卡flag
        abnormal_from_kgist:[], //kgist（算法）检测到的异常list
        single_relation_error : [], //链接异常dialog页中的表格
        single_attribute_error : [], ////属性值异常dialog页中的表格
        //以下都是前端分页代码
        pageSizes:[5,10,20,30,40,50,60], //每页的行数
        //kgist（算法）list分页
        tableData1 : [],
        tableData1_page: 1,
        tableData1_size: 20,
        tableData1_total: 0,
        //本体链接异常list分页
        tableData2 : [],
        tableData2_page: 1,
        tableData2_size: 20,
        tableData2_total: 0,
        //本体属性异常list分页
        tableData3 : [],
        tableData3_page: 1,
        tableData3_size: 20,
        tableData3_total: 0,
        //评估提交list分页
        tableData4 : [],
        tableData4_page: 1,
        tableData4_size: 20,
        tableData4_total: 0,
        attribute_error: [], //从本体检测到的属性异常list
        relation_error: [], //从本体检测到的链接异常list
        data_to_be_submitted_rel_stack:[], //暂存编辑过的链接异常
        data_to_be_submitted_attr_stack:[],
        data_to_be_submitted:[], //评估提交list
        selectedRowOfEntityError:[], //选中的链接异常行
        active:0, //基于本体检测中的步骤条
        submitLoading:false, //提交的loading状态flag
        // qualiatyVisible:false,
        nextStepVisible:false, //是否保存操作至缓存表的flag
        dialogRelationErrorFormVisible: false, //关系异常修改的dialog
        dialogAttributeErrorFormVisible: false, //属性异常修改的dialog
        // 存放修改链接异常结果的form
        form_of_relation_error: {
          head: '',
          head_typ: '',
          rel:'',
          tail:'',
          tail_typ:'',
          rel_radio: 0,
        },
        // 存放修改属性异常结果的form
        form_of_attribute_error: {
          ent: '',
          ent_typ: '',
          attribute:'',
          attribute_val:'',
          attr_radio: 3,
        },
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      //下一步
      next() {
        if(this.active<3){
          this.active++;
          if(this.active==2){
            this.getTableData4();
          }
        }
        else if(this.active==3){
          // this.active++;
        }
      },
      //上一步
      previous() {
        this.active--;
      },
      //质量雷达图（暂未使用）
      
      // dispalyEvaluation(){
      //   setTimeout(()=>{
      //     this.getKgRadar()
      //   },100)
      // },
      // getKgRadar(){
      //   var chartDom = document.getElementById('radar');
      //   var myChart = echarts.init(chartDom);
      //   var option;
      //   option = {
      //     title: {
      //       text: '图谱质量评估'
      //     },
      //     radar: {
      //       // shape: 'circle',
      //       indicator: [
      //         { name: '准确性', max: 100 },
      //         { name: '一致性', max: 100 },
      //         { name: '完整性', max: 100 },
      //         { name: '时效性', max: 100 },
      //         { name: '可信度', max: 100 },
      //         { name: '可用性', max: 100 }
      //       ]
      //     },
      //     series: [
      //       {
      //         name: 'Budget vs spending',
      //         type: 'radar',
      //         data: [
      //           {
      //             value: [65, 80, 65, 55, 70, 60],
      //             name: 'Allocated Budget'
      //           },
      //         ]
      //       }
      //     ]
      //   };
      //   option && myChart.setOption(option);
      // },
      get_relation_error_list(){
          //axios请求
          axios.post('/pythonApi/get_relation_error_list',{})
          .then((response)=>{
            if (response.status == 200) {
              //赋值给表格
              this.relation_error = response.data.data;
              this.getTableData2();
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
              this.getTableData3()
               //设置文本高亮
              }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      get_abnormal_by_algorithm(){
          //axios请求
          axios.post('/pythonApi/get_abnormal_by_algorithm',{})
          .then((response)=>{
            if (response.status == 200) {
              //赋值给表格
              this.abnormal_from_kgist = response.data.data;
              this.getTableData();
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
        console.log(this.data_to_be_submitted)
        axios.post('/api/triples/evaluationCoreKg',{
          res:this.data_to_be_submitted,
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
      //接受一条关系错误的dialog
      dailog_receive_relation_error(row){
        this.single_relation_error = [];
        this.single_relation_error.push(row);
        for(var key in row){
          if(key in this.form_of_relation_error)
          this.form_of_relation_error[key] = row[key]
        }
        this.dialogRelationErrorFormVisible = true;
        this.selectedRowOfRelError = row;
      },
      submit_an_relation_error_modification(){
        var row_of_relation_error_modification = {
          head: '', head_typ: '', rel:'', tail:'', tail_typ:'',
          head_new: '-', head_typ_new: '-', rel_new: '-', tail_new: '-', tail_typ_new: '-',
          rel_radio: 0,
          error_typ: 0,
        };
        this.selectedRowOfRelError.error_status = 1;
        row_of_relation_error_modification.pointer = this.selectedRowOfRelError;
        for(var key in this.selectedRowOfRelError){
          if(key in row_of_relation_error_modification)
          row_of_relation_error_modification[key] = this.selectedRowOfRelError[key]
        }
        row_of_relation_error_modification['update_form'] = this.form_of_relation_error.rel_radio
        if(row_of_relation_error_modification['update_form'] != 0){
          row_of_relation_error_modification['head_new'] = this.form_of_relation_error.head;
          row_of_relation_error_modification['head_typ_new'] = this.form_of_relation_error.head_typ;
          row_of_relation_error_modification['rel_new'] = this.form_of_relation_error.rel;
          row_of_relation_error_modification['tail_new'] = this.form_of_relation_error.tail;
          row_of_relation_error_modification['tail_typ_new'] = this.form_of_relation_error.tail_typ;
        }
        this.data_to_be_submitted_rel_stack.push(row_of_relation_error_modification)
      },
      join_submission_form(){
        for(var i=0;i <this.data_to_be_submitted_rel_stack.length; i++){
          this.data_to_be_submitted.push(this.data_to_be_submitted_rel_stack[i])
        }
        //关系错误置零
        this.data_to_be_submitted_rel_stack = [];
      },
      dailog_receive_attribute_error(row){
        this.single_attribute_error = [];
        this.single_attribute_error.push(row);
        for(var key in row){
          if(key in this.form_of_attribute_error)
          this.form_of_attribute_error[key] = row[key]
        }
        this.dialogAttributeErrorFormVisible = true;
        this.selectedRowOfAttrError = row;
      },
      submit_an_attribute_error_modification(){
        var row_of_attribute_error_modification = {
          head: '', head_typ: '', rel:'', tail:'',
          head_new: '-', head_typ_new: '-', rel_new: '-', tail_new: '-',
          attr_radio: 3,
          error_typ: 1,
        };
        this.selectedRowOfAttrError.error_status = 1;
        row_of_attribute_error_modification.pointer = this.selectedRowOfAttrError;
        // for(var key in this.selectedRowOfAttrError){
        //   if(key in row_of_attribute_error_modification)
        //   row_of_attribute_error_modification[key] = this.selectedRowOfAttrError[key]
        // }
        row_of_attribute_error_modification['head'] = this.selectedRowOfAttrError.ent;
        row_of_attribute_error_modification['head_typ'] = this.selectedRowOfAttrError.ent_typ;
        row_of_attribute_error_modification['rel'] = this.selectedRowOfAttrError.attribute;
        row_of_attribute_error_modification['tail'] = this.selectedRowOfAttrError.attribute_val;        
        row_of_attribute_error_modification['update_form'] = this.form_of_attribute_error.attr_radio
        if(row_of_attribute_error_modification['update_form'] != 3){
          row_of_attribute_error_modification['head_new'] = this.selectedRowOfAttrError.ent;
          row_of_attribute_error_modification['head_typ_new'] = this.selectedRowOfAttrError.ent_typ;
          row_of_attribute_error_modification['rel_new'] = this.selectedRowOfAttrError.attribute;
          row_of_attribute_error_modification['tail_new'] = this.form_of_attribute_error.attribute_val;
        }
        this.data_to_be_submitted_attr_stack.push(row_of_attribute_error_modification)
      },
      join_submission_form_of_attr(){
        for(var i=0;i <this.data_to_be_submitted_attr_stack.length; i++){
          this.data_to_be_submitted.push(this.data_to_be_submitted_attr_stack[i])
        }
        //关系错误置零
        this.data_to_be_submitted_attr_stack = [];
      },
      //getTableData
      getTableData(){
        //allData为全部数据
        this.tableData1 = this.abnormal_from_kgist.slice(
          (this.tableData1_page - 1) * this.tableData1_size,
          this.tableData1_page * this.tableData1_size
        );
        this.tableData1_total = this.abnormal_from_kgist.length
        this.getTableData();
      },
      currentChange(val){
        this.tableData1_page = val
        this.getTableData()
      },
      sizeChange(val){
        this.tableData1_size = val
        this.tableData1_page = 1
        this.getTableData()
      },
      getTableData2(){
        //allData为全部数据
        this.tableData2 = this.relation_error.slice(
          (this.tableData2_page - 1) * this.tableData2_size,
          this.tableData2_page * this.tableData2_size
        );
        this.tableData2_total = this.relation_error.length
        this.getTableData2();
      },
      currentChange2(val){
        this.tableData2_page = val
        this.getTableData2()
      },
      sizeChange2(val){
        this.tableData2_size = val
        this.tableData2_page = 1
        this.getTableData2()
      },
      getTableData3(){
        //allData为全部数据
        this.tableData3 = this.attribute_error.slice(
          (this.tableData3_page - 1) * this.tableData3_size,
          this.tableData3_page * this.tableData3_size
        );
        this.tableData3_total = this.attribute_error.length
        this.getTableData3();
      },
      currentChange3(val){
        this.tableData3_page = val
        this.getTableData3()
      },
      sizeChange3(val){
        this.tableData3_size = val
        this.tableData3_page = 1
        this.getTableData3()
      },
      getTableData4(){
        //allData为全部数据
        this.tableData4 = this.data_to_be_submitted.slice(
          (this.tableData4_page - 1) * this.tableData4_size,
          this.tableData4_page * this.tableData4_size
        );
        this.tableData4_total = this.data_to_be_submitted.length
        this.getTableData4();
      },
      currentChange4(val){
        this.tableData4_page = val
        this.getTableData4()
      },
      sizeChange4(val){
        this.tableData4_size = val
        this.tableData4_page = 1
        this.getTableData4()
      },
      //请求当前三元组中结点周围一跳的信息
      draw_graph(row){
        //axios请求
        axios.post('/pythonApi/draw_graph',{
          data: row,
        })
        .then((response)=>{
          if (response.status == 200) {
            let arr = response.data.data;
            this.show_triples(arr);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      draw_graph_of_attr(row){
        //axios请求
        axios.post('/pythonApi/draw_graph_of_attr',{
          data: row,
        })
        .then((response)=>{
          if (response.status == 200) {
            let arr = response.data.data;
            this.show_triples_of_attr(arr);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //三元组展示
      show_triples(arr){
        var chartDom = document.getElementById('triples_show');
        var myChart = echarts.init(chartDom);
        myChart.hideLoading();
        var webkitDep = this.genrateData(arr);
        var option = {
          legend: {
            x: 'left',//图例位置
            //图例的名称
            //此处的数据必须和关系网类别中name相对应
            data: webkitDep.categories.map(function (a) {
              return a.name;
            })
          },
          series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 20,
            // animation: false,
            label: {
              normal: {
                show:true,
                position: 'right'
              }
            },
            //展示边数据
            edgeLabel: {
              normal: {
                show: true,
                formatter: function (x) {
                  return x.data.name;
                }
              }
            },
            edgeSymbol: ["circle", "arrow"], //边两边的类型
            draggable: true,
            force: {
              layoutAnimation:true,
              // xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
              // yAxisIndex : 0, //y轴坐标
              // gravity:0.03,  //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
              // edgeLength: 55,  //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
              // repulsion: 150  //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
              edgeLength: 120,
              repulsion: 50,
              gravity: 0.03
            },
            data: webkitDep.nodes.map(function (node, idx) {  //node数据
              node.id = idx;
              return node;
            }),
            categories: webkitDep.categories,  //关系网类别，可以写多组
            edges: webkitDep.links  //link数据
          }]
        };
        myChart.setOption(option);
      },
      show_triples_of_attr(arr){
        var chartDom = document.getElementById('triples_show');
        var myChart = echarts.init(chartDom);
        myChart.hideLoading();
        var webkitDep = this.genrateData_of_attr(arr);
        var option = {
          legend: {
            x: 'left',//图例位置
            //图例的名称
            //此处的数据必须和关系网类别中name相对应
            data: webkitDep.categories.map(function (a) {
              return a.name;
            })
          },
          series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 20,
            // animation: false,
            label: {
              normal: {
                show:true,
                position: 'right'
              }
            },
            //展示边数据
            edgeLabel: {
              normal: {
                show: true,
                formatter: function (x) {
                  return x.data.name;
                }
              }
            },
            edgeSymbol: ["circle", "arrow"], //边两边的类型
            draggable: true,
            force: {
              layoutAnimation:true,
              // xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
              // yAxisIndex : 0, //y轴坐标
              // gravity:0.03,  //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
              // edgeLength: 55,  //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
              // repulsion: 150  //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
              edgeLength: 120,
              repulsion: 50,
              gravity: 0.03
            },
            data: webkitDep.nodes.map(function (node, idx) {  //node数据
              node.id = idx;
              return node;
            }),
            categories: webkitDep.categories,  //关系网类别，可以写多组
            edges: webkitDep.links  //link数据
          }]
        };
        myChart.setOption(option);
      },
      //生成三元组展示图所需数据
      genrateData(arr){
        var data = {};
        var map=new Map;
        data['categories'] = [];
        var nodes = [];
        var links= [];
        var counter = 0;
        var dic = {};
        var cate_counter = 0;
        for(var i=0;i<arr.length;i++){
          if(!(arr[i].head_typ in dic)){
            dic[arr[i].head_typ] = cate_counter
            var new_cate = {};
            new_cate.name = arr[i].head_typ;
            cate_counter+=1;
            data['categories'].push(new_cate);
          }
          if(!(arr[i].tail_typ in dic)){
            dic[arr[i].tail_typ] = cate_counter
            var new_cate = {};
            new_cate.name = arr[i].tail_typ;
            cate_counter+=1;
            data['categories'].push(new_cate);
          }
        }
        for(var i=0;i<arr.length;i++){
            //已有该实体
            if(!map.has(arr[i].head)){
              map.set(arr[i].head,counter);
              var new_node1 = {};
              new_node1.name = arr[i].head;
              new_node1.category = dic[arr[i].head_typ];
              new_node1.id = counter;
              counter+=1;
              nodes.push(new_node1);
            }
            //已有该实体,不需增加新的节点
            if(!map.has(arr[i].tail)) {
              map.set(arr[i].tail, counter);
              var new_node2 = {};
              new_node2.name = arr[i].tail;
              new_node2.category = dic[arr[i].tail_typ];
              new_node2.id = counter;
              counter += 1;
              nodes.push(new_node2);
            }
        }
        for(var i=0;i<arr.length;i++){
            var link = {};
            link.source = map.get(arr[i].head);
            link.name = arr[i].rel;
            link.target = map.get(arr[i].tail);
            links.push(link)
        }
        data['nodes'] = nodes;
        data['links'] = links;
        return data;
      },
      //生成三元组展示图所需数据
      genrateData_of_attr(arr){
        console.log(arr)
        var data = {};
        var map=new Map;
        data['categories'] = [];
        var nodes = [];
        var links= [];
        var counter = 0;
        data['categories'].push({name: arr[0].ent_typ});
        data['categories'].push({name: '属性值'});
        var new_node1 = {};
        new_node1.name = arr[0].ent;
        new_node1.category = 0;
        map.set(arr[0].ent, counter)
        counter += 1;
        new_node1.id = counter;
        nodes.push(new_node1);
        for(var i=0;i<arr.length;i++){
            //已有该实体,不需增加新的节点
            if(!map.has(arr[i].attribute_val)) {
              map.set(arr[i].attribute_val, counter);
              var new_node2 = {};
              new_node2.name = arr[i].attribute_val;
              new_node2.category = 1;
              new_node2.id = counter;
              counter += 1;
              nodes.push(new_node2);
            }
        }
        for(var i=0;i<arr.length;i++){
            var link = {};
            link.source = 0;
            link.name = arr[i].attribute;
            link.target = map.get(arr[i].attribute_val);
            links.push(link)
        }
        data['nodes'] = nodes;
        data['links'] = links;
        console.log(data);
        return data;
      },
      //表格行背景颜色改变
      tableRowClassName({row, rowIndex}) {
        if (row.error_status == 1) {
          return 'warning-row';
        } else if (row.error_status == 0) {
          return 'success-row';
        }
        return '';
      },
      //待提交->待处理
      
      revoke_selection(row){
          row.error_status = 0;
          for(var i=0;i<this.data_to_be_submitted_rel_stack.length;i++){
            if(this.data_to_be_submitted_rel_stack[i].pointer == row){
              console.log('来这里了')
              this.data_to_be_submitted_rel_stack.splice(i, 1);
            }
          }
      },
      revoke_selection_of_attr(row){
          row.error_status = 0;
          for(var i=0;i<this.data_to_be_submitted_attr_stack.length;i++){
            if(this.data_to_be_submitted_attr_stack[i].pointer == row){
              console.log('来这里了')
              this.data_to_be_submitted_attr_stack.splice(i, 1);
            }
          }
      },
      whether_can_revoked(row){
        var isInSubmit = false
        for(var i=0;i<this.data_to_be_submitted.length;i++){
          if(this.data_to_be_submitted[i].pointer == row){
            isInSubmit = true;
            break;
          }
        }
        return isInSubmit;
      },
      link_modified_successfully(){
        this.$message({
          message: '链接异常修改应用成功！',
          type: 'success'
        });
      },
      attr_modified_successfully(){
        this.$message({
          message: '属性值异常修改应用成功！',
          type: 'success'
        });
      }
    },
    mounted(){
      this.get_abnormal_by_algorithm()
    }
  }
</script>
