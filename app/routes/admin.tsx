import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import AddAdminModal from '../components/AddAdminModal';
import MonsterModal from '../components/MonsterModal';

interface User {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  roles: string[];
  created_at: string;
}

interface AdminAccount {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  roles: string[];
  created_at: string;
}

interface Monster {
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

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [activeView, setActiveView] = useState<'users' | 'admins' | 'monsters'>('users');
  
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMonsterModalOpen, setIsMonsterModalOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState<Monster | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setIsLoading(true);
    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      };

      const [resUsers, resAdmins, resMonsters] = await Promise.all([
        fetch('http://localhost:8000/api/admin/users?page=1&size=50', { headers }),
        fetch('http://localhost:8000/api/admin/admins', { headers }),
        fetch('http://localhost:8000/api/monsters/admin/list?page=1&size=50', { headers })
      ]);

      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        setUsers(dataUsers.data?.items || []);
      }

      if (resAdmins.ok) {
        const dataAdmins = await resAdmins.json();
        setAdmins(dataAdmins.data || []);
      }

      if (resMonsters.ok) {
        const dataMonsters = await resMonsters.json();
        setMonsters(dataMonsters.data?.items || dataMonsters.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleBlock = async (id: string, active: boolean) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const action = active ? 'block' : 'unblock';
    try {
      await fetch(`http://localhost:8000/api/admin/users/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this administrator account?")) return;
    
    try {
      await fetch(`http://localhost:8000/api/admin/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAdminConfirm = async (adminData: any) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/admin/admins/create', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });
      
      if (response.ok) {
        setIsAdminModalOpen(false);
        fetchData();
      } else {
        alert("Error creating administrator. Please verify the data.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMonster = async (formData: FormData) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const isEdit = !!editingMonster;
    const url = isEdit 
      ? 'http://localhost:8000/api/monsters/admin/update' 
      : 'http://localhost:8000/api/monsters/admin/add';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        setIsMonsterModalOpen(false);
        fetchData();
      } else {
        alert("Error saving monster.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMonster = async (id: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this monster?")) return;
    
    try {
      await fetch(`http://localhost:8000/api/monsters/admin/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const renderBool = (val: boolean | null | undefined) => {
    if (val === true) return <span className="text-lime-500 font-bold">Yes</span>;
    if (val === false) return <span className="text-red-500 font-bold">No</span>;
    return <span className="text-gray-500 font-bold">-</span>; 
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6 relative overflow-x-hidden font-sans text-white"
      style={{
        backgroundColor: "#1a1a1a",
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,.03) 2px,
          rgba(255,255,255,.03) 4px
        )`,
      }}
    >
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold"
        >
          ⌂
        </Link>
      </div>

      <div className="w-full max-w-[1400px] mt-16">
        <h1 className="text-3xl text-lime-500 font-bold text-center mb-8 uppercase tracking-widest">
          Admin Dashboard
        </h1>

        <div className="flex gap-4 justify-center mb-10 flex-wrap">
          <button
            onClick={() => setActiveView('users')}
            className={`px-8 py-3 border-2 border-lime-500 font-bold rounded-lg transition-colors uppercase ${
              activeView === 'users' ? 'bg-lime-500 text-black' : 'text-lime-500 hover:bg-lime-500 hover:text-black'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveView('admins')}
            className={`px-8 py-3 border-2 border-lime-500 font-bold rounded-lg transition-colors uppercase ${
              activeView === 'admins' ? 'bg-lime-500 text-black' : 'text-lime-500 hover:bg-lime-500 hover:text-black'
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setActiveView('monsters')}
            className={`px-8 py-3 border-2 border-lime-500 font-bold rounded-lg transition-colors uppercase ${
              activeView === 'monsters' ? 'bg-lime-500 text-black' : 'text-lime-500 hover:bg-lime-500 hover:text-black'
            }`}
          >
            Monsters
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-lime-500 font-bold animate-pulse mb-4">
            LOADING FROM DATABASE...
          </div>
        )}

        {activeView === 'users' && (
          <div className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border-2 border-lime-500/30 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl text-lime-500 font-bold mb-6 uppercase">User List</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-lime-500 border-b-2 border-lime-500/50 uppercase">
                    <th className="p-3">Username</th>
                    <th className="p-3">Email</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-lime-500/10 hover:bg-lime-500/5 transition-colors">
                      <td className="p-3 font-bold">{u.username}</td>
                      <td className="p-3 text-gray-400">{u.email}</td>
                      <td className="p-3 text-center">
                        {u.is_active ? 
                          <span className="text-lime-500">ACTIVE</span> : 
                          <span className="text-red-500">BANNED</span>
                        }
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleToggleBlock(u.id, u.is_active)}
                          className={`px-4 py-1.5 rounded-lg border-2 font-bold text-xs transition-colors ${
                            u.is_active 
                              ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black' 
                              : 'border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-black'
                          }`}
                        >
                          {u.is_active ? 'BAN' : 'UNBAN'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !isLoading && (
                     <tr><td colSpan={4} className="p-6 text-center text-lime-500/50">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'admins' && (
          <div className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border-2 border-lime-500/30 rounded-lg p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl text-lime-500 font-bold uppercase">Admin Accounts</h2>
              <button 
                onClick={() => setIsAdminModalOpen(true)}
                className="px-6 py-2 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors uppercase text-sm"
              >
                + ADD ADMIN
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-lime-500 border-b-2 border-lime-500/50 uppercase">
                    <th className="p-3">Admin</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(a => (
                    <tr key={a.id} className="border-b border-lime-500/10 hover:bg-lime-500/5 transition-colors">
                      <td className="p-3 font-bold">{a.username}</td>
                      <td className="p-3 text-gray-400">{a.email}</td>
                      <td className="p-3 text-sm text-gray-400">{new Date(a.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDeleteAdmin(a.id)}
                          className="px-4 py-1.5 rounded-lg border-2 border-red-500 text-red-500 font-bold text-xs hover:bg-red-500 hover:text-black transition-colors"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && !isLoading && (
                     <tr><td colSpan={4} className="p-6 text-center text-lime-500/50">No admins found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'monsters' && (
          <div className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border-2 border-lime-500/30 rounded-lg p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl text-lime-500 font-bold uppercase">Monster Inventory</h2>
              <button 
                onClick={() => { setEditingMonster(null); setIsMonsterModalOpen(true); }}
                className="px-6 py-2 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors uppercase text-sm"
              >
                + ADD MONSTER
              </button>
            </div>

            <div className="overflow-x-auto">
              {/* Zastosowano whitespace-nowrap, aby długie wiersze się nie łamały tylko dodawały scrollbar */}
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-lime-500 border-b-2 border-lime-500/50 uppercase text-xs">
                    <th className="p-3">IMG</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Taste</th>
                    <th className="p-3 text-center">Caff.</th>
                    <th className="p-3 text-center" title="Sugar Free">SF</th>
                    <th className="p-3 text-center" title="Available Online">ONL</th>
                    <th className="p-3 text-center" title="Available Zabka">ZAB</th>
                    <th className="p-3 text-center" title="Available Store">STR</th>
                    <th className="p-3 text-center" title="Premium Line">PREM</th>
                    <th className="p-3">Added</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {monsters.map(m => {
                    // Wsparcie obu konwencji (z "is_" i bez, ponieważ backend zwraca bez)
                    const isSF = m.sugar_free ?? m.is_sugar_free;
                    const isOnline = m.available_online ?? m.is_available_online;
                    const isZabka = m.available_zabka ?? m.is_available_zabka;
                    const isStore = m.available_store ?? m.is_available_store;
                    const isPrem = m.premium_line ?? m.is_premium_line;

                    return (
                      <tr key={m.id} className="border-b border-lime-500/10 hover:bg-lime-500/5 transition-colors">
                        <td className="p-3">
                          {m.image_url ? (
                            <img src={m.image_url} alt={m.name} className="w-10 h-10 object-contain rounded bg-black/50 border border-lime-500/30" />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center border border-lime-500/30 rounded text-[10px] text-lime-500/50">NO IMG</div>
                          )}
                        </td>
                        <td className="p-3 font-bold">{m.name}</td>
                        <td className="p-3 max-w-[150px] truncate text-gray-400" title={m.description}>
                          {m.description}
                        </td>
                        <td className="p-3 text-gray-400">{m.taste_profile}</td>
                        <td className="p-3 text-center text-lime-500 font-mono">{m.caffeine_mg}mg</td>
                        
                        <td className="p-3 text-center">{renderBool(isSF)}</td>
                        <td className="p-3 text-center">{renderBool(isOnline)}</td>
                        <td className="p-3 text-center">{renderBool(isZabka)}</td>
                        <td className="p-3 text-center">{renderBool(isStore)}</td>
                        <td className="p-3 text-center">{renderBool(isPrem)}</td>
                        
                        <td className="p-3 text-xs text-gray-400">
                          {m.created_at ? new Date(m.created_at).toLocaleDateString() : '-'}
                        </td>
                        
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => { 
                                setEditingMonster({
                                  ...m,
                                  is_sugar_free: isSF ?? false,
                                  is_available_online: isOnline ?? false,
                                  is_available_zabka: isZabka ?? false,
                                  is_available_store: isStore ?? false,
                                  is_premium_line: isPrem ?? false,
                                }); 
                                setIsMonsterModalOpen(true); 
                              }}
                              className="px-3 py-1 rounded border-2 border-blue-500 text-blue-500 font-bold text-xs hover:bg-blue-500 hover:text-black transition-colors"
                            >
                              EDIT
                            </button>
                            <button 
                              onClick={() => handleDeleteMonster(m.id)}
                              className="px-3 py-1 rounded border-2 border-red-500 text-red-500 font-bold text-xs hover:bg-red-500 hover:text-black transition-colors"
                            >
                              DELETE
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {monsters.length === 0 && !isLoading && (
                     <tr><td colSpan={12} className="p-6 text-center text-lime-500/50">No monsters found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AddAdminModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onConfirm={handleCreateAdminConfirm} 
      />

      <MonsterModal 
        isOpen={isMonsterModalOpen} 
        onClose={() => setIsMonsterModalOpen(false)} 
        onSave={handleSaveMonster} 
        editingMonster={editingMonster} 
      />
    </div>
  );
};

export default Admin;