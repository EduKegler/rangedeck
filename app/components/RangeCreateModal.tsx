'use client';

import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@heroui/react';

interface RangeCreateModalProps {
  categoryId: string;
  categoryName: string;
  onSave: (name: string, categoryId: string) => void;
  onClose: () => void;
}

export default function RangeCreateModal({ categoryId, categoryName, onSave, onClose }: RangeCreateModalProps) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), categoryId);
    } else {
      alert('Please enter a range name');
    }
  };

  return (
    <Modal isOpen={true} onOpenChange={(open) => !open && onClose()} classNames={{ backdrop: "bg-black/50" }}>
      <ModalContent className="bg-[#1f2937] border border-slate-700">
        {(onModalClose) => (
          <>
            <ModalHeader className="text-white">
              New Range in {categoryName}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Range Name"
                value={name}
                onValueChange={setName}
                placeholder="e.g., MP vs BTN, EP vs BB"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                classNames={{
                  input: "text-white",
                  label: "text-slate-400",
                  inputWrapper: "bg-slate-800 border-slate-600 hover:bg-slate-700 group-data-[focus=true]:bg-slate-800"
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onModalClose} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button color="primary" onPress={handleSave} className="bg-[#3b82f6] text-white">
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
