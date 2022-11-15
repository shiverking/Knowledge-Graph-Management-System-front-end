<template>
  <div class="gContainer">
    <!-- <d3graph /> -->
<!--    <gSearch @getData="update" class="gSearch"/>-->
    <d3graph
      :data="data"
      :names="names"
      :labels="labels"
      :linkTypes="linkTypes"
    />
  </div>
</template>
<style>
</style>
<script>
import d3graph from '@/components/d3graph.vue'
import json from "../../data/records.json";
export default {
  name: 'twoDView',
  components: {
    d3graph
  },
  data () {
    return {
      // d3jsonParser()处理 json 后返回的结果
      data: {
        nodes: [],
        links: []
      },
      names: ['企业', '贸易类型', '地区', '国家'],
      labels: ['Enterprise', 'Type', 'Region', 'Country'],
      linkTypes: ['', 'type', 'locate', 'export'],
    }
  },
  methods: {
    /*eslint-disable*/
    // 解析json数据，主要负责数据的去重、标准化.
    d3jsonParser (json) {
      const nodes =[]
      const links = [] // 存放节点和关系
      const nodeSet = [] // 存放去重后nodes的id

      for (let item of json) {
        for (let segment of item.p.segments) {
          // 重新更改data格式
          if (nodeSet.indexOf(segment.start.identity) == -1) {
            nodeSet.push(segment.start.identity)
            nodes.push({
              id: segment.start.identity,
              label: segment.start.labels[0],
              properties: segment.start.properties
            })
          }
          if (nodeSet.indexOf(segment.end.identity) == -1) {
            nodeSet.push(segment.end.identity)
            nodes.push({
              id: segment.end.identity,
              label: segment.end.labels[0],
              properties: segment.end.properties
            })
          }
          links.push({
            source: segment.relationship.start,
            target: segment.relationship.end,
            type: segment.relationship.type,
            properties: segment.relationship.properties
          })
        }
      }
      return { nodes, links }
    }
  },
  created() {
      var json = require('../../data/records.json')
      this.data = this.d3jsonParser(json)
  }
}
</script>

<style lang="scss" scoped>
.gContainer {
  height: inherit;
  position: relative;
  //border: 2px #000 solid;
  background-color: #effaff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
