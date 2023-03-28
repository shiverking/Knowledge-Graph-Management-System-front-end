<template>
  <body>
        <!--  动态增加标签页  -->
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
          <!-- 这个标签页是固定存在的 -->
          <el-tab-pane label="候选本体列表" name="candidateOntologyList">
            <el-card class="candidate-ontology-card">
              <span>候选本体列表</span>
              <el-table
                  class="candidate-ontology-table"
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="候选本体名称"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="creatorName"
                    label="创建者"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="comment"
                    label="备注"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="查看"
                    width="150">
                  <template slot-scope="scope">
                    <el-button
                        @click="addTab(editableTabsValue,scope.row.name,scope.row.id)"
                        type="primary"
                        icon="el-icon-search">
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                    label="删除"
                    width="150">
                  <el-button
                      slot-scope="scope"
                      type="primary"
                      icon="el-icon-delete-solid"
                      @click.native.prevent="deleteRow(scope.$index, tableData)">
                  </el-button>
                </el-table-column>
              </el-table>
              <div style="margin-top: 20px">
<!--                <el-button @click="toggleSelection()">取消选择</el-button>-->
                <el-button @click="dialogVisible = true">创建候选本体</el-button>
              </div>
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
          </el-tab-pane>
          <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.candidateOntologyId"
              :label="item.title"
              :name="item.name"
          >
            <keep-alive>
              <!--在这里将存储在标签页信息数组里的候选本体id传输给子组件-->
              <component :is="item.content" :candidateOntologyId="item.candidateOntologyId"></component>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
  </body>
</template>

<script>
  import OntologyDetail from '../../../components/candidate_ontology/OntologyDetail';
  export default {
    name:'CandidateOntologyShow',
    //添加该组件的子组件
    components:{
      OntologyDetail
    },
    data() {
      return {
        candidateOntologyCurrentPage:1,
        candidateKgPageSize:10,
        candidateOntologyTotal:0,
        drawer: false,
        search:'',
        tableData: [],
        multipleSelection: [],
        //第一次打开页面时展示这个标签页
        editableTabsValue: 'candidateOntologyList',
        editableTabs: [],
        //存储打开的tab页的candidateOntologyId和tabName的关系
        openedTabsId: new Map,
        tabIndex: 2,
        dialogVisible: false,
        form: {
          name: '',
          creatorName: '',
          comment: '',
        }
      };
    },
    methods:{
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
            // this.$options.methods.getCandidateOntology(this.candidateOntologyCurrentPage,this.candidateKgPageSize);
            this.getCandidateOntology(this.candidateOntologyCurrentPage,this.candidateKgPageSize);
            this.$message({
              type: 'success',
              message: "添加成功"
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
      handleClose(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
      },
      getCandidateOntology(page,limit){
        //axios请求
        axios.request({
          method : "POST",
          url : "/api/candidateOntology/getAllCandidateOntology",
          params : {page : page,limit : limit},
        })
            .then(
                (response) => {
                  if (response.status == 200) {
                    //修改候选本体展示表格里的数据
                    this.tableData = response.data.data
                    this.candidateOntologyTotal = response.data.count
                  }
                }
            )
            .catch(function (error) {
              console.log(error);
            })
      },
      //动态增加标签页，将候选本体的名称和，候选本体的id作为参数
      addTab(targetName,candidateOntologyName,candidateOntologyId) {
        //判断是否已经打开过，如已经打开过则跳转到打开的界面（根据name进行跳转）
        if(this.openedTabsId.has(candidateOntologyId)){
          this.editableTabsValue =this.openedTabsId.get(candidateOntologyId);
        }else {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            //把候选本体的名称作为新的标签页的title
            title: candidateOntologyName,
            name: newTabName,
            content: OntologyDetail,
            //在标签页存储信息的数组里存放候选本体的id，可以将id返回给子组件，拿到具体的某个候选本体的信息
            candidateOntologyId: candidateOntologyId
          });
          this.editableTabsValue = newTabName;
          this.openedTabsId.set(candidateOntologyId,newTabName);
        }
      },
      //动态删除标签页
      removeTab(targetName) {
        //删除标签页的时候对应这个map里标签页的candidateOntologyId和tabName的对应关系
        for(let i of this.openedTabsId.keys()) {
          if(this.openedTabsId.get(i) === targetName){
            this.openedTabsId.delete(i);
            break;
          }
        }
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
        //如果所有标签页都被关闭，则打开最初的候选本体列表标签页
        if(this.editableTabs.length === 0){
          this.editableTabsValue = "candidateOntologyList";
        }
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.getCandidateOntology(this.candidateOntologyCurrentPage,this.candidateKgPageSize);
    }
  }
</script>

<style>
  /*候选本体列表的样式*/
  .candidate-ontology-card span{
    font-weight: bold;
  }
  /* 提示框的样式 */
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
  /*图谱样式*/
  #candidate-ontology-show{
    width: 700px;
    height: 600px;
    float: left;
  }
  /*搜索框样式*/
  .search-ontology-class{
    float: right;
    margin-right: 90px;
    width: 300px;
  }
  /*本体信息表格样式*/
  .show-ontology-table{
    float: right;
    margin-right: 20px;
    width: 350px;
  }

</style>