<template>
  <el-tabs v-model="activeName" >
    <el-tab-pane label="飞机数据" name="first">
  <div>
    <div>
      <br>
      <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline">

        <el-form-item label="字段名称：">
          <el-select v-model="ruleForm.key" placeholder="请选择字段名称" >
            <el-option label="飞机名称" value ="aircraft_name"></el-option>
            <el-option label="研发公司" value ="rd_company"></el-option>
            <el-option label="类型" value ="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值：">
          <el-input v-model="ruleForm.value" placeholder="请输入字段值"></el-input>

        </el-form-item >
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="submitForm('formInline')" >搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon = "el-icon-circle-plus-outline" size='big'  @click="add()">添加</el-button>
        </el-form-item>

      </el-form>
    </div>
    <el-table
        :data="tableData"
        border
        style="width: 90%">
      <el-table-column
   >
      </el-table-column>
      <el-table-column
          prop="aircraft_name"
          label="飞机名称"
          width="100">
      </el-table-column>
      <el-table-column
          prop="picture"
          label="图片"
          width="100">
        <template slot-scope="scope">
          <el-image :src="scope.row.picture" style="width: 80px;height: 80px">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"  style="margin: 0 20px; font-size: 30px; "></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
          prop="description"
          label="简介"
          width="200">
      </el-table-column>
      <el-table-column
          prop="fist_flight"
          label="首飞时间"
          width="100">
      </el-table-column>
      <el-table-column
          prop="rd_company"
          label="研发公司"
          width="100">
      </el-table-column>
      <el-table-column
          prop="engines_num"
          label="引擎数量"
          width="50">
      </el-table-column>
      <el-table-column
          prop="crew_num"
          label="载员"
          width="50">
      </el-table-column>
      <el-table-column
          prop="length"
          label="长度"
          width="50">
      </el-table-column>
      <el-table-column
          prop="winspan"
          label="翼展"
          width="50">
      </el-table-column>
      <el-table-column
          prop="height"
          label="高度"
          width="50">
      </el-table-column>
      <el-table-column
          prop="engine"
          label="引擎"
          width="100">
      </el-table-column>
      <el-table-column
          prop="max_speed"
          label="最快速度"
          width="100">
      </el-table-column>
      <el-table-column
          prop="empty_wgt"
          label="空重"
          width="50">
      </el-table-column>
      <el-table-column
          prop="type"
          label="类型"
          width="50">
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="big" >编辑</el-button>
          <el-button @click="deleteBook(scope.row)" type="text" size="big">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @current-change="page">
    </el-pagination>
  </div>
    </el-tab-pane>
    <el-tab-pane label="数据导入" name="second">
      <div>
        <div>
          <br>
          <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple">

                  <el-upload
                      class="upload-demo"
                      ref="upload"
                      action
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :on-change="handle"
                      :file-list="fileList"
                      :show-file-list="false"
                      accept=".xls,.xlsx"
                      :auto-upload="false">
                    <el-button slot="trigger"  type="primary" >导入文件</el-button>

                    <!--        <el-button style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>-->
                    <!--                  <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>-->
                  </el-upload>
            </div></el-col>
            <el-col :span="6" ><div class="grid-content bg-purple">
              <el-button  slot="trigger" type="primary" @click="dialogFormVisible = true" >数据清洗</el-button>
              <el-button slot="trigger"  type="primary" @click="submit" :disabled="disabled">导出文件</el-button>
              <el-button slot="trigger"  type="primary" @click="submit" :disabled="disabled">转换为候选三元组</el-button>
<!--              <el-button  slot="trigger" type="primary" @click="dialogFormVisible1 = true" >导入数据库</el-button>-->
            </div></el-col>
          </el-row>
<!--          <el-dialog title="文件导入" :visible.sync="fileimportVisible">-->

<!--            <el-scrollbar style="height: 40ch">-->
<!--              <div class="content-box">-->

<!--            <el-form :model="form">-->
<!--              <el-form-item label="文件导入：" :label-width="formLabelWidth">-->
<!--                <el-upload-->
<!--                    class="upload-demo"-->
<!--                    ref="upload"-->
<!--                    action-->
<!--                    :on-preview="handlePreview"-->
<!--                    :on-remove="handleRemove"-->
<!--                    :on-change="handle"-->
<!--                    :file-list="fileList"-->
<!--                    :show-file-list="false"-->
<!--                    accept=".xls,.xlsx"-->
<!--                    :auto-upload="false">-->
<!--                  <el-button slot="trigger"  type="primary" >选取文件</el-button>-->

<!--                  &lt;!&ndash;        <el-button style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;                  <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>&ndash;&gt;-->
<!--                </el-upload>-->
<!--                <div slot="tip" class="el-upload__tip">将飞机字段与文件中某列对应</div>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="飞机名称：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="图片：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="简介：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="首飞时间：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="研发公司：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="引擎数量：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="裁员：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="长度：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="翼展：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="高度：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="引擎：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="最快速度：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="空重：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="类型：" :label-width="formLabelWidth">-->
<!--                <el-select v-model="form.excvalue" ></el-select>-->
<!--              </el-form-item>-->

