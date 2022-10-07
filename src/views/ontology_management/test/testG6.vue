<template>
  <!--设置parentContent的宽高为浏览器大小-->
  <div class="parentContent" ref="parentContent">
    <div id="container" ref="container"></div>
  </div>
</template>
<script>
import G6 from '@antv/g6'
export default {
  name: 'testG6',
  mounted () {
    this.initComponent()
    this.initSize()
  },
  data () {
    return {
      data: {}, // 拓扑图数据
      graph: undefined, // new G6
      canvasWidth: 0, // 画布宽度
      canvasHeight: 0 // 画布高度
    }
  },
  methods: {
    /**
     * 设置画布大小自适应
     */
    initSize () {
      const self = this // 因为箭头函数会改变this指向，指向windows。所以先把this保存
      setTimeout(() => {
        // todo 浏览器窗口发生变化时
        window.onresize = function () {
          // todo 获取div parentContent 的宽度和高度
          this.canvasWidth = self.$refs.parentContent.clientWidth
          this.canvasHeight = self.$refs.parentContent.clientHeight
          // todo 修改画布的大小
          self.graph.changeSize(this.canvasWidth, this.canvasHeight)
          // todo 将图移动到画布中心位置
          self.graph.fitCenter()
        }
      }, 20)
    },
    /**
     * 创建G6，并对G6的一些设置
     * */
    initComponent () {
      this.data = {
        nodes: [
          {
            id: 'node1',
            label: '采集服务器',
            ip: '192.168.1.1',
            status: 0
            // 此处的key值一定不要出现type，如果出现type，图片修改无效
          },
          {
            id: 'node2',
            label: '数据库',
            ip: '192.168.1.2',
            status: 1
          },
          {
            id: 'node3',
            label: '终端',
            ip: '192.168.1.3',
            status: 2
          },
          {
            id: 'node4',
            label: '引擎',
            ip: '192.168.1.4',
            status: 0
          },
          {
            id: 'node5',
            label: '引擎5',
            ip: '192.168.1.4',
            status: 0
          },
          {
            id: 'node6',
            label: '引擎6',
            ip: '192.168.1.4',
            status: 2
          },
          {
            id: 'node7',
            label: '引擎7',
            ip: '192.168.1.4',
            status: 1
          },
          {
            id: 'node8',
            label: '引擎8',
            ip: '192.168.1.4',
            status: 2
          },
          {
            id: 'node9',
            label: '引擎9',
            ip: '192.168.1.4',
            status: 1
          },
          {
            id: 'node10',
            label: '引擎10',
            ip: '192.168.1.4',
            status: 0
          }
        ],
        edges: [
          {
            source: 'node1',
            target: 'node2'
          },
          {
            source: 'node1',
            target: 'node3'
          },
          {
            source: 'node1',
            target: 'node4'
          },
          {
            source: 'node4',
            target: 'node5'
          },
          {
            source: 'node1',
            target: 'node6'
          },
          {
            source: 'node6',
            target: 'node7'
          },
          {
            source: 'node7',
            target: 'node8'
          },
          {
            source: 'node1',
            target: 'node8'
          },
          {
            source: 'node2',
            target: 'node9'
          },
          {
            source: 'node3',
            target: 'node10'
          }
        ]
      }
      /**
       * 遍历节点数据，给节点添加图片
       */
      for (let i = 0, len = this.data.nodes.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (this.data.nodes[i].status == 0) { // 'offlineAnomaly'
          this.data.nodes[i].img = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp05%2F19100122420C335-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641970684&t=70b9b0b3a05f6ca5d56d6c4234fdd1fd'
        }
        // eslint-disable-next-line eqeqeq
        if (this.data.nodes[i].status == 1) { // 'onlineAuth'
          this.data.nodes[i].img = 'https://yyb.gtimg.com/aiplat/page/product/visionimgidy/img/demo6-16a47e5d31.jpg?max_age=31536000'
        }
        // eslint-disable-next-line eqeqeq
        if (this.data.nodes[i].status == 2) { // 'onlineAuth'
          this.data.nodes[i].img = 'https://img0.baidu.com/it/u=3927459320,2138990686&fm=26&fmt=auto'
        }
      }
      // todo 设置鼠标悬停显示详情操作
      const tooltip = new G6.Tooltip({
        offsetX: 70,
        offsetY: 20,
        getContent (e) {
          const outDiv = document.createElement('div')
          outDiv.style.width = '180px'
          outDiv.innerHTML = `
            <ul id="nodeDetails">
              <li>名称: ${e.item.getModel().label}</li>
              <li>IP: ${e.item.getModel().ip}</li>
              <li>ID: ${e.item.getModel().id}</li>
              <li>status: ${e.item.getModel().status}</li>
            </ul>`
          return outDiv
        },
        itemTypes: ['node']
      })
      // todo 初始化画布宽高为div parentContent 的宽度和高度
      this.canvasWidth = this.$refs.parentContent.clientWidth
      this.canvasHeight = this.$refs.parentContent.clientHeight
      this.graph = new G6.Graph({
        container: 'container',
        width: this.canvasWidth,
        height: this.canvasHeight,
        linkCenter: true,
        plugins: [tooltip], // 配置 Tooltip 插件
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'activate-relations'] // 允许拖拽画布、放缩画布、拖拽节点、设置高亮
        },
        layout: {
          type: 'force',
          preventOverlap: true, // 防止节点重叠
          // 防碰撞必须设置nodeSize或size,否则不生效，由于节点的size设置了40，虽然节点不碰撞了，但是节点之间的距离很近，label几乎都挤在一起，所以又重新设置了大一点的nodeSize,这样效果会好很多
          nodeSize: 100,
          linkDistance: 150 // 指定边距离为150
        },
        defaultNode: { // 节点样式修改
          type: 'image', // 设置节点为图片
          size: [40, 40], // 节点大小
          labelCfg: { // 修改节点label样式
            style: {
              fill: '#5B8FF9', // 字体颜色
              fontSize: 14 // 字体大小
            }
          }
        },
        defaultEdge: {
          style: {
            lineWidth: 2, // 线宽
            stroke: '#778899', // 线的颜色
            endArrow: { // 设置终点箭头
              path: G6.Arrow.vee(5, 20, 15), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
              d: 15
            }
          }
        }
        // 设置节点高亮样式
        // edgeStateStyles: {
        //   highlight: {
        //     stroke: '#32dadd'
        //   }
        // }
      })
      /**
       * 鼠标移入时，设置节点连线高亮
       * */
      // const that = this // 改变this指向
      // this.graph.on('node:mouseenter', function (e) {
      //   let item = e.item
      //   that.graph.setAutoPaint(false)
      //   that.graph.getNodes().forEach(function (node) {
      //     that.graph.clearItemStates(node)
      //     that.graph.setItemState(node, 'dark', true)
      //   })
      //   that.graph.setItemState(item, 'dark', false)
      //   that.graph.setItemState(item, 'highlight', true)
      //   that.graph.getEdges().forEach(function (edge) {
      //     if (edge.getSource() === item) {
      //       that.graph.setItemState(edge.getTarget(), 'dark', false)
      //       that.graph.setItemState(edge.getTarget(), 'highlight', true)
      //       that.graph.setItemState(edge, 'highlight', true)
      //       edge.toFront()
      //     } else if (edge.getTarget() === item) {
      //       that.graph.setItemState(edge.getSource(), 'dark', false)
      //       that.graph.setItemState(edge.getSource(), 'highlight', true)
      //       that.graph.setItemState(edge, 'highlight', true)
      //       edge.toFront()
      //     } else {
      //       that.graph.setItemState(edge, 'highlight', false)
      //     }
      //   })
      //   that.graph.paint()
      //   that.graph.setAutoPaint(true)
      // })
      /**
       * 鼠标移出时，删除节点连线高亮
       * */
      // this.graph.on('node:mouseleave', this.clearAllStats)
      // 接收数据并渲染
      this.graph.data(this.data)
      this.graph.render()
      /**
       * 更新节点数据<我这边例子是取第一个节点的数据进行更新，因为我的数据是前端写的假数据，不是实时更新的>
       * 如果真的在项目中，数据是实时更新的，可以在watch中写这段代码，通过for循环对数据进行遍历更新，大致代码如下，如果不正常的话适当微调即可
       * watch: {
          'this.data.nodes'(val, oldVal) {
            if(val) {
                const that = this
              val.forEach(function(value, index, array) {
                const el = that.graph.findById(value.id)
                console.log('model', el._cfg.model)
                console.log('value', value)
                el._cfg.model.id = value.id
                el._cfg.model.label = value.label
                el._cfg.model.ip= value.ip
                el._cfg.model.status= value.status
                if (value.status == 1) { /
                  el._cfg.model.img = '.....'
                }
                if (value.status == 0) {
                  el._cfg.model.img = '.....'
                }
                that.graph.refreshItem(el)
              })
            }
            }
        },
       */
      const el = this.graph.findById(this.data.nodes[0].id)
      console.log('model', el)
      el._cfg.model.label = '哈哈哈，我变成了可爱的小奶龙'
      el._cfg.model.ip = '192.168.....'
      el._cfg.model.status = 4
      el._cfg.model.img = 'https://img1.baidu.com/it/u=1049473449,988642504&fm=253&fmt=auto&app=120&f=JPEG?w=328&h=328'
      this.graph.refreshItem(el)
      // 双击节点
      this.graph.on('node:dblclick', (e) => {
        // 先将所有当前是 click 状态的节点置为非 click 状态
        const clickNodes = this.graph.findAllByState('node', 'dblclick')
        clickNodes.forEach((cn) => {
          this.graph.setItemState(cn, 'dblclick', false)
        })
        const nodeItem = e.item // 获取被点击的节点元素对象
        console.log('双击', nodeItem._cfg)
        this.graph.setItemState(nodeItem, 'dblclick', true) // 设置当前节点的 click 状态为 true
      })
    },
    /**
     * 清除节点连线高亮状态
     */
    clearAllStats () {
      const that = this
      this.graph.setAutoPaint(false)
      this.graph.getNodes().forEach(function (node) {
        that.graph.clearItemStates(node)
      })
      this.graph.getEdges().forEach(function (edge) {
        that.graph.clearItemStates(edge)
      })
      this.graph.paint()
      this.graph.setAutoPaint(true)
    }
  }
}
</script>

<style>
.parentContent {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
#nodeDetails {
  list-style: none;
}
#nodeDetails>li {
  padding:5px 0;
  text-align: left;
}
</style>