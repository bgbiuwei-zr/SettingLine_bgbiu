# Less 样式指南

## 🎨 项目已成功接入Less处理插件

### ✅ 完成的配置

1. **安装依赖**: `less` 包已安装
2. **Vite配置**: 配置了Less预处理器选项
3. **全局变量**: 创建了 `src/styles/variables.less` 全局变量文件
4. **文件迁移**: 所有CSS文件已转换为Less格式

### 📁 项目结构

```
src/
├── styles/
│   └── variables.less      # 全局变量定义
├── components/
│   ├── Button.tsx          # 示例组件
│   └── Button.less         # 组件样式
├── App.less               # 主组件样式
├── index.less             # 全局样式
└── ...
```

### 🚀 Less功能特性

#### 1. 变量 (Variables)
```less
// 在 variables.less 中定义
@primary-color: #646cff;
@spacing-lg: 2rem;

// 在其他文件中使用
.card {
  padding: @spacing-lg;
  color: @primary-color;
}
```

#### 2. 嵌套 (Nesting)
```less
.logo {
  height: 6em;
  
  &:hover {
    filter: drop-shadow(0 0 2em fade(@primary-color, 67%));
  }
  
  &.react:hover {
    filter: drop-shadow(0 0 2em fade(@secondary-color, 67%));
  }
}
```

#### 3. 混合 (Mixins)
```less
.button-variant(@color; @bg-color; @border-color) {
  color: @color;
  background-color: @bg-color;
  border-color: @border-color;

  &:hover {
    background-color: lighten(@bg-color, 10%);
  }
}

.custom-btn--primary {
  .button-variant(white; @primary-color; @primary-color);
}
```

#### 4. 函数 (Functions)
- `lighten()` - 变亮颜色
- `darken()` - 变暗颜色
- `fade()` - 调整透明度
- `saturate()` - 调整饱和度

### 🛠️ 使用方式

#### 创建新的Less文件
```less
// components/MyComponent.less
.my-component {
  padding: @spacing-md;
  background: @primary-color;
  
  &__title {
    font-size: @font-size-xl;
    color: white;
  }
  
  &--large {
    padding: @spacing-lg;
  }
}
```

#### 在组件中引入
```tsx
import './MyComponent.less';

const MyComponent = () => {
  return (
    <div className="my-component my-component--large">
      <h2 className="my-component__title">标题</h2>
    </div>
  );
};
```

### 📝 全局变量列表

#### 颜色变量
- `@primary-color` - 主要颜色
- `@success-color` - 成功颜色
- `@warning-color` - 警告颜色
- `@error-color` - 错误颜色

#### 尺寸变量
- `@spacing-xs` - 0.5rem
- `@spacing-sm` - 1rem
- `@spacing-md` - 1.5rem
- `@spacing-lg` - 2rem
- `@spacing-xl` - 3rem

#### 其他变量
- `@border-radius-base` - 基础圆角
- `@transition-base` - 基础过渡时间
- `@font-size-base` - 基础字体大小

### 🎯 最佳实践

1. **使用全局变量**: 保持设计一致性
2. **合理嵌套**: 避免过深的嵌套层级
3. **组件化样式**: 每个组件对应一个Less文件
4. **使用混合**: 复用常见的样式模式
5. **响应式设计**: 利用Less的媒体查询嵌套

### 🔧 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run lint` - 代码检查

现在你可以享受Less带来的强大样式编写体验了！🎉