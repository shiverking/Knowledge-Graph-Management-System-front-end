<template>
  <body>
  <el-card class="box-card">
    <el-button type="primary" @click="dialogVisible = true">生成候选本体</el-button>
    <el-dialog
        title="创建本体"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="本体名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="form.creatorName"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.comment"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false;onSubmit()">确 定</el-button>
              </span>
    </el-dialog>
  </el-card>
  <el-card class="data-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="本体类" name="first">
        <el-table
            :data="classTableData"
            height="400"
            border
            style="width: 100%">
          <el-table-column
              prop="id"
              label="类别id"
              width="180">
          </el-table-column>
          <el-table-column
              prop="name"
              label="类别名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="parentId"
              label="父类id"
              width="180">
          </el-table-column>
          <el-table-column
              prop="createdAt"
              label="创建时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="detail"
              label="备注">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="关系" name="second">
        <el-table
            :data="relationTableData"
            height="400"
            border
            style="width: 100%">
          <el-table-column
              prop="id"
              label="关系id"
              width="180">
          </el-table-column>
          <el-table-column
              prop="name"
              label="关系名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="startId"
              label="头类别id"
              width="180">
          </el-table-column>
          <el-table-column
              prop="endId"
              label="尾类别id"
              width="180">
          </el-table-column>
          <el-table-column
              prop="createdAt"
              label="创建时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="detail"
              label="备注">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="属性" name="third">
        <el-table
            :data="attributeTableData"
            height="400"
            border
            style="width: 100%">
          <el-table-column
              prop="id"
              label="属性id"
              width="180">
          </el-table-column>
          <el-table-column
              prop="name"
              label="属性名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="classId"
              label="所属类别id"
              width="180">
          </el-table-column>
          <el-table-column
              prop="valueType"
              label="值型"
              width="180">
          </el-table-column>
          <el-table-column
              prop="createdAt"
              label="创建时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="detail"
              label="备注">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  </body>
</template>

<script>
export default {
  name: "CandidateStructuredOntology",
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        creatorName: '',
        comment: '',
      },
      activeName: 'first',
      classTableData: [],
      relationTableData: [],
      attributeTableData : []
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    onSubmit() {
      if(this.form.name === null || this.form.name === ''){
        this.$message({
          type: 'warning',
          message: "请输入候选本体名称"
        });
        return
      }
      axios.request({
        method: "post",
        url: "/api/candidateOntology/addCandidateOntology",
        data: {
          name: this.form.name,
          creatorName: this.form.creatorName,
          comment: this.form.comment
        }
      }).then((response) => {
        if((response.status === 200 && response.data.result === true)){
          this.createOntoClass(this.form.name);
          this.$message({
            type: 'success',
            message: "生成候选本体成功"
          });
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg
          });
        }
      }).catch(error => {
        console.log(error);
      })
    },
    createOntoClass(candidateOntoName){
      console.log(candidateOntoName)
      axios.request({
        method : 'GET',
        url : '/api/candidateOntology/structuredDataToOntology/' + '' + candidateOntoName,
      }).then((response) => {
        if((response.status === 200 && response.data.result === true)){
          this.$message({
            type: 'success',
            message: "本体转换成功"
          });
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg
          });
        }
      }).catch(error => {
        console.log(error);
      })
    },
    getClassTableData(){
      axios.request({
        method : 'GET',
        url : '/api/bigdata/getClass'
      }).then((response) => {
        if(response.status === 200 && response.data.result){
          this.classTableData = response.data.data;
        }
      }).catch(error => {
        console.log(error);
      })
    },
    getRelationTableData(){
      axios.request({
        method : 'GET',
        url : '/api/bigdata/getRelation'
      }).then((response) => {
        if(response.status === 200 && response.data.result){
          this.relationTableData = response.data.data;
        }
      }).catch(error => {
        console.log(error);
      })
    },
    getAttributeTableData(){
      axios.request({
        method : 'GET',
        url : '/api/bigdata/getAttribute'
      }).then((response) => {
        if(response.status === 200 && response.data.result){
          this.attributeTableData = response.data.data;
        }
      }).catch(error => {
        console.log(error);
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  mounted() {
    this.getClassTableData();
    this.getRelationTableData();
    this.getAttributeTableData();
  }
}
</script>

<style scoped>
  .box-card {
    width: 99%;
    height: 70px;
  }

  .data-card{
    width: 99%;
    height: 700px;
    margin-top: 20px;
  }
</style>