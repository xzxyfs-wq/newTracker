<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useConfig } from "./utils/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import type { FormRules } from "element-plus";
import { dictApi } from "@/api/system";

import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import AddFill from "~icons/ri/add-circle-line";
import AddLine from "~icons/ri/add-line";
import Close from "~icons/ep/close";
import SaveLine from "~icons/ri/save-line";
import InfoFilled from "~icons/ep/info-filled";
defineOptions({
  name: "SystemConfig"
});

const {
  loading,
  groupList,
  currentGroup,
  configList,
  configForm,
  configFormRef,
  addForm,
  addFormRef,
  selectGroup,
  saveConfigForm,
  handleAddConfig,
  handleEditConfig,
  handleDeleteConfig,
  openDialog,
  getConfigOptions,
  handleAddGroup,
  handleDeleteGroup,
  dictTypeList,
  loadConfigOptions,
  formDictOptions,
  loadingFormDictOptions,
  loadFormDictOptions
} = useConfig();

// 添加配置项表单的字典选项
const addFormDictOptions = ref<Array<{ label: string; value: any }>>([]);
const loadingDictOptions = ref(false);

// 加载字典选项的函数
async function loadAddFormDictOptions(dictType?: string) {
  const targetDictType =
    dictType ||
    (typeof addForm.extend === "string"
      ? addForm.extend
      : addForm.extend?.dict_type_code);
  if (targetDictType && addForm.input_type === "select") {
    loadingDictOptions.value = true;
    try {
      const res = await dictApi.getDictByType({
        dict_type_code: targetDictType
      });
      if (res?.success) {
        const data = Array.isArray(res.data) ? res.data : [];
        addFormDictOptions.value = data.map((item: any) => ({
          label: item.dict_label || item.label,
          value: item.dict_value || item.value
        }));
      } else {
        addFormDictOptions.value = [];
      }
    } catch (error) {
      console.error(`获取字典数据失败 (${targetDictType}):`, error);
      addFormDictOptions.value = [];
    } finally {
      loadingDictOptions.value = false;
    }
  } else {
    addFormDictOptions.value = [];
  }
}
</script>

<template>
  <div class="config-container">
    <el-row :gutter="5" class="config-row">
      <!-- 左侧：组标签和配置表单 -->
      <el-col :span="14" class="config-left gap-2">
        <!-- 上方：组标签 -->
        <div class="group-tags-container flex items-start gap-1">
          <div class="flex-1 flex flex-wrap gap-1">
            <el-tag
              v-for="group in groupList"
              :key="group.config_group_id"
              :type="
                currentGroup?.config_group_id === group.config_group_id
                  ? 'primary'
                  : 'info'
              "
              :effect="
                currentGroup?.config_group_id === group.config_group_id
                  ? 'dark'
                  : 'plain'
              "
              class="group-tag"
              closable
              @click="selectGroup(group)"
              @close="handleDeleteGroup(group.config_group_name, $event)"
            >
              {{ group.config_group_name }}
            </el-tag>
            <el-tag
              v-if="groupList.length === 0"
              type="info"
              effect="plain"
              class="group-tag"
            >
              暂无配置组
            </el-tag>
          </div>
          <div
            class="group-tags-header cursor-pointer rounded-full bg-primary text-white p-1"
            @click="handleAddGroup"
          >
            <AddLine />
          </div>
          <div class="group-tags-content"></div>
        </div>

        <!-- 下方：配置项表单 -->
        <div class="config-form-container">
          <div v-if="currentGroup" class="config-form-content">
            <el-form
              v-if="configList.length > 0"
              ref="configFormRef"
              :model="configForm"
              label-width="120px"
              class="config-form"
            >
              <el-form-item
                v-for="item in configList"
                :key="item.config_id"
                :label="item.config_name"
                :prop="item.config_key"
              >
                <template #label>
                  {{ item.config_name }}
                  <div
                    class="flex items-center gap-1 ml-1"
                    style="height: 32px"
                  >
                    <el-tooltip :content="item.config_key" placement="top">
                      <InfoFilled
                        style="vertical-align: middle; flex-shrink: 0"
                      />
                    </el-tooltip>
                  </div>
                </template>
                <div class="form-item-wrapper">
                  <!-- Select 类型 -->
                  <el-select
                    v-if="item.input_type === 'select'"
                    v-model="configForm[item.config_key]"
                    :placeholder="`请选择${item.config_name}`"
                    :multiple="item.is_multiple"
                    style="flex: 1"
                  >
                    <el-option
                      v-for="opt in item.options || []"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                  <!-- Input 多行类型 -->
                  <el-input
                    v-else-if="item.input_type === 'input' && item.is_multiline"
                    v-model="configForm[item.config_key]"
                    type="textarea"
                    :rows="3"
                    :placeholder="`请输入${item.config_name}`"
                    style="flex: 1"
                  />
                  <!-- Input 单行类型 -->
                  <el-input
                    v-else
                    v-model="configForm[item.config_key]"
                    :placeholder="`请输入${item.config_name}`"
                    style="flex: 1"
                  />
                  <div class="form-item-actions">
                    <EditPen
                      style="vertical-align: middle; flex-shrink: 0"
                      class="cursor-pointer"
                      @click="handleEditConfig(item)"
                    />
                    <el-popconfirm
                      :title="`是否确认删除配置项${item.config_name}？`"
                      @confirm="handleDeleteConfig(item)"
                    >
                      <template #reference>
                        <el-link type="danger" :icon="useRenderIcon(Delete)">
                        </el-link>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
                <div
                  v-if="item.remark || item.description"
                  class="form-item-desc"
                >
                  {{ item.remark || item.description }}
                </div>
              </el-form-item>
            </el-form>
            <el-empty v-else description="该组暂无配置项" :image-size="100" />
            <div class="flex justify-end mt-2 w-full mx-auto">
              <el-button
                type="primary"
                :icon="useRenderIcon(SaveLine)"
                :loading="loading"
                @click="saveConfigForm"
              >
                提交
              </el-button>
            </div>
          </div>
          <div v-else class="config-form-empty">
            <el-empty description="请先选择配置组" :image-size="100" />
          </div>
        </div>
      </el-col>

      <!-- 右侧：添加配置项表单 -->
      <el-col :span="10" class="config-right">
        <div class="add-form-container">
          <div class="add-form-header">
            <span class="header-title">添加配置项</span>
          </div>
          <div class="add-form-content">
            <el-form
              ref="addFormRef"
              :model="addForm"
              :rules="formRules"
              label-width="100px"
              class="add-form"
            >
              <el-form-item label="所属组" prop="config_group_id">
                <el-select
                  v-model="addForm.config_group_id"
                  placeholder="请选择所属组"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="group in groupList"
                    :key="group.config_group_id"
                    :label="group.config_group_name"
                    :value="group.config_group_id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="配置标题" prop="config_name">
                <el-input
                  v-model="addForm.config_name"
                  placeholder="请输入配置标题"
                  clearable
                />
              </el-form-item>

              <el-form-item label="配置标识" prop="config_key">
                <el-input
                  v-model="addForm.config_key"
                  placeholder="请输入配置标识（唯一）"
                  clearable
                />
              </el-form-item>

              <el-form-item label="配置值" prop="config_value">
                <!-- Input 单行类型 -->
                <el-input
                  v-if="addForm.input_type === 'input' && !addForm.is_multiline"
                  v-model="addForm.config_value"
                  placeholder="请输入配置值"
                  clearable
                />
                <!-- Input 多行类型 -->
                <el-input
                  v-else-if="
                    addForm.input_type === 'input' && addForm.is_multiline
                  "
                  v-model="addForm.config_value"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入配置值"
                  clearable
                />
                <!-- Select 类型：下拉框 -->
                <el-select
                  v-else-if="addForm.input_type === 'select'"
                  v-model="addForm.config_value"
                  :placeholder="`请选择${addForm.config_name || '配置值'}`"
                  :multiple="addForm.is_multiple"
                  clearable
                  style="width: 100%"
                  :loading="loadingDictOptions"
                >
                  <el-option
                    v-for="opt in addFormDictOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="组件类型" prop="input_type">
                <el-select
                  v-model="addForm.input_type"
                  placeholder="请选择组件类型"
                  style="width: 100%"
                >
                  <el-option label="输入框" value="input" />
                  <el-option label="下拉选择" value="select" />
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="addForm.input_type === 'input'"
                label="是否多行"
              >
                <el-radio-group v-model="addForm.is_multiline">
                  <el-radio :value="true">是</el-radio>
                  <el-radio :value="false">否</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                v-if="addForm.input_type === 'select'"
                label="字典类型"
                prop="extend"
                :rules="[
                  {
                    required: true,
                    message: '字典类型为必填项',
                    trigger: 'change'
                  }
                ]"
              >
                <el-select
                  v-model="addForm.extend"
                  placeholder="请选择字典类型"
                  clearable
                  style="width: 100%"
                  @change="loadAddFormDictOptions"
                >
                  <el-option
                    v-for="dict in dictTypeList"
                    :key="dict.dict_type_id"
                    :label="dict.dict_type_name"
                    :value="dict.dict_type_code"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="addForm.input_type === 'select'"
                label="是否多选"
              >
                <el-radio-group v-model="addForm.is_multiple">
                  <el-radio :value="true">是</el-radio>
                  <el-radio :value="false">否</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="配置说明">
                <el-input
                  v-model="addForm.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入配置说明"
                />
              </el-form-item>

              <el-form-item label-width="0">
                <el-button
                  type="primary"
                  :icon="useRenderIcon(AddFill)"
                  :loading="loading"
                  @click="handleAddConfig"
                  style="width: 80%; margin: 0 auto"
                >
                  添加配置项
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.config-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.config-row {
  flex: 1;
  min-height: 0;
}

.config-left {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.group-tags-container {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  padding: 16px;
  flex-shrink: 0;

  .group-tags-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
  }

  .group-tags-content {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .group-tag {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

.config-form-container {
  flex: 1;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  .config-form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;

    .header-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--el-text-color-primary);
    }
  }

  .config-form-content {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .config-form-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .config-form {
    overflow-y: auto;
    :deep(.el-form-item__label) {
      height: auto;
    }
    .form-item-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      .form-item-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
    }

    .form-item-desc {
      margin-top: 4px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

.config-right {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.add-form-container {
  height: 100%;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  .add-form-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;

    .header-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--el-text-color-primary);
    }
  }

  .add-form-content {
    flex: 1;
    overflow: auto;
  }
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}
</style>
