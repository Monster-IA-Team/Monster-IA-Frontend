import React, { useState } from 'react';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminData: any) => Promise<void>;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirm_password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onConfirm(formData);
    setIsSubmitting(false);
    setFormData({ email: '', username: '', password: '', confirm_password: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md bg-[#1a1a1a] border-2 border-lime-500 rounded-lg p-8 shadow-[0_0_50px_rgba(163,230,53,0.2)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-lime-500 hover:text-white transition-colors text-xl font-bold"
        >
          ✕
        </button>
        
        <h2 className="text-2xl text-lime-500 font-bold mb-6 text-center uppercase tracking-tighter">
          New Administrator
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Username" required 
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg" 
            value={formData.username} 
            onChange={e => setFormData({...formData, username: e.target.value})} 
          />
          <input 
            type="email" placeholder="Email Address" required 
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            type="password" placeholder="Password" required 
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
          <input 
            type="password" placeholder="Confirm Password" required 
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg" 
            value={formData.confirm_password} 
            onChange={e => setFormData({...formData, confirm_password: e.target.value})} 
          />
          
          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 px-8 py-3 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors border-2 border-lime-500 disabled:opacity-50"
            >
              {isSubmitting ? 'SAVING...' : 'CREATE'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors text-center"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;