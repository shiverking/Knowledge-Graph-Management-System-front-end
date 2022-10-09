<template>
  <el-card class="box-card">
  <h3>版本设置</h3>
  <el-form ref="form" :model="sizeForm" label-width="auto" size="medium" style="margin-top: 10px">
    <el-form-item label="修改主版本名称">
      <el-input v-model="sizeForm.name"></el-input>
    </el-form-item>
    <el-form-item label="版本更新周期">
      <el-select v-model="sizeForm.region" placeholder="请选择三元组数量">
        <el-option label="5000" value="shanghai"></el-option>
        <el-option label="10000" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="默认预览模式">
      <el-checkbox-group v-model="sizeForm.type">
        <el-checkbox-button label="只节点" name="type"></el-checkbox-button>
        <el-checkbox-button label="只文字" name="type"></el-checkbox-button>
        <el-checkbox-button label="节点和文字" name="type"></el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="系统主题">
      <el-radio-group v-model="sizeForm.resource" size="medium">
        <el-radio border label="黑色"></el-radio>
        <el-radio border label="白色"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item size="large">
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </el-form-item>
  </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      sizeForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
};
</script>

<style scoped>

</style>