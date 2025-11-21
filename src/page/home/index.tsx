import React, { useState, useRef, useCallback, useMemo } from 'react';
import CircleIcon from '../../components/CircleIcon';
import ImageMarker from '../../components/ImageMarker';
import ConfirmDialog from '../../components/ConfirmDialog';
import { ButtonType, IconMarker, ImageInfo, ButtonConfig } from '../../types';
import './index.less';

const Home: React.FC = () => {
  const [activeButton, setActiveButton] = useState<ButtonType>('start');
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [markers, setMarkers] = useState<IconMarker[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 按钮配置 - 使用useMemo优化
  const buttonConfig: Record<ButtonType, ButtonConfig> = useMemo(() => ({
    start: { color: '#3b9b4a', label: '起步点' },
    foot: { color: '#e4df3e', label: '脚点' },
    general: { color: '#3e50e4', label: '通用点' },
    end: { color: '#9e66b1', label: '结束点' },
    delete: { color: '#cd3838', label: '清除' },
  }), []);

  // 图片上传处理
  const handleImageUpload = useCallback((file: File) => {
    // 文件大小检查 (10MB限制)
    if (file.size > 10 * 1024 * 1024) {
      setError('图片文件大小不能超过10MB');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 图片尺寸检查
        if (img.naturalWidth < 100 || img.naturalHeight < 100) {
          setError('图片尺寸太小，最小尺寸为100x100像素');
          setIsLoading(false);
          return;
        }

        setImageInfo({
          src: e.target?.result as string,
          width: img.naturalWidth,
          height: img.naturalHeight,
          file
        });
        setMarkers([]); // 清空之前的标记
        setActiveButton('start'); // 重置为第一个按钮高亮
        setIsLoading(false);
        console.log('kkl', '图片上传成功', { width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        setError('图片加载失败，请检查文件格式');
        setIsLoading(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('文件读取失败');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  // 文件选择处理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('请选择有效的图片文件');
        return;
      }
      handleImageUpload(file);
    }
    // 清空input值，允许重复选择同一文件
    e.target.value = '';
  };

  // 按钮点击处理
  const handleButtonClick = (buttonType: ButtonType) => {
    if (!imageInfo) return; // 无图时不响应

    if (buttonType === 'delete') {
      // 清除按钮特殊逻辑
      if (markers.length > 0) {
        setShowConfirmDialog(true);
      }
    } else {
      setActiveButton(buttonType);
      console.log('kkl', `切换到${buttonConfig[buttonType].label}`);
    }
  };

  // 图片点击处理 - 只处理空白区域点击
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageInfo || !imageRef.current) return;

    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    
    // 计算图片的实际显示尺寸（考虑object-fit: contain的影响）
    const imgNaturalRatio = imageInfo.width / imageInfo.height;
    const containerRatio = rect.width / rect.height;
    
    let actualWidth, actualHeight, offsetX, offsetY;
    
    if (imgNaturalRatio > containerRatio) {
      // 图片更宽，以容器宽度为准
      actualWidth = rect.width;
      actualHeight = rect.width / imgNaturalRatio;
      offsetX = 0;
      offsetY = (rect.height - actualHeight) / 2;
    } else {
      // 图片更高，以容器高度为准
      actualWidth = rect.height * imgNaturalRatio;
      actualHeight = rect.height;
      offsetX = (rect.width - actualWidth) / 2;
      offsetY = 0;
    }
    
    // 计算相对于实际图片显示区域的坐标
    const clickX = e.clientX - rect.left - offsetX;
    const clickY = e.clientY - rect.top - offsetY;
    
    // 检查是否在实际图片区域内
    if (clickX < 0 || clickX > actualWidth || clickY < 0 || clickY > actualHeight) {
      return; // 点击在图片外的空白区域，不处理
    }
    
    // 转换为百分比坐标
    const x = (clickX / actualWidth) * 100;
    const y = (clickY / actualHeight) * 100;

    // 防抖处理，避免快速点击
    const now = Date.now();
    const lastTime = (window as typeof window & { lastClickTime?: number }).lastClickTime;
    if (lastTime && now - lastTime < 200) {
      return;
    }
    (window as typeof window & { lastClickTime?: number }).lastClickTime = now;

    // 只在空白区域添加新标记（ImageMarker会阻止事件冒泡）
    const newMarker: IconMarker = {
      id: `marker_${Date.now()}_${Math.random()}`,
      x,
      y,
      type: activeButton,
      color: buttonConfig[activeButton].color
    };
    setMarkers(prevMarkers => [...prevMarkers, newMarker]);
    console.log('kkl', '添加标记', newMarker);
  }, [imageInfo, activeButton, buttonConfig]);

  // 标记点击处理 - 处理同色清除/异色替换
  const handleMarkerClick = useCallback((clickedMarker: IconMarker) => {
    if (clickedMarker.type === activeButton) {
      // 同色 - 清除标记
      setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== clickedMarker.id));
      console.log('kkl', '清除同色标记', clickedMarker);
    } else {
      // 不同色 - 替换标记
      const newMarker: IconMarker = {
        id: `marker_${Date.now()}_${Math.random()}`,
        x: clickedMarker.x,
        y: clickedMarker.y,
        type: activeButton,
        color: buttonConfig[activeButton].color
      };
      setMarkers(prevMarkers => 
        prevMarkers.map(marker => 
          marker.id === clickedMarker.id ? newMarker : marker
        )
      );
      console.log('kkl', '替换标记', { 原标记: clickedMarker, 新标记: newMarker });
    }
  }, [activeButton, buttonConfig]);

  // 确认清除所有标记
  const handleConfirmDeleteAll = () => {
    setMarkers([]);
    setShowConfirmDialog(false);
    console.log('kkl', '清除所有标记');
  };

  // 保存图片
  const handleSaveImage = useCallback(() => {
    if (!imageInfo || !imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // 绘制原图
      ctx.drawImage(img, 0, 0);
      
      // 绘制标记
      markers.forEach(marker => {
        const markerX = (marker.x / 100) * canvas.width;
        const markerY = (marker.y / 100) * canvas.height;
        const radius = Math.min(canvas.width, canvas.height) * 0.02; // 2%的半径
        
        // 绘制外圆
        ctx.beginPath();
        ctx.arc(markerX, markerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = marker.color;
        ctx.lineWidth = radius * 0.3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        ctx.stroke();
        
        // 绘制内圆
        ctx.beginPath();
        ctx.arc(markerX, markerY, radius * 0.6, 0, 2 * Math.PI);
        ctx.fillStyle = marker.color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      
      // 下载图片
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `marked_image_${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          console.log('kkl', '图片保存完成');
        }
      }, 'image/png');
    };
    img.src = imageInfo.src;
  }, [imageInfo, markers]);

  // 重新上传
  const handleReupload = () => {
    fileInputRef.current?.click();
  };

  const hasImage = !!imageInfo;

  return (
    <div className="home-page">
      {/* 页面头部 */}
      <header className="home-header">
        <div className="home-header__left">
          <button 
            className="header-button" 
            onClick={handleReupload}
            disabled={!hasImage}
          >
            重新上传
          </button>
        </div>
        <div className="home-header__brand">
          <h1>SettingLine_0。o</h1>
        </div>
        <div className="home-header__right">
          <button 
            className="header-button header-button--save" 
            onClick={handleSaveImage}
            disabled={!hasImage || markers.length === 0}
          >
            保存
          </button>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="home-main">
        <div className="content-area">
          {isLoading ? (
            // 加载状态
            <div className="loading-area">
              <div className="loading-spinner"></div>
              <p>正在加载图片...</p>
            </div>
          ) : error ? (
            // 错误状态
            <div className="error-area">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>{error}</p>
              <button 
                className="retry-button" 
                onClick={() => {
                  setError('');
                  fileInputRef.current?.click();
                }}
              >
                重新选择
              </button>
            </div>
          ) : !hasImage ? (
            // 无图状态 - 上传区域
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-area__content">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>点击上传图片</p>
                <span>支持 JPG、PNG、GIF 格式，最大10MB</span>
              </div>
            </div>
          ) : (
            // 有图状态 - 图片展示区域
            <div className="image-container">
                <div className="image-container-inner">
                    <img
                        ref={imageRef}
                        src={imageInfo.src}
                        alt="标记图片"
                        className="main-image"
                        onClick={handleImageClick}
                        onError={() => setError('图片显示失败')}
                    />
                    {markers.map(marker => (
                        <ImageMarker
                        key={marker.id}
                        marker={marker}
                        onClick={handleMarkerClick}
                        />
                    ))}
                </div>
            </div>
          )}
        </div>
      </main>

      {/* 页面底部 - 按钮组 */}
      <footer className="home-footer">
        <div className="footer-buttons">
          {(Object.keys(buttonConfig) as ButtonType[]).map((buttonType) => (
            <CircleIcon
              key={buttonType}
              color={buttonConfig[buttonType].color}
              isActive={buttonType === 'delete' ? true : activeButton === buttonType}
              onClick={() => handleButtonClick(buttonType)}
              label={buttonConfig[buttonType].label}
              disabled={!hasImage}
              isDeleteButton={buttonType === 'delete'}
            />
          ))}
        </div>
      </footer>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* 确认清除对话框 */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="确认清除"
        message="确定要移除所有标记吗？此操作无法撤销。"
        onConfirm={handleConfirmDeleteAll}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
};

export default Home;