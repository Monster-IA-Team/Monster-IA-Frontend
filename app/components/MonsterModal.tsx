import React, { useState, useEffect, useRef } from 'react';

export interface Monster {
  id: string;
  name: string;
  description: string;
  caffeine_mg: number;
  taste_profile: string;
  sugar_free?: boolean | null;
  available_online?: boolean | null;
  available_zabka?: boolean | null;
  available_store?: boolean | null;
  premium_line?: boolean | null;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  is_sugar_free?: boolean;
  is_available_online?: boolean;
  is_available_zabka?: boolean;
  is_available_store?: boolean;
  is_premium_line?: boolean;
}

interface MonsterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  editingMonster: Monster | null;
}

const MonsterModal: React.FC<MonsterModalProps> = ({ isOpen, onClose, onSave, editingMonster }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    caffeine_mg: 160,
    taste_profile: '',
    is_sugar_free: false,
    is_available_online: false,
    is_available_zabka: false,
    is_available_store: false,
    is_premium_line: false,
    image: null as File | null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMonster) {
      setFormData({
        name: editingMonster.name || '',
        description: editingMonster.description || '',
        caffeine_mg: editingMonster.caffeine_mg ?? 160,
        taste_profile: editingMonster.taste_profile || '',
        is_sugar_free: editingMonster.is_sugar_free ?? false,
        is_available_online: editingMonster.is_available_online ?? false,
        is_available_zabka: editingMonster.is_available_zabka ?? false,
        is_available_store: editingMonster.is_available_store ?? false,
        is_premium_line: editingMonster.is_premium_line ?? false,
        image: null
      });
    } else {
      setFormData({
        name: '',
        description: '',
        caffeine_mg: 160,
        taste_profile: '',
        is_sugar_free: false,
        is_available_online: false,
        is_available_zabka: false,
        is_available_store: false,
        is_premium_line: false,
        image: null
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [editingMonster, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    if (editingMonster) data.append('id', editingMonster.id);
    data.append('name', formData.name);
    data.append('description', formData.description);
    
    data.append('caffeine_mg', (formData.caffeine_mg ?? 0).toString());
    data.append('taste_profile', formData.taste_profile);
    data.append('is_sugar_free', (formData.is_sugar_free ?? false).toString());
    data.append('is_available_online', (formData.is_available_online ?? false).toString());
    data.append('is_available_zabka', (formData.is_available_zabka ?? false).toString());
    data.append('is_available_store', (formData.is_available_store ?? false).toString());
    data.append('is_premium_line', (formData.is_premium_line ?? false).toString());
    
    if (formData.image) data.append('image', formData.image);

    await onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-[#1a1a1a] border-2 border-lime-500 rounded-lg p-8 shadow-[0_0_50px_rgba(163,230,53,0.2)] max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-lime-500 hover:text-white text-xl font-bold">✕</button>
        <h2 className="text-2xl text-lime-500 font-bold mb-6 uppercase tracking-tighter">
          {editingMonster ? 'Edit Monster' : 'Add New Monster'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Flavor Name" 
              required 
              className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 outline-none rounded-lg" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            
            <select 
              required 
              className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-lime-500 text-white outline-none rounded-lg cursor-pointer" 
              value={formData.taste_profile} 
              onChange={e => setFormData({...formData, taste_profile: e.target.value})}
            >
              <option value="" disabled hidden>Select Taste Profile</option>
              <option value="sweet">sweet</option>
              <option value="sour">sour</option>
              <option value="moderate">moderate</option>
            </select>
          </div>
          
          <textarea 
            placeholder="Description..." 
            required 
            rows={3} 
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 outline-none rounded-lg" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
          
          <div className="flex flex-col gap-2">
            <label className="text-lime-500 font-bold text-sm uppercase">Caffeine (mg):</label>
            <input 
              type="number" 
              required 
              min="0" 
              className="w-full md:w-1/3 px-4 py-3 bg-transparent border-2 border-lime-500 text-white outline-none rounded-lg" 
              value={formData.caffeine_mg} 
              onChange={e => setFormData({...formData, caffeine_mg: Number(e.target.value)})} 
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-2 border-lime-500/30 p-4 rounded-lg bg-black/40">
            {['is_sugar_free', 'is_available_online', 'is_available_zabka', 'is_available_store', 'is_premium_line'].map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-white">
                <input 
                  type="checkbox" 
                  className="accent-lime-500 w-4 h-4" 
                  checked={(formData as any)[key]} 
                  onChange={e => setFormData({...formData, [key]: e.target.checked})} 
                />
                {key.replace(/is_|_/g, ' ').replace('available', 'avail.')}
              </label>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-lime-500 font-bold text-sm uppercase">Can Image (JPG/PNG):</label>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              required={!editingMonster} 
              onChange={e => setFormData({...formData, image: e.target.files ? e.target.files[0] : null})} 
              className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-lime-500 file:text-black hover:file:bg-lime-400" 
            />
          </div>
          
          <div className="flex gap-4 pt-4 border-t-2 border-lime-500/30">
            <button type="submit" className="flex-1 px-8 py-3 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 border-2 border-lime-500">SAVE</button>
            <button type="button" onClick={onClose} className="flex-1 px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MonsterModal;