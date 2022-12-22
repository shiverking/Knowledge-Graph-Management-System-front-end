<template>
  <div id="displayArea" class="display"></div>
</template>
<style>
  .display{
    background-color: #FDF9FD;
    height:500px;
    width:100%;
  }
</style>
<script>
  import * as G6 from "../../plugins/g6.min"
  import $ from '../../plugins/jquery.min.js';
  import insertCss from 'insert-css';
  export default {
    name: "KgPreview",
    props: {'previewData':Array},
    data() {
      return {
        previewData:this.previewData,
        nodes: [],
        edges: [],
      }
    },
    methods: {
      //生成节点和边
      generateNodesAndEdges(){
      //修改数据
      let list = JSON.parse(this.previewData);
      const map = new Map();
      var nodeCounter = 0;
      for(var i=0;i<list.length;i++){
        var head = list[i].head;
        var tail = list[i].tail;
        var relation = list[i].relation;
        if(!map.has(head)){
          map.set(head,"node"+nodeCounter)
          this.nodes.push({id:"node"+nodeCounter ,label:head,size:30})
          nodeCounter++;
        }
        if(!map.has(tail)){
          map.set(tail,"node"+nodeCounter)
          this.nodes.push({id:"node"+nodeCounter ,label:tail,size:30})
          nodeCounter++;
        }
        let from = map.get(head)
        let to =map.get(tail)
        this.edges.push({source:from, target:to,name:relation})
      };
      var container = document.getElementById("displayArea");
      const width = container.scrollWidth;
      const height = container.offsetHeight;
      //下面内容为设置相邻节点高亮
      insertCss(`
      .g6-component-tooltip {
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        font-size: 12px;
        color: #000;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 10px 8px;
        box-shadow: rgb(174, 174, 174) 0px 0px 10px;
      }
    `);
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        fixToNode: [1, 0.5],
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        itemTypes: ['node', 'edge'],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const outDiv = document.createElement('div');
          outDiv.style.width = 'fit-content';
          outDiv.style.height = 'fit-content';
          const model = e.item.getModel();
          if (e.item.getType() === 'node') {
            outDiv.innerHTML = `${model.label}`;
          } else {
            const source = e.item.getSource();
            const target = e.item.getTarget();
            console.log(e.item)
            outDiv.innerHTML = `关系类型: ${model.name}<br/>头实体: ${source.getModel().label}<br/>尾实体: ${target.getModel().label}`;
          }
          return outDiv;
        },
      });
      const graph = new G6.Graph({
        container: container,
        width,
        height,
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: (d) => {
            return 300;
          },
          nodeStrength: (d) => {
            if (d.isLeaf) {
              return -50;
            }
            return -10;
          },
          edgeStrength: (d) => {
            return 0.2;
          },
        },
          defaultNode: {
            size: [10, 10],
            style: {
              lineWidth: 1,
              fill: '#DEE9FF',
              stroke: '#5B8FF9',
            },
          },
          defaultEdge: {
            size: 1,
            style: {
              stroke: '#e2e2e2',
              lineAppendWidth: 2,
            },
          },
          nodeStateStyles: {
            highlight: {
              opacity: 1,
            },
            dark: {
              opacity: 0.2,
            },
          },
          edgeStateStyles: {
            highlight: {
              stroke: '#999',
            },
          },
          // 允许拖拽画布、放缩画布、拖拽节点
          modes: {
            default: ['drag-canvas','zoom-canvas', 'drag-node','activate-relations'],
          },
          // 配置插件
          plugins: [tooltip], // 将 minimap 实例配置到图上
      });
      const nodes = this.nodes;
      //移入节点高亮
      function clearAllStats() {
        graph.setAutoPaint(false);
        graph.getNodes().forEach(function (node) {
          graph.clearItemStates(node);
        });
        graph.getEdges().forEach(function (edge) {
          graph.clearItemStates(edge);
        });
        graph.paint();
        graph.setAutoPaint(true);
      }

      graph.on('node:mouseenter', function (e) {
        const item = e.item;
        graph.setAutoPaint(false);
        graph.getNodes().forEach(function (node) {
          graph.clearItemStates(node);
          graph.setItemState(node, 'dark', true);
        });
        graph.setItemState(item, 'dark', false);
        graph.setItemState(item, 'highlight', true);
        graph.getEdges().forEach(function (edge) {
          if (edge.getSource() === item) {
            graph.setItemState(edge.getTarget(), 'dark', false);
            graph.setItemState(edge.getTarget(), 'highlight', true);
            graph.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else if (edge.getTarget() === item) {
            graph.setItemState(edge.getSource(), 'dark', false);
            graph.setItemState(edge.getSource(), 'highlight', true);
            graph.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else {
            graph.setItemState(edge, 'highlight', false);
          }
        });
        graph.paint();
        graph.setAutoPaint(true);
      });
      graph.on('node:mouseleave', clearAllStats);
      graph.on('canvas:click', clearAllStats);
      graph.data({
        nodes,
        edges: this.edges.map(function (edge, i) {
          edge.id = 'edge' + i;
          return Object.assign({}, edge);
        }),
      });
      graph.render();
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
      }
    },
    watch: {
      previewData(newVal) {
        this.previewData= newVal //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
      },
    },
    created() {
      // console.log("进来了")
      // console.log("原生data 是"+this.previewData)
      // console.log("data 是",JSON.parse(this.previewData))
    },
    mounted() {
      //生成节点
      this.generateNodesAndEdges();
    }
  }
</script>