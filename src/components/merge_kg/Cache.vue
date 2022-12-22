<template>
  <div>
    <el-tooltip class="item" effect="dark" content="查看暂存表中信息" placement="top-start">
      <el-button type="primary" icon="el-icon-view" class="check" circle @click="cacheDisplay = true"></el-button>
    </el-tooltip>
    <!--对话框内容-->
    <el-dialog title="缓存表内容" :visible.sync="cacheDisplay" width="1000px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!--融合改动-->
        <el-tab-pane label="融合改动" name="first">
          <el-popover
              placement="top"
              v-model="visible">
            <p>确定要删除缓存表中关于融合的修改吗？</p>
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
        <el-button @click="centerDialogVisible = false">取 消</el-button>
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
export default {
  name: "DeleteCache",
   data(){
    return{
       cacheDisplay:false,
    }
  }
}
</script>

<style scoped>
.check{
  position: fixed;
  bottom: 5px;
  right: 10px;
}
</style>