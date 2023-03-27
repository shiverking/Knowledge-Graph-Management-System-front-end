<template>
  <div v-show="mergeUpdate==true||completionUpdate==true|| evaluationUpdate==true">
    <!--提示信息-->
    <el-card shadow="never" class="check" >
      <i class="el-icon-info"></i>
      <span>有一条任务正在进行中</span>
      <span v-show="mergeUpdate==true||completionUpdate==true|| evaluationUpdate==true">(</span>
      <span v-show="mergeUpdate==true">融合数据已更新</span>
      <span v-show="completionUpdate==true&&mergeUpdate==true">,</span>
      <span v-show="completionUpdate==true">补全数据已更新</span>
      <span v-show="completionUpdate==true&& evaluationUpdate==true">,</span>
      <span v-show="completionUpdate==false&& evaluationUpdate==true&&mergeUpdate==true">,</span>
      <span v-show=" evaluationUpdate==true">质量评估数据已更新</span>
      <span v-show="mergeUpdate==true||completionUpdate==true|| evaluationUpdate==true">)</span>
      <span>......</span>
      <el-button id="detailButton" type="primary" class="detail" @click="cacheDisplay=true">详情</el-button>
    </el-card>
    <!--对话框内容-->
    <el-dialog title="缓存表" :visible.sync="cacheDisplay" width="70%" >
      <el-tabs v-model="activeName" v-loading="dialogLoading" element-loading-text="版本提交中....." >
        <!--融合改动-->
        <el-tab-pane label="融合改动" name="first">
          <el-table :data="mergeCacheData" height="500" style="margin-top:0vh" border>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column property="id" label="id" width="70" show-overflow-tooltip></el-table-column>
            <el-table-column property="head" label="头实体" show-overflow-tooltip></el-table-column>
            <el-table-column property="head_from" label="From" show-overflow-tooltip></el-table-column>
            <el-table-column property="relation" label="关系" show-overflow-tooltip></el-table-column>
            <el-table-column property="tail" label="尾实体" show-overflow-tooltip></el-table-column>
            <el-table-column property="tail_from" label="From" show-overflow-tooltip></el-table-column>
            <el-table-column property="score" label="置信评分" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理结果">
              <template slot-scope="scope">
                  <span>
                  <el-tag type="success" v-if="scope.row.operation=='插入'">{{ scope.row.operation}}</el-tag>
                  <el-tag type="danger" v-if="scope.row.operation=='忽略'">{{ scope.row.operation}}</el-tag>
                </span>
                </template>
            </el-table-column>
            <el-table-column label="操作时间">
              <template slot-scope="scope">{{ timeProcess(scope.row.time)}}</template>
            </el-table-column>
          </el-table>
          <el-pagination
              class="choose_targetKg_pagination"
              background
              layout="total ,prev, pager, next"
              @current-change="mergeCacheHandleCurrentChange"
              :current-page="mergeCacheCurrentPage"
              :page-size="mergeCachePageSize"
              :total="mergeCacheTotal">
          </el-pagination>
        </el-tab-pane>
        <!--补全改动-->
        <el-tab-pane label="补全改动" name="second">
          <el-table :data="completionCacheData" height="500" border>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column property="id" label="id" width="70" show-overflow-tooltip></el-table-column>
            <el-table-column property="head" label="头实体" show-overflow-tooltip></el-table-column>
            <el-table-column property="rel" label="关系" show-overflow-tooltip></el-table-column>
            <el-table-column property="tail" label="尾实体" show-overflow-tooltip></el-table-column>
            <el-table-column property="pred_prob" label="评分" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                  <span v-if="scope.row.pred_form=='0'">“实体-关系”链接已存在</span>
                  <span v-if="scope.row.pred_form=='1'">“实体-关系”链接不存在</span>
              </template>
            </el-table-column>
            <el-table-column label="操作时间">
              <template slot-scope="scope">{{ dateFormat(scope.row.time)}}</template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="choose_targetKg_pagination"
            background
            layout="total ,prev, pager, next"
            @current-change="completionCacheHandleCurrentChange"
            :current-page="completionCacheCurrentPage"
            :page-size="completionCachePageSize"
            :total="completionCacheTotal">
        </el-pagination>
        </el-tab-pane>
        <!--质量评估改动-->
        <el-tab-pane label="质量评估改动" name="third" border>
          <el-table :data="evaluationCacheData"  height="500" >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column property="id" label="id" width="70"></el-table-column>
            <el-table-column property="head" label="头实体" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="head_new" label="新头实体" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="head_typ" label="类型" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="head_typ_new" label="新类型" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="rel" label="关系" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="rel_new" label="新关系" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="tail" label="尾实体" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="tail_new" label="新尾实体" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="tail_typ" label="类型" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="tail_typ_new" label="新类型" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="错误类型" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-if="scope.row.error_typ=='0'">实体错误</span>
                <span v-if="scope.row.error_typ=='1'">链接错误</span>
                <span v-if="scope.row.error_typ=='2'">属性值错误</span>
              </template>
            </el-table-column>
            <el-table-column label="修改形式" >
              <template slot-scope="scope">
                <span v-if="scope.row.update_form=='0'"><el-tag type="warning">修改</el-tag></span>
                <span v-if="scope.row.update_form=='1'"><el-tag type="danger">删除</el-tag></span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              class="choose_targetKg_pagination"
              background
              layout="total ,prev, pager, next"
              @current-change="evaluationCacheHandleCurrentChange"
              :current-page="evaluationCacheCurrentPage"
              :page-size="evaluationCachePageSize"
              :total="evaluationCacheTotal">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <!--footer-->
      <span slot="footer" class="dialog-footer">
        <el-tooltip class="item" effect="dark" content="批量删除" placement="top-start">
          <el-button type="danger" icon="el-icon-delete" class="operation_button" plain>批量删除</el-button>
        </el-tooltip>
        <el-popover
            placement="top"
            v-model="deleteVisible">
            <p>确定要将缓存表中的所有更新(融合,补全,质量评估)清除并删除此次更新吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteVisible = false;deleteAll()">确定</el-button>
            </div>
            <el-button type="danger" class="operation_button" slot="reference" plain icon="el-icon-delete">全部删除</el-button>
        </el-popover>
        <el-popover
            placement="top"
            v-model="submitVisible">
            <p>确定要将缓存表中的所有更新提交为新版本吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="submitVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="submitVisible = false;submit()">确定</el-button>
            </div>
            <el-button type="success" slot="reference" class="operation_button" icon="el-icon-upload2" plain>提交版本</el-button>
        </el-popover>
      </span>
    </el-dialog>
  </div>
</template>
<style>
.operation_button{
  margin: 8px;
}
</style>
<script>
import moment from 'moment';
import $ from "../../plugins/jquery.min";
export default {
  name: "DeleteCache",
   data(){
    return{
      activeName:'first',
      cacheDisplay:false,
      mergeDeleteVisible:false,
      completionDeleteVisible:false,
      evaluationDeleteVisible:false,
      submitVisible:false,
      deleteVisible:false,
      //下面是记录三种状态是否存在数据更新
      mergeUpdate:false,
      completionUpdate:false,
      evaluationUpdate:false,
      //查询所有的merge的缓存数据
      mergeCacheData:[],
      mergeCacheCurrentPage:1,
      mergeCachePageSize:10,
      mergeCacheTotal:0,
      //查询所有的completion的缓存数据
      completionCacheData:[],
      completionCacheCurrentPage:1,
      completionCachePageSize:10,
      completionCacheTotal:0,
      //查询所有的evaluation的缓存数据
      evaluationCacheData:[],
      evaluationCacheCurrentPage:1,
      evaluationCachePageSize:10,
      evaluationCacheTotal:0,
      dialogLoading:false,
    }
  },
  methods:{
    //获取mergeCacheTableData
    get_merge_cache(page,limit){
      axios.request({
        method:"POST",
        url:'/api/triples/getMergeCacheByPage',
        params:{page:page,limit:limit}
      })
      .then((response) => {
        if (response.status == 200) {
          //向表中加载数据
          this.mergeCacheData= response.data.data
          this.mergeCacheTotal= response.data.count
          //设置提示可见
          if(this.mergeCacheData.length>0){
            this.mergeUpdate = true;
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    //mergeCacheTable的PageSzie改变动作
    mergeCacheHandleSizeChange(val){
      //修改当前分页大小
      this.mergeCachePageSize = val;
      //重新请求数据
      this.get_merge_cache(this.mergeCachePageSize,val)
    },
    //mergeCacheTable分页改变动作
    mergeCacheHandleCurrentChange(val){
      this.get_merge_cache(val,this.mergeCachePageSize)
    },
    //获取completionCacheTableData
    get_completion_cache(page,limit){
      axios.request({
        method:"POST",
        url:'/api/triples/getCompletionCacheByPage',
        params:{page:page,limit:limit}
      })
          .then((response) => {
            if (response.status == 200) {
              //向表中加载数据
              this.completionCacheData= response.data.data
              this.completionCacheTotal= response.data.count
              //设置提示可见
              if(this.completionCacheData.length>0){
                this.completionUpdate = true;
              }
            }
          })
      .catch(function (error) {
        console.log(error)
      })
      },
    //completionCacheTable的PageSzie改变动作
    completionCacheHandleSizeChange(val){
      //修改当前分页大小
      this.completionCachePageSize = val;
      //重新请求数据
      this.get_completion_cache(this.completionCachePageSize,val)
    },
    //completionCacheTable分页改变动作
    completionCacheHandleCurrentChange(val){
      this.get_completion_cache(val,this.completionCachePageSize)
    },
    //获取 evaluationCacheTableData
    get_evaluation_cache(page,limit){
      axios.request({
        method:"POST",
        url:'/api/triples/getEvaluationCacheByPage',
        params:{page:page,limit:limit}
      })
      .then((response) => {
        if (response.status == 200) {
          //向表中加载数据
          this.evaluationCacheData= response.data.data
          this.evaluationCacheTotal= response.data.count
          //设置提示可见
          if(this.evaluationCacheData.length>0){
            this.evaluationUpdate = true;
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    // evaluationCacheTable的PageSzie改变动作
     evaluationCacheHandleSizeChange(val){
      //修改当前分页大小
      this.evaluationCachePageSize = val;
      //重新请求数据
      this.get_evaluation_cache(this.evaluationCachePageSize,val)
    },
    // evaluationCacheTable分页改变动作
     evaluationCacheHandleCurrentChange(val){
      this.get_evaluation_cache(val,this.evaluationCachePageSize)
    },
    //提交版本
    submit(){
      this.dialogLoading=true
      axios.post('/api/version/insertNewVersion',{
        mergeNumber:this.mergeCacheTotal,
        completionNumber:this.completionCacheTotal,
        evaluationNumber:this.evaluationCacheTotal,
      })
      .then((response) => {
        if (response.status == 200) {
          if(response.data.msg=="success"){
            this.dialogLoading=false
            this.$notify({
              title: '成功',
              message: '版本更新成功!',
              type: 'success'
            });
            //跳转到版本记录
            this.$router.push('/merge/kg/versionControl');
          }
        }
      })
      .catch(function (error) {
        this.$notify({
          title: '失败',
          message: '版本更新失败!',
          type: 'danger'
        });
        console.log(error)
      })
    },
    //时间格式化
    dateFormat(data) {
      return moment(new Date(data).getTime()).format('YYYY-MM-DD');;
    },
    //处理时间格式问题
    timeProcess(time){
      var res = "";
      for(var i=0;i<3;i++){
        res+=time[i];
        if(i<2){
          res+="-";
        }
      }
      return res;
    },
    //删除所有
    deleteAll(){
      axios.post('/api/version/deleteAllCache',{})
          .then((response) => {
            if (response.status == 200 && response.data.msg=="success"){
                this.$notify({
                  title: '成功',
                  message: '删除成功!',
                  type: 'success'
                });
                this.cacheDisplay = false;
                this.mergeUpdate=false;
                this.completionUpdate=false;
                this.evaluationUpdate=false;
            }
          })
          .catch(function (error) {
            this.$notify({
              title: '失败',
              message: '删除失败!',
              type: 'danger'
            });
            console.log(error)
          })
    }
  },
  mounted() {
    this.get_merge_cache(this.mergeCacheCurrentPage,this.mergeCachePageSize);
    this.get_completion_cache(this.completionCacheCurrentPage,this.completionCachePageSize);
    this.get_evaluation_cache(this.evaluationCacheCurrentPage,this.evaluationCachePageSize);
  }
}
</script>

<style scoped>
.check{
  width: 100%;
  background-color:#FDF6EC;
}
.detail{
  float: right;
  bottom: 8px;
  position: relative;
}
.el-tabs__header{
  margin: 0px;
}
</style>