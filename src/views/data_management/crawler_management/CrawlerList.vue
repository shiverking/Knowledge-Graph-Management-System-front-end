<template>
  <div class="block" style="margin: 10px;">
    <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" >
      <el-tab-pane
          :key="item.name"
          v-for="(item, index) in editableTabs"
          :label="item.title"
          :name="item.name"
          :closable="item.close">
        <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
        ></el-autocomplete>
        <el-button @click="clearFilter" style="margin-right:50px">查找</el-button>
        <!--选择库 -->
        <el-select v-model="value" placeholder="请选择状态" style="display: inline-block">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="medium" style="float:right" @click="addTab(editableTabsValue)">添加新爬虫</el-button>
        <el-table
            ref="filterTable"
            :data="tableData"
            style="width: 100%;margin-top: 10px;"
            border
            key="version_table"
        >
          <el-table-column
              prop="cid"
              label="ID"
          >
          </el-table-column>
          <el-table-column
              prop="name"
              label="名称"
          >
          </el-table-column>
          <el-table-column
              prop="remark"
              label="备注"
          >
          </el-table-column>
          <el-table-column
              prop="status"
              label="上次运行状态"
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
          <el-table-column
              prop="cron"
              label="定时表达式"
          >
          </el-table-column>
<!--          <el-table-column-->
<!--              label="定时启用/关闭"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--            <el-switch-->
<!--                v-model="scope.row.regularstatus"-->
<!--                active-color="#13ce66"-->
<!--                inactive-color="#ff4949"-->
<!--                :active-value=true-->
<!--                :inactive-value=false>-->
<!--            </el-switch>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="primary" @click="start_crawl(scope.row)"
                  v-if="scope.row.status!=1">
                <i class="el-icon-video-play" style="font-size: 18px"></i>
              </el-button>
              <el-button
                  size="mini"
                  type="info" @click="stop_crawl(scope.row)"
                  v-if="scope.row.status===1">
                <i class="el-icon-video-pause" style="font-size: 18px "></i>
              </el-button>
              <el-button
                  size="mini" @click="crawldetail(scope.row)">
                <i class="el-icon-zoom-in" style="font-size: 18px"></i>
              </el-button>
              <el-button
                  size="mini"
                  type="danger">
                <i class="el-icon-circle-close" style="font-size: 18px"></i>
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
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
  name: "CrawlerList",

  data() {
    return {
      pageSize:10,
      start_stop:true,
      editableTabsValue: '1',
      editableTabs: [{
        title: '爬虫列表',
        name: '1',
        close: '',
      }],
      tabIndex: 1,

      tableData: [{
        id: '1',
        name: 'military',
        remark: '无',
        lruntime: '2022-08-24',
        lrunstatus: '正常',
        regulartime: '1周',
        regularstatus: true,
      },
      ],

      options: [{
          value: '选项1',
          label: '全部'
        },
        {
          value: '选项2',
          label: '正常'
        },
        {
          value: '选项3',
          label: '异常'
        },
        {
          value: '选项',
          label: '运行中'
        },
      ],
    }
  },
  methods: {
    start_crawl(row){
      const _this =this
      row.status=1
      this.axios.get('/api/crawl/start/'+row.cid).then(function(resp){
        if (resp.data===1){
          row.status=-1
        }
        else{
          row.status=0
        }
      })
    },
    stop_crawl(row){
      const _this =this
      row.status=0
      this.axios.get('/api/crawl/stop/'+row.cid).then(function(resp){
        console.log(resp)
      })
    },
    crawldetail(row){
      this.$router.push({
        path: "/data/crawler_management/CrawlerInfo",
        query: {
          cid: row.cid
        }
      })
    },
    addTab(targetName) {
      let newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: 'New Tab',
        name: newTabName,
        close: 'closable'
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    }
  },
  created() {
    const _this = this
    _this.axios.get('/api/crawl/list/0/10').then(function(resp){
      console.log(resp)
      _this.tableData = resp.data.data
      _this.total = resp.data.count
      _this.pageSize=resp.data.data.length
    })
  }
}
</script>

<style scoped>
.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 1px;
  margin-right: 5px;
  position: relative;
  left: 10px;
  bottom: -15px;
}
.icon1 {
  background-color: #19be6b;
}
.icon0 {
  background-color: #eb194d;
}

</style>