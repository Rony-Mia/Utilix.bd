import React, { useState, useRef, useEffect, useMemo, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Upload,
  Download,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  Sliders,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { PresetProfile } from '../types.ts';
import { GOVERNMENT_PRESET_PROFILES } from '../constants/presets.ts';

// Helper to calculate exact byte length of a base64 data URL
function getDataUrlByteLength(dataUrl: string): number {
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return 0;
  const base64Str = dataUrl.slice(commaIdx + 1);
  const padding = base64Str.endsWith('==') ? 2 : base64Str.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((base64Str.length * 3) / 4) - padding);
}

export const PhotoResizerPage: React.FC = () => {
  // Preset selection
  const [selectedPreset, setSelectedPreset] = useState<string>('bcs_govt_photo');
  const [customWidth, setCustomWidth] = useState<number>(300);
  const [customHeight, setCustomHeight] = useState<number>(300);
  const [customMaxKb, setCustomMaxKb] = useState<number>(100);
  const [customFormat, setCustomFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');

  // Image source state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalMeta, setOriginalMeta] = useState<{
    name: string;
    width: number;
    height: number;
    sizeKb: number;
  } | null>(null);

  // Transform controls
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'cover' | 'contain' | 'fill'>('cover');
  const [backgroundColor] = useState<string>('#ffffff');

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Result state
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [resultMeta, setResultMeta] = useState<{
    width: number;
    height: number;
    sizeKb: number;
    format: string;
    qualityUsed: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Determine active parameters
  const currentPreset = useMemo(() => {
    return GOVERNMENT_PRESET_PROFILES.find((p) => p.id === selectedPreset);
  }, [selectedPreset]);

  const activeWidth = currentPreset ? currentPreset.width : customWidth;
  const activeHeight = currentPreset ? currentPreset.height : customHeight;
  const activeMaxKb = currentPreset ? currentPreset.maxSizeKb : customMaxKb;
  const activeFormat = currentPreset ? currentPreset.format : customFormat;

  // Set default sample image on first load
  useEffect(() => {
    loadSampleImage('photo');
  }, []);

  // Handle Preset change
  const handlePresetSelect = (id: string) => {
    setSelectedPreset(id);
    const preset = GOVERNMENT_PRESET_PROFILES.find((p) => p.id === id);
    if (preset) {
      if (preset.id === 'govt_signature') {
        loadSampleImage('signature');
      } else {
        if (originalMeta?.name.includes('স্বাক্ষর')) {
          loadSampleImage('photo');
        }
      }
    }
  };

  // Helper to load sample portrait or signature
  const loadSampleImage = (type: 'photo' | 'signature') => {
    const canvas = document.createElement('canvas');
    if (type === 'signature') {
      canvas.width = 600;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 200);

        ctx.fillStyle = '#083f2a';
        ctx.font = 'italic 52px "Hind Siliguri", cursive, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Md. Rafiqul Islam', 300, 90);

        ctx.strokeStyle = '#083f2a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(150, 130);
        ctx.bezierCurveTo(240, 160, 360, 120, 460, 140);
        ctx.stroke();

        ctx.font = '16px "Hind Siliguri", sans-serif';
        ctx.fillStyle = '#6b6255';
        ctx.fillText('(নমুনা স্বাক্ষর - প্রিভিউ টেস্ট)', 300, 175);
      }
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setImageSrc(dataUrl);
      setOriginalMeta({
        name: 'নমুনা_স্বাক্ষর.jpg',
        width: 600,
        height: 200,
        sizeKb: 42
      });
    } else {
      canvas.width = 640;
      canvas.height = 640;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Subtle gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, 640);
        grad.addColorStop(0, '#f0f4f8');
        grad.addColorStop(1, '#d9e2ec');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 640, 640);

        // Body silhouette
        ctx.fillStyle = '#102a43';
        ctx.beginPath();
        ctx.ellipse(320, 560, 200, 160, 0, 0, Math.PI * 2);
        ctx.fill();

        // Collar/Tie
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(270, 420);
        ctx.lineTo(320, 500);
        ctx.lineTo(370, 420);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0c5c3d';
        ctx.beginPath();
        ctx.moveTo(310, 440);
        ctx.lineTo(330, 440);
        ctx.lineTo(325, 540);
        ctx.lineTo(315, 540);
        ctx.closePath();
        ctx.fill();

        // Head/Face silhouette
        ctx.fillStyle = '#d4a373';
        ctx.beginPath();
        ctx.ellipse(320, 300, 110, 140, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#1f2933';
        ctx.beginPath();
        ctx.ellipse(320, 230, 115, 80, 0, 0, Math.PI);
        ctx.fill();

        // Label
        ctx.fillStyle = '#334e68';
        ctx.font = '22px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('নমুনা পাসপোর্ট ছবি (পাসপোর্ট / বিসিএস প্রিসেট)', 320, 80);
      }
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setImageSrc(dataUrl);
      setOriginalMeta({
        name: 'নমুনা_ছবি.jpg',
        width: 640,
        height: 640,
        sizeKb: 68
      });
    }

    // Reset transformations
    setZoom(1);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
  };

  // Handle File Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(dataUrl);
        setOriginalMeta({
          name: file.name,
          width: img.width,
          height: img.height,
          sizeKb: Number((file.size / 1024).toFixed(1))
        });
        setZoom(1);
        setRotation(0);
        setOffsetX(0);
        setOffsetY(0);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Trigger processing whenever parameters or image changes
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgElementRef.current = img;
      processImage();
    };
    img.src = imageSrc;
  }, [
    imageSrc,
    activeWidth,
    activeHeight,
    activeMaxKb,
    activeFormat,
    zoom,
    rotation,
    offsetX,
    offsetY,
    fitMode,
    backgroundColor
  ]);

  // Main 100% Client-Side Image Processing Routine with Binary Search Optimization
  const processImage = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    try {
      // 1. Compose canvas representing the user's crop/zoom/rotate/dimensions
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = activeWidth;
      offscreenCanvas.height = activeHeight;
      const ctx = offscreenCanvas.getContext('2d');

      if (!ctx || !imgElementRef.current) {
        setIsProcessing(false);
        return;
      }

      // Background fill (white by default for passport/govt guidelines)
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, activeWidth, activeHeight);

      const img = imgElementRef.current;

      ctx.save();
      ctx.translate(activeWidth / 2 + offsetX, activeHeight / 2 + offsetY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      let drawW = activeWidth;
      let drawH = activeHeight;

      if (fitMode === 'cover') {
        const scale = Math.max(activeWidth / img.width, activeHeight / img.height);
        drawW = img.width * scale;
        drawH = img.height * scale;
      } else if (fitMode === 'contain') {
        const scale = Math.min(activeWidth / img.width, activeHeight / img.height);
        drawW = img.width * scale;
        drawH = img.height * scale;
      } else {
        // fill / stretch
        drawW = activeWidth;
        drawH = activeHeight;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // 2. Binary Search Target Size Matching
      const outputMime =
        activeFormat === 'png'
          ? 'image/png'
          : activeFormat === 'webp'
          ? 'image/webp'
          : 'image/jpeg';

      let finalDataUrl = '';
      let finalQuality = 100;
      let finalBytes = 0;

      if (outputMime === 'image/png') {
        // PNG is lossless and does not take quality parameter
        finalDataUrl = offscreenCanvas.toDataURL('image/png');
        finalBytes = getDataUrlByteLength(finalDataUrl);
        finalQuality = 100;
      } else {
        // JPEG or WebP: Binary search for the highest quality that stays <= activeMaxKb
        const targetBytes = activeMaxKb > 0 ? activeMaxKb * 1024 : Infinity;

        // Test top quality first (0.98)
        const highCandidateQuality = 0.98;
        const highCandidateDataUrl = offscreenCanvas.toDataURL(outputMime, highCandidateQuality);
        const highCandidateBytes = getDataUrlByteLength(highCandidateDataUrl);

        if (highCandidateBytes <= targetBytes || targetBytes === Infinity) {
          // Fits within budget with pristine quality
          finalDataUrl = highCandidateDataUrl;
          finalQuality = Math.round(highCandidateQuality * 100);
          finalBytes = highCandidateBytes;
        } else {
          // Binary search in range [0.05, 0.98] to hit target size with minimal overshoot/undershoot
          let low = 0.05;
          let high = highCandidateQuality;
          let bestDataUrl = offscreenCanvas.toDataURL(outputMime, low);
          let bestBytes = getDataUrlByteLength(bestDataUrl);
          let bestQuality = low;

          // 8 iterations gives 0.36% step precision
          for (let iter = 0; iter < 8; iter++) {
            const mid = (low + high) / 2;
            const testDataUrl = offscreenCanvas.toDataURL(outputMime, mid);
            const testBytes = getDataUrlByteLength(testDataUrl);

            if (testBytes <= targetBytes) {
              // Fits within government budget! Try to get even higher quality
              bestDataUrl = testDataUrl;
              bestBytes = testBytes;
              bestQuality = mid;
              low = mid;
            } else {
              // Exceeds limit; reduce quality
              high = mid;
            }
          }

          finalDataUrl = bestDataUrl;
          finalQuality = Math.round(bestQuality * 100);
          finalBytes = bestBytes;
        }
      }

      setResultDataUrl(finalDataUrl);
      setResultMeta({
        width: activeWidth,
        height: activeHeight,
        sizeKb: Number((finalBytes / 1024).toFixed(1)),
        format: activeFormat.toUpperCase(),
        qualityUsed: finalQuality
      });
    } catch (err) {
      console.error('Client-side processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Handler
  const handleDownload = () => {
    if (!resultDataUrl) return;
    const link = document.createElement('a');
    const ext = activeFormat === 'png' ? 'png' : activeFormat === 'webp' ? 'webp' : 'jpg';
    link.download = `utilix-bd-${activeWidth}x${activeHeight}-${selectedPreset}.${ext}`;
    link.href = resultDataUrl;
    link.click();
  };

  // Check if output complies with Govt specs
  const isCompliant = useMemo(() => {
    if (!resultMeta) return false;
    const correctDims = resultMeta.width === activeWidth && resultMeta.height === activeHeight;
    const correctSize = activeMaxKb ? resultMeta.sizeKb <= activeMaxKb : true;
    return correctDims && correctSize;
  }, [resultMeta, activeWidth, activeHeight, activeMaxKb]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Helmet>
        <title>সরকারি চাকরি ও পাসপোর্ট ছবি রিসাইজার — Photo & Signature Resizer | Utilix.bd</title>
        <meta
          name="description"
          content="বিসিএস, সরকারি চাকরি (৩০০×৩০০ পিক্সেল, ১০০ কেবি) ও স্বাক্ষর (৩০০×৮০ পিক্সেল, ৬০ কেবি) সহ পাসপোর্ট সাইজ ছবির নির্ভুল অনলাইন রিসাইজার ও ক্রপার।"
        />
        <meta
          property="og:title"
          content="সরকারি চাকরি ও পাসপোর্ট ছবি রিসাইজার — Photo & Signature Resizer | Utilix.bd"
        />
        <meta
          property="og:description"
          content="বিসিএস, সরকারি চাকরি (৩০০×৩০০ পিক্সেল, ১০০ কেবি) ও স্বাক্ষর (৩০০×৮০ পিক্সেল, ৬০ কেবি) সহ পাসপোর্ট সাইজ ছবির নির্ভুল অনলাইন রিসাইজার ও ক্রপার।"
        />
        <meta property="og:url" content="https://utilix.bd/photo-resizer" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ছবি ও স্বাক্ষর রিসাইজার | Utilix.bd" />
        <meta
          name="twitter:description"
          content="সরকারি চাকরি ও পাসপোর্টের নির্ধারিত মাপে ছবি এবং স্বাক্ষর রিসাইজার।"
        />
      </Helmet>

      {/* Top Breadcrumb & Privacy Guarantee */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#d8cfb8]">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="border border-[#d8cfb8] bg-[#fffdf7] hover:bg-[#f4efe4] px-3 py-1.5 text-xs text-[#083f2a] flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>হোমপেজে ফিরুন</span>
          </Link>
          <span className="text-xs text-[#6b6255] font-mono">REF: IMG-GOV-02</span>
        </div>

        {/* 100% Client-Side Privacy Badge */}
        <div className="flex items-center space-x-2 text-xs font-medium text-[#083f2a] bg-[#fffdf7] border border-[#d8cfb8] px-3 py-1.5 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#0c5c3d]" />
          <span>১০০% ক্লায়েন্ট-সাইড ব্রাউজার প্রসেসিং (গোপনীয়তা সুরক্ষিত, নো সার্ভার আপলোড)</span>
        </div>
      </div>

      {/* Page Title & Intro */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#083f2a] font-serif tracking-tight">
          সরকারি ও পাসপোর্ট ছবি রিসাইজার
        </h1>
        <p className="text-sm text-[#4a4237] max-w-3xl leading-relaxed">
          বাংলাদেশি সরকারি চাকরি (Teletalk / BPSC), বিসিএস, প্রাথমিক শিক্ষক নিয়োগ, স্মার্ট এনআইডি ও ই-পাসপোর্ট আবেদনের নির্ধারিত
          <strong> ৩০০×৩০০ পিক্সেল (১০০ KB)</strong> এবং <strong>৩০০×৮০ পিক্সেল স্বাক্ষর (৬০ KB)</strong> মাপে
          তাৎক্ষণিক নিখুঁত ক্রপ, রিসাইজ ও বাইনারি সার্চ কম্প্রেশন। সম্পূর্ণ কাজ ব্রাউজারের অভ্যন্তরে সম্পন্ন হয়।
        </p>
      </div>

      {/* Preset Selector Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#083f2a] uppercase tracking-wider block font-serif">
          ১. নির্ধারিত আবেদনের প্রিসেট নির্বাচন করুন
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {GOVERNMENT_PRESET_PROFILES.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p.id)}
                className={`text-left p-3 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#083f2a] text-[#fffdf7] border-[#083f2a] shadow-sm'
                    : 'bg-[#fffdf7] hover:bg-[#f4efe4] border-[#d8cfb8] text-[#14231c]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 truncate max-w-[110px] ${
                        isSelected ? 'bg-[#0c5c3d] text-[#fffdf7]' : 'bg-[#f4efe4] text-[#083f2a]'
                      }`}
                      title={p.org}
                    >
                      {p.org}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#fffdf7] shrink-0" />}
                  </div>
                  <h3 className="font-semibold text-xs leading-snug font-serif mb-1">
                    {p.name}
                  </h3>
                </div>
                <div className="pt-2 mt-2 border-t border-current/20 flex items-center justify-between text-[11px] font-mono">
                  <span>{p.width}×{p.height} px</span>
                  <span>≤ {p.maxSizeKb} KB</span>
                </div>
              </button>
            );
          })}

          {/* Custom Option */}
          <button
            type="button"
            onClick={() => setSelectedPreset('custom')}
            className={`text-left p-3 border transition-all cursor-pointer flex flex-col justify-between ${
              selectedPreset === 'custom'
                ? 'bg-[#083f2a] text-[#fffdf7] border-[#083f2a]'
                : 'bg-[#fffdf7] hover:bg-[#f4efe4] border-[#d8cfb8] text-[#14231c]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 ${
                    selectedPreset === 'custom' ? 'bg-[#0c5c3d] text-[#fffdf7]' : 'bg-[#f4efe4] text-[#083f2a]'
                  }`}
                >
                  CUSTOM
                </span>
                {selectedPreset === 'custom' && <CheckCircle2 className="w-3.5 h-3.5 text-[#fffdf7]" />}
              </div>
              <h3 className="font-semibold text-xs leading-snug font-serif mb-1">
                কাস্টম সাইজ ও কম্প্রেশন
              </h3>
            </div>
            <div className="pt-2 mt-2 border-t border-current/20 text-[11px] font-mono">
              ইচ্ছামতো px ও KB নির্ধারণ
            </div>
          </button>
        </div>
      </div>

      {/* Custom Parameters Form (When custom selected) */}
      {selectedPreset === 'custom' && (
        <div className="bg-[#fffdf7] border border-[#d8cfb8] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-[#6b6255] mb-1 font-medium">প্রস্থ (Width - পিক্সেল):</label>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(Math.max(10, parseInt(e.target.value) || 10))}
              className="w-full p-2 border border-[#d8cfb8] bg-[#f4efe4]/30 font-mono text-sm focus:outline-none focus:border-[#0c5c3d]"
            />
          </div>
          <div>
            <label className="block text-[#6b6255] mb-1 font-medium">উচ্চতা (Height - পিক্সেল):</label>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(Math.max(10, parseInt(e.target.value) || 10))}
              className="w-full p-2 border border-[#d8cfb8] bg-[#f4efe4]/30 font-mono text-sm focus:outline-none focus:border-[#0c5c3d]"
            />
          </div>
          <div>
            <label className="block text-[#6b6255] mb-1 font-medium">সর্বোচ্চ ফাইল সাইজ (Max KB):</label>
            <input
              type="number"
              value={customMaxKb}
              onChange={(e) => setCustomMaxKb(Math.max(5, parseInt(e.target.value) || 5))}
              className="w-full p-2 border border-[#d8cfb8] bg-[#f4efe4]/30 font-mono text-sm focus:outline-none focus:border-[#0c5c3d]"
            />
          </div>
          <div>
            <label className="block text-[#6b6255] mb-1 font-medium">ফরম্যাট (Format):</label>
            <select
              value={customFormat}
              onChange={(e) => setCustomFormat(e.target.value as 'jpeg' | 'png' | 'webp')}
              className="w-full p-2 border border-[#d8cfb8] bg-[#f4efe4]/30 text-sm focus:outline-none focus:border-[#0c5c3d]"
            >
              <option value="jpeg">JPEG (.jpg) - সরকারি মান</option>
              <option value="png">PNG (.png)</option>
              <option value="webp">WebP (.webp)</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Workspace: 2 Side-by-Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Side: Upload & Adjustment Studio */}
        <div className="bg-[#fffdf7] border border-[#d8cfb8] p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#d8cfb8]">
              <span className="text-xs font-bold text-[#083f2a] font-serif uppercase tracking-wider flex items-center space-x-1.5">
                <FileImage className="w-4 h-4 text-[#0c5c3d]" />
                <span>২. ইনপুট ছবি ও পজিশনিং</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => loadSampleImage('photo')}
                  className="text-[11px] text-[#083f2a] hover:underline cursor-pointer"
                >
                  নমুনা ছবি
                </button>
                <span className="text-[#d8cfb8]">|</span>
                <button
                  type="button"
                  onClick={() => loadSampleImage('signature')}
                  className="text-[11px] text-[#083f2a] hover:underline cursor-pointer"
                >
                  নমুনা স্বাক্ষর
                </button>
              </div>
            </div>

            {/* Upload Area */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#d8cfb8] hover:border-[#0c5c3d] bg-[#f4efe4]/30 hover:bg-[#f4efe4]/60 p-4 text-center cursor-pointer transition-colors"
            >
              <Upload className="w-6 h-6 mx-auto mb-2 text-[#083f2a]" />
              <div className="text-xs font-semibold text-[#083f2a]">
                ছবি নির্বাচন করতে ক্লিক করুন অথবা এখানে টেনে আনুন
              </div>
              <div className="text-[11px] text-[#6b6255] mt-1 font-mono">
                JPG, PNG, WebP (ব্রাউজার মেমোরিতে নিরাপদে প্রসেস হবে)
              </div>
            </div>

            {/* Original Metadata Tag */}
            {originalMeta && (
              <div className="bg-[#f4efe4]/50 border border-[#d8cfb8] p-2.5 flex items-center justify-between text-xs font-mono">
                <span className="truncate max-w-[200px] text-[#14231c]" title={originalMeta.name}>
                  {originalMeta.name}
                </span>
                <span className="text-[#6b6255]">
                  মূল: {originalMeta.width}×{originalMeta.height} px | {originalMeta.sizeKb} KB
                </span>
              </div>
            )}

            {/* Interactive Crop / Pan / Zoom Sliders */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-[#083f2a] font-semibold">
                <span className="flex items-center space-x-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>ক্রপ ও জুম নিয়ন্ত্রণ:</span>
                </span>
                <span className="font-mono text-[11px] text-[#6b6255]">{Math.round(zoom * 100)}%</span>
              </div>

              {/* Zoom Slider */}
              <div className="flex items-center space-x-3">
                <ZoomOut className="w-4 h-4 text-[#6b6255]" />
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#0c5c3d]"
                />
                <ZoomIn className="w-4 h-4 text-[#6b6255]" />
              </div>

              {/* Pan Horizontal & Vertical */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <div className="flex justify-between text-[#6b6255] mb-1">
                    <span>অনুভূমিক সরান (X):</span>
                    <span className="font-mono">{offsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    step="2"
                    value={offsetX}
                    onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
                    className="w-full accent-[#0c5c3d]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[#6b6255] mb-1">
                    <span>উল্লম্ব সরান (Y):</span>
                    <span className="font-mono">{offsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    step="2"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
                    className="w-full accent-[#0c5c3d]"
                  />
                </div>
              </div>

              {/* Rotate & Reset row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#d8cfb8] text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="border border-[#d8cfb8] bg-[#f4efe4] hover:bg-[#d8cfb8]/50 px-2.5 py-1 text-[#14231c] flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#083f2a]" />
                    <span>৯০° ঘোরান ({rotation}°)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setRotation(0);
                      setOffsetX(0);
                      setOffsetY(0);
                    }}
                    className="border border-[#d8cfb8] bg-[#f4efe4] hover:bg-[#d8cfb8]/50 px-2.5 py-1 text-[#14231c] flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#083f2a]" />
                    <span>রিসেট</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-[#6b6255]">ফিট মোড:</label>
                  <select
                    value={fitMode}
                    onChange={(e) => setFitMode(e.target.value as 'cover' | 'contain' | 'fill')}
                    className="border border-[#d8cfb8] bg-[#f4efe4]/30 px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="cover">ফিল ও ক্রপ (Fill/Cover)</option>
                    <option value="contain">সম্পূর্ণ ছবি (Contain)</option>
                    <option value="fill">টান টান (Stretch)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines hint */}
          <div className="bg-[#f4efe4]/40 border border-[#d8cfb8] p-3 text-[11px] text-[#4a4237] leading-relaxed">
            💡 <strong>টিপস:</strong> সরকারি চাকরি ও বিসিএস আবেদনে ছবির ব্যাকগ্রাউন্ড সাদা বা হালকা একরঙা হতে হবে।
            স্বাক্ষরের জন্য সাদা কাগজে কালো কালির কলম দিয়ে স্বাক্ষর করে ছবি তুলে এখানে ক্রপ করুন।
          </div>
        </div>

        {/* Right Side: Processed Output Preview & Compliance */}
        <div className="bg-[#fffdf7] border border-[#d8cfb8] p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#d8cfb8]">
              <span className="text-xs font-bold text-[#083f2a] font-serif uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0c5c3d]" />
                <span>৩. চূড়ান্ত আউটপুট ও ভেরিফিকেশন</span>
              </span>
              <div className="text-[11px] font-mono text-[#0c5c3d] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                <span>ক্যানভাস বাইনারি অপ্টিমাইজার</span>
              </div>
            </div>

            {/* Compliance Badge Banner */}
            <div
              className={`p-3 border flex items-center justify-between text-xs ${
                isCompliant
                  ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                  : 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
              }`}
            >
              <div className="flex items-center space-x-2">
                {isCompliant ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
                )}
                <div>
                  <div className="font-semibold">
                    {isCompliant ? 'সরকারি আবেদনের মানদণ্ড অনুযায়ী প্রস্তুত ✓' : 'সাইজ বা পরিমাপ যাচাই করুন'}
                  </div>
                  <div className="text-[11px] opacity-80 font-mono">
                    নির্ধারিত: {activeWidth}×{activeHeight} px | অনূর্ধ্ব {activeMaxKb} KB
                  </div>
                </div>
              </div>

              {resultMeta && (
                <div className="text-right font-mono">
                  <div className="font-bold">{resultMeta.sizeKb} KB</div>
                  <div className="text-[10px] opacity-75">{resultMeta.format}</div>
                </div>
              )}
            </div>

            {/* Visual Canvas Display Frame */}
            <div className="bg-[#f4efe4]/50 border border-[#d8cfb8] p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
              {isProcessing && (
                <div className="absolute inset-0 bg-[#fffdf7]/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 space-y-2 text-xs text-[#083f2a]">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#0c5c3d]" />
                  <span>ছবি অপ্টিমাইজেশন চলছে...</span>
                </div>
              )}

              {resultDataUrl ? (
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className="border-2 border-[#083f2a] shadow-sm bg-white overflow-hidden"
                    style={{
                      width: activeHeight < 150 ? '300px' : activeWidth > 350 ? '240px' : `${activeWidth}px`,
                      height: activeHeight < 150 ? '80px' : activeHeight > 350 ? `${(240 * activeHeight) / activeWidth}px` : `${activeHeight}px`
                    }}
                  >
                    <img
                      src={resultDataUrl}
                      alt="Processed Result"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-center">
                    <span className="text-xs font-mono text-[#6b6255] bg-[#fffdf7] px-2 py-0.5 border border-[#d8cfb8]">
                      আউটপুট রেজোলিউশন: {resultMeta?.width} × {resultMeta?.height} px ({resultMeta?.format})
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-[#6b6255]">
                  কোনো ছবি লোড করা হয়নি
                </div>
              )}
            </div>

            {/* Quality & Encoding Details */}
            {resultMeta && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#f4efe4]/40 border border-[#d8cfb8] p-2">
                  <span className="block text-[10px] text-[#6b6255]">প্রস্থ ও উচ্চতা</span>
                  <span className="font-mono font-bold text-[#083f2a]">{resultMeta.width}×{resultMeta.height}</span>
                </div>
                <div className="bg-[#f4efe4]/40 border border-[#d8cfb8] p-2">
                  <span className="block text-[10px] text-[#6b6255]">ফাইল সাইজ</span>
                  <span className={`font-mono font-bold ${resultMeta.sizeKb <= activeMaxKb ? 'text-[#0c5c3d]' : 'text-[#c8342a]'}`}>
                    {resultMeta.sizeKb} KB
                  </span>
                </div>
                <div className="bg-[#f4efe4]/40 border border-[#d8cfb8] p-2">
                  <span className="block text-[10px] text-[#6b6255]">বাইনারি কোয়ালিটি</span>
                  <span className="font-mono font-bold text-[#083f2a]">{resultMeta.qualityUsed}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Download Buttons */}
          <div className="pt-4 border-t border-[#d8cfb8] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={processImage}
              className="border border-[#d8cfb8] bg-[#f4efe4] hover:bg-[#d8cfb8]/50 px-3 py-2 text-xs text-[#14231c] flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#083f2a]" />
              <span>পুনরায় প্রসেস করুন</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!resultDataUrl}
              className={`px-5 py-2 text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm ${
                resultDataUrl
                  ? 'bg-[#0c5c3d] hover:bg-[#083f2a] text-[#fffdf7] cursor-pointer'
                  : 'bg-[#d8cfb8]/50 text-[#6b6255] cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>রিসাইজড ছবি ডাউনলোড করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Government Sizing Guidelines Reference Box */}
      <div className="bg-[#fffdf7] border border-[#d8cfb8] p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#083f2a] font-serif uppercase tracking-wider flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-[#0c5c3d]" />
          <span>সরকারি চাকরি ও পাসপোর্ট আবেদনের অফিশিয়াল নির্দেশিকা</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#4a4237] leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-[#083f2a]">১. ছবির নিয়মাবলী (Photo Rules):</h4>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>ছবির মাপ অবশ্যই নির্দিষ্ট <strong>৩০০ × ৩০০ পিক্সেল (প্রস্থ × উচ্চতা)</strong> হতে হবে।</li>
              <li>ছবির ফাইলের আকার কোনোভাবেই <strong>১০০ কিলোবাইট (100 KB)</strong>-এর বেশি হওয়া যাবে না।</li>
              <li>ছবির ব্যাকগ্রাউন্ড সাধারণত সাদা বা হালকা একরঙা হতে হবে।</li>
              <li>চোখ ও মুখাবয়ব স্পষ্টভাবে দৃশ্যমান থাকতে হবে, ক্যাপ বা গাঢ় সানগ্লাস পরা ছবি গ্রহণযোগ্য নয়।</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#083f2a]">২. স্বাক্ষরের নিয়মাবলী (Signature Rules):</h4>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>স্বাক্ষরের মাপ অবশ্যই নির্দিষ্ট <strong>৩০০ × ৮০ পিক্সেল (প্রস্থ × উচ্চতা)</strong> হতে হবে।</li>
              <li>স্বাক্ষরের ফাইলের আকার কোনোভাবেই <strong>৬০ কিলোবাইট (60 KB)</strong>-এর বেশি হওয়া যাবে না।</li>
              <li>সাদা পরিষ্কার কাগজের ওপর কালো কালির বলপেন বা সাইনপেন দিয়ে স্বাক্ষর করে ক্রপ করুন।</li>
              <li>টেলিটক বা বিসিএস অনলাইন পোর্টালে এই মাপের ব্যত্যয় হলে ফর্ম সাবমিট হবে না।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
