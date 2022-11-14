<template>
    <div style="margin-top: 20px;">
      <el-card class="box-card" shadow="never">
        <p><b>结构化增量数据</b></p>
        <div class="block">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
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
          <el-table-column
          label="日期"
          width="400">
          <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
          </el-table-column>
          <el-table-column
          label="三元组 (头实体,头实体类型,尾实体,尾实体类型,关系)"
          width>
          <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
              <p>头实体: {{ scope.row.head }}</p>
              <p>头实体类型: {{ scope.row.head_typ }}</p>
              <p>尾实体: {{ scope.row.tail }}</p>
              <p>尾实体类型: {{ scope.row.tail_typ }}</p>
              <p>关系: {{ scope.row.rel }}</p>
              <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.head }}</el-tag>
                  <el-tag size="medium">{{ scope.row.head_typ }}</el-tag>
                  <el-tag size="medium">{{ scope.row.tail }}</el-tag>
                  <el-tag size="medium">{{ scope.row.tail_typ }}</el-tag>
                  <el-tag size="medium">{{ scope.row.rel }}</el-tag>
              </div>
              </el-popover>
          </template>
          </el-table-column>
          <el-table-column
          label="类别"
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
          label="存储方式"
          width="180">
          <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.storage_status }}</span>
          </template>
          </el-table-column>
          <el-table-column 
          label="操作"
          width="180">
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
          background
          @size-change="handleSizeChange"
          @current-change="current_change"
          :current-page="currentPage1"
          :page-size="pageSize"
          layout="prev, pager, next"
          style="margin-top:10px"
          :total="total">
        </el-pagination>
        <el-button type="primary" style="margin-top: 10px;" @click="open">生成候选数据集</el-button>
      </el-card>
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          multipleSelection: [],
          activeName: 'first',
          tableData: [{
            date: new Date(),
            head: '约翰·保罗·琼斯号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '美国',
            tail_typ: '国家',
            rel: '产国',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储'
          }, {
            date: new Date(),
            head: '普林斯顿号导弹巡洋舰',
            head_typ: '巡洋舰',
            tail: '英格尔斯造船',
            tail_typ: '制造厂',
            rel: '制造厂',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          }, {
            date: new Date(),
            head: '约书亚·温克',
            head_typ: 'Per',
            tail: '尼米兹号航空母舰',
            tail_typ: '航空母舰',
            rel: '指挥军舰',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储'
          },{
            date: new Date(),
            head: '安东尼·梅西',
            head_typ: 'Per',
            tail: '古巴关塔那摩湾',
            tail_typ: 'Loc',
            rel: '家庭信息',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储'
          },{
            date: new Date(),
            head: '本杰明·华盛顿',
            head_typ: 'Per',
            tail: '纽约罗切斯特',
            tail_typ: 'Loc',
            rel: '家庭信息',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储'
          },{
            date: new Date(),
            head: '柯蒂斯·威尔伯号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '道尔顿·特劳特',
            tail_typ: 'Per',
            rel: '指挥军士长',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储'
          },{
            date: new Date(),
            head: '克里斯托弗·斯威尼',
            head_typ: 'Per',
            tail: '杰森威尔斯',
            tail_typ: 'Per',
            rel: '同事',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储'
          },{
            date: new Date(),
            head: '尼米兹号航空母舰',
            head_typ: '航空母舰',
            tail: '克里斯托弗·莱尔斯',
            tail_typ: 'Per',
            rel: '指挥军士长',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储'
          },{
            date: new Date(),
            head: '斯特雷特号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '克里斯托弗·德斯科维奇',
            tail_typ: 'Per',
            rel: '指挥官',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '伊利湖号导弹巡洋舰',
            head_typ: '巡洋舰',
            tail: '卡尔·P·坡',
            tail_typ: 'Per',
            rel: '执行官',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '安东尼·梅西',
            head_typ: 'Per',
            tail: '海军部门',
            tail_typ: '部门',
            rel: '部门',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '安东尼·梅西',
            head_typ: 'Per',
            tail: '美国海军柯蒂斯·威尔伯号驱逐舰',
            tail_typ: '单位',
            rel: '任职单位',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '电子攻击中队139',
            head_typ: '队伍',
            tail: '莫里斯·杰森',
            tail_typ: 'Per',
            rel: '指挥军士长',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '第十一航母打击群',
            head_typ: '打击群',
            tail: '美国',
            tail_typ: '国家',
            rel: '产国',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '克里斯托弗·J·格林',
            head_typ: 'Per',
            tail: '美国',
            tail_typ: '国家',
            rel: '国家',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '育空号补给舰',
            head_typ: '补给舰',
            tail: '美国',
            tail_typ: '国家',
            rel: '产国',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '拉尔夫·约翰逊号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '2015.12.12',
            tail_typ: 'string',
            rel: '下水时间',
            conflict_typ: '装备图谱',
            storage_mode: 'mysql',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '约书亚·温克',
            head_typ: 'Per',
            tail: '2018.06',
            tail_typ: 'string',
            rel: '任职时间',
            conflict_typ: '人员图谱',
            storage_mode: 'mysql',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '丹·科尔贝克',
            head_typ: 'Per',
            tail: 'Dan Kohlbeck',
            tail_typ: 'string',
            rel: '英文姓名',
            conflict_typ: '人员图谱',
            storage_mode: 'mysql',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '第十一航母打击群',
            head_typ: '打击群',
            tail: '第17舰载机联队',
            tail_typ: '舰载机',
            rel: '舰载机',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '道尔顿·特劳斯',
            head_typ: 'Per',
            tail: '军士长',
            tail_typ: '军衔',
            rel: '军衔',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '克里斯托弗·J·格林',
            head_typ: 'Per',
            tail: '中校',
            tail_typ: '军衔',
            rel: '军衔',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '第十一航母打击群',
            head_typ: '打击群',
            tail: '普林斯顿号导弹巡洋舰',
            tail_typ: '巡洋舰',
            rel: '巡洋舰',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '安东尼·梅西',
            head_typ: 'Per',
            tail: '柯蒂斯·威尔伯号驱逐舰',
            tail_typ: '驱逐舰',
            rel: '指挥',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '柯蒂斯·威尔伯号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '巴斯钢铁造船厂',
            tail_typ: '制造厂',
            rel: '制造厂',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '尼米兹号航空母舰',
            head_typ: '航空母舰',
            tail: '纽波特纽斯造船及船坞公司',
            tail_typ: '制造厂',
            rel: '制造厂',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '斯特雷特号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '巴斯钢铁造船厂',
            tail_typ: '制造厂',
            rel: '制造厂',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '第十一航母打击群',
            head_typ: '打击群',
            tail: '第17舰载机联队',
            tail_typ: '舰载机',
            rel: '舰载机',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '斯特雷特号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '9200吨',
            tail_typ: 'string',
            rel: '满载排水量',
            conflict_typ: '装备图谱',
            storage_mode: 'mysql',
            storage_status: '已存储',
          }],
          pickerOptions: {
            shortcuts: [{
              text: '最近一天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
              }
            },{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          value1: [new Date().getTime() - 3600 * 1000 * 24 * 1, new Date()],
          tableListData: [], // 列表数据
          pageList: [{
            date: new Date(),
            head: '约翰·保罗·琼斯号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '美国',
            tail_typ: '国家',
            rel: '产国',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          }, {
            date: new Date(),
            head: '普林斯顿号导弹巡洋舰',
            head_typ: '巡洋舰',
            tail: '英格尔斯造船',
            tail_typ: '制造厂',
            rel: '制造厂',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          }, {
            date: new Date(),
            head: '约书亚·温克',
            head_typ: 'Per',
            tail: '尼米兹号航空母舰',
            tail_typ: '航空母舰',
            rel: '指挥军舰',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '安东尼·梅西',
            head_typ: 'Per',
            tail: '古巴关塔那摩湾',
            tail_typ: 'Loc',
            rel: '家庭信息',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '本杰明·华盛顿',
            head_typ: 'Per',
            tail: '纽约罗切斯特',
            tail_typ: 'Loc',
            rel: '家庭信息',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '柯蒂斯·威尔伯号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '道尔顿·特劳特',
            tail_typ: 'Per',
            rel: '指挥军士长',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '克里斯托弗·斯威尼',
            head_typ: 'Per',
            tail: '杰森威尔斯',
            tail_typ: 'Per',
            rel: '同事',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '尼米兹号航空母舰',
            head_typ: '航空母舰',
            tail: '克里斯托弗·莱尔斯',
            tail_typ: 'Per',
            rel: '指挥军士长',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '斯特雷特号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '克里斯托弗·德斯科维奇',
            tail_typ: 'Per',
            rel: '指挥官',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '伊利湖号导弹巡洋舰',
            head_typ: '巡洋舰',
            tail: '卡尔·P·坡',
            tail_typ: 'Per',
            rel: '执行官',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '安东尼·梅西',
            head_typ: 'Per',
            tail: '海军部门',
            tail_typ: '部门',
            rel: '部门',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '安东尼·梅西',
            head_typ: 'Per',
            tail: '美国海军柯蒂斯·威尔伯号驱逐舰',
            tail_typ: '单位',
            rel: '任职单位',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '电子攻击中队139',
            head_typ: '队伍',
            tail: '莫里斯·杰森',
            tail_typ: 'Per',
            rel: '指挥军士长',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '第十一航母打击群',
            head_typ: '打击群',
            tail: '美国',
            tail_typ: '国家',
            rel: '产国',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '克里斯托弗·J·格林',
            head_typ: 'Per',
            tail: '美国',
            tail_typ: '国家',
            rel: '国家',
            conflict_typ: '人员图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '育空号补给舰',
            head_typ: '补给舰',
            tail: '美国',
            tail_typ: '国家',
            rel: '产国',
            conflict_typ: '装备图谱',
            storage_mode: 'neo4j',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '拉尔夫·约翰逊号导弹驱逐舰',
            head_typ: '驱逐舰',
            tail: '2015.12.12',
            tail_typ: 'string',
            rel: '下水时间',
            conflict_typ: '装备图谱',
            storage_mode: 'mysql',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '约书亚·温克',
            head_typ: 'Per',
            tail: '2018.06',
            tail_typ: 'string',
            rel: '任职时间',
            conflict_typ: '人员图谱',
            storage_mode: 'mysql',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '丹·科尔贝克',
            head_typ: 'Per',
            tail: 'Dan Kohlbeck',
            tail_typ: 'string',
            rel: '英文姓名',
            conflict_typ: '人员图谱',
            storage_mode: 'mysql',
            storage_status: '已存储',
          },{
            date: new Date(),
            head: '第十一航母打击群',
            head_typ: '打击群',
            tail: '第17舰载机联队',
            tail_typ: '舰载机',
            rel: '舰载机',
            conflict_typ: '装备图谱',
            storage_status: '已存储',
            storage_mode: 'neo4j'
          },], // 分页列表数据
          pageSize: 20, // 每页多少条
          currentPage1: 1, // 当前页
          total: 29, // 总数据条数
        }
      },
      methods: {
        handleEdit(index, row) {
          console.log(index, row);
        },
        handleDelete(index, row) {
          console.log(index, row);
        },
        del_all(){
          for (var i = 0; i < this.multipleSelection.length; i ++){
            for (var j = 0; j < this.tableData.length; j ++){
              if (this.tableData[j] == this.multipleSelection[i])
                this.tableData.splice(j, 1)
            }
          }
        },
        getNowTime(){
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
        },
        //小于10的拼接上0字符串
        addZero(s) {
          return s < 10 ? ('0' + s) : s;
        },
        //选择多行数据
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        current_change (currentPage) { // 当前是第几页
          this.currentPage1 = currentPage
          this.currentChangePage(this.tableData, currentPage)
        },
        currentChangePage (list, currentPage) { // 分页方法(重点)
          let from = (currentPage - 1) * this.pageSize
          let to = currentPage * this.pageSize
          this.pageList = []
          for (; from < to; from++) {
            if (list[from]) {
              this.pageList.push(list[from])
            }
          }
        },
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
        },
        handleEdit(index, row) {
          console.log(index, row);
        },
        handleDelete(index, row) {
          console.log(index, row);
          row.splice(index, 1);
        }
      },
  
      // mounted(){
      //   for (var i = 0; i < this.tableData.length; i ++){
      //     this.$data.tableData[i].date = this.getNowTime();
      //     this.$data.tableData[i].date = this.getNowTime();
      //   }
      // }
    }
  </script>