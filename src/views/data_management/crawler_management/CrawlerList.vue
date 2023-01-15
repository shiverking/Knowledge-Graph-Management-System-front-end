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
              prop="id"
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
              prop="lruntime"
              label="上次运行时间"
          >
          </el-table-column>
          <el-table-column
              prop="lrunstatus"
              label="上次运行状态"
          >
          </el-table-column>
          <el-table-column
              prop="regulartime"
              label="爬取间隔时间"
          >
          </el-table-column>
          <el-table-column
              label="定时启用/关闭"
          >
            <el-switch
                v-model="regularstatus"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="primary">
                <i class="el-icon-video-play" style="font-size: 18px"></i>
              </el-button>
              <el-button
                  size="mini" @click="crawldetail">
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
        {
          id: '2',
          name: 'system.net',
          remark: '无',
          lruntime: '2022-08-26',
          lrunstatus: '正常',
          regulartime: '1周',
          regularstatus: true,
        },
        {
          id: '3',
          name: '台湾海军官网',
          remark: '无',
          lruntime: '2022-08-27',
          lrunstatus: '正常',
          regulartime: '1周',
          regularstatus: true,
        },
        {
          id: '4',
          name: '日本防卫省自卫队官网',
          remark: '无',
          lruntime: '2022-08-27',
          lrunstatus: '正常',
          regulartime: '1周',
          regularstatus: true,
        },
        {
          id: '5',
          name: '多源轨迹关联数据',
          remark: '无',
          lruntime: '2022-08-27',
          lrunstatus: '正常',
          regulartime: '1周',
          regularstatus: true,
        },
        {
          id: '6',
          name: 'GDELT全球事件集',
          remark: '无',
          lruntime: '2022-08-28',
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
    crawldetail(){
      this.$router.push({path:"/data/crawler_management/CrawlerInfo"})
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
  }
}
</script>

<style scoped>

</style>