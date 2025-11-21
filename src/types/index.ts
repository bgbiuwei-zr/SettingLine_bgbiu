// 按钮类型
export type ButtonType = 'end' | 'start' | 'foot' | 'general' | 'delete';

// 图标标记类型
export interface IconMarker {
  id: string;
  x: number; // 相对于图片的x坐标（百分比）
  y: number; // 相对于图片的y坐标（百分比）
  type: ButtonType;
  color: string;
}

// 按钮配置类型
export interface ButtonConfig {
  color: string;
  label: string;
}

// 图片信息类型
export interface ImageInfo {
  src: string;
  width: number;
  height: number;
  file?: File;
}