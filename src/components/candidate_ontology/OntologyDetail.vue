<template>
  <div id="main">
    <VueCTree class="trees"  :isEdit="true" :treeData="leftTreeData"/>
    <G6Img class="gImg"/>
    <!-- <VueJstree class="tree" v-if="leftTreeDataFlag" text-field-name="name" value-field-name="id" :data="leftTreeData"
      @item-click="itemClick"></VueJstree> -->

    <!-- <div id="tree-container" class="tree-container"></div> -->
    <!-- <div id="container" class="canvas_container"></div> -->
  </div>
</template>
<script>

import VueCTree from '../vue_js_tree.vue';
import G6Img from '../G6Img.vue';
export default {
  name: 'OntologyDetail',
  //在这里接收父组件传输过来的候选本体id
  props: ['candidateOntologyId'],
  components: {
    VueCTree,
    G6Img
  },
  data() {
    return {
      options: {
        core: {
          check_callback: true
        },
        plugins: ["types", "checkbox"]
      },
      leftTreeDataFlag: false,
      leftTreeData: [],
      // candidateOntologyId: this.candidateOntologyId,
      newTreeContainerId: '',
      newContainerId: '',
      // treeData: {
      //   "children": [{
      //     "children": [],
      //     "name": "节点2",
      //     "id": 2,
      //     "parentId": 1
      //   }, {
      //     "children": [{
      //       "children": [],
      //       "name": "节点4",
      //       "id": 4,
      //       "parentId": 3
      //     }],
      //     "name": "节点3",
      //     "id": 3,
      //     "parentId": 1
      //   }],
      //   "name": "节点1",
      //   "id": 1,
      //   "parentId": 0
      // },
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
      //图的节点
      // nodes: [
      //   { id: 'node0', size: 70, label:'节点一' },
      //   { id: 'node1', size: 50, label:'节点二' },
      //   { id: 'node2', size: 50, label:'节点三' },
      //   { id: 'node3', size: 50, label:'节点四' },
      //   { id: 'node4', size: 40, isLeaf: true },
      //   { id: 'node5', size: 40, isLeaf: true },
      //   { id: 'node6', size: 25, isLeaf: true },
      //   { id: 'node7', size: 25, isLeaf: true },
      //   { id: 'node8', size: 25, isLeaf: true },
      //   { id: 'node9', size: 25, isLeaf: true },
      //   { id: 'node10', size: 25, isLeaf: true },
      //   { id: 'node11', size: 25, isLeaf: true },
      //   { id: 'node12', size: 25, isLeaf: true },
      //   { id: 'node13', size: 25, isLeaf: true },
      //   { id: 'node14', size: 25, isLeaf: true },
      //   { id: 'node15', size: 25, isLeaf: true },
      //   { id: 'node16', size: 25, isLeaf: true },
      // ],
      nodes: [
        { id: '0', label: '舰船舰艇', size: '50' },
        { id: '1', label: '导弹武器', size: '50' },
        { id: '2', label: '火炮', size: '50' },
        { id: '3', label: '飞行器', size: '50' },
        { id: '4', label: '人员', size: '50' },
        { id: '5', label: '学历', size: '50' },
        { id: '6', label: '任务', size: '50' },
        { id: '7', label: '国家', size: '50' },
        { id: '8', label: '履历', size: '50' },
        { id: '9', label: '计划', size: '50' },
      ],
      //图的边
      // edges: [
      //   { source: 'node0', target: 'node1', label:'关系一' },
      //   { source: 'node0', target: 'node2', label:'关系二'  },
      //   { source: 'node0', target: 'node3', label:'关系三'  },
      //   { source: 'node0', target: 'node4', label:'关系四'  },
      //   { source: 'node0', target: 'node5', label:'关系五'  },
      //   { source: 'node1', target: 'node6', label:'关系六'  },
      //   { source: 'node1', target: 'node7', label:'关系七'  },
      //   { source: 'node2', target: 'node8', label:'关系八'  },
      //   { source: 'node2', target: 'node9', label:'关系九'  },
      //   { source: 'node2', target: 'node10', label:'关系十'  },
      //   { source: 'node2', target: 'node11', label:'关系十一'  },
      //   { source: 'node2', target: 'node12', label:'关系十二'  },
      //   { source: 'node2', target: 'node13', label:'关系十三'  },
      //   { source: 'node3', target: 'node14', label:'关系十四'  },
      //   { source: 'node3', target: 'node15', label:'关系十五'  },
      //   { source: 'node3', target: 'node16', label:'关系十六'  },
      // ],
      edges: [
        { source: '0', target: '1', label: '携带' },
        { source: '0', target: '2', label: '携带' },
        { source: '0', target: '3', label: '携带' },
        { source: '3', target: '1', label: '携带' },
        { source: '4', target: '5', label: '拥有' },
        { source: '0', target: '6', label: '执行' },
        { source: '3', target: '6', label: '执行' },
        { source: '0', target: '4', label: '乘坐' },
        { source: '3', target: '4', label: '乘坐' },
        { source: '7', target: '0', label: '生产' },
        { source: '7', target: '1', label: '生产' },
        { source: '7', target: '2', label: '生产' },
        { source: '7', target: '3', label: '生产' },
        { source: '4', target: '8', label: '拥有' },
        { source: '6', target: '9', label: '组成' },
      ],
    }
  },
  methods: {
    renderTree(tree) {
      for (let node of tree) {
        node.opened = false;
        node.selected = false;
        node.loading = false;
        node.disabled = false;
        if (node.children) {
          this.renderTree(node.children)
        }
      }
    },
    getTreeDataByCandidateOntologyId() {
      let treeJson = '';
      axios.request({
        method: 'POST',
        url: '/api/candidateOntology/getTreeClassByCandidateOntologyId',
        params: { candidateOntologyId: this.candidateOntologyId }
      }).then(response => {
        if (response.status === 200) {
          // this.treeData = response.data.data;
          // treeJson = JSON.parse(this.treeData);
          console.log('请求到的treeData');
          // this.leftTreeData = [JSON.parse(response.data.data)]
          // this.renderTree(this.leftTreeData)
          // console.log(this.leftTreeData)
          this.leftTreeData = response.data.data != null ? [response.data.data] :[]
          this.renderTree(this.leftTreeData)
          console.log(this.leftTreeData)
        }
      }).catch(error => {
        console.log(error);
      })
    },
  },
  mounted() {
    this.getTreeDataByCandidateOntologyId();
  }
}
</script>
<style>
#main {
  background: white;
  height: 100%;
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.trees{
  width: 30%;
  margin-right: 30px;
}
.gImg{
  flex:1;
}
.tree-container {
  display: inline-block;
  width: 25%;
  height: 600px;
  background-color: rgba(251, 242, 250, 0.46);
  margin-left: 10px;
}
.tree{
  /* display: inline-block;
  width: 25%;
  height: 600px;
  background-color: rgba(251, 242, 250, 0.46);
  margin-left: 10px; */
}

.canvas_container {
  width: 69%;
  height: 600px;
  background-color: rgba(251, 242, 250, 0.46);
  margin-right: 10px;
  float: right;
}
</style>
