<template>
  <div class="history" ref="history" style="height: 99%">
    <history-view-title :title="history_view_title"></history-view-title>
    <main class="container">
      <div id="myInput">
        <div style="flex:1; display:flex;">
          <div class="paramInput">
            <span
                style="font:italic bold 13px Georgia, serif;">batch_size：</span>
            <input type="text" class="styleInput" v-model="batchSize"
                   placeholder="请输入样本大小" />
          </div>
          <div class="paramInput">
            <span style="font:italic bold 13px Georgia, serif;">epoch：</span>
            <input type="text" class="styleInput" v-model="epoch"
                   placeholder="请输入循环次数" />
          </div>
        </div>
        <div
            style="flex:1; display:flex;align-items: center;margin-bottom: 5%;">
          <div class="paramInput">
            <span
                style="font:italic bold 13px Georgia, serif;">pruning_ratio：</span>
            <input type="text" class="styleInput" list="rateList"
                   v-model="pruningRatio" placeholder="请输入剪枝率" />
            <!-- <datalist id="rateList" style="text-align: center;">
              <option>0.1</option>
              <option>0.2</option>
              <option>0.3</option>
            </datalist> -->
          </div>
          <div class="paramButtom" style="flex:1">
            <button type="submit" @click="addNode"
                    style="flex:2;font:italic bold 16px Georgia, serif;">submit</button>
          </div>
        </div>

      </div>
      <div id="tree_history"><svg id="mainsvg"></svg></div>
    </main>
  </div>
</template>

<script>
import $ from 'jquery';
import HistoryViewTitle from '@/components/title/Title'
import * as d3 from "d3";
export default {
  name: 'History',
  components: {
    HistoryViewTitle
  },
  props: {},
  data () {
    return {
      history_view_title: 'Explore History',
      // id:"treeMap"+Math.ceil(Math.random()*1000),
      treeData: {
        "id": 0,
        "name": 'pruning',
        "children": [
          {
            "id": 1,
            "name": 'pruning1',
            "batch_size": 256,
            "epoch": 30,
            "pruning_ratio": 0.9,
          },
          {
            "id": 2,
            "name": 'pruning2',
            "batch_size": 512,
            "epoch": 100,
            "pruning_ratio": 0.8,
          },
          {
            "id": 3,
            "name": 'pruning3',
            "batch_size": 128,
            "epoch": 20,
            "pruning_ratio": 0.7,
          },
          {
            "id": 4,
            "name": 'pruning5',
            "batch_size": 64,
            "epoch": 100,
            "pruning_ratio": 0.9,
          },
          // {
          //   "id":this.id,
          //   "name":'pruning'+this.id,
          //   "batch_size": this.batchSize,
          //   "epoch": this.epoch,
          //   "pruning_ratio":this.pruningRatio,
          // }
        ]
      },
      id: parseInt(100 * Math.random()),
      batchSize: '',
      epoch: '',
      pruningRatio: ''
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    this.initTree()

  },
  methods: {

    initTree () {
      let that = this
      // 1、 选中页面给页面添加svg标签；设置Svg绘制区域的宽和高；添加g元素(svg的group分组标签元素)并设置位置。

      // Set the dimensions and margins of the diagram
      //获得画布
      var svg = d3.select("#mainsvg")
      //定义比例尺
      var width = 100;
      var height = 800;
      var rectWidth = 60;
      var rectHeight = 20;
      //用于控制表格边框线的位置
      var margin = { top: 10, right: 10, bottom: 10, left: 50 };
      let data = {}//源数据
      if (!this.treeData) {
        this.treeData = data
      } else {
        // 清空画布
        d3.select("#mainsvg").select('.body').remove();
      }

      // 2、生成树状布局，设置树图布局容器尺寸。
      //读取数据
      //使用hierarchy讲数据转换成d3中自己的数据格式
      //sum方法让非叶子结点也有value属性，他的value值为它下面所有叶子结点的value之和
      var root = d3.hierarchy(this.treeData)
          .sum(function (d) { return d.value; });
      root.x0 = height / 2;
      root.y0 = 0;
      root.descendants().forEach((d, i) => {
        d.id = i;
      });

      //separation表示同层中节点的占比情况，同一层（相同父节点）占比1:1，同层（不一样父节点）占比1:2
      //不同层，每个节点占比1:1，但深度越深，高度越小
      var tree = d3.tree().size([height, width - margin.left - margin.right - 10])
          // .nodeSize([-100,30])
          .separation(function (a, b) {
            return (a.parent == b.parent ? 3 : 4) / a.depth;
          })
          .nodeSize([22, 26])(root)

      var g = svg.append('g')
          .attr('class', 'body')
          // .call(zoom)
          .attr('transform', function (d) {
            if (tree.links().length == 0) {
              return `translate(${margin.left + 10},${(height - margin.top - margin.bottom) / 2})`
            }
            return `translate(${margin.left + 10},0)`
          })

      //设置缩放功能
      const zoom = d3.zoom()
          .scaleExtent([1 / 8, 8])
          .on("zoom", function(){
            g.attr("transform", d3.zoomTransform(this))
          })
      svg.call(zoom)


      //3、绘制连线、节点以及文本
      //获取links线段
      // console.log(tree.links())
      //定义link连接函数
      var link = d3.linkHorizontal()
          .x(function (d) { return d.y })
          .y(function (d) { return d.x })
      var links = g.selectAll('.link')
          .data(tree.links())
          .enter()
          .append('path')
          // .join('path')
          .attr('class', 'link')
          .attr('fill', 'none')
          .attr('stroke', 'skyblue')
          .attr('stroke-width', 1.5)
          .attr("d", function (d) {
            if (d.source.depth == 0) {
              var start = { x: d.source.x, y: d.source.y };
              var end = { x: d.target.x, y: d.target.y + 100 }
            } else {
              var start = { x: d.source.x, y: d.source.y + 100 };
              var end = { x: d.target.x, y: d.target.y + 150 }
            }
            // var start = {x: d.source.x, y: d.source.y};
            // var end = {x: d.target.x, y: d.target.y}
            return link({ source: start, target: end })
          })
      // 边框终点的形状
      // .attr('stroke-linecap',"square")
      //对角线生成器,并旋转90度.这里由于是横向显示，所以把x和y的位置反过来写
      // .attr('d',d3.linkHorizontal().x(d => d.y).y(d => d.x))

      // 自定义节点填充样式
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      const fill = (d) => {
        if (d.depth === 0) return color(d.data.name);
        while (d.depth > 1) {
          d = d.parent;
        }
        // console.log("d.data.name", d.data.name);
        return color(d.data.name);
      };

      //获取node节点
      // console.log(tree.descendants())
      var node = g.selectAll('.node').data(tree.descendants())
      var nodes = tree.descendants()


      //动态计算树的高度/宽度，node.x指的是纵坐标
      let left = tree
      let right = tree
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      })

      //计算树的高度
      const heightTree = right.x - left.x + margin.top + margin.bottom
      const transition = svg.transition()
          .duration(0.5)
          .attr("viewBox", [margin.left, left.x - margin.top, width + margin.left + margin.right, height])

      var nodeEnter = node.enter()
          .append('g')
          .attr('class', 'node')
          .attr("transform", d => `translate(${d.y},${d.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1)
          .attr("cursor", "pointer")
          .attr("pointer-events", "all")


      //绘制节点
      nodeEnter.append("circle")
          .attr("r", 5)
          .attr("fill", d => d.data.childrenTemp ? "red" : "#999")
          .attr("stroke-width", 1)
          .attr('transform', function (d) {
            if (d.depth == 0) {
              return `translate(6,0)`
            } else if (d.depth == 1) {
              return `translate(${d.y + 70 * d.depth},0)`
            } else {
              return `translate(${d.y + 60 * d.depth},0)`
            }
          })
          .on("click", function (event, node) {
            console.log(event)
            let data = event.data
            // console.log(node)
            // console.log(event.data)
            //节点展开状态
            if (data.children) {
              data.childrenTemp = data.children
              data.children = null
            } else {
              //节点折叠状态
              data.children = data.childrenTemp
              data.childrenTemp = null
            }
            that.initTree()
            // d3.select("#mainsvg").select('body').remove();
          });

      nodeEnter.append('rect')
          .attr('transform', function (d) {
            if (d.depth == 0) {
              return `translate(${-(9 * d.data.name.length)},0)`
            }

          })
          .attr("x", function (d) {
            if (d.depth == 0) {
              return d.y - 16;
            }
            else if (d.children) {
              return d.y + d.depth * 24
            }
            else return d.y + 55 * d.depth + 20
          })
          .attr("y", '-0.6em')
          .attr("width", function (d) {
            // console.log(d)
            if (d.depth == 0) {
              return 11 * d.data.name.length
              // return 10*Math.max(d.data.name.length,d.data.pruning_ratio.length)
            }
            return 12 * d.data.name.length + 2
          })
          .attr("height", function (d) {
            if (d.depth == 0) {
              return rectHeight * 2.4
            }
            return rectHeight * 3
          })
          .attr("fill", function (d) {
            return d.children ? "whitesmoke" : '#9fd3c7'
          })
          .style("opacity", 0.6)
          .attr("stroke", function (d) {
            return d.children ? '#248888' : "whitesmoke"
          })
          .attr('stroke-width', 2)
      // .on("mouseover",d=>addVisible(d))
      // .on("mouseout", d=>addVisible(d))

      //进行字体的渲染
      //显示id
      nodeEnter.append('text')
          .attr('font-size', '0.7em')
          // 用三元运算符去判断，它如果有子节点的话，就是true，显示形式就用end，会显示在圆点的左边。这样的话根结点就在左边，子节点在右边。
          .attr('text-anchor', d => d._children ? 'end' : 'start')
          .attr('transform', function (d) {
            if (d.depth == 0) {
              return `translate(${-(10 * d.data.name.length) + 20},0)`
            }
            if (d.children) {
              return `translate(${-(6.5 * d.data.name.length)},0)`
            }
          })
          .attr('x', function (d) {
            if (d.depth == 0) {
              return d.y - 10;
            }
            if (d.children) {
              return d.y - 10 + d.depth * 76
            } else {
              return d.y + 55 * d.depth + 30
            }
          })
          .attr("dy", "0.31em")
          .html(d => "id：" + d.data.id)
          // .text(d=>{
          //   return "name："+d.data.name
          // })
          .style("fill", "blue")
          .on("mouseover", function (d) {
            d3.select(this)
                .style('fill', 'orange')
          })
          .on("mouseout", function () {
            d3.select(this)
                .style('fill', 'blue')
          })
          .on("click", function (event, node) {
            let data = node.data
            // console.log(data)
            //节点展开状态
            if (data.children) {
              data.childrenTemp = data.children
              data.children = null
            } else {
              //节点折叠状态
              data.children = data.childrenTemp
              data.childrenTemp = null
            }
            that.initTree()
          })


      nodeEnter.append('line')
          .attr("x1", d => {
            if (d.depth == 0) {
              return d.y - 12 * d.data.name.length + 5
            }
            return null
          })
          .attr("y1", d => {
            if (d.depth == 0) {
              return d.x + 10
            }
            return null
          })
          .attr("x2", d => {
            if (d.depth == 0) {
              return d.y - 2
            }
            return null
          })
          .attr("y2", d => {
            if (d.depth == 0) {
              return d.x + 10
            }
            return null
          })
          .attr("stroke", "#5a6fc0")
          .attr("stroke-width", "3")
          .attr("opacity", 0.8)


      //显示name
      nodeEnter.append('text')
          .attr('font-size', '0.6em')
          .attr('transform', function (d) {
            if (d.depth == 0) {
              return `translate(${-(12 * d.data.name.length) + 20},22)`
            } else {
              return `translate(${-(d.data.name.length) + 8},12)`
            }
            // if(d.children){
            //   return `translate(${-(6.5*d.data.name.length)},10)`
            // }
          })
          .attr('x', function (d) {
            if (d.depth == 0) {
              return d.y - 10;
            }
            if (d.children) {
              return d.y - 10 + d.depth * 76
            } else {
              return d.y + 55 * d.depth + 30
            }
          })
          .attr("dy", "0.31em")
          // .html(d=>"name："+d.data.name)
          .text(d => {
            return "name：" + d.data.name
          })
          .on("mouseover", function (d) {
            d3.select(this)
                .style('fill', 'orange')
          })
          .on("mouseout", function () {
            d3.select(this)
                .style('fill', 'black')
          })
          .on("click", function (event, node) {
            let data = node.data
            // console.log(data)
            //节点展开状态
            if (data.children) {
              data.childrenTemp = data.children
              data.children = null
            } else {
              //节点折叠状态
              data.children = data.childrenTemp
              data.childrenTemp = null
            }
            that.initTree()
          })

      //显示样本大小
      nodeEnter.append('text')
          .attr('font-size', '0.6em')
          .attr('transform', function (d) {
            if (d.depth == 0) {
              return `translate(${-(7 * d.data.name.length) + 20},22)`
            } else {
              return `translate(${-(d.data.name.length) + 8},22)`
            }
          })
          .attr('x', function (d) {
            if (d.depth == 0) {
              return d.y - 10;
            }
            if (d.children) {
              return d.y - 10 + d.depth * 76
            } else {
              return d.y + 55 * d.depth + 30
            }
          })
          .attr("dy", "0.31em")
          .text(d => {
            if (d.depth == 0) {
              return null
            }
            return "batch_size：" + d.data.batch_size
          })
          .on("mouseover", function (d) {
            d3.select(this)
                .style('fill', 'orange')
          })
          .on("mouseout", function () {
            d3.select(this)
                .style('fill', 'black')
          })
          .on("click", function (event, node) {
            let data = node.data
            // console.log(data)
            //节点展开状态
            if (data.children) {
              data.childrenTemp = data.children
              data.children = null
            } else {
              //节点折叠状态
              data.children = data.childrenTemp
              data.childrenTemp = null
            }
            that.initTree()
          })


      //显示循环次数
      nodeEnter.append('text')
          .attr('font-size', '0.6em')
          .attr('transform', function (d) {
            if (d.depth == 0) {
              return `translate(${-(7 * d.data.name.length) + 20},32)`
            } else {
              return `translate(${-(d.data.name.length) + 8},32)`
            }
            // if(d.children){
            //   return `translate(${-(6.5*d.data.name.length)},10)`
            // }
          })
          .attr('x', function (d) {
            if (d.depth == 0) {
              return d.y - 10;
            }
            if (d.children) {
              return d.y - 10 + d.depth * 76
            } else {
              return d.y + 55 * d.depth + 30
            }
          })
          .attr("dy", "0.31em")
          // .html(d=>"name："+d.data.name)
          .text(d => {
            if (d.depth == 0) {
              return null
            }
            return "epoch：" + d.data.epoch
          })
          .on("mouseover", function (d) {
            d3.select(this)
                .style('fill', 'orange')
          })
          .on("mouseout", function () {
            d3.select(this)
                .style('fill', 'black')
          })
          .on("click", function (event, node) {
            let data = node.data
            // console.log(data)
            //节点展开状态
            if (data.children) {
              data.childrenTemp = data.children
              data.children = null
            } else {
              //节点折叠状态
              data.children = data.childrenTemp
              data.childrenTemp = null
            }
            that.initTree()
          })


      //显示剪枝率
      nodeEnter.append('text')
          .attr('font-size', '0.6em')
          .attr('transform', function (d) {
            if (d.depth == 0) {
              return `translate(${-(7 * d.data.name.length) + 20},42)`
            } else {
              return `translate(${-(d.data.name.length) + 8},42)`
            }
            // if(d.children){
            //   return `translate(${-(6.5*d.data.name.length)},10)`
            // }
          })
          .attr('x', function (d) {
            if (d.depth == 0) {
              return d.y - 10;
            }
            if (d.children) {
              return d.y - 10 + d.depth * 76
            } else {
              return d.y + 55 * d.depth + 30
            }
          })
          .attr("dy", "0.31em")
          // .html(d=>"name："+d.data.name)
          .text(d => {
            if (d.depth == 0) {
              return null
            }
            return "pruning_ratio：" + d.data.pruning_ratio
          })
          .on("mouseover", function (d) {
            d3.select(this)
                .style('fill', 'orange')
          })
          .on("mouseout", function () {
            d3.select(this)
                .style('fill', 'black')
          })
          .on("click", function (event, node) {
            let data = node.data
            // console.log(data)
            //节点展开状态
            if (data.children) {
              data.childrenTemp = data.children
              data.children = null
            } else {
              //节点折叠状态
              data.children = data.childrenTemp
              data.childrenTemp = null
            }
            that.initTree()
          })
    },
    addNode () {
      var that = this
      var arrayObj = { id: this.id, name: "pruning" + this.id, epoch: this.epoch, pruning_ratio: this.pruningRatio, batch_size: this.batchSize }
      var data = this.treeData.children
      data.push(arrayObj)
      // console.log(data.push(arrayObj))
      data["id"] = this.id
      data["name"] = "pruning" + this.id
      data["epoch"] = this.epoch
      data["pruning_ratio"] = this.pruningRatio
      data["batch_size"] = this.batchSize
      // console.log(data)
      that.treeData.children = data
      this.initTree()
      this.epoch = ""
      this.batchSize = ""
      this.pruningRatio = ""
    }
  },


}
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: calc(~'100% - 30px');
  border-left: 2px solid #dddddd;
  border-right: 2px solid #dddddd;
  border-bottom: 2px solid #dddddd;
}
#myInput {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.paramInput {
  flex: 1;
  margin: 10px;
  /* display:flex;
    justify-content: center;
    align-items: center; */
}
.styleInput {
  background-color: #9fd3c7;
  border: none;
  /* flex:0.5; */
  text-align: center;
  font: italic bold 13px Georgia, serif;
}
.paramButtom {
  margin-left: 15%;
  margin-top: 4%;
}
#tree_history {
  /* border:1px solid red; */
  height: 100%;
  width: auto;
  justify-content: center;
  margin: -5px 10px 7px 10px;
  padding: 0px 10px;
}
#mainsvg {
  width: 100%;
  height: 100%;
}
</style>