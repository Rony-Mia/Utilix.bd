import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  X,
  FileImage,
  Info
} from 'lucide-react';
import { MediaItem } from '../types.ts';
import { toBn } from '../../utils/bnDigits.ts';

export const MediaLibraryPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Inspector form
  const [altText, setAltText] = useState('');
  const [imgTitle, setImgTitle] = useState('');
  const [imgCaption, setImgCaption] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchMedia = () => {
    setLoading(true);
    fetch('/api/admin/media')
      .then(res => res.json())
      .then(data => {
        if (data && data.media) {
          setMediaList(data.media);
          if (data.media.length > 0 && !selectedMedia) {
            selectItem(data.media[0]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const selectItem = (item: MediaItem) => {
    setSelectedMedia(item);
    setAltText(item.alt || '');
    setImgTitle(item.title || '');
    setImgCaption(item.caption || '');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে (JPG, PNG, WebP, SVG)।', type: 'error' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            dataUrl: base64,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            title: file.name
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.media) {
          setMessage({ text: 'ছবি সফলভাবে আপলোড হয়েছে!', type: 'success' });
          setMediaList(prev => [data.media, ...prev]);
          selectItem(data.media);
        } else {
          setMessage({ text: data.error || 'আপলোড ব্যর্থ হয়েছে।', type: 'error' });
        }
      } catch {
        setMessage({ text: 'আপলোড করতে সমস্যা হয়েছে।', type: 'error' });
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMetadata = async () => {
    if (!selectedMedia) return;

    try {
      const res = await fetch(`/api/admin/media/${selectedMedia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alt: altText,
          title: imgTitle,
          caption: imgCaption
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'ছবির এসইও মেটাডাটা সফলভাবে সংরক্ষিত হয়েছে!', type: 'success' });
        setMediaList(prev => prev.map(m => m.id === selectedMedia.id ? data.media : m));
        setSelectedMedia(data.media);
      }
    } catch {
      setMessage({ text: 'মেটাডাটা সংরক্ষণ করা যায়নি।', type: 'error' });
    }
  };

  const handleDeleteMedia = async () => {
    if (!selectedMedia) return;
    if (!confirm(`আপনি কি "${selectedMedia.name}" ছবিটি ডিলিট করতে চান?`)) return;

    try {
      const res = await fetch(`/api/admin/media/${selectedMedia.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'ছবি ডিলিট করা হয়েছে।', type: 'success' });
        const remaining = mediaList.filter(m => m.id !== selectedMedia.id);
        setMediaList(remaining);
        setSelectedMedia(remaining.length > 0 ? remaining[0] : null);
      }
    } catch {
      setMessage({ text: 'ডিলিট করতে সমস্যা হয়েছে।', type: 'error' });
    }
  };

  const handleCopyLink = () => {
    if (!selectedMedia) return;
    navigator.clipboard.writeText(selectedMedia.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const filteredMedia = mediaList.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.alt && m.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#0B5D3B]" />
            মিডিয়া লাইব্রেরি (Media Library)
          </h1>
          <p className="text-xs text-[#718279] mt-1">
            ওয়েবসাইটের সব ছবি, ব্যানার ও এসইও মেটাডাটা পরিচালনা করুন।
          </p>
        </div>

        <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold transition-all shadow-md cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'আপলোড হচ্ছে...' : 'নতুন ছবি আপলোড'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="ml-auto p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid & Inspector layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Search & Image Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-[#D5E4DB] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#718279] ml-2" />
            <input
              type="text"
              placeholder="ফাইলের নাম বা Alt text দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 py-1 text-xs bg-transparent focus:outline-none"
            />
            <span className="text-[11px] text-[#718279] whitespace-nowrap pr-2">
              মোট: {toBn(filteredMedia.length)}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D5E4DB] p-5 shadow-2xs min-h-[480px]">
            {loading ? (
              <div className="text-center py-24 text-xs text-[#718279]">ছবি লোড হচ্ছে...</div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-24 text-xs text-[#718279]">
                কোনো ছবি পাওয়া যায়নি।
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {filteredMedia.map(item => {
                  const isSelected = selectedMedia?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => selectItem(item)}
                      className={`group relative aspect-4/3 rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#0B5D3B] ring-2 ring-[#0B5D3B]/20 shadow-md'
                          : 'border-[#D5E4DB] hover:border-[#0B5D3B]/50'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.alt || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-1.5 text-[10px] text-white truncate">
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Image SEO & Details Inspector */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-[#D5E4DB] p-6 shadow-2xs flex flex-col justify-between space-y-5">
          {selectedMedia ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5E4DB]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F1F17]">
                  ইমেজ প্রিভিউ ও এসইও
                </h3>
                <span className="text-[10px] text-[#718279]">{selectedMedia.size}</span>
              </div>

              {/* Preview image */}
              <div className="rounded-xl border border-[#D5E4DB] overflow-hidden bg-[#F0F4F2] max-h-48 flex items-center justify-center">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt || ''}
                  className="w-full h-full object-contain max-h-48"
                />
              </div>

              {/* URL & Copy button */}
              <div>
                <label className="block text-[11px] font-bold text-[#0F1F17] mb-1">
                  ফাইল পাথ (URL)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedMedia.url}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#D5E4DB] bg-[#F8FAF9] text-[11px] font-mono text-[#52635A]"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg border border-[#D5E4DB] hover:bg-[#F0F4F2] text-[#0B5D3B] cursor-pointer"
                    title="লিংক কপি করুন"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Alt Text (Image SEO #21) */}
              <div>
                <label className="block text-[11px] font-bold text-[#0F1F17] mb-1">
                  অল্টারনেট টেক্সট (Alt Text) — Google Image SEO এর জন্য
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="ছবির অর্থবহ বর্ণনা..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-[#F8FAF9] focus:bg-white"
                />
              </div>

              {/* Title & Caption */}
              <div>
                <label className="block text-[11px] font-bold text-[#0F1F17] mb-1">
                  ছবির শিরোনাম (Title)
                </label>
                <input
                  type="text"
                  value={imgTitle}
                  onChange={(e) => setImgTitle(e.target.value)}
                  placeholder="ছবির টাইটেল..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-[#F8FAF9] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0F1F17] mb-1">
                  ছবির ক্যাপশন (Caption)
                </label>
                <textarea
                  rows={2}
                  value={imgCaption}
                  onChange={(e) => setImgCaption(e.target.value)}
                  placeholder="ক্যাপশন (আর্টিকেলে ছবির নিচে প্রদর্শিত হবে)..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E4DB] text-xs bg-[#F8FAF9] focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveMetadata}
                  className="w-full py-2 bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  মেটাডাটা সেভ করুন
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-xs text-[#718279] italic">
              বাম পাশ থেকে একটি ছবি নির্বাচন করুন।
            </div>
          )}

          {selectedMedia && (
            <div className="pt-3 border-t border-[#D5E4DB] flex justify-end">
              <button
                type="button"
                onClick={handleDeleteMedia}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ছবি মুছে ফেলুন</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
