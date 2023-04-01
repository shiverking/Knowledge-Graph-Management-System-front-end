<template>
  <div class="block" style="margin: 10px;">
    <el-card class="card">
      <el-input
          placeholder="请输入内容"
          v-model="input"
          clearable
          style="width: 180px">
      </el-input>
      <el-button @click="crawl_list" style="margin-right:50px">查找</el-button>

      <el-select v-model="value" placeholder="请选择状态" @change="crawl_list">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>

      <el-button type="primary" size="medium" style="float:right" @click="dialogFormVisible = true">添加新爬虫</el-button>
      <el-dialog title="爬虫信息" :visible.sync="dialogFormVisible" center = true>
        <el-form :model="form">
          <el-form-item label="爬虫名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="spider name" :label-width="formLabelWidth">
            <el-input v-model="form.spider_name" autocomplete="off" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="爬取网站" :label-width="formLabelWidth">
            <el-input v-model="form.website" autocomplete="off" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="form.remark"
                style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="定时表达式" :label-width="formLabelWidth">
            <el-input v-model="form.cron" autocomplete="off" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="爬虫文件" :label-width="formLabelWidth">
            <el-upload
                class="upload-demo"
                accept=".zip, .7z, .rar"
                :headers="headers"
                ref="upload"
                action
                :http-request="uploadFile"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :file-list="fileList"
                :auto-upload="false"
                :limit="1"
                style="width: 400px">
<!--              <el-button size="small" type="primary">点击上传</el-button>-->
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
<!--              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
              <div slot="tip" class="el-upload__tip">只能上传一个压缩包(zip/7z/rar)文件,文件大小不超过200KB</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUpload">取 消</el-button>
          <el-button type="primary" @click="addCrawler">确 定</el-button>
        </div>
      </el-dialog>

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
            prop="website"
            label="爬取网站"
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
                v-if="scope.row.status==1">
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
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size=pageSize
          layout="total, sizes, prev, pager, next, jumper"
          :total=total
          style="margin-top: 10px">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CrawlerList",

  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize:10,
      total: '',

      value: '',
      input: '',

      dialogFormVisible: false,
      filePath:'D:\\CODE\\Knowledge-Graph-Management-System-front-end\\src\\data',
      form: {
        name: '',
        spider_name: '',
        website: '',
        remark: '',
        cron: '',
      },
      formLabelWidth: '120px',

      fileList: [],
      fileSize: 200,
      headers: { "Content-Type": "multipart/form-data" },

      start_stop:true,
      activeName: 'second',

      options: [{
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '正常'
        },
        {
          value: '-1',
          label: '异常'
        },
        {
          value: '1',
          label: '运行中'
        },
      ],
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt5M = file.size / 1024 < this.fileSize;
      if (!isLt5M) {
        this.$message.error(`上传文件大小不能超过${this.fileSize}KB!`);
        return false;
      }
    },
    uploadFile(file) {
      let FormDatas = new FormData();
      FormDatas.append("file", file.file);
      console.log(file)
      console.log(FormDatas)
      const _this = this
      _this.axios.post(
           '/api/crawl/file',
          FormDatas,
          {headers: _this.headers})
          .then(resp => {
            console.log(resp)
            _this.$message({
              message: '恭喜你，添加成功！',
              type: 'success'})
          })
          .catch(err => {
            console.log(err)
            _this.$message.error('抱歉，添加失败！');
      })
    },
    submitUpload() {
      console.log('submit')
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    addCrawler() {
      const _this = this
      if(this.form.name == '') {
        _this.$message.error('请输入爬虫名称！');
        return;
      }
      if(this.form.spider_name == '') {
        _this.$message.error('请输入spider_name！');
        return;
      }
      if (_this.fileList.length >= 0) {
        this.$refs.upload.submit();
        _this.axios.post('/api/crawl/addCrawler', this.form).then(function(resp){
          if(resp.data == 1){
            _this.$message({
              message: '恭喜你，添加成功！',
              type: 'success'
            });
            _this.dialogFormVisible = false;
            _this.cancelUpload();
            _this.crawl_list();
          }
          else {
            _this.$message.error('抱歉，添加失败！');
          }
        })
      }else{
        _this.$message.error('请选择一个文件！');
      }
    },
    cancelUpload() {
      this.form.name = '';
      this.form.spider_name = '';
      this.form.website = '';
      this.form.remark = '';
      this.form.cron = '';
      this.fileList = [];
      this.dialogFormVisible = false;
    },

    start_crawl(row){
      const _this =this
      row.status=1
      _this.axios.get('/api/crawl/start/'+row.cid).then(function(resp){
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
      _this.axios.get('/api/crawl/stop/'+row.cid).then(function(resp){
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
    handleCurrentChange(val){
      this.currentPage = val
      console.log(this.currentPage)
      this.crawl_list()
    },
    // fromKgTable的前端Size页改变动作
    handleSizeChange(val){
      this.pageSize = val
      console.log(this.pageSize)
      this.crawl_list()
    },
    crawl_list(){
      const _this = this
      _this.axios.get(
          '/api/crawl/list',
          {params:{
            name: this.input,
            status: this.value,
            page: this.currentPage,
            limit: this.pageSize
          }}).then(function(resp){
        _this.tableData = resp.data.data
        _this.total = resp.data.count
      })
    }
  },
  created() {
    this.value = ''
    if(this.$route.query.status) {
      this.value = this.$route.query.status
    }
    this.crawl_list()
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