<!--            </el-form>-->
<!--            <div slot="footer" class="dialog-footer">-->
<!--              <el-button @click="fileimportVisible = false">取 消</el-button>-->
<!--              <el-button type="primary" @click="dataclean" >确 定</el-button>-->
<!--            </div>-->


<!--              </div>-->
<!--            </el-scrollbar>-->
<!--          </el-dialog>-->


          <el-dialog title="数据清洗" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="空值处理：" :label-width="formLabelWidth">
                <el-select v-model="form.nullvalue" >
                  <el-option label="不做处理" value="shanghai"></el-option>
                  <el-option label="删除该行" value="beijing"></el-option>
                  <el-option label="填入最大值" value="beijing"></el-option>
                  <el-option label="填入最小值" value="beijing"></el-option>
                  <el-option label="填入均值" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="异常值处理：" :label-width="formLabelWidth">
                <el-select v-model="form.excvalue" >
                  <el-option label="置空" value="shanghai"></el-option>
                  <el-option label="删除该行" value="shanghai"></el-option>
                  <el-option label="填入最大值" value="beijing"></el-option>
                  <el-option label="填入最小值" value="beijing"></el-option>
                  <el-option label="填入均值" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dataclean" >确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <el-table
            v-show="show"
            :data="tableData1.slice((currentPage1-1)*2,currentPage1*2)" stripe style="width: 100%">
            border
            style="width: 90%"
          @selection-change ="selectionChange">
          <el-table-column
              type="selection"
              label="编号"
              align="center">
          </el-table-column>
          <el-table-column
              v-for ="(value,key,index) in tableData1[0]"
              :prop="key"
              :label="key"
          >
          </el-table-column>

        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="2"
            :total="tableData1.length"
            :current-page.sync="currentPage1"
        >
        </el-pagination>

      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<style>

</style>
<script>
import * as XLSX from 'xlsx'
import {readFile}from '../../../../../src/plugins/xlsx'

export default {
  data() {
    return {
      fileimportVisible:false,
      formLabelWidth: '120px',
      form:{
        nullvalue:'',
        excvalue:'',
      },
      dialogFormVisible:false,
      disabled:false,
      selectionlist:[],
      show:false,
      show1:false,
      fileList: [],
      tableData1:[],
      activeName: 'first',
      currentPage:'1',
      currentPage1:'1',
      pageSize:'1',
      total:'11',
      tableData: [],
      ruleForm: {
        key: '',
        value: '',
        page: '',
        size: 2,
      },
      rules: {
        name: [
          { required: true, message: '图书名称不能为空', trigger: 'blur' }
        ],
        author:[
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.ruleForm.page = _this.currentPage
          axios.get('/api/aircraft/search',{params:_this.ruleForm}).then(function(resp){
            console.log(resp)
            _this.tableData =resp.data.list
            _this.pageSize = resp.data.pageSize
            _this.total = resp.data.total
          })
        } else {
          return false;
        }
      });
    },
    deleteBook(row){
      const _this = this
      axios.delete('/api/aircraft/deleteById/'+row.id).then(function(resp){

        _this.$alert('《'+row.aircraft_name+'》删除成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.reload()
          }
        })
      })
    },
    add() {
      this.$router.push({
        path: '/data/structure/arm/AddAircraft',
      })
    },
    edit(row) {
      this.$router.push({
        path: '/data/structure/arm/AircraftUpdate',
        query:{
          id:row.id
        }
      })
    },
    page(currentPage){

      const _this = this
      if(_this.ruleForm.value ==''){
        axios.get('/api/aircraft/findAll/'+(currentPage)+'/2').then(function(resp){
          console.log(resp)
          _this.tableData = resp.data.list
          _this.pageSize = resp.data.pageSize
          _this.total = resp.data.total
        })}
      else{
        _this.ruleForm.page = currentPage
        axios.get('/api/aircraft/search',{params:_this.ruleForm}).then(function(resp){
          console.log(_this.ruleForm)
          _this.tableData = resp.data.list
          _this.pageSize = resp.data.pageSize
          _this.total = resp.data.total
        })
      }
    },
    submit(){
        if (this.selectionlist.length<=0){
          this.$message({
            message:"请选择要导出的数据",
            type:"warning",
            showClose:true
          })
          return;
        }
        this.disabled=true;
        let sheet = XLSX.utils.json_to_sheet(this.tableData1),
            book = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book,sheet,"sheet1");
        XLSX.writeFile(book,new Date().getTime()+'.xls')
        this.disabled=false;
      },
    selectionChange(val){
      this.selectionlist=val
    },
    async handle(ev1){
      let file = ev1.raw;
      if(!file) return;
      let data =  await readFile(file);
      let workboot = XLSX.read(data,{type:"binary"});
      let worksheet = workboot.Sheets[workboot.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(worksheet);
      console.log(data)
      this.tableData1=data
      this.show1=true
      this.show=true
    },

    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    dataclean(){
      const _this =this
      this.dialogFormVisible = false
      axios.post('/api/aircraft/clean',_this.tableData).then(function(resp){
        console.log(resp)
        _this.tableData = resp.data
      })
    }

  },


  created() {
    const _this = this
    axios.get('/api/aircraft/findAll/0/2').then(function(resp){
      console.log(resp)
      _this.tableData = resp.data.list
      _this.pageSize = resp.data.pageSize
      _this.total = resp.data.total
    })
  }
}
</script>
