export interface FormItemProps {
  device_id?: number;
  room_id?: number;
  room_name?: string;
  parent_id?: number;
  parent_device_name?: string;
  device_barcode?: string;
  device_name?: string;
  device_type_id?: number;
  device_type_name?: string;
  device_type_code?: string;
  brand?: string;
  floors?: number;
  rows?: number;
  columns?: number;
  ref_run_temperature?: number;
  ref_run_speed?: number;
  ref_run_duration?: number;
  current_run_temperature?: string;
  current_run_speed?: number;
  current_run_duration?: number;
  is_shelf?: number;
  is_store?: number;
  status?: number;
  sort?: number;
  device_no?: string;
  device_model?: string;
  centrifuge_type_id?: string;
  centrifuge_type_name?: string;
  transfer_types?: string;
  create_by?: number;
  created_at?: string;
  update_by?: number;
  updated_at?: string;
  FridgeFloors?: Array<any>;
}

export interface DeviceTypeOption {
  device_type_code: string;
  device_type_id: number;
  device_type_name: string;
}

