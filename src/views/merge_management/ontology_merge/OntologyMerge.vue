<template>
  <div v-if="isReloadData">
    <el-button type="primary" style="margin-bottom: 20px" @click="dialogTableVisible = true;getCandidateOntology(1,10)">选择候选本体</el-button>
    <el-dialog title="候选本体列表" :visible.sync="dialogTableVisible">
      <el-table
          class="candidate-ontology-table"
          ref="multipleTable"
          :data="CandidateOntoData"
          tooltip-effect="dark"
          style="width: 100%">
        <el-table-column
            prop="name"
            label="候选本体名称"
            width="150">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="150">
        </el-table-column>
        <el-table-column
            prop="creatorName"
            label="创建者"
            width="80">
        </el-table-column>
        <el-table-column
            prop="comment"
            label="备注"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            label="选择"
            width="150">
          <template slot-scope="scope">
            <el-button
                @click="selectCandidateOnto(scope.row.id)"
                type="primary"
                icon="el-icon-check">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-row :gutter="12">
      <el-col :span="11">
        <el-card class="box-card" shadow="never" style="display:block;margin-bottom:10px;">
          目标本体:
          <span v-if="currentRowName != ''"><el-tag type="success">{{ currentRowName }}</el-tag></span>
        </el-card>
        <VueCTree ref="jstree1" :isEdit="false" :treeData="coreOntoData" :refresh="refresh" @setRefresh="setRefresh"/>
      </el-col>
      <el-col :span="1">
        <el-image style="width: auto; height: auto;position: relative;top: 10px;" :src='leftArrow'></el-image>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="never" style="display:block;margin-bottom:10px;">
          候选本体:
          <span v-for="(item, i) in multipleSelectionName" :key="i"><el-tag>{{ item }}</el-tag>&nbsp;</span>
        </el-card>
        <VueCTree ref="jstree2" :isEdit="false" :draggable="draggable" :treeData="candidateOntoData"
                  :refresh="refresh" :candidate-ontology-id="candidateOntologyId" @setRefresh="setRefresh"/>
      </el-col>
    </el-row>
  </div>
</template>
<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.el-dialog__header {
  /*display: none;*/
  padding: 10px;
}

.dj-dialog-content {
  padding: 0;
  overflow: unset;
}

.transfer {
  text-align: left;
  display: inline-block;
}

.el-dialog {
  margin-top: 2vh !important;
}

.operation_button {
  display: inline-block;
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.choose_targetKg_pagination {
  margin-top: 10px;
}
</style>
<script>
import moment from 'moment';
import VueCTree from '../../../components/vue_js_tree.vue';
import $ from "../../../plugins/jquery.min"

import rightImg from "@/assets/icon/right.png"
import leftArrow from "@/assets/icon/left-arrow.png"
import leftArrow2 from "@/assets/icon/left-arrow2.png"

export default {
  components: {
    VueCTree
  },
  data() {
    return {
      CandidateOntoData: [],
      dialogTableVisible: false,
      refresh: true,
      isReloadData: true,
      coreOntoData: [],
      candidateOntoData: [],
      draggable: true,
      candidateOntologyId: null,
      rightImg: rightImg,
      leftArrow: leftArrow,
      leftArrow2: leftArrow2,
      currentRowName: '',
      currentRowId: '',
      multipleSelectionName: [],
    };
  },
  mounted() {
    this.getInit2()
  },
  methods: {
    selectCandidateOnto(selectCandidateOntoId){
      this.candidateOntologyId = selectCandidateOntoId;
      this.dialogTableVisible = false;
      this.getInit(this.candidateOntologyId);
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
                if (response.status === 200 && response.data.result) {
                  //修改候选本体展示表格里的数据
                  this.CandidateOntoData = response.data.data
                } else {
                  this.$message({
                    type: 'warning',
                    message: response.data.msg
                  });
                }
              }
          )
          .catch(function (error) {
            console.log(error);
          })
    },
    setRefresh(res) {
      this.getInit(this.candidateOntologyId)
      this.getInit2()
    },
    getInit(candidateOntologyId) {
      axios.request({
        method: 'POST',
        url: '/api/candidateOntology/getTreeClassByCandidateOntologyId',
        params: {candidateOntologyId: candidateOntologyId}
      }).then(response => {
        if (response.status === 200) {
          this.candidateOntoData = response.data.data != null ? [response.data.data] : []
          this.isReloadData = false
          this.$nextTick(() => {
            this.isReloadData = true
          })
        }else {
          this.$message({
            type: 'warning',
            message: response.data.msg
          });
        }
      }).catch(error => {
        console.log(error);
      })
    },
    getInit2() {
      axios.request({
        method: 'get',
        url: '/api/coreOntology/getTreeData'
      }).then(response => {
        if (response.status === 200 && response.data.result) {
          var list = [response.data.data]
          this.coreOntoData = list;
          this.isReloadData = false
          this.$nextTick(() => {
            this.isReloadData = true
          })
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg
          });
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }
}
</script>