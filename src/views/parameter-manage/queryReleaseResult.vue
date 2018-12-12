<template>
  <div>
    <el-card style="margin-bottom:10px">
      <el-form :model="formInline" ref="formInline" label-position="top" size="mini">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="机构">
              <el-cascader
                :options="formInline.options"
                :show-all-levels="false"
                placeholder="请选择机构"
              ></el-cascader>
            </el-form-item>        
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="formInline.value1"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="formInline.value1"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="程序版本">
              <el-select v-model="formInline.b" placeholder="请选择程序版本">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>            
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="设备编号">
              <el-select v-model="formInline.b" placeholder="请选择设备编号">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="设备型号">
              <el-select v-model="formInline.b" placeholder="请选择设备型号">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="3" :lg="2" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" @click="onSubmit"
              icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type='warning' icon='el-icon-search' 
              @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-col>         
        </el-row>

      </el-form>
    </el-card>
    
    <el-card>
        <el-table :data="tableData3"
        v-loading="loading"
        element-loading-text="拼命加载中"
        header-row-class-name="tableHeaderClass"
        border>
            <el-table-column
              fixed prop="a" label="设备编号" width="150">
            </el-table-column>
            <el-table-column
              prop="b" label="设备型号" width="120">
            </el-table-column>
            <el-table-column
              prop="c" label="程序版本" width="150">
            </el-table-column>
            <el-table-column
              prop="d" label="推送结果" width="160">
            </el-table-column>
            <el-table-column
              prop="g" label="操作日期" width="160">
            </el-table-column>
            <el-table-column
              prop="l" label="推送更新日期" min-width="150">
            </el-table-column>
        </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        layout="total, prev, pager, next, jumper"
        :total="tableData3.length">
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
// import Sortable from "sortablejs";
export default {
  data() {
    return {
      formInline: {
        value1: "",
        b: "",
        options: []
      },
      currentPage: 5,
      loading:false,
      tableData3: [{
          a: 'N888001112',
          b: 'C10000QDSAA',
          c: 'v_201805031222',
          d: '成功',
          g: '2018-06-28 11:08:00',
          l: '2018-05-16 09:08:00'
        }]
    };
    
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    onSubmit() {
      this.loading = true;
      console.log("submit!");
    },
    resetForm(formName) {
      console.log(formName);
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scope>
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
</style>