import React, { useState, useEffect } from 'react';
import { X, Upload, Search, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { MediaItem } from '../types.ts';

interface MediaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: { url: string; alt: string; title: string; caption: string }) => void;
}

export const MediaSelectorModal: React.FC<MediaSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [altTextInput, setAltTextInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMedia = () => {
    setLoading(true);
    fetch('/api/admin/media')
      .then(res => res.json())
      .then(data => {
        if (data && data.media) {
          setMediaList(data.media);
          if (data.media.length > 0 && !selectedId) {
            setSelectedId(data.media[0].id);
            setAltTextInput(data.media[0].alt || data.media[0].name);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে (JPG, PNG, WebP, SVG)।');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

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
          setMediaList(prev => [data.media, ...prev]);
          setSelectedId(data.media.id);
          setAltTextInput(data.media.alt || data.media.name);
          setIsUploading(false);
        } else {
          setErrorMsg(data.error || 'আপলোড ব্যর্থ হয়েছে।');
          setIsUploading(false);
        }
      } catch {
        setErrorMsg('আপলোড করার সময় সমস্যা হয়েছে।');
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const selectedMedia = mediaList.find(m => m.id === selectedId);

  const filteredMedia = mediaList.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.alt && m.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleConfirmSelect = () => {
    if (!selectedMedia) return;
    onSelect({
      url: selectedMedia.url,
      alt: altTextInput || selectedMedia.alt || selectedMedia.name,
      title: selectedMedia.title || selectedMedia.name,
      caption: selectedMedia.caption || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#D5E4DB] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D5E4DB] bg-[#F8FAF9]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0B5D3B]" />
            <h2 className="text-base font-bold text-[#0F1F17]">মিডিয়া লাইব্রেরি থেকে ছবি নির্বাচন করুন</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#718279] hover:text-[#0F1F17] hover:bg-[#E8EFEA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-[#D5E4DB] bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#718279]" />
            <input
              type="text"
              placeholder="ছবি খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D5E4DB] bg-[#F8FAF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
            />
          </div>

          <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0B5D3B] hover:bg-[#084A2E] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs">
            <Upload className="w-3.5 h-3.5" />
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

        {errorMsg && (
          <div className="mx-6 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content area: Grid on left, Details on right */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Images Grid */}
          <div className="md:col-span-2 p-6 overflow-y-auto border-r border-[#D5E4DB] max-h-[50vh] md:max-h-[55vh]">
            {loading ? (
              <div className="text-center py-12 text-xs text-[#718279]">ছবি লোড হচ্ছে...</div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#718279]">
                কোনো ছবি পাওয়া যায়নি।
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredMedia.map(item => {
                  const isSelected = item.id === selectedId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setAltTextInput(item.alt || item.name);
                      }}
                      className={`relative aspect-4/3 rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#0B5D3B] ring-2 ring-[#0B5D3B]/30 shadow-md'
                          : 'border-[#D5E4DB] hover:border-[#0B5D3B]/50'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.alt || item.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#0B5D3B] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-1.5 text-[10px] text-white truncate">
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details / Alt text panel */}
          <div className="p-6 bg-[#F8FAF9] flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[55vh]">
            {selectedMedia ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-[#0F1F17] uppercase tracking-wider mb-2">
                    ইমেজ ডিটেইলস
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-[#D5E4DB] mb-3">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.alt || ''}
                      className="w-full max-h-36 object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium text-[#0F1F17] break-all">{selectedMedia.name}</p>
                  <p className="text-[11px] text-[#718279] mt-0.5">সাইজ: {selectedMedia.size}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F1F17] mb-1">
                    অল্টারনেট টেক্সট (Alt Text) — SEO এর জন্য আবশ্যক
                  </label>
                  <input
                    type="text"
                    value={altTextInput}
                    onChange={(e) => setAltTextInput(e.target.value)}
                    placeholder="ছবিটির স্পষ্ট বর্ণনা লিখুন"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5E4DB] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
                  />
                  <p className="text-[10px] text-[#718279] mt-1">
                    সার্চ ইঞ্জিনে র‍্যাঙ্ক এবং স্ক্রিন রিডারের সুবিধার জন্য উপযুক্ত Alt Text দিন।
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#718279] italic py-8 text-center">
                বাম পাশ থেকে একটি ছবি সিলেক্ট করুন।
              </div>
            )}

            <div className="pt-4 border-t border-[#D5E4DB] mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#52635A] hover:bg-[#EAEFEA] rounded-xl transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={!selectedMedia}
                onClick={handleConfirmSelect}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0B5D3B] hover:bg-[#084A2E] disabled:opacity-50 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                সিলেক্ট করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
