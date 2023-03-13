<template>
  <div >
    图片上传
    <el-upload
        class="upload-demo"
        action
        list-type="picture"
        :show-file-list="false"
        :on-preview="handlePreview"
        :on-remove="handleRemove"

        :on-change="handleChange"
        multiple
        :limit="3"

        :file-list="fileList"
        :auto-upload="false">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <div style = "height: 100px;border-radius: 2px">
      <div v-for=" in fileList" :key="fil" style="width: 20%;" >
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple">
            <el-image
                style="width: 50px; height: 50px"
                :src="fil.url"
                :preview-src-list="urls"
            >
            </el-image>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light">
            <span style='padding:0px 10px'>{{fil.name}}</span>
          </div></el-col>
        </el-row>


      </div>
<!--      <el-image-->
<!--          v-for="fil in fileList"-->
<!--          style="width: 200px; height: 200px"-->
<!--          :src="fil.url"-->
<!--          :preview-src-list="urls"-->
<!--        >-->
<!--      </el-image>-->
    </div>
    文本上传
    <el-upload
        class="upload-demo"
        action
        list-type="text"
        :show-file-list="false"
        :on-preview="handlePreview"
        :on-remove="handleRemove"

        :on-change="handleChange2"
        multiple
        :limit="3"

        :file-list="fileList"
        :auto-upload="false">
      <el-button size="small" type="primary">点击上传</el-button>
<!--      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>
    <el-table
        :data="tableData"
        border
        style="width: 95%">
      <el-table-column
          prop="txt"
          label="非结构化数据"
          width="800">
      </el-table-column>
    </el-table>
    音视频上传
    <el-upload
        class="upload-demo"
        action

        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-change="handleChange3"
        multiple
        :limit="3"
        :file-list="fileList"
        :auto-upload="false">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip"></div>
    </el-upload>
    <video ref="videoPlayer" controls :src=localUrl width="320" height="240">
    </video>


  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTime:null,
      urls: [],
      localUrl:null,
      videoFlag:true,
      authProgress:1,
      fileList: [],
      tableData:[
        {
          txt:null,
        },
      ]
    };
  },
  methods: {

    updateTime(e){
      this.currentTime = e.target.currentTime
    },
    uploadFile(file) {
      this.fileList.push(file.file);//取到选取的文件
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleChange(file, fileList) {
      const _this =this
      this.fileList=fileList
        //把文件给data里的fileList
      console.log(this.fileList)
      for (let i = this.fileList.length;i>0;i--){
        _this.urls.push(_this.fileList[i-1].url)
      }

    },
    async handleChange2(file, fileList) {
      const _this = this
      let reader = new FileReader();
      reader.readAsText(file.raw, "UTF-8");// 如果出现乱码，可以更换编码
      if (typeof FileReader === "undefined") {
        alert("你的浏览器不支持");
        return;
      }
      reader.onload = function(e) {
        console.log(_this.tableData)
        _this.tableData[0].txt=e.target.result// [0317/205939.060:ERROR:crash_reporter_win.cc(92)] Unable to get pipe name for crashpad
      };
    },
    async handleChange3(file,filelist) {
      this.authProgress = 0
      this.videoFlag = false
      // 视频文件上传前的验证
      // console.log(file.size / 1024 / 1024)
      const isLt1G = file.raw.size / 1024 / 1024 < 1024;
      // if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.raw.type) == -
      //   1) {
      //   this.$message.error('请上传正确的视频格式');
      //   return false;
      // }
      if (!isLt1G) {
        this.$message.error('上传视频大小不能超过1G哦!');
        return false;
      }

      // 获取上传视频的本地localUrl
      var localUrl = null;
      console.log(window.webkitURL)
      if (window.createObjectURL != undefined) {
        // basic
        localUrl = window.createObjectURL(file.raw);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        localUrl = window.URL.createObjectURL(file.raw);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        localUrl = window.webkitURL.createObjectURL(file.raw);
      }
      // 转换后的地址为 blob:http://xxx/7bf54338-74bb-47b9-9a7f-7a7093c716b5
      this.localUrl=localUrl
      }

    }
  }

</script>

<style scoped>

</style>