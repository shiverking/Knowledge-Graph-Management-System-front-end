<template>
  <div style="margin-top:20px">
    <el-card class="box-card" shadow="never">
      <p><b>文件导入</b></p>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger"  type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">格式要求：实体1，实体1类型，实体2，实体2类型，关系，只接受.txt/.csv文件</div>
      </el-upload>
      <el-button style="margin-top:10px" type="primary" @click="open4">读取文本信息</el-button>
      <template>
        <el-table
        :data="pageList"
        border
        style="width: 100%; margin-top: 20px;">
        <el-table-column
        label="日期"
        width="200">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组"
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
        label="操作"
        width="300">
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
        @current-change="current_change"
        :current-page="currentPage1"
        :page-size="pageSize"
        layout="prev, pager, next"
        style="margin-top:10px"
        :total="total">
      </el-pagination>
      </template>
      <el-button type="primary" style="margin-top: 10px;" @click="open1">置信度检测</el-button>
    </el-card>
    <el-card class="box-card" shadow="never" style="margin-top:10px">
      <p><b>置信度检测</b></p>
      <el-table
        :data="pageList2"
        border
        style="width: 100%; margin-top: 20px;">
        <el-table-column
        label="日期"
        width="200">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组"
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
        label="三元组置信度"
        width="350">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.conflict_typ }}</span>
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
        @current-change="current_change2"
        :current-page="currentPage2"
        :page-size="pageSize"
        layout="prev, pager, next"
        style="margin-top:10px"
        :total="total">
      </el-pagination>
      <el-button type="primary" style="margin-top: 10px;" @click="open2">保存结果</el-button>
      <el-button type="primary" style="margin-top: 10px;" @click="open3">插入图谱</el-button>
    </el-card>  
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageSize: 10, // 每页多少条
        currentPage1: 1, // 当前页
        currentPage2: 1, // 当前页
        total: 20, // 总数据条数
        pageList:[{
          date: '2022-11-1-14:26:23',
          head: '约翰·沃克',
          head_typ: 'Per',
          tail: '美国海军第11航母打击群',
          tail_typ: '单位',
          rel: '任职单位',
          conflict_typ: '检测不通过',
        }, {
          date: '2022-11-1-14:26:23',
          head: '攻击战斗机中队137',
          head_typ: '队伍',
          tail: '亚当“吉利根”布莱恩',
          tail_typ: 'Per',
          rel: '执行官',
          conflict_typ: '检测不通过',
        }, {
          date: '2022-11-1-14:26:23',
          head: '尼米兹号航空母舰',
          head_typ: '航空母舰',
          tail: '里斯托弗·莱尔斯',
          tail_typ: 'Per',
          rel: '指挥军士长',
          conflict_typ: '检测不通过',
        }, {
          date: '2022-11-1-14:26:23',
          head: '海军陆战队战斗机攻击中队323',
          head_typ: '队伍',
          tail: '美国',
          tail_typ: '国家',
          rel: '产国',
          conflict_typ: '检测通过，置信度0.9644538164138794',
        }, {
          date: '2022-11-1-14:26:23',
          head: '克雷格·西科拉',
          head_typ: 'Per',
          tail: '中校',
          tail_typ: '军衔',
          rel: '军衔',
          conflict_typ: '检测通过，置信度0.6499826312065125',
        },{
          date: '2022-11-1-14:26:23',
          head: '约瑟夫·福斯特',
          head_typ: 'Per',
          tail: '柯蒂斯·威尔伯号驱逐舰',
          tail_typ: '驱逐舰',
          rel: '指挥军舰',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '本杰明·华盛顿',
          head_typ: 'Per',
          tail: '美国',
          tail_typ: '国家',
          rel: '国家',
          conflict_typ: '测通过，置信度0.9684066772460938',
        },{
          date: '2022-11-1-14:26:23',
          head: '拉尔夫·约翰逊号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '科林·罗伯茨',
          tail_typ: 'Per',
          rel: '指挥官',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '韦恩·迈耶号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '丹·科尔贝克',
          tail_typ: 'Per',
          rel: '产国',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '罗纳德·费尔班克斯',
          head_typ: 'Per',
          tail: '斯科特·利平科特',
          tail_typ: 'Per',
          rel: '国家',
          conflict_typ: '检测不通过',
        },],
        pageList2:[{
          date: '2022-11-1-14:26:23',
          head: '约翰·沃克',
          head_typ: 'Per',
          tail: '美国海军第11航母打击群',
          tail_typ: '单位',
          rel: '任职单位',
          conflict_typ: '检测不通过',
        }, {
          date: '2022-11-1-14:26:23',
          head: '攻击战斗机中队137',
          head_typ: '队伍',
          tail: '亚当“吉利根”布莱恩',
          tail_typ: 'Per',
          rel: '执行官',
          conflict_typ: '检测不通过',
        }, {
          date: '2022-11-1-14:26:23',
          head: '尼米兹号航空母舰',
          head_typ: '航空母舰',
          tail: '里斯托弗·莱尔斯',
          tail_typ: 'Per',
          rel: '指挥军士长',
          conflict_typ: '检测不通过',
        }, {
          date: '2022-11-1-14:26:23',
          head: '海军陆战队战斗机攻击中队323',
          head_typ: '队伍',
          tail: '美国',
          tail_typ: '国家',
          rel: '产国',
          conflict_typ: '检测通过，置信度0.9644538164138794',
        }, {
          date: '2022-11-1-14:26:23',
          head: '克雷格·西科拉',
          head_typ: 'Per',
          tail: '中校',
          tail_typ: '军衔',
          rel: '军衔',
          conflict_typ: '检测通过，置信度0.6499826312065125',
        },{
          date: '2022-11-1-14:26:23',
          head: '约瑟夫·福斯特',
          head_typ: 'Per',
          tail: '柯蒂斯·威尔伯号驱逐舰',
          tail_typ: '驱逐舰',
          rel: '指挥军舰',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '本杰明·华盛顿',
          head_typ: 'Per',
          tail: '美国',
          tail_typ: '国家',
          rel: '国家',
          conflict_typ: '测通过，置信度0.9684066772460938',
        },{
          date: '2022-11-1-14:26:23',
          head: '拉尔夫·约翰逊号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '科林·罗伯茨',
          tail_typ: 'Per',
          rel: '指挥官',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '韦恩·迈耶号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '丹·科尔贝克',
          tail_typ: 'Per',
          rel: '产国',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '罗纳德·费尔班克斯',
          head_typ: 'Per',
          tail: '斯科特·利平科特',
          tail_typ: 'Per',
          rel: '国家',
          conflict_typ: '检测不通过',
        },],
        tableData: [{
          date: '2022-11-1-14:26:23',
          head: '约翰·沃克',
          head_typ: 'Per',
          tail: '美国海军第11航母打击群',
          tail_typ: '单位',
          rel: '任职单位',
          conflict_typ: '检测不通过',
        }, {
          date: '2022-11-1-14:26:23',
          head: '攻击战斗机中队137',
          head_typ: '队伍',
          tail: '亚当“吉利根”布莱恩',
          tail_typ: 'Per',
          rel: '执行官',
          conflict_typ: '检测不通过',
        }, {
          date: '2022-11-1-14:26:23',
          head: '尼米兹号航空母舰',
          head_typ: '航空母舰',
          tail: '里斯托弗·莱尔斯',
          tail_typ: 'Per',
          rel: '指挥军士长',
          conflict_typ: '检测不通过',
        }, {
          date: '2022-11-1-14:26:23',
          head: '海军陆战队战斗机攻击中队323',
          head_typ: '队伍',
          tail: '美国',
          tail_typ: '国家',
          rel: '产国',
          conflict_typ: '检测通过，置信度0.9644538164138794',
        }, {
          date: '2022-11-1-14:26:23',
          head: '克雷格·西科拉',
          head_typ: 'Per',
          tail: '中校',
          tail_typ: '军衔',
          rel: '军衔',
          conflict_typ: '检测通过，置信度0.6499826312065125',
        },{
          date: '2022-11-1-14:26:23',
          head: '约瑟夫·福斯特',
          head_typ: 'Per',
          tail: '柯蒂斯·威尔伯号驱逐舰',
          tail_typ: '驱逐舰',
          rel: '指挥军舰',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '本杰明·华盛顿',
          head_typ: 'Per',
          tail: '美国',
          tail_typ: '国家',
          rel: '国家',
          conflict_typ: '测通过，置信度0.9684066772460938',
        },{
          date: '2022-11-1-14:26:23',
          head: '拉尔夫·约翰逊号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '科林·罗伯茨',
          tail_typ: 'Per',
          rel: '指挥官',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '韦恩·迈耶号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '丹·科尔贝克',
          tail_typ: 'Per',
          rel: '产国',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '罗纳德·费尔班克斯',
          head_typ: 'Per',
          tail: '斯科特·利平科特',
          tail_typ: 'Per',
          rel: '国家',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '安东尼·梅西',
          head_typ: 'Per',
          tail: '美国',
          tail_typ: '国家',
          rel: '国家',
          conflict_typ: '检测通过，置信度0.9557742476463318',
        },{
          date: '2022-11-1-14:26:23',
          head: '伊利湖号导弹巡洋舰',
          head_typ: '巡洋舰',
          tail: '美国',
          tail_typ: '国家',
          rel: '产国',
          conflict_typ: '检测通过，置信度0.9236108660697937',
        },{
          date: '2022-11-1-14:26:23',
          head: '电子攻击中队139',
          head_typ: '队伍',
          tail: '雅各布·弗尔巴斯',
          tail_typ: 'Per',
          rel: '指挥官',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '克里斯托弗·斯威尼',
          head_typ: 'Per',
          tail: '美国海军第11航母打击群',
          tail_typ: '单位',
          rel: '军衔',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '约瑟夫·福斯特',
          head_typ: 'Per',
          tail: '中校',
          tail_typ: '军衔',
          rel: '部门',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '舰队后勤支援中队30第4分遣队',
          head_typ: '队伍',
          tail: '约翰·沃克',
          tail_typ: 'Per',
          rel: '指挥军士长',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '攻击战斗机中队137',
          head_typ: '队伍',
          tail: '普林斯顿号导弹巡洋舰',
          tail_typ: '巡洋舰',
          rel: '指挥官',
          conflict_typ: '检测不通过',
        },{
          date: '2022-11-1-14:26:23',
          head: '约翰·保罗·琼斯号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '美国',
          tail_typ: '国家',
          rel: '产国',
          conflict_typ: '检测通过，置信度0.9713948965072632',
        },{
          date: '2022-11-1-14:26:23',
          head: '约翰·保罗·琼斯号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '巴斯钢铁造船厂',
          tail_typ: '制造厂',
          rel: '制造厂',
          conflict_typ: '检测通过，置信度0.5822768211364746',
        },{
          date: '2022-11-1-14:26:23',
          head: '克里斯托弗·J·格林',
          head_typ: 'Per',
          tail: '韦恩·迈耶号导弹驱逐舰',
          tail_typ: '驱逐舰',
          rel: '指挥军舰',
          conflict_typ: '检测通过，置信度0.5480439066886902',
        }]
      };
    },
    methods: {
      open1() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '置信度检测完成！'),
          type: 'success'
        })
      },
      open2() {
        this.$prompt('请输入保存路径', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '检测结果已保存至目标路径: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });       
        });
      }, 
      open3() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '插入图谱完成！'),
          type: 'success'
        })
      }, 
      open4() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '读取完成！'),
          type: 'success'
        })
      }, 
      current_change (currentPage) { // 当前是第几页
        this.currentPage1 = currentPage
        // this.currentChangePage(this.tableData, currentPage)
        let from = (currentPage - 1) * this.pageSize
        let to = currentPage * this.pageSize
        this.pageList = []
        for (; from < to; from++) {
          if (this.tableData[from]) {
            this.pageList.push(this.tableData[from])
          }
        }
      },
      current_change2 (currentPage) { // 当前是第几页
        this.currentPage2 = currentPage
        // this.currentChangePage(this.tableData, currentPage)
        let from = (currentPage - 1) * this.pageSize
        let to = currentPage * this.pageSize
        this.pageList2 = []
        for (; from < to; from++) {
          if (this.tableData[from]) {
            this.pageList2.push(this.tableData[from])
          }
        }
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    }
  }
</script>