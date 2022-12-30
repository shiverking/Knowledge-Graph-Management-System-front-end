<template>
  <div v-show="mergeUpdate==true||completionUpdate==true||evaluateUpdate==true">
    <!--提示信息-->
    <el-card shadow="never" class="check" >
      <i class="el-icon-info"></i>
      <span>有一条任务正在进行中</span>
      <span v-show="mergeUpdate==true||completionUpdate==true||evaluateUpdate==true">(</span>
      <span v-show="mergeUpdate==true">融合数据已更新</span>
      <span v-show="completionUpdate==true&&mergeUpdate==true">,</span>
      <span v-show="completionUpdate==true">补全数据已更新</span>
      <span v-show="completionUpdate==true&&evaluateUpdate==true">,</span>
      <span v-show="completionUpdate==false&&evaluateUpdate==true&&mergeUpdate==true">,</span>
      <span v-show="evaluateUpdate==true">质量评估数据已更新</span>
      <span v-show="mergeUpdate==true||completionUpdate==true||evaluateUpdate==true">)</span>
      <span>......</span>
      <el-button type="primary" class="detail" @click="cacheDisplay=true">详情</el-button>
    </el-card>
    <!--对话框内容-->
    <el-dialog title="缓存表内容" :visible.sync="cacheDisplay" width="1000px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabChange" >
        <!--融合改动-->
        <el-tab-pane label="融合改动" name="first">
          <el-popover
              placement="top"
              v-model="mergeDeletaVisible">
            <p>确定要删除缓存表中关于融合的修改吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="mergeDeletaVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="mergeDeletaVisible = false">确定</el-button>
            </div>
          <el-button type="danger" slot="reference">删除</el-button>
          </el-popover>
          <el-table :data="mergeCacheData" height="400" style="margin-top:0vh">
            <el-table-column property="id" label="id" ></el-table-column>
            <el-table-column property="head" label="头实体"></el-table-column>
            <el-table-column property="head_from" label="From"></el-table-column>
            <el-table-column property="relation" label="关系" ></el-table-column>
            <el-table-column property="tail" label="尾实体" ></el-table-column>
            <el-table-column property="tail_from" label="From"></el-table-column>
            <el-table-column property="score" label="置信评分"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                  <span>
                  <el-tag type="success" v-if="scope.row.operation=='插入'">{{ scope.row.operation}}</el-tag>
                  <el-tag type="danger" v-if="scope.row.operation=='忽略'">{{ scope.row.operation}}</el-tag>
                </span>
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
              @current-change="mergeCacheHandleCurrentChange"
              :current-page="mergeCacheCurrentPage"
              :page-size="mergeCachePageSize"
              :total="mergeCacheTotal">
          </el-pagination>
        </el-tab-pane>
        <!--补全改动-->
        <el-tab-pane label="补全改动" name="second">
          <el-popover
              placement="top"
              v-model="visible">
            <p>确定要删除缓存表中关于补全的修改吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
            </div>
            <el-button type="danger" slot="reference">删除</el-button>
          </el-popover>
          <el-table :data="completionCacheData">
            <el-table-column property="id" label="id" ></el-table-column>
            <el-table-column property="head" label="头实体"></el-table-column>
            <el-table-column property="rel" label="关系" ></el-table-column>
            <el-table-column property="tail" label="尾实体" ></el-table-column>
            <el-table-column property="pred_prob" label="评分"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                  <span v-if="scope.row.pred_form=='0'">预测尾实体</span>
                  <span v-if="scope.row.pred_form=='1'">预测头实体</span>
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
        <el-tab-pane label="质量评估改动" name="third">
          <el-popover
              placement="top"
              v-model="visible">
            <p>确定要删除缓存表中关于质量评估的修改吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
            </div>
            <el-button type="danger" slot="reference">删除</el-button>
          </el-popover>
          <el-table :data="gridData">
            <el-table-column property="date" label="日期" width="150"></el-table-column>
            <el-table-column property="name" label="姓名" width="200"></el-table-column>
            <el-table-column property="address" label="地址"></el-table-column>
          </el-table>
          <el-pagination
              class="choose_targetKg_pagination"
              background
              layout="total ,prev, pager, next"
              @current-change="multipleCandidateKgHandleCurrentChange"
              :current-page="multipleCandidateKgCurrentPage"
              :page-size="multipleCandidateKgPageSize"
              :total="multipleCandidateKgTotal">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <!--footer-->
      <span slot="footer" class="dialog-footer">
        <el-popover
            placement="top"
            v-model="visible">
            <p>确定要将缓存表中的所有更新提交为新版本吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
            </div>
            <el-button type="success" @click="centerDialogVisible = false" slot="reference">提交版本</el-button>
        </el-popover>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: "DeleteCache",
   data(){
    return{
      activeName:'first',
      cacheDisplay:false,
      mergeDeletaVisible:false,
      completionDeletaVisible:false,
      evaluationDeletaVisible:false,
      //下面是记录三种状态是否存在数据更新
      mergeUpdate:false,
      completionUpdate:false,
      evaluateUpdate:false,
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
    //时间格式化
    dateFormat(data) {
      return moment(new Date(data).getTime()).format('YYYY-MM-DD');;
    },
  },
  mounted() {
    this.get_merge_cache(this.mergeCacheCurrentPage,this.mergeCachePageSize);
    this.get_completion_cache(this.completionCacheCurrentPage,this.completionCachePageSize);
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
</style>