<template>
  <div id="main" class="main" v-if="isReloadData">
      <div class="trees">
        <!-- 文件上传 -->
        <!--
          limit: 代表一次可上传的文件数量
          file-list： 代表自己定义的属性
          on-error： 代表导入文件失败的时候提示的方法
          on-success：代表导入文件成功提示的方法
          before-upload：代表在上传前检查文件的格式、数据大小、信息等，判定文件是否能够上传
          show-file-list：代表是否显示文件列表，false不显示
          http-request：本次用来进行上传给后端的方法
         -->
        <el-upload
            style="display: inline-block;margin-bottom: 30px"
            action="string"
            :limit="1"
            :file-list="fileList"
            :on-error="loadFileError"
            :on-success="loadFileSuccess"
            :before-upload="beforeUpload"
            accept=".xlsx,.xls"
            :show-file-list="false"
            :http-request="uploadFile"
        >
          <el-button type="success">导入</el-button>
        </el-upload>
        <VueCTree :isEdit="true" v-if="ontology_data.length" :treeData="ontology_data" type="1"
                  :refresh="refresh" @setRefresh="setRefresh" />
      </div>

    <G6Img class="gImg" />
    <!-- <div id="show_ontology_like_graph" class="show_ontology" >
      <span class="desc">本体结构展示</span>
      <svg id="show_ontology_in_svg" width="100%" height="100%"></svg>
    </div>
    <el-card class="class_info" style="margin-top: 0px;margin-left: 0px;position: absolute;right: 11px;height: auto">
      <el-descriptions title="节点详细信息" direction="vertical" :column="2" border>
        <el-descriptions-item label="节点名">Country</el-descriptions-item>
        <el-descriptions-item label="父节点">GIS</el-descriptions-item>
        <el-descriptions-item label="备注">国家信息</el-descriptions-item>
        <el-descriptions-item label="数据库url">localhost:3306</el-descriptions-item>
        <el-descriptions-item label="数据库">FKFD</el-descriptions-item>
        <el-descriptions-item label="映射数据表">t_country</el-descriptions-item>
      </el-descriptions>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
          <el-button id="update_class_button" @click="updateClassButton = true" type="primary" class="update_button">
            修改节点
          </el-button>
        </div>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
          <el-button id="update_relation_button" @click="updateRelationButton = true" type="primary" class="update_button">
            修改关系
          </el-button>
        </div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
          <el-button id="add_class_button" @click="addClassButton = true" type="primary" class="update_button">
            添加节点
          </el-button>
        </div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
          <el-button id="add_relation_button" @click="addRelationButton = true" type="primary" class="update_button">
            添加关系
          </el-button>
        </div></el-col>
      </el-row>

      <el-drawer title="请输入需要修改的节点的信息" :visible.sync="updateClassButton" :with-header="true">
        <el-form ref="form" :model="addClass" label-width="80px">
          <el-form-item label="节点名称">
            <el-input v-model="addClass.name"></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input v-model="addClass.desc" placeholder="请修改备注"></el-input>
          </el-form-item>
          <el-form-item label="父节点">
            <el-select v-model="addClass.father" placeholder="请修改父节点">
              <el-option label="无" value=""></el-option>
              <el-option label="父节点一" value="Country"></el-option>
              <el-option label="父节点二" value="Sky"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="checkUpdateClass" size="small">确认修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer title="请输入需要修改的关系的信息" :visible.sync="updateRelationButton" :with-header="true">
        <el-form ref="form" :model="addRelation" label-width="80px">
          <el-form-item label="关系名称">
            <el-input v-model="addRelation.name"></el-input>
          </el-form-item>
          <el-form-item label="头节点">
            <el-select v-model="addRelation.classList" placeholder="请选择头节点">
              <el-option label="头节点一" value="Country"></el-option>
              <el-option label="头节点二" value="Sky"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="尾节点">
            <el-select v-model="addRelation.classList" placeholder="请选择尾节点">
              <el-option label="尾节点一" value="Country"></el-option>
              <el-option label="尾节点二" value="Sky"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="checkUpdateRelation" size="small">确认修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer title="请输入需要添加的节点的信息" :visible.sync="addClassButton" :with-header="true">
        <el-form ref="form" :model="addClass" label-width="80px">
          <el-form-item label="节点名称">
            <el-input v-model="addClass.name"></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input v-model="addClass.desc" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="父节点">
            <el-select v-model="addClass.father" placeholder="请选择父节点">
              <el-option label="无" value=""></el-option>
              <el-option label="父节点一" value="Country"></el-option>
              <el-option label="父节点二" value="Sky"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="checkAddClass" size="small">确认添加</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer title="请输入需要添加的关系的信息" :visible.sync="addRelationButton" :with-header="true">
        <el-form ref="form" :model="addRelation" label-width="80px">
          <el-form-item label="关系名称">
            <el-input v-model="addRelation.name"></el-input>
          </el-form-item>
          <el-form-item label="头节点">
            <el-select v-model="addRelation.classList" placeholder="请选择头节点">
              <el-option label="头节点一" value="Country"></el-option>
              <el-option label="头节点二" value="Sky"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="尾节点">
            <el-select v-model="addRelation.classList" placeholder="请选择尾节点">
              <el-option label="尾节点一" value="Country"></el-option>
              <el-option label="尾节点二" value="Sky"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="checkAddRelation" size="small">确认添加</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </el-card> -->
  </div>
</template>

<script>
import VueCTree from '../../../components/vue_js_tree.vue';
import G6Img from '../../../components/G6Img.vue';
import * as d3 from '../../../plugins/d3.v5.min.js'
import * as echarts from 'echarts';
import * as jquery from '../../../plugins/jquery.min.js'
import Panzoom from '@panzoom/panzoom';
import * as http from "http";
export default {
  name: 'OntologyShow',
  components: {
    VueCTree,
    G6Img
  },
  data() {
    return {
      fileList: [], // 导入的文件
      isReloadData: true,
      dataset: {
        name: "Thing",
        children: [
          {
            name: "Equipment",
            children: [
              { name: "Land", value: 100 },
              {
                name: "Sea",
                children: [
                  { name: "Vessel", value: 100 }
                ]
              },
              {
                name: "Sky",
                children: [
                  { name: "Aircraft", value: 100 }
                ]
              },
              {
                name: "Space",
                children: [
                  { name: "Misile", value: 100 }
                ]
              },
              {
                name: "Weapon",
                children: [
                  { name: "Artillery", value: 100 },
                  { name: "Bomb", value: 100 }
                ]
              }
            ]
          },
          {
            name: "GIS",
            children: [
              { name: "Country", value: 100 },
              { name: "LongitudeAndLatitude", value: 100 },
            ]
          },
          {
            name: "Mechanism",
            children: [
              { name: "Company", value: 100 },
              { name: "School", value: 100 }
            ]
          },
          {
            name: "OperationalInformation",
            children: [
              {
                name: "Plan",
                children: [
                  { name: "Task", value: 100 }
                ]
              }
            ]
          },
          {
            name: "Person",
            children: [
              { name: "Commander", value: 100 },
              {
                name: "Experience",
                children: [
                  { name: "Education", value: 100 },
                  { name: "Resume", value: 100 }
                ]
              },
              { name: "OrdinarySoldier", value: 100 }
            ]
          }
        ]
      },
      addClass: {
        name: '',
        father: '',
        desc: ''
      },
      addRelation: {
        name: '',
        classList: ''
      },
      updateClassButton: false,
      updateRelationButton: false,
      addClassButton: false,
      addRelationButton: false,
      ontology_data: [],
    }
  },
  methods: {
    //上传文件
    uploadFile(param){
      const File = param.file;
      let formDataInfo = new FormData();
      formDataInfo.append("file", File);
      this.loadConferenceFile(formDataInfo).then((res) => {
        this.$message({
          message: res.data.data,
          type: "success",
        });
      });
    },
    loadConferenceFile(formDataInfo){
      return axios.post("/coreOntology/uploadExcel",formDataInfo)
    },
    // 导入前检查文件
    beforeUpload(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2) {
        this.$message({
          message: "上传模板只能是 xls、xlsx格式!",
          type: "error",
        });
      }
      if (!isLt2M) {
        console.log("上传模板大小不能超过 2MB!");
        this.$message({
          message: "上传模板大小不能超过 2MB!",
          type: "error",
        });
      }
      return extension || extension2 || isLt2M;
    },
    //导入文件成功提示的方法
    loadFileSuccess() {
      this.$message({
        message: "文件上传成功!",
        type: "success",
      });
    },
    // 导入失败，其中$message为elementui的消息提醒组件
    loadFileError() {
      this.$message({
        message: "文件上传失败!",
        type: "error",
      });
    },
    setRefresh(res) {
      console.log(res, 'res');
      this.getInit()
 
      axios.request({
        method: 'get',
        url: '/api/coreOntology/getTreeData'
      }).then(response => {
        console.log(response);
        if (response.status == 200 && response.data.result) {
          console.log('请求到的response6');
          var list = [response.data.data]
          // this.renderTree(list)
          this.ontology_data = list;
          console.log(this.ontology_data);
          this.isReloadData = false
      this.$nextTick(() => {
        this.isReloadData = true
      })
        } else {
          this.$message({
            type: 'warning',
            message: response.data.message
          });
        }
      }).catch(error => {
        console.log(error);
      })
    },
    renderTree(tree) {
      for (let node of tree) {
        node.opened = false;
        node.selected = false;
        node.loading = false;
        node.disabled = false;
        node.name = node.className;
        if (node.children) {
          this.renderTree(node.children)
        }
      }
    },
    getInit() {
      axios.request({
        method: 'get',
        url: '/api/coreOntology/getTreeData'
      }).then(response => {
        console.log(response);
        if (response.status == 200 && response.data.result) {
          console.log('请求到的response6');
          var list = [response.data.data]
          // this.renderTree(list)
          this.ontology_data = list;
          console.log(this.ontology_data);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.message
          });
        }
      }).catch(error => {
        console.log(error);
      })
    },
    draw() {
      this.ontology_data = [require('../../../data/ontology.json')]
      console.log(this.ontology_data)
    },
    checkUpdateClass() {
      this.$alert('是否确认修改', '修改节点', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }
      });
    },
    checkUpdateRelation() {
      this.$alert('是否确认修改', '修改关系', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }
      });
    },
    checkAddClass() {
      this.$alert('是否确认添加', '添加节点', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: '添加成功'
          });
        }
      });
    },
    checkAddRelation() {
      this.$alert('是否确认添加', '添加关系', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: '添加成功'
          });
        }
      });
    },
  },
  mounted() {
    this.getInit()
  }
}
</script>

<style lang="css">
.main {
  background: white;
  height: 600px;
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.trees {
  width: 30%;
  margin-right: 30px;
}

.gImg {
  flex: 1;
}

.show_ontology {
  float: left;
  height: 750px;
  width: 800px;
  margin-top: 20px;
  /*border: red 1px solid;*/
  /*overflow-x:scroll;*/
  /*overflow-y:scroll;*/
}

.desc {
  font-size: 16px;
  font-weight: 700;
}

.update_button {
  /*margin-left: 150px;*/
  margin-top: 10px;
  /*float: right;*/
}

.class_info {
  float: left;
  margin-left: 20px;
  width: 30%;
  height: 110%;
  margin-top: 20px;
}
</style>