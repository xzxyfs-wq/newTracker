<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import projectApi from "@/api/projectManagement";

defineOptions({
  name: "SlotForm"
});

const props = withDefaults(
  defineProps<{
    formInline?: {
      slot_id?: number;
      slot_no?: string;
      slot_type?: number | string;
      format?: string;
      generate_count?: number;
    };
    projectId?: number;
    isEdit?: boolean;
  }>(),
  {
    isEdit: false
  }
);

const formRef = ref();
// 生成方式：batch-批量生成，manual-手动输入
const generateMode = ref<"batch" | "manual">("batch");
const formInline = reactive({
  slot_no: "",
  slot_type: -1,
  format: "",
  generate_count: 1
});

// 编号类型选项
const slotTypeOptions = ref<Array<{ label: string; value: number | string }>>(
  []
);

// 加载编号类型字典
async function loadSlotTypeDict() {
  try {
    const response = await projectApi.getSlotTypeDict();
    if (response?.success && response?.data) {
      slotTypeOptions.value = response.data.map((item: any) => ({
        label: item.dictLabel,
        value: Number(item.dictValue)
      }));
    }
  } catch (error) {
    console.error("加载编号类型字典失败:", error);
  }
}

// 初始化表单数据
onMounted(() => {
  loadSlotTypeDict();
  
  if (props.formInline) {
    Object.assign(formInline, {
      slot_no: props.formInline.slot_no ?? "",
      slot_type: props.formInline.slot_type ?? -1,
      format: props.formInline.format ?? "",
      generate_count: props.formInline.generate_count ?? 1
    });
    // 编辑模式下，如果有 slot_no 但没有 format，则认为是手动输入
    if (props.isEdit && props.formInline.slot_no && !props.formInline.format) {
      generateMode.value = "manual";
    }
  }
});

// 动态验证规则
const rules = computed(() => {
  const baseRules: any = {
    slot_type: [
      { required: true, message: "请选择编号类型", trigger: "change" }
    ]
  };

  if (generateMode.value === "batch") {
    // 批量生成模式：需要格式和数量
    baseRules.format = [
      { required: true, message: "请输入编号格式", trigger: "blur" }
    ];
    baseRules.generate_count = [
      { required: true, message: "请输入生成数量", trigger: "blur" },
      { type: "number", min: 1, message: "生成数量必须大于0", trigger: "blur" }
    ];
  } else {
    // 手动输入模式：需要编号
    baseRules.slot_no = [
      { required: true, message: "请输入受试者编号", trigger: "blur" }
    ];
  }

  return baseRules;
});

function getRef() {
  return formRef.value;
}

function getFormData() {
  return formInline;
}

function getGenerateMode() {
  return generateMode.value;
}

defineExpose({
  getRef,
  getFormData,
  formInline,
  getGenerateMode,
  generateMode
});
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="95px">
    <el-tabs v-model="generateMode">
      <el-tab-pane label="批量生成" name="batch" />
      <el-tab-pane label="手动输入" name="manual" />
    </el-tabs>
    <el-form-item label="编号类型" prop="slot_type">
      <el-radio-group v-model="formInline.slot_type">
        <el-radio
          v-for="item in slotTypeOptions"
          :key="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 批量生成模式 -->
    <template v-if="generateMode === 'batch'">
      <el-form-item label="编号格式" prop="format">
        <el-input
          v-model="formInline.format"
          placeholder="请输入编号格式，如：RZH###（#表示数字占位符）"
          clearable
          style="width: 100%"
        />
        <div class="text-gray-400 text-xs mt-1">
          格式说明：使用 # 表示数字占位符，例如 RZH### 表示 RZH001, RZH002 等
        </div>
      </el-form-item>
      <el-form-item label="生成数量" prop="generate_count">
        <el-input-number
          v-model="formInline.generate_count"
          :min="1"
          placeholder="请输入生成数量"
          style="width: 100%"
        />
      </el-form-item>
    </template>
    <!-- 手动输入模式 -->
    <template v-else>
      <el-form-item label="受试者编号" prop="slot_no">
        <el-input
          v-model="formInline.slot_no"
          placeholder="请输入受试者编号，如：RZH001"
          clearable
          style="width: 100%"
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<style lang="scss" scoped></style>

