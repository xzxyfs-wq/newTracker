<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { message } from "@/utils/message";
import type { FormItemProps, DeviceTypeOption } from "../utils/types";

defineOptions({
  name: "DeviceForm"
});

const props = withDefaults(
  defineProps<{
    formInline?: FormItemProps;
    deviceTypeOptions?: DeviceTypeOption[];
    roomOptions?: Array<{ room_id: number; room_name: string }>;
    centrifugeTypeOptions?: Array<{ dictValue: string; dictLabel: string }>;
    transferTypeOptions?: Array<{ dictValue: string; dictLabel: string }>;
  }>(),
  {
    centrifugeTypeOptions: () => [],
    transferTypeOptions: () => [],
    deviceTypeOptions: () => [],
    roomOptions: () => []
  }
);

const formRef = ref();
const formInline = reactive<FormItemProps>({
  device_id: undefined,
  device_name: "",
  device_barcode: "",
  device_type_id: undefined,
  device_type_code: "",
  room_id: undefined,
  device_model: "",
  device_no: "",
  brand: "",
  sort: 1, // 默认值为1
  status: 1,
  // 离心机相关字段
  centrifuge_type_id: undefined,
  centrifuge_type_name: "",
  // 冰箱相关字段
  ref_run_temperature: undefined,
  transfer_types: [] as any,
  // 盒子相关字段
  rows: undefined,
  columns: undefined
});

// 计算当前选择的设备类型代码
const currentDeviceTypeCode = computed(() => {
  if (!formInline.device_type_id || !props.deviceTypeOptions) return "";
  const deviceType = props.deviceTypeOptions.find(
    item => item.device_type_id === formInline.device_type_id
  );
  return deviceType?.device_type_code || "";
});

// 判断是否为离心机
const isCentrifuge = computed(
  () => currentDeviceTypeCode.value === "centrifuge"
);

// 判断是否为冰箱
const isFridge = computed(() => currentDeviceTypeCode.value === "fridge");

// 判断是否为盒子
const isBox = computed(() => currentDeviceTypeCode.value === "box");

// 优化监听：只监听 formInline 引用变化，避免深度监听
watch(
  () => props.formInline,
  newVal => {
    if (newVal) {
      formInline.device_id = newVal.device_id ?? undefined;
      formInline.device_name = newVal.device_name ?? "";
      formInline.device_barcode = newVal.device_barcode ?? "";
      formInline.device_type_id = newVal.device_type_id ?? undefined;
      formInline.device_type_code = newVal.device_type_code ?? "";
      formInline.room_id = newVal.room_id ?? undefined;
      formInline.device_model = newVal.device_model ?? "";
      formInline.device_no = newVal.device_no ?? "";
      formInline.brand = newVal.brand ?? "";
      // 新增时默认为1，编辑时使用原有值（如果为0或undefined则设为1）
      formInline.sort = newVal.sort && newVal.sort > 0 ? newVal.sort : 1;
      formInline.status = newVal.status ?? 1;
      // 离心机相关字段
      formInline.centrifuge_type_id = newVal.centrifuge_type_id ?? undefined;
      formInline.centrifuge_type_name = newVal.centrifuge_type_name ?? "";
      // 冰箱相关字段
      formInline.ref_run_temperature = newVal.ref_run_temperature ?? undefined;
      // 将逗号分隔的字符串转换为数组
      if (newVal.transfer_types) {
        (formInline as any).transfer_types =
          typeof newVal.transfer_types === "string"
            ? newVal.transfer_types
                .split(",")
                .filter((item: string) => item.trim() !== "")
            : Array.isArray(newVal.transfer_types)
              ? newVal.transfer_types
              : [];
      } else {
        (formInline as any).transfer_types = [];
      }
      // 盒子相关字段
      formInline.rows = newVal.rows ?? undefined;
      formInline.columns = newVal.columns ?? undefined;
    }
  },
  { immediate: true }
);

// 监听设备类型变化，更新设备类型代码
watch(
  () => formInline.device_type_id,
  newVal => {
    if (newVal && props.deviceTypeOptions) {
      const deviceType = props.deviceTypeOptions.find(
        item => item.device_type_id === newVal
      );
      if (deviceType) {
        formInline.device_type_code = deviceType.device_type_code;
      }
    } else {
      formInline.device_type_code = "";
    }
  }
);

// 验证规则：设备编码在新增时不显示，编辑时只读，所以都不需要验证
const rules = reactive({
  device_name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
  device_type_id: [
    { required: true, message: "请选择设备类型", trigger: "change" }
  ],
  room_id: [{ required: true, message: "请选择所在房间", trigger: "change" }]
});

function getRef() {
  return formRef.value;
}

defineExpose({ getRef, formInline });
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="100px">
    <el-form-item label="设备名称" prop="device_name">
      <el-input
        v-model="formInline.device_name"
        placeholder="请输入设备名称"
        clearable
      />
    </el-form-item>
    <!-- 设备编码：新增时不显示，编辑时只读 -->
    <el-form-item
      v-if="formInline.device_id"
      label="设备编码"
      prop="device_barcode"
    >
      <el-input
        v-model="formInline.device_barcode"
        placeholder="设备编码"
        disabled
      />
    </el-form-item>
    <el-form-item label="设备类型" prop="device_type_id">
      <el-select
        v-model="formInline.device_type_id"
        placeholder="请选择设备类型"
        clearable
        style="width: 100%"
      >
        <el-option
          v-for="item in deviceTypeOptions"
          :key="item.device_type_id"
          :label="item.device_type_name"
          :value="item.device_type_id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="所在房间" prop="room_id">
      <el-select
        v-model="formInline.room_id"
        placeholder="请选择所在房间"
        clearable
        style="width: 100%"
      >
        <el-option
          v-for="item in roomOptions"
          :key="item.room_id"
          :label="item.room_name"
          :value="item.room_id"
        />
      </el-select>
    </el-form-item>

    <!-- 所有设备类型都显示的字段：品牌 -->
    <el-form-item label="品牌" prop="brand">
      <el-input v-model="formInline.brand" placeholder="请输入品牌" clearable />
    </el-form-item>

    <!-- 离心机类型字段：离心机类型、仪器编码、设备型号 -->
    <template v-if="isCentrifuge">
      <el-form-item label="离心机类型" prop="centrifuge_type_id">
        <el-select
          v-model="formInline.centrifuge_type_id"
          placeholder="请选择离心机类型"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in centrifugeTypeOptions || []"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="仪器编码" prop="device_no">
        <el-input
          v-model="formInline.device_no"
          placeholder="请输入仪器编码"
          clearable
        />
      </el-form-item>
      <el-form-item label="设备型号" prop="device_model">
        <el-input
          v-model="formInline.device_model"
          placeholder="请输入设备型号"
          clearable
        />
      </el-form-item>
    </template>

    <!-- 冰箱类型字段：温度、仪器编码、设备型号、试管类型 -->
    <template v-if="isFridge">
      <el-form-item label="温度" prop="ref_run_temperature">
        <el-input-number
          v-model="formInline.ref_run_temperature"
          placeholder="请输入温度"
          :precision="2"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="仪器编码" prop="device_no">
        <el-input
          v-model="formInline.device_no"
          placeholder="请输入仪器编码"
          clearable
        />
      </el-form-item>
      <el-form-item label="设备型号" prop="device_model">
        <el-input
          v-model="formInline.device_model"
          placeholder="请输入设备型号"
          clearable
        />
      </el-form-item>
      <el-form-item label="试管类型" prop="transfer_types">
        <el-select
          v-model="formInline.transfer_types"
          placeholder="请选择试管类型"
          multiple
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in transferTypeOptions || []"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
    </template>

    <!-- 盒子类型字段：行、列 -->
    <template v-if="isBox">
      <el-form-item label="行" prop="rows">
        <el-input-number
          v-model="formInline.rows"
          placeholder="请输入行数"
          :min="1"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="列" prop="columns">
        <el-input-number
          v-model="formInline.columns"
          placeholder="请输入列数"
          :min="1"
          style="width: 100%"
        />
      </el-form-item>
    </template>

    <!-- 其他设备类型显示通用字段 -->
    <template v-if="!isCentrifuge && !isFridge && !isBox">
      <el-form-item label="设备型号" prop="device_model">
        <el-input
          v-model="formInline.device_model"
          placeholder="请输入设备型号"
          clearable
        />
      </el-form-item>
      <el-form-item label="设备编号" prop="device_no">
        <el-input
          v-model="formInline.device_no"
          placeholder="请输入设备编号"
          clearable
        />
      </el-form-item>
    </template>
    <el-form-item label="排序" prop="sort">
      <el-input-number
        v-model="formInline.sort"
        :min="1"
        placeholder="请输入排序"
        style="width: 100%"
      />
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
