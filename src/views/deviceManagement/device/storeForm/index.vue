<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "StoreForm"
});

const props = defineProps<{
  formInline?: {
    device_id?: number;
    device_name?: string;
    parent_id?: number;
    floors?: number;
    rows?: number;
    columns?: number;
  };
  isEdit?: boolean;
  floorList?: Array<{ device_id: number; device_name: string; floors: number }>;
}>();

const formRef = ref();
const formInline = reactive({
  device_id: undefined,
  device_name: "",
  parent_id: undefined,
  floors: undefined,
  rows: undefined,
  columns: undefined
});

// 监听 props 变化，更新表单数据
watch(
  () => props.formInline,
  newVal => {
    if (newVal) {
      Object.assign(formInline, {
        device_id: newVal.device_id ?? undefined,
        device_name: newVal.device_name ?? "",
        parent_id: newVal.parent_id ?? undefined,
        floors: newVal.floors ?? undefined,
        rows: newVal.rows ?? undefined,
        columns: newVal.columns ?? undefined
      });
    }
  },
  { immediate: true, deep: true }
);

// 编辑时只需要储位名称，新增时需要更多字段
const rules = computed(() => {
  if (props.isEdit) {
    return {
      device_name: [
        { required: true, message: "请输入储位名称", trigger: "blur" }
      ]
    };
  } else {
    // 根据 store.vue 的逻辑：parent_id 和 floors 互斥，至少需要一个
    const baseRules: any = {
      rows: [{ required: true, message: "请输入行数", trigger: "blur" }],
      columns: [{ required: true, message: "请输入列数", trigger: "blur" }]
    };

    // 如果选择了层，则不需要验证 floors
    // 如果没有选择层，则需要验证 floors（但这里我们简化，只验证必填项）
    return baseRules;
  }
});

// 监听层选择变化，清除层数字段
watch(
  () => formInline.parent_id,
  newVal => {
    if (newVal && newVal > 0) {
      formInline.floors = undefined;
    }
  }
);

// 监听层数输入变化，清除层选择
watch(
  () => formInline.floors,
  newVal => {
    if (newVal && newVal > 0) {
      formInline.parent_id = undefined;
    }
  }
);

function getRef() {
  return formRef.value;
}

defineExpose({ getRef, formInline });
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="100px">
    <!-- 编辑时只显示储位名称 -->
    <template v-if="isEdit">
      <el-form-item label="储位名称" prop="device_name">
        <el-input
          v-model="formInline.device_name"
          placeholder="请输入储位名称"
          clearable
        />
      </el-form-item>
    </template>
    <!-- 新增时显示快速创建字段 -->
    <template v-else>
      <el-form-item
        label="冰箱层"
        prop="parent_id"
        :rules="[
          {
            validator: (rule, value, callback) => {
              if (!formInline.parent_id && !formInline.floors) {
                callback(new Error('请选择冰箱层或输入层数'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ]"
      >
        <el-select
          v-model="formInline.parent_id"
          :disabled="formInline.floors && formInline.floors > 0"
          placeholder="请选择冰箱层"
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in floorList || []"
            :key="item.device_id"
            :label="item.device_name"
            :value="item.device_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="层数"
        prop="floors"
        :rules="[
          {
            validator: (rule, value, callback) => {
              if (!formInline.parent_id && !formInline.floors) {
                callback(new Error('请选择冰箱层或输入层数'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]"
      >
        <el-input-number
          v-model="formInline.floors"
          :disabled="formInline.parent_id && formInline.parent_id > 0"
          :min="1"
          placeholder="请输入层数（创建新层时使用）"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="行数" prop="rows">
        <el-input-number
          v-model="formInline.rows"
          :min="1"
          placeholder="请输入行数"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="列数" prop="columns">
        <el-input-number
          v-model="formInline.columns"
          :min="1"
          placeholder="请输入列数"
          style="width: 100%"
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<style lang="scss" scoped></style>
