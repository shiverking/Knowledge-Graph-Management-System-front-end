<template>
  <div class="g6Img">
    <div id="container" class="canvas_container" @contextmenu.prevent=""></div>
    <el-dialog title="添加关系" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="关系名称" :label-width="formLabelWidth" prop="relationName">
          <el-input v-model="form.relationName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择节点" :label-width="formLabelWidth" prop="tailClassName">
          <el-select v-model="form.tailClassName" placeholder="请选择关系节点" class="select">
            <el-option v-for="(item, index) in nodes" :key="index" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import G6 from '../plugins/g6.min.js';
import $ from '../plugins/jquery.min.js';
import insertCss from 'insert-css'
insertCss(`
  .g6-component-contextmenu {
    padding: 0
  }
  .g6-component-contextmenu ul {
    margin: 0;
    text-align: center;
  }
  .g6-component-contextmenu ul li {
    padding: 6px 20px;
    cursor: pointer;
  }
  .g6-component-contextmenu ul li:hover {
    background: #b4b4b4;
  }
`)
export default {
  name: 'OntologyDetail',
  //在这里接收父组件传输过来的候选本体id
  props: ['candidateOntologyId'],
  data() {
    return {
      route:'',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        relationName: '',
        headClassName: '',
        tailClassName: '',
        belongCandidateId: ""
      },
      rules: {
        relationName: [
          { required: true, message: '请输入节点关系', trigger: 'blur' }
        ],
        tailClassName: [
          { required: true, message: '请选择目标节点', trigger: 'change' }
        ],
      },
      options: {
        core: {
          check_callback: true
        },
        plugins: ["types", "checkbox"]
      },
      leftTreeDataFlag: false,
      leftTreeData: [],
      newTreeContainerId: '',
      newContainerId: '',
      treeData: {
        "name": "Thing",
        "children": [
          {
            "name": "武器装备",
            "children": [
              { "name": "陆", "value": 100 },
              {
                "name": "海",
                "children": [
                  { "name": "舰船舰艇", "value": 100 }
                ]
              },
              {
                "name": "空",
                "children": [
                  { "name": "飞行器", "value": 100 }
                ]
              },
              {
                "name": "天",
                "children": [
                  { "name": "导弹武器", "value": 100 }
                ]
              },
              {
                "name": "武器",
                "children": [
                  { "name": "火炮", "value": 100 },
                  { "name": "爆炸物", "value": 100 }
                ]
              }
            ]
          },
          {
            "name": "地理信息",
            "children": [
              { "name": "国家", "value": 100 },
              { "name": "经纬度", "value": 100 }
            ]
          },
          {
            "name": "机构",
            "children": [
              { "name": "单位", "value": 100 },
              { "name": "学校", "value": 100 }
            ]
          },
          {
            "name": "作战信息",
            "children": [
              {
                "name": "计划",
                "children": [
                  { "name": "任务", "value": 100 }
                ]
              }
            ]
          },
          {
            "name": "人员",
            "children": [
              { "name": "指挥官", "value": 100 },
              {
                "name": "经历",
                "children": [
                  { "name": "学历", "value": 100 },
                  { "name": "履历", "value": 100 }
                ]
              },
              { "name": "普通士兵", "value": 100 }
            ]
          }
        ]
      },
      nodes: [],
      edges: [],
      graphInfo: null
    }
  },
  methods: {
    getInit() {
      axios.request({
        method: 'get',
        // url: '/api/candidateOntology/getGraphNode/1',
        url: this.route==='/coredata/mainontology/display'?'/api/coreOntology/getGraphNode':'/api/candidateOntology/getGraphNode/1'
      }).then(response => {
        console.log(response);
        if (response.status === 200 && response.data.result) {
          console.log('请求到的response2');
          // console.log(response);
          var list = response.data.data;
          list.forEach((item) => {
            item.label = item.name
            item.id = item.id + ''
            item.size = '50'
          })
          this.nodes = list;
          console.log(this.nodes);
          this.getEdge();
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
    getEdge() {
      axios.request({
        method: 'get',
        // url: '/api/candidateOntology/getGraphEdge/1'
        url: this.route==='/coredata/mainontology/display'?'/api/coreOntology/getGraphEdge':'/api/candidateOntology/getGraphEdge/1'
      }).then(response => {
        console.log(response);
        if (response.status === 200 && response.data.result) {
          console.log('请求到的response3');
          // console.log(response);
          var list = response.data.data;
          list.forEach((item) => {
            item.source = item.headClassId + ''
            item.target = item.tailClassId + ''
            item.label = item.relationName
          })
          this.edges = list;
          console.log(this.edges);
          if (this.graphInfo != null) {
            this.graphInfo.changeData({
              nodes: this.nodes,
              edges: this.edges.map(function (edge, i) {
                edge.id = 'edge' + i;
                return Object.assign({}, edge);
              }),
            })
          } else {
            this.initGraph()
          }
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
    addClass() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          axios.request({
            method: 'POST',
            // url: '/api/candidateOntology/addRelation',
            url: this.route==='/coredata/mainontology/display'?'/api/coreOntology/addRelation':'/api/candidateOntology/addRelation',
            data: {
              headClassName: this.form.headClassName,
              relationName: this.form.relationName,
              tailClassName: this.form.tailClassName,
              belongCandidateOntologyId: 1,
            }
          }).then(response => {
            console.log(response);
            console.log(response.data.msg);
            if (response.status == 200 && response.data.result) {
              console.log('请求到的response');
              console.log(response);
              this.dialogFormVisible = false;
              this.getInit();
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
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    //把画图的容器id做一个改变，随着传输过来的候选图谱id进行动态改变
    //因为如果不把容器的id动态变化的话，所有的候选本体就会在同一个容器里
    initComponent() {
      this.newTreeContainerId = 'tree_candidate_ontology_' + this.candidateOntologyId;
      this.newContainerId = 'candidate_ontology_' + this.candidateOntologyId;
      $('#container').attr('id', this.newContainerId);
    },
    getGraphDataByCandidateOntologyId() {
      axios.request({
        method: "post",
        url: "/api/candidateOntology/"
      })
    },
    initGraph() {
      var that = this;
      const container = document.getElementById(this.newContainerId);
      const width = container.scrollWidth;
      const height = container.scrollHeight;
      const graph = new G6.Graph({
        // container为容器id
        container: this.newContainerId,
        width,
        height,
        // plugins: [contextMenu],
        layout: {
          type: 'force',
          preventOverlap: true,
          //函数控制节点间边的长度
          linkDistance: (d) => {
            return 200;
          },
          nodeStrength: (d) => {
            if (d.isLeaf) {
              return -50;
            }
            return -10;
          },
          edgeStrength: (d) => {
            if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
              return 0.7;
            }
            return 0.1;
          },
        },
        defaultNode: {
          color: '#5B8FF9',
        },
        defaultEdge: {
          color: '#500020',
          style: {
            endArrow: true,
          },
        },
        modes: {
          default: ['drag-canvas'],
        },
      });
      graph.data({
        nodes: that.nodes,
        edges: that.edges.map(function (edge, i) {
          edge.id = 'edge' + i;
          return Object.assign({}, edge);
        }),
      });
      graph.render();
      console.log(graph)


      graph.on('node:contextmenu', function (evt) {
        //当前节点定位
        var top = evt.clientY;
        var left = evt.clientX;
        var a = $("#mountNode").height() - $(".tools-box").height();
        var width1 = $("#mountNode").width();
        var width2 = $(".tools-box").width();
        var b = $("#mountNode").width() - $(".tools-box").width();
        //当前节点数据信息
        var rightNode = evt.item._cfg.id;
        var rightNodeParent = evt.item._cfg.model.parentid;
        var rightNodestate = evt.item._cfg.model.state;
        var rightNodelabel = evt.item._cfg.model.label;
        var rightCurrentHumId = evt.item._cfg.model.CurrentHumId;
        var rightFromHumId = evt.item._cfg.model.FromHumId;
        console.log(evt)
        console.log(rightNode)
        console.log(rightNodelabel)
        if (that.$refs.ruleForm !== undefined) that.$refs.ruleForm.resetFields()
        that.form.headClassName = rightNodelabel;
        that.form.belongCandidateId = rightNode
        that.dialogFormVisible = true;
      })
      graph.on('edge:contextmenu', function (evt) {
        console.log(evt)
        var rightNode = evt.item._cfg.id;
        var rightNodelabel = evt.item._cfg.model.label;
        console.log(rightNode)
        console.log(rightNodelabel)
        that.$confirm('此操作将永久删除此节点关系, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.route);
          axios.request({
            method: 'DELETE',
            // url: '/api/candidateOntology/deleteRelation',
            url: that.route==='/coredata/mainontology/display'?'/api/coreOntology/deleteRelation':'/api/candidateOntology/deleteRelation',
            data: {
              headClassId: evt.item._cfg.source._cfg.id,
              relationName: rightNodelabel,
              tailClassId: evt.item._cfg.target._cfg.id,
              belongCandidateOntologyId: 1,
            }
          }).then(response => {
            console.log(response);
            if (response.status == 200 && response.data.result) {
              console.log('请求到的response');
              console.log(response);
              that.getInit();
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              that.$message({
                type: 'warning',
                message: response.data.msg
              });
            }
          }).catch(error => {
            console.log(error);
          })

        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      });

      graph.on('node:dragstart', function (e) {
        graph.layout();
        refreshDragedNodePosition(e);
      });
      graph.on('node:drag', function (e) {
        refreshDragedNodePosition(e);
      });
      graph.on('node:dragend', function (e) {
        e.item.get('model').fx = null;
        e.item.get('model').fy = null;
      });

      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };

      function refreshDragedNodePosition(e) {
        const model = e.item.get('model');
        model.fx = e.x;
        model.fy = e.y;
      }
      this.graphInfo = graph;
      return graph;
    },
  },
  created(){
    this.route=this.$route.path
    console.log(this.route==='/coredata/mainontology/display');
  },
  mounted() {
    console.log(this.route);
    this.initComponent();
    this.getInit();
  
    // this.initGraph();

  },
  watch: {
    $route(to, from) {
      console.log(this.$route.path);
    }
  },
}
</script>
<style>
.g6Img {
  width: 100%;
  height: 100%;
}

.canvas_container {
  width: 100% !important;
  height: 600px;
  background-color: rgba(251, 242, 250, 0.46);
  margin-right: 10px;
  position: relative;
}

.g6-component-contextmenu {
  box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);
  border-radius: 4px;
}

.g6-component-contextmenu ul {
  list-style: none;
}

.g6-component-contextmenu ul li {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}

.g6-component-contextmenu ul li:hover {
  background: #eee;
}

.select .el-input {
  width: 100% !important;
}
</style>