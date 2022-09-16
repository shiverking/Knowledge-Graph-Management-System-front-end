<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" type="card" style="margin-top: 20px;">
    <el-tab-pane label="手动添加" name="first">
        <el-input
        type="textarea"
        :rows="5"
        placeholder="格式要求：(实体1，实体1类型，实体2，实体2类型，关系)，预测项设为UNKNOWN"
        v-model="textarea">
        </el-input>
        <div>
          <el-steps :active="active" align-center finish-status="success" style="margin-top: 20px;">
            <el-step title="格式检测"></el-step>
            <el-step title="链接预测"></el-step>
            <el-step title="置信度检测"></el-step>
            <el-step title="插入图数据库"></el-step>
          </el-steps>
          <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
        </div>
        <div id="pageFormContent"
          style="margin-top: 20px; max-height: 500px;height: 500px;overflow-y: auto; border-style: solid;background: #304156; border: 1px solid #2e2e2e; color:#dbdbdb;">
          <div id="spider-message" class="profile_title" style="padding-left: 5px" v-html="hello"></div>
        </div>
    </el-tab-pane>
    <el-tab-pane label="文件导入" name="second">
        <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
        <p style="margin-top: 10px;"><font size="3">格式要求：(实体1，实体1类型，实体2，实体2类型，关系)，预测项设为UNKNOWN，只接受.txt/.csv文件</font></p>
        <div>
          <el-steps :active="active" align-center finish-status="success" style="margin-top: 20px;">
            <el-step title="格式检测" description=""></el-step>
            <el-step title="链接预测"></el-step>
            <el-step title="置信度检测"></el-step>
            <el-step title="插入图数据库"></el-step>
          </el-steps>
          <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
        </div>
        <div id="pageFormContent"
          style="margin-top: 20px; max-height: 500px;height: 500px;overflow-y: auto; border-style: solid;background: #304156; border: 1px solid #2e2e2e; color:#dbdbdb;">
          <div id="spider-message" class="profile_title" style="padding-left: 5px" v-html="hello"></div>
        </div>
    </el-tab-pane>
    <el-tab-pane label="数据库导入" name="third">
        <el-select v-model="value1" multiple placeholder="选择数据库">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-select
            v-model="value2"
            multiple
            collapse-tags
            style="margin-left: 20px;"
            placeholder="选择表">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-button style="margin-left: 20px;">读取待预测数据</el-button> 
        <div>
          <el-steps :active="active" align-center finish-status="success" style="margin-top: 20px;">
            <el-step title="格式检测"></el-step>
            <el-step title="链接预测"></el-step>
            <el-step title="置信度检测"></el-step>
            <el-step title="插入图数据库"></el-step>
          </el-steps>
          <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
        </div>
        <div id="pageFormContent"
          style="margin-top: 20px; max-height: 500px;height: 500px;overflow-y: auto; border-style: solid;background: #304156; border: 1px solid #2e2e2e; color:#dbdbdb;">
          <div id="spider-message" class="profile_title" style="padding-left: 5px" v-html="hello"></div>
        </div>
    </el-tab-pane>
  </el-tabs>
</template>
// <script>
//   export default {
//     data() {
//       return {
//         activeName: 'second'
//       };
//     },
//     methods: {
//       handleClick(tab, event) {
//         console.log(tab, event);
//       }
//     }
//   };
// </script>
<script>
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },

    methods: {
      next() {
        if (this.active++ > 2) this.active = 0;
      }
    }
  }
</script>