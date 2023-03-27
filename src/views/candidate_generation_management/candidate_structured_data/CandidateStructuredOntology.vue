<template>
  <body>
  <el-card class="box-card">
    <el-button type="primary">同步</el-button>
    <el-button type="primary">请求</el-button>
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
      activeName: 'first',
      classTableData: [],
      relationTableData: [],
      attributeTableData : []
    };
  },
  methods: {
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