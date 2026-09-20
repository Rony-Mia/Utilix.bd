import React, { useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  Plus,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { formatBytesBengali, toBanglaDigits } from '../../lib/imageMergerUtils.ts';

export interface ImageSortableItem {
  id: string;
  file: File;
  dataUrl: string;
  imgElement: HTMLImageElement;
  rotation: number;
  name: string;
  sizeBytes: number;
  width: number;
  height: number;
}

interface ImageSortableGridProps {
  items: ImageSortableItem[];
  onUpload: (files: File[]) => void;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onClearAll: () => void;
  isLoading?: boolean;
}

export const ImageSortableGrid: React.FC<ImageSortableGridProps> = ({
  items,
  onUpload,
  onRemove,
  onRotate,
  onReorder,
  onClearAll,
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (
        file.type.startsWith('image/') ||
        /\.(png|jpe?g|webp|bmp|gif|tiff?)$/i.test(file.name)
      ) {
        validFiles.push(file);
      }
    }
    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  };

  const handleDropArea = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOverArea = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeaveArea = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  // Drag-and-Drop Reordering handlers
  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // For Firefox compatibility
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleItemDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorder(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleItemDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      />

      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOverArea}
        onDragLeave={handleDragLeaveArea}
        onDrop={handleDropArea}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDraggingOver
            ? 'border-[#0c5c3d] bg-[#0c5c3d]/10'
            : 'border-[#d8cfb8] bg-[#fffdf7] hover:border-[#0c5c3d]/60 hover:bg-[#f4efe4]/50'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 bg-[#0c5c3d] text-[#fffdf7] mx-auto flex items-center justify-center shadow-sm">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-sm sm:text-base text-[#083f2a]">
              ছবি নির্বাচন করুন অথবা এখানে টেনে এনে ছেড়ে দিন
            </h3>
            <p className="text-xs text-[#6b6255]">
              একাধিক ছবি একসাথে নির্বাচন করা যাবে • PNG, JPG, JPEG, WEBP অনুমোদিত
            </p>
          </div>

          <div className="pt-1">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#0c5c3d] text-[#fffdf7] text-xs font-medium hover:bg-[#083f2a] transition-colors">
              <Plus className="w-3.5 h-3.5" />
              <span>ছবি যোগ করুন</span>
            </span>
          </div>
        </div>
      </div>

      {/* List Header & Actions (if items exist) */}
      {items.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-b border-[#d8cfb8]">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-[#0c5c3d]/10 text-[#083f2a] px-2 py-0.5 border border-[#0c5c3d]/20">
              মোট {toBanglaDigits(items.length)}টি ছবি
            </span>
            <span className="text-xs text-[#6b6255] hidden sm:inline">
              (মাউস দিয়ে টেনে বা বাটন চেপে ছবির ক্রম সাজান)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs border border-[#d8cfb8] bg-[#fffdf7] text-[#083f2a] hover:bg-[#f4efe4] font-medium flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#0c5c3d]" />
              <span>আরও ছবি দিন</span>
            </button>

            <button
              type="button"
              onClick={onClearAll}
              className="px-2.5 py-1 text-xs border border-[#b84d4d]/40 bg-[#f9e8e8]/50 text-[#8a2424] hover:bg-[#f9e8e8] font-medium flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>সব মুছুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of Sortable Image Cards */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item, index) => {
            const isBeingDragged = draggedIndex === index;
            const isHoveredTarget = dragOverIndex === index && draggedIndex !== index;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDrop={(e) => handleItemDrop(e, index)}
                onDragEnd={handleItemDragEnd}
                className={`border bg-[#fffdf7] transition-all relative flex flex-col justify-between group ${
                  isBeingDragged ? 'opacity-40 border-dashed border-[#0c5c3d]' : ''
                } ${
                  isHoveredTarget ? 'border-2 border-[#0c5c3d] scale-[1.02]' : 'border-[#d8cfb8]'
                }`}
              >
                {/* Drag Handle & Order Badge Header */}
                <div className="p-1.5 bg-[#f4efe4] border-b border-[#d8cfb8] flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3.5 h-3.5 text-[#6b6255]" />
                    <span className="font-mono font-bold text-[#083f2a]">
                      #{toBanglaDigits(index + 1)}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#6b6255]">
                    {item.width}×{item.height}
                  </span>
                </div>

                {/* Thumbnail Image Viewport */}
                <div className="relative w-full aspect-square bg-[#ece5d8]/40 p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.dataUrl}
                    alt={item.name}
                    style={{
                      transform: `rotate(${item.rotation}deg)`,
                    }}
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                  />

                  {item.rotation !== 0 && (
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 py-0.2">
                      {item.rotation}°
                    </span>
                  )}
                </div>

                {/* Card Footer: Metadata and Controls */}
                <div className="p-2 space-y-2 border-t border-[#d8cfb8] bg-[#fffdf7]">
                  <div className="text-[11px] truncate text-[#083f2a] font-medium" title={item.name}>
                    {item.name}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#d8cfb8]/60">
                    {/* Move Left / Right Reorder Buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onReorder(index, index - 1)}
                        title="বামে / আগে সরান"
                        className="p-1 border border-[#d8cfb8] bg-[#f4efe4] text-[#083f2a] hover:bg-[#d8cfb8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        disabled={index === items.length - 1}
                        onClick={() => onReorder(index, index + 1)}
                        title="ডানে / পরে সরান"
                        className="p-1 border border-[#d8cfb8] bg-[#f4efe4] text-[#083f2a] hover:bg-[#d8cfb8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Rotate and Delete Action Buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => onRotate(item.id)}
                        title="৯০° ঘড়ির দিকে ঘোরান"
                        className="p-1 border border-[#d8cfb8] bg-[#f4efe4] text-[#0c5c3d] hover:bg-[#d8cfb8] cursor-pointer"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        title="ছবিটি বাদ দিন"
                        className="p-1 border border-[#b84d4d]/30 bg-[#f9e8e8]/60 text-[#8a2424] hover:bg-[#f9e8e8] cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
