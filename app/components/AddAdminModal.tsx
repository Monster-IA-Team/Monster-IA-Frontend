import React, { useState } from 'react';
import type { CreateAdminRequest } from '../services/types';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminData: CreateAdminRequest) => Promise<void>;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState<CreateAdminRequest & { confirm_password: string }>({
    email: '',
    username: '',
    password: '',
    confirm_password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const getButtonText = (): string => {
    if (isSubmitting) return 'CREATING...';
    if (success) return '✓ DONE';
    return 'CREATE';
  };

  // ...rest of component

  const validateForm = (): string | null => {
    if (!formData.username.trim()) return 'Username is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (!formData.confirm_password) return 'Please confirm your password';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirm_password) return 'Passwords do not match';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Invalid email address';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(formData as CreateAdminRequest);
      setSuccess(true);
      setFormData({ email: '', username: '', password: '', confirm_password: '' });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create administrator');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
      ></div>

      <div className="relative w-full max-w-md bg-[#1a1a1a] border-2 border-lime-500 rounded-lg p-8 shadow-[0_0_50px_rgba(163,230,53,0.2)]">
        <button 
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-lime-500 hover:text-white transition-colors text-xl font-bold disabled:opacity-50"
          aria-label="Close modal"
        >
          ✕
        </button>
        
        <h2 className="text-2xl text-lime-500 font-bold mb-6 text-center uppercase tracking-tighter">
          New Administrator
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border-2 border-red-500 rounded-lg text-red-400 text-sm font-mono">
            ⚠ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-lime-500/20 border-2 border-lime-500 rounded-lg text-lime-400 text-sm font-mono">
            ✓ Administrator created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text"
            placeholder="Username"
            disabled={isSubmitting || success}
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <input 
            type="email"
            placeholder="Email Address"
            disabled={isSubmitting || success}
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password"
            placeholder="Password (min. 8 characters)"
            disabled={isSubmitting || success}
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <input 
            type="password"
            placeholder="Confirm Password"
            disabled={isSubmitting || success}
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            value={formData.confirm_password}
            onChange={e => setFormData({...formData, confirm_password: e.target.value})}
          />
          
          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting || success}
              className="flex-1 px-8 py-3 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors border-2 border-lime-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getButtonText()}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
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