import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ClothingType } from '../types';
import { Camera, X, Check, RotateCcw, Image as ImageIcon, Zap } from 'lucide-react';

interface CameraViewProps {
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onClose }) => {
  const { addClothingItem, currentUser } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState<ClothingType | null>(null);
  const [mode, setMode] = useState<'select' | 'camera' | 'preview'>('select');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 初始化摄像头
  useEffect(() => {
    if (mode === 'camera') {
      initializeCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode]);

  const initializeCamera = async () => {
    try {
      setError(null);
      
      // 检查浏览器是否支持 getUserMedia
      const mediaDevices = navigator.mediaDevices;
      if (!mediaDevices || !mediaDevices.getUserMedia) {
        setError('您的浏览器不支持摄像头功能，请更新浏览器或使用 HTTPS 连接');
        console.error('getUserMedia 不可用');
        return;
      }

      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      };
      
      const stream = await mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(err => {
          setError('摄像头启动失败，请检查权限设置');
          console.error('视频播放失败:', err);
        });
      }
    } catch (err) {
      let errorMsg = '无法访问摄像头，请检查权限设置';
      if (err instanceof Error) {
        errorMsg = err.message;
        if (err.name === 'NotAllowedError') {
          errorMsg = '摄像头权限被拒绝，请在设置中允许摄像头访问';
        } else if (err.name === 'NotFoundError') {
          errorMsg = '未找到摄像头设备';
        } else if (err.name === 'NotReadableError') {
          errorMsg = '摄像头被占用，请关闭其他应用';
        }
      }
      setError(errorMsg);
      console.error('摄像头初始化失败:', err);
    }
  };

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMode('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const photoData = canvasRef.current.toDataURL('image/jpeg', 0.9);
        setImage(photoData);
        setMode('preview');
        
        // 停止摄像头
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      }
    }
  };

  const handleSave = () => {
    if (!image) {
      setError('No image selected');
      return;
    }
    
    if (!type) {
      setError('请选择服装类型');
      return;
    }

    if (!currentUser || !currentUser.id) {
      setError('用户信息不可用');
      console.error('currentUser:', currentUser);
      return;
    }

    try {
      addClothingItem({
        id: crypto.randomUUID(),
        type,
        imageUrl: image,
        userId: currentUser.id,
        season: ['spring', 'summer', 'autumn', 'winter'], // Default to all seasons
      });
      
      // 保存成功后关闭视图
      setImage(null);
      setType(null);
      setMode('select');
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '保存项目失败';
      setError(`保存失败: ${errorMsg}`);
      console.error('保存服饰项目失败:', err);
    }
  };

  const handleBackToMode = () => {
    setImage(null);
    setType(null);
    setMode('select');
  };

  const clothingTypes: { value: ClothingType; label: string }[] = [
    { value: 'top', label: '上衣' },
    { value: 'bottom', label: '下装' },
    { value: 'outerwear', label: '外套' },
    { value: 'shoes', label: '鞋子' },
    { value: 'hat', label: '帽子' },
    { value: 'accessory', label: '配饰' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
      >
        <X size={24} />
      </button>

      {/* 模式一：选择拍照或相册 */}
      {mode === 'select' && !image && (
        <div className="flex flex-col items-center justify-center gap-8 text-white w-full h-full p-6">
          {error && (
            <div className="absolute top-20 left-4 right-4 bg-red-600 text-white p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">⚠️ {error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-xs underline text-white/80"
              >
                Dismiss
              </button>
            </div>
          )}
          
          <div className="text-center space-y-2">
            <Camera size={64} className="mx-auto text-slate-500 mb-4" />
            <h2 className="text-2xl font-bold">添加新服饰</h2>
            <p className="text-slate-400 max-w-xs mx-auto">拍照或从相册选择来为你的衣柜添加项目。</p>
          </div>
          
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {/* 拍照按钮 */}
            <button
              onClick={() => {
                setError(null);
                setMode('camera');
              }}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={20} />
              <span>拍照</span>
            </button>
            
            {/* 相册按钮 */}
            <label className="flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-semibold transition-colors shadow-lg cursor-pointer">
              <ImageIcon size={20} />
              <span>从相册选择</span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleCapture}
                className="hidden" 
              />
            </label>
          </div>
        </div>
      )}

      {/* 模式二：摄像头预览 */}
      {mode === 'camera' && (
        <div className="relative w-full h-full flex flex-col bg-black">
          {error && (
            <div className="absolute top-20 left-4 right-4 bg-red-600 text-white p-4 rounded-lg z-20">
              <p>{error}</p>
              <button 
                onClick={() => setMode('select')}
                className="mt-2 text-sm underline"
              >
                Back to Gallery
              </button>
            </div>
          )}
          
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* 摄像头控制工具栏 */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-6 flex justify-center gap-4">
            <button 
              onClick={() => setMode('select')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleTakePhoto}
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              <div className="w-12 h-12 bg-white rounded-full" />
            </button>
          </div>
        </div>
      )}

      {/* 模式三：预览和确认 */}
      {mode === 'preview' && image && (
        <div className="relative w-full h-full flex flex-col bg-slate-900">
          {error && (
            <div className="absolute top-4 left-4 right-4 bg-red-600 text-white p-4 rounded-lg z-20 text-sm">
              <p className="font-semibold">{error}</p>
            </div>
          )}
          
          <img src={image} alt="Captured" className="flex-1 object-contain w-full h-full" />
          
          {/* Type Selection Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-6 rounded-t-3xl backdrop-blur-md max-h-[50vh] overflow-y-auto">
            {!type ? (
              <div className="space-y-4">
                <h3 className="text-white text-lg font-bold text-center mb-4">这是什么类型的项目？</h3>
                <div className="grid grid-cols-3 gap-3">
                  {clothingTypes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => {
                        setType(t.value);
                        setError(null); // 清除错误
                      }}
                      className="bg-slate-800 text-slate-200 py-3 rounded-xl hover:bg-slate-700 transition-colors text-sm font-medium border border-slate-700"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <button 
                    onClick={handleBackToMode}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>重拍</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-white">
                  <span className="text-slate-400">选择的类型：</span>
                  <span className="font-bold capitalize bg-slate-800 px-3 py-1 rounded-full">{type}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      setType(null);
                      setError(null); // 清除错误
                    }}
                    className="bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
                  >
                    返回
                  </button>
                  <button 
                    onClick={handleSave}
                    className="bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                  >
                    <Check size={18} />
                    <span>保存项目</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
