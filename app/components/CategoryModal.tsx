'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@heroui/react';
import type { Category } from '../types/range';

interface CategoryModalProps {
  category?: Category;
  onSave: (name: string) => void;
  onClose: () => void;
}

export default function CategoryModal({ category, onSave, onClose }: CategoryModalProps) {
  const [name, setName] = useState(category?.name || '');

  useEffect(() => {
    setName(category?.name || '');
  }, [category]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    } else {
      alert('Please enter a category name');
    }
  };

  return (
    <Modal isOpen={true} onOpenChange={(open) => !open && onClose()} classNames={{ backdrop: "bg-black/50" }}>
      <ModalContent className="bg-[#1f2937] border border-slate-700">
        {(onModalClose) => (
          <>
            <ModalHeader className="text-white">
              {category ? 'Edit Category' : 'New Category'}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Category Name"
                value={name}
                onValueChange={setName}
                placeholder="e.g., 4Bet, Squeeze"
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
                {category ? 'Save' : 'Create'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
