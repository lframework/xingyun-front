<template>
  <div v-permission="['system:dept:query']" class="app-container">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card>
          <el-button v-permission="['system:dept:add']" type="primary" icon="el-icon-plus" @click="$refs.addDialog.openDialog()">新增</el-button>
          <el-button icon="el-icon-refresh" @click="getDeptTrees">刷新</el-button>
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button>
              操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="allOpen">展开所有</el-dropdown-item>
              <el-dropdown-item command="allFold">折叠所有</el-dropdown-item>
              <el-dropdown-item command="allCheck">全选</el-dropdown-item>
              <el-dropdown-item command="allUnCheck">取消全选</el-dropdown-item>
              <el-dropdown-item command="reserveCheck">反选</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown v-permission="['system:dept:modify']" trigger="click" @command="handleCommand">
            <el-button>
              更多<i class="el-icon-more el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="batchEnable"><i class="el-icon-check" />批量启用</el-dropdown-item>
              <el-dropdown-item command="batchUnable"><i class="el-icon-s-release" />批量停用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-switch
            v-model="showAllDepts"
            style="margin-left: 10px;"
            active-text="显示全部部门"
            inactive-text="只显示启用部门"
            inactive-color="#13ce66"
            @change="showChange"
          />
          <div class="tree-container">
            <el-tree
              ref="tree"
              v-loading="loading"
              class="tree"
              :data="treeData"
              show-checkbox
              node-key="id"
              :props="{
                children: 'children',
                label: 'name'
              }"
              :expand-on-click-node="false"
              :highlight-current="true"
              :check-strictly="false"
              :indent="0"
              style="margin-top: 10px;"
              @current-change="currentChange"
            >
              <span slot-scope="{ node, data }">
                <span v-if="data.available">
                  {{ node.label }}
                </span>
                <span v-else style="color: #F56C6C;">
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <modify v-if="!$utils.isEmpty(id)" :id="id" ref="updateDialog" @confirm="e => {id = '';getDeptTrees()}" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="getDeptTrees" />
  </div>
</template>

<script>
import Add from './add'
import Modify from './modify'

export default {
  name: 'Dept',
  components: {
    Add, Modify
  },
  data() {
    return {
      loading: false,
      // 部门树形数据
      treeData: [],
      // 部门数据
      depts: [],
      // 是否显示停用的部门
      showAllDepts: false,
      id: ''
    }
  },
  created() {
    this.getDeptTrees()
  },
  methods: {
    getDeptTrees() {
      this.loading = true
      this.id = ''
      this.$api.system.dept.trees().then(res => {
        if (!this.$utils.isEmpty(res)) {
          this.depts = res

          let treeData = res
          if (!this.showAllDepts) {
            treeData = treeData.filter(item => item.available)
          }

          this.treeData = this.$utils.toArrayTree(treeData, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })
        } else {
          this.treeData = []
          this.depts = []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleCommand(command) {
      if (command === 'batchEnable') {
        this.batchEnable()
      } else if (command === 'batchUnable') {
        this.batchUnable()
      } else if (command === 'allOpen') {
        for (let i = 0; i < this.treeData.length; i++) {
          this.$refs.tree.store.nodesMap[this.treeData[i].id].expanded = true
        }
      } else if (command === 'allFold') {
        for (let i = 0; i < this.treeData.length; i++) {
          this.$refs.tree.store.nodesMap[this.treeData[i].id].expanded = false
        }
      } else if (command === 'allCheck') {
        this.$refs.tree.setCheckedNodes(this.treeData)
      } else if (command === 'allUnCheck') {
        this.$refs.tree.setCheckedNodes([])
      } else if (command === 'reserveCheck') {
        const refs = this.$refs.tree

        const nodes = refs.getCheckedNodes(true, true)

        this.treeData.forEach(element => {
          refs.setChecked(element, true, true)
        })

        nodes.forEach(node => {
          refs.setChecked(node, false, true)
        })
      }
    },
    batchUnable() {
      const records = this.$refs.tree.getCheckedNodes()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要停用的部门！')
        return
      }

      this.$msg.confirm('是否确定停用选择的部门及其下级部门？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.system.dept.batchUnable(ids).then(data => {
          this.$msg.success('停用成功！')
          this.getDeptTrees()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    batchEnable() {
      const records = this.$refs.tree.getCheckedNodes()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要启用的部门！')
        return
      }

      this.$msg.confirm('是否确定启用选择的部门及其下级部门？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.system.dept.batchEnable(ids).then(data => {
          this.$msg.success('启用成功！')
          this.getDeptTrees()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    showChange(val) {
      let treeData = this.depts
      if (!val) {
        treeData = treeData.filter(item => item.available)
      }
      this.treeData = this.$utils.toArrayTree(treeData)
    },
    // 选中的部门发生改变
    currentChange(data) {
      this.id = ''
      this.$nextTick(() => {
        this.id = data.id
      })
    }
  }
}
</script>
<style scoped>
.tree-container {
  overflow: hidden;
}
.tree /deep/ .el-tree-node {
  position: relative;
  padding-left: 0 ;
}

.tree /deep/ .el-tree-node__children {
  padding-left: 16px;
}

.tree /deep/ .el-tree-node :last-child:before {
  height: 12px;
}

.tree /deep/ .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree-container /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree /deep/ .el-tree-node:before {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
  border-left: 1px dashed #DCDFE6;
  bottom: 0px;
  height: 100%;
  top: 0px;
  width: 1px;
}

.tree /deep/ .el-tree-node:after {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
  border-top: 1px dashed #DCDFE6;
  height: 20px;
  top:12px;
  width: 10px ;
}
</style>
