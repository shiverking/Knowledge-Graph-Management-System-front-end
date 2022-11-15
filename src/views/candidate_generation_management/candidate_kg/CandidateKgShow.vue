<template>
  <div style="margin-top: 20px;">
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
      <el-tab-pane label="候选图谱" closable='false' name ="overview" >
        <el-card class="box-card" shadow="never">
          <p><b>候选图谱列表</b></p>
          <div class="block">
            <!--时间选择器-->
            <el-date-picker
                v-model="value1"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
            </el-date-picker>
            <el-select v-model="value" placeholder="请选择状态">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" style="margin-top: 10px;" @click="load_all()">读取数据</el-button>
          </div>
          <el-table
              :data="pageList"
              border
              style="width: 100%; margin-top:10px"
              @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column label="头实体"width>
            </el-table-column>
            <el-table-column label="关系" width>
            </el-table-column>
            <el-table-column label="尾实体"width>
            </el-table-column>
            <el-table-column
                label="创建时间"
                width="200">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="状态"
                width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.conflict_typ }}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="存储方式"
                width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.storage_mode }}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="180">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">详情
                </el-button>
                <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">详情
                </el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              background
              @current-change="current_change"
              :current-page="currentPage1"
              :page-size="pageSize"
              layout="prev, pager, next"
              style="margin-top:10px"
              :total="total">
          </el-pagination>
        </el-card>
      </el-tab-pane>
      <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
      >
      <detail :myName="name"></detail>
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" @click="addTab(editableTabsValue)">查看候选图谱</el-button>
  </div>
</template>
<script>
import detail from "../../../components/candidate_kg/detail";
export default {
  components:{
    detail,
  },
  data() {
    return {
      multipleSelection: [],
      activeName: 'first',
      pageSize: 10, // 每页多少条
      currentPage1: 1, // 当前页
      total: 29, // 总数据条数
      //可变分页结构
      editableTabsValue: 'overview',
      editableTabs: [{
        title: '图谱详情1',
        name: '1',
      }],
      tabIndex: 2,
      name:"test",
    }
  },
  methods: {
    //动态增加删除tab页
    addTab(targetName) {
      let newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: 'New Tab',
        name: newTabName,
        content: 'New Tab content'
      });
      this.editableTabsValue = newTabName;
      //修改传参值
      this.name = newTabName;
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
    },
    handleEdit(index, row) {
      console.log(index, row);
    }
    ,
    handleDelete(index, row) {
      console.log(index, row);
    }
    ,
    del_all() {
      for (var i = 0; i < this.multipleSelection.length; i++) {
        for (var j = 0; j < this.tableData.length; j++) {
          if (this.tableData[j] == this.multipleSelection[i])
            this.tableData.splice(j, 1)
        }
      }
    }
    ,
    getNowTime() {
      var date = new Date();
      //年 getFullYear()：四位数字返回年份
      var year = date.getFullYear(); //getFullYear()代替getYear()
      //月 getMonth()：0 ~ 11
      var month = date.getMonth() + 1;
      //日 getDate()：(1 ~ 31)
      var day = date.getDate();
      //时 getHours()：(0 ~ 23)
      var hour = date.getHours();
      //分 getMinutes()： (0 ~ 59)
      var minute = date.getMinutes();
      //秒 getSeconds()：(0 ~ 59)
      var second = date.getSeconds();
      var time = year + '-' + this.addZero(month) + '-' + this.addZero(day) + '-' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
      console.log(time)
      return time;
    }
    ,
//小于10的拼接上0字符串
    addZero(s) {
      return s < 10 ? ('0' + s) : s;
    }
    ,
//选择多行数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    ,
    current_change(currentPage) { // 当前是第几页
      this.currentPage1 = currentPage
      this.currentChangePage(this.tableData, currentPage)
    }
    ,
    currentChangePage(list, currentPage) { // 分页方法(重点)
      let from = (currentPage - 1) * this.pageSize
      let to = currentPage * this.pageSize
      this.pageList = []
      for (; from < to; from++) {
        if (list[from]) {
          this.pageList.push(list[from])
        }
      }
    }
    ,
    open() {
      this.$confirm('已选中的数据将生成候选数据集！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '生成候选数据集成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
    ,
  },
  mounted() {
  }
}
</script>