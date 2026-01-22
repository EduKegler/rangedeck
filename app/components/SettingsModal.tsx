'use client';

import { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useSettingsStore, type SettingsState } from '../stores/settingsStore';
import { trackSettingsChanged } from '@/lib/analytics';

const CARD_SIZE_OPTIONS = [
  { value: 280, label: 'Small' },
  { value: 340, label: 'Medium' },
  { value: 400, label: 'Large' },
  { value: 480, label: 'Extra Large' },
];

const FONT_SIZE_OPTIONS = [
  { value: 0, label: 'None' },
  { value: 10, label: '10px' },
  { value: 11, label: '11px' },
  { value: 12, label: '12px' },
  { value: 13, label: '13px' },
  { value: 14, label: '14px' },
  { value: 15, label: '15px' },
  { value: 16, label: '16px' },
];

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const gridFontSize = useSettingsStore((state) => state.gridFontSize);
  const cardSize = useSettingsStore((state) => state.cardSize);
  const setGridFontSize = useSettingsStore((state) => state.setGridFontSize);
  const setCardSize = useSettingsStore((state) => state.setCardSize);

  const [localSettings, setLocalSettings] = useState<SettingsState>({ gridFontSize, cardSize });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSettings({ gridFontSize, cardSize });
  }, [gridFontSize, cardSize]);

  const handleFontSizeChange = (delta: number) => {
    const currentIndex = FONT_SIZE_OPTIONS.findIndex(opt => opt.value === localSettings.gridFontSize);
    const newIndex = Math.max(0, Math.min(FONT_SIZE_OPTIONS.length - 1, currentIndex + delta));
    setLocalSettings(prev => ({ ...prev, gridFontSize: FONT_SIZE_OPTIONS[newIndex].value }));
  };

  const getCurrentFontSizeLabel = () => {
    return FONT_SIZE_OPTIONS.find(opt => opt.value === localSettings.gridFontSize)?.label || '10px';
  };

  const currentFontSizeIndex = FONT_SIZE_OPTIONS.findIndex(opt => opt.value === localSettings.gridFontSize);

  const handleCardSizeChange = (delta: number) => {
    const currentIndex = CARD_SIZE_OPTIONS.findIndex(opt => opt.value === localSettings.cardSize);
    const newIndex = Math.max(0, Math.min(CARD_SIZE_OPTIONS.length - 1, currentIndex + delta));
    setLocalSettings(prev => ({ ...prev, cardSize: CARD_SIZE_OPTIONS[newIndex].value }));
  };

  const getCurrentCardSizeLabel = () => {
    return CARD_SIZE_OPTIONS.find(opt => opt.value === localSettings.cardSize)?.label || 'Large';
  };

  const handleSave = () => {
    if (gridFontSize !== localSettings.gridFontSize) {
      trackSettingsChanged({
        setting_name: 'grid_font_size',
        old_value: gridFontSize,
        new_value: localSettings.gridFontSize,
      });
    }

    if (cardSize !== localSettings.cardSize) {
      trackSettingsChanged({
        setting_name: 'card_size',
        old_value: cardSize,
        new_value: localSettings.cardSize,
      });
    }

    setGridFontSize(localSettings.gridFontSize);
    setCardSize(localSettings.cardSize);

    document.documentElement.style.setProperty('--settings-card-size', `${localSettings.cardSize}px`);
    document.documentElement.style.setProperty('--settings-grid-font-size', `${localSettings.gridFontSize}px`);

    onClose();
  };

  const handleReset = () => {
    setLocalSettings({ gridFontSize: 10, cardSize: 400 });
  };

  const currentCardSizeIndex = CARD_SIZE_OPTIONS.findIndex(opt => opt.value === localSettings.cardSize);

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-[#0b1019]/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[480px] bg-[#1a2332] border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Display</h3>
              
              <div className="flex items-center justify-between p-4 bg-[#111822] rounded-lg border border-slate-700/50">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-medium">Card Size</span>
                  <span className="text-slate-300 text-xs">Size of range cards on dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCardSizeChange(-1)}
                    disabled={currentCardSizeIndex <= 0}
                    className="size-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-white font-medium text-sm w-20 text-center">
                    {getCurrentCardSizeLabel()}
                  </span>
                  <button
                    onClick={() => handleCardSizeChange(1)}
                    disabled={currentCardSizeIndex >= CARD_SIZE_OPTIONS.length - 1}
                    className="size-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#111822] rounded-lg border border-slate-700/50">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-medium">Grid Text Size</span>
                  <span className="text-slate-300 text-xs">Hand names size in range cards</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleFontSizeChange(-1)}
                    disabled={currentFontSizeIndex <= 0}
                    className="size-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-white font-medium text-sm w-12 text-center">
                    {getCurrentFontSizeLabel()}
                  </span>
                  <button
                    onClick={() => handleFontSizeChange(1)}
                    disabled={currentFontSizeIndex >= FONT_SIZE_OPTIONS.length - 1}
                    className="size-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#111822] rounded-lg border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wider mb-3 block">Preview</span>
                <div 
                  className="bg-[#1f2937] rounded-lg p-3 border border-slate-700/50 transition-all"
                  style={{ width: `${Math.min(localSettings.cardSize * 0.4, 180)}px` }}
                >
                  <div className="grid grid-cols-5 gap-0.5">
                    {['AA', 'AKs', 'AQs', 'AJs', 'ATs',
                      'AKo', 'KK', 'KQs', 'KJs', 'KTs',
                      'AQo', 'KQo', 'QQ', 'QJs', 'QTs',
                      'AJo', 'KJo', 'QJo', 'JJ', 'JTs',
                      'ATo', 'KTo', 'QTo', 'JTo', 'TT'].map((hand, i) => (
                      <div
                        key={hand}
                        className="aspect-square flex items-center justify-center rounded-sm"
                        style={{ 
                          backgroundColor: [0,1,2,5,6,7,10,12,15,20,24].includes(i) ? '#ef4444' : '#334155',
                          fontSize: localSettings.gridFontSize === 0 ? 0 : `${localSettings.gridFontSize * 0.6}px`
                        }}
                      >
                        {localSettings.gridFontSize > 0 && (
                          <span className="font-bold text-white drop-shadow-sm">{hand}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-[#151c28] border-t border-slate-700/50 flex justify-between">
            <button 
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Reset to Default
            </button>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#3b82f6] hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
