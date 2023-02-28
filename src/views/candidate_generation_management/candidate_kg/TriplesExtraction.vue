<template>
  <div style="margin-top: 20px;">
    <el-select v-model="algorithm_value" placeholder="请选择算法">
      <el-option
          v-for="item in algoritm_options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-button type="primary" @click="triples_extraction" style="margin:0px;">开始抽取</el-button>
    <el-button type="primary" plain style="margin:0px;">全部开始</el-button>
    <el-progress :percentage="10" :format="format"></el-progress>
    <el-dialog
        title="抽取结果"
        :visible.sync="dialogVisible"
        width="50%">
      <el-card shadow="always"  class="triples_card_top_half">
        <h4 class="triples_label">抽取结果</h4>
        <el-table
            :data="extract_table"
            style="width: 100%">
          <el-table-column
              prop="head"
              label="头实体"
          >
          </el-table-column>
          <el-table-column
              prop="rel"
              label="关系"
          >
          </el-table-column>
          <el-table-column
              prop="tail"
              label="尾实体"
          >
          </el-table-column>
        </el-table>
      </el-card>
      <el-card shadow="always"  class="triples_card_bottom_half">
        <h4 class="triples_label">三元组预览</h4>
        <div id="triples_show" style="height: 500px;width: auto" ><el-empty description="暂无预览" image="../../static/icon/no_data.png"></el-empty></div>
      </el-card>
    </el-dialog>
    <!--内容预览-->
    <el-dialog title="内容" :visible.sync="contentVisible" top="7vh" width="70%">
      <el-input :rows="20" v-model="content" type="textarea" style="width: 100%" :readonly="read" ></el-input>
    </el-dialog>
    <el-table
        ref="multipleTable"
        :data="unstructuredTextPageList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          label="标题"
          width="400"
          show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.title}}</template>
      </el-table-column>
      <el-table-column
          label="内容">
        <template slot-scope="scope">
          <el-button type="text" @click = "displayContent(scope.row.content)">查看</el-button></template>
      </el-table-column>
      <el-table-column
          label="类型">
        <template slot-scope="scope">{{ scope.row.type}}</template>
      </el-table-column>
      <el-table-column
          label="状态"
          show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.status}}</template>
      </el-table-column>
      <el-table-column
          label="创建时间"
          width="120"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.create_time!=null">{{timeProcess(scope.row.create_time)}}</span>
          <span v-if="scope.row.create_time==null">暂无</span>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看抽取结果" placement="top-start">
            <el-button type="primary" plain icon="el-icon-zoom-in" @click="dialogVisible=true"></el-button>
          </el-tooltip>
          <el-button type="success" plain @click="triples_extraction(scope.row.content)">测试抽取</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="unstructuredTextHandleSizeChange"
        @current-change="unstructuredTextHandleCurrentChange"
        :current-page="unstructuredTextCurrentPage"
        :page-sizes="unstructuredTextPageSizes"
        :page-size="unstructuredTextPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="unstructuredTextTotal">
    </el-pagination>
  </div>
</template>
<style>
.triples_label{
  margin: 0px;
}
.triples_card{
  margin-top: 10px;
  margin-bottom: 10px;
}
.triples_card_top_half{
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
}
.triples_card_bottom_half{
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
.triples_result{
  word-break: normal;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
</style>
<script>
  import * as echarts from 'echarts';
  export default {
    data() {
      return {
        //加载
        loading:false,
        activeName: 'first',
        fileList: [],
        //三元组抽取数据
        extract_data:"唐纳德·特朗普(Donald Trump，1946年6月14日-)，出生于美国纽约，祖籍德国巴伐利亚自由州，德裔美国共和党籍政治家、企业家、房地产商人、电视人，第45任美国总统(2017年1月20日-2021年1月20日)。特朗普于1968年获得宾夕法尼亚大学沃顿商学院经济学学士学位，随后任职于父亲弗雷德·特朗普的房地产公司。",
        extract_table:[],
        dialogVisible:false,
        //非结构文本分页
        unstructuredTextPageList: [],
        unstructuredTextCurrentPage: 1,
        unstructuredTextTotal: 1,
        unstructuredTextPageSize: 10,
        unstructuredTextPageSizes: [10, 50, 100, 200],
        //查看内容
        contentVisible:false,
        content:"",
      };
    },
    methods: {
      handleSuccess(){
        this.$refs.upload.clearFiles()
        this.$message({
          message: '上传成功',
          type:'success'
        })
      },
      handleError() {
        this.$message({
          message: '上传失败',
          type:'error'
        })
      },
      handleBeforeUpload(file) {
        const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        const fileTypeList = ['txt']
        if (!fileTypeList.includes(fileType)) {
          this.$message({
            message: '上传文件只能是txt格式',
            type: 'error'
          })
          this.fileList = []
          return false
        }
        return true
      },
      // 上传文件数超过限制
      handleExceed() {
        this.$message({
          message: '最大上传文件个数为1',
          type: 'error'
        })
      },
      // 文件状态改变时
      handleChange(file) {
        console.log(file.status)
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },    
      open() {
        this.$confirm('已选中的数据将生成候选数据集！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '成功生成候选数据集!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      },
      open1() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '抽取完成！'),
          type: 'success'
        })
      },
      open2() {
        this.$prompt('请输入保存路径', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '抽取结果已保存至目标路径: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });       
        });
      },
      open3() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '读取完成！'),
          type: 'success'
        })
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      // 三元组抽取
      triples_extraction(content){
        // let content = this.extract_data;
        //如果为空，提示triples_extraction
        // if(content==""){
        //   this.$message({
        //     type: 'warning',
        //     message: '请输入信息'
        //   });
        // }
        // else{
        this.loading = true
        //axios请求
        axios.post('/pythonApi/triple_extraction',{
          // data: this.extract_data,
          data: content,
        })
        .then((response)=>{
          if (response.status == 200) {
            this.$message({
              type: 'success',
              message: '抽取成功!'
            });
            let arr = response.data.data;
            this.loading=false;
            //赋值给表格
            this.extract_table= arr;
            //设置文本高亮
            // this.setHeightKeyWord(arr)
            this.show_triples(arr);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //三元组展示
      show_triples(arr){
        var chartDom = document.getElementById('triples_show');
        var myChart = echarts.init(chartDom);
        myChart.hideLoading();
        var webkitDep = this.genrateData(arr);
        var option = {
          legend: {
            x: 'left',//图例位置
            //图例的名称
            //此处的数据必须和关系网类别中name相对应
            data: webkitDep.categories.map(function (a) {
              return a.name;
            })
          },
          series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 20,
            // animation: false,
            label: {
              normal: {
                show:true,
                position: 'right'
              }
            },
            //展示边数据
            edgeLabel: {
              normal: {
                show: true,
                formatter: function (x) {
                  return x.data.name;
                }
              }
            },
            draggable: true,
            force: {
              layoutAnimation:true,
              // xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
              // yAxisIndex : 0, //y轴坐标
              gravity:0.03,  //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
              edgeLength: 55,  //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
              repulsion: 150  //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
            },
            data: webkitDep.nodes.map(function (node, idx) {  //node数据
              node.id = idx;
              return node;
            }),
            categories: webkitDep.categories,  //关系网类别，可以写多组
            edges: webkitDep.links  //link数据
          }]
        };
        myChart.setOption(option);
      },
      //生成三元组展示图所需数据
      genrateData(arr){
        var data = {};
        var map=new Map;
        data['categories'] = [{name: "实体"}];
        var nodes = [];
        var links= [];
        var counter = 0;
        for(var i=0;i<arr.length;i++){
            //已有该实体
            if(!map.has(arr[i].head)){
              map.set(arr[i].head,counter);
              var new_node1 = {};
              new_node1.name = arr[i].head;
              new_node1.category = 0;
              new_node1.id = counter;
              counter+=1;
              nodes.push(new_node1);
            }
            //已有该实体,不需增加新的节点
            if(!map.has(arr[i].tail)) {
              map.set(arr[i].tail, counter);
              var new_node2 = {};
              new_node2.name = arr[i].tail;
              new_node2.category = 0;
              new_node2.id = counter;
              counter += 1;
              nodes.push(new_node2);
            }
        }
        for(var i=0;i<arr.length;i++){
            var link = {};
            link.source = map.get(arr[i].head);
            link.name = arr[i].rel;
            link.target = map.get(arr[i].tail);
            links.push(link)
        }
        data['nodes'] = nodes;
        data['links'] = links;
        console.log(data);
        return data;
      },
      //编辑进度条的
      format(percentage) {
        return percentage === 100 ? '抽取完成' : `${percentage}%`;
      },
      //处理候选三元组分页事件
      unstructuredTextHandleSizeChange(val) {
        //修改当前分页大小
        this.unstructuredTextPageSize = val;
        //重新请求数据
        this.get_unstructured_text(this.unstructuredTextCurrentPage,val)
      },
      //翻页动作
      unstructuredTextHandleCurrentChange(val) {
        this.get_unstructured_text(val,this.unstructuredTextPageSize)
      },
      //向后端请求存储的非结构文本数据
      get_unstructured_text(num, limit) {
        //axios请求
        axios.request({
          method:"POST",
          url:'/api/unstructure/getAllTextByPage',
          params:{page:num,limit:limit}
        })
        .then((response) => {
          if (response.status == 200) {
            //修改数据
            this.unstructuredTextPageList = response.data.data
            this.unstructuredTextTotal = response.data.count
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //显示内容详情
      displayContent(content){
        this.contentVisible = true;
        this.content = content;
      },
      timeProcess(time){
        var res = "";
        for(var i=0;i<3;i++){
          res+=time[i];
          if(i<2){
            res+="-";
          }
        }
        return res;
      }
    },
    mounted() {
      this.get_unstructured_text(this.unstructuredTextCurrentPage,this.unstructuredTextPageSize);
    }
  }
</script>
<style>
  .comment{
      white-space:pre-wrap;
  }
</style>