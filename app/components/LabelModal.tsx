'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@heroui/react';
import type { Label } from '../types/range';

interface LabelModalProps {
  label?: Label;
  onSave: (name: string, color: string) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

export default function LabelModal({ label, onSave, onClose }: LabelModalProps) {
  const [name, setName] = useState(label?.name || '');
  const [color, setColor] = useState(label?.color || '#3b82f6');

  useEffect(() => {
    setName(label?.name || '');
    setColor(label?.color || '#3b82f6');
  }, [label]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), color);
    } else {
      alert('Please enter a name for the label');
    }
  };

  return (
    <Modal isOpen={true} onOpenChange={(open) => !open && onClose()} size="md" classNames={{ backdrop: "bg-black/50" }}>
      <ModalContent className="bg-[#1f2937] border border-slate-700">
        {(onModalClose) => (
          <>
            <ModalHeader className="text-white">
              {label ? 'Edit Label' : 'New Label'}
            </ModalHeader>
            <ModalBody className="gap-5">
              <Input
                label="Name"
                value={name}
                onValueChange={setName}
                placeholder="e.g., 4bet, Call, Raise"
                autoFocus
                classNames={{
                  input: "text-white",
                  label: "text-slate-400",
                  inputWrapper: "bg-slate-800 border-slate-600 hover:bg-slate-700 group-data-[focus=true]:bg-slate-800"
                }}
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-14 h-10 border border-slate-600 rounded-lg cursor-pointer bg-slate-800"
                  />
                  <span className="text-sm font-mono-nums text-slate-400">{color}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Preset Colors</label>
                <div className="grid grid-cols-8 gap-2">
                  {PRESET_COLORS.map((presetColor) => (
                    <button
                      key={presetColor}
                      type="button"
                      className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                        color === presetColor
                          ? 'border-white shadow-lg scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: presetColor }}
                      onClick={() => setColor(presetColor)}
                      title={presetColor}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Preview</label>
                <div className="flex justify-center">
                  <div
                    className="px-6 py-3 rounded-lg text-white text-base font-semibold text-center min-w-[120px]"
                    style={{ backgroundColor: color }}
                  >
                    {name || 'Label Name'}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onModalClose} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button color="primary" onPress={handleSave} className="bg-[#3b82f6] text-white">
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
