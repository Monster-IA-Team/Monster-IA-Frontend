import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

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

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [activeView, setActiveView] = useState<'users' | 'admins'>('users');
  
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    username: '',
    password: '',
    confirm_password: ''
  });

  const fetchData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setIsLoading(true);
    try {
      const resUsers = await fetch('http://localhost:8000/api/admin/users?page=1&size=50', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json' 
        }
      });
      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        setUsers(dataUsers.data.items || []);
      }

      const resAdmins = await fetch('http://localhost:8000/api/admin/admins', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json' 
        }
      });
      if (resAdmins.ok) {
        const dataAdmins = await resAdmins.json();
        setAdmins(dataAdmins.data || []);
      }
    } catch (err) {
      console.error("Błąd pobierania danych z API", err);
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
      console.error("Błąd przy zmianie statusu", err);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    if (!window.confirm("Czy na pewno usunąć to konto administratora?")) return;
    
    try {
      await fetch(`http://localhost:8000/api/admin/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Błąd usuwania", err);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/admin/admins/create', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAdmin)
      });
      
      if (response.ok) {
        alert("Admin stworzony pomyślnie!");
        setShowAddAdmin(false);
        setNewAdmin({ email: '', username: '', password: '', confirm_password: '' });
        fetchData();
      } else {
        alert("Błąd podczas tworzenia admina. Sprawdź poprawność danych.");
      }
    } catch (err) {
      console.error("Błąd wysyłania formularza", err);
    }
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
          title="Home"
        >
          ⌂
        </Link>
      </div>

      <div className="w-full max-w-5xl mt-16">
        <h1 className="text-3xl text-lime-500 font-bold text-center mb-8 uppercase tracking-widest">
          Panel Administratora
        </h1>

        <div className="flex gap-4 justify-center mb-10 flex-wrap">
          <button
            onClick={() => setActiveView('users')}
            className={`px-8 py-3 border-2 border-lime-500 font-bold rounded-lg transition-colors ${
              activeView === 'users' 
                ? 'bg-lime-500 text-black' 
                : 'text-lime-500 hover:bg-lime-500 hover:text-black'
            }`}
          >
            Użytkownicy
          </button>
          <button
            onClick={() => setActiveView('admins')}
            className={`px-8 py-3 border-2 border-lime-500 font-bold rounded-lg transition-colors ${
              activeView === 'admins' 
                ? 'bg-lime-500 text-black' 
                : 'text-lime-500 hover:bg-lime-500 hover:text-black'
            }`}
          >
            Administratorzy
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-lime-500 font-bold animate-pulse mb-4">
            Wczytywanie z bazy danych...
          </div>
        )}

        {activeView === 'users' && (
          <div className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border-2 border-lime-500/30 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl text-lime-500 font-bold mb-6">Lista Użytkowników</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-lime-500 border-b-2 border-lime-500/50">
                    <th className="p-3">Username</th>
                    <th className="p-3">Email</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Akcja</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-lime-500/10 hover:bg-lime-500/5 transition-colors">
                      <td className="p-3 font-bold">{u.username}</td>
                      <td className="p-3 text-gray-400">{u.email}</td>
                      <td className="p-3 text-center">
                        {u.is_active ? 
                          <span className="text-lime-500">Aktywny</span> : 
                          <span className="text-red-500">Zablokowany</span>
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
                          {u.is_active ? 'ZABLOKUJ' : 'ODBLOKUJ'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !isLoading && (
                     <tr><td colSpan={4} className="p-6 text-center text-lime-500/50">Brak użytkowników do wyświetlenia.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'admins' && (
          <div className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border-2 border-lime-500/30 rounded-lg p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl text-lime-500 font-bold">Konta Administratorów</h2>
              <button 
                onClick={() => setShowAddAdmin(!showAddAdmin)}
                className="px-6 py-2 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors uppercase text-sm"
              >
                {showAddAdmin ? 'Anuluj dodawanie' : '+ Dodaj Admina'}
              </button>
            </div>

            {/* Formularz dodawania (style z login.tsx) */}
            {showAddAdmin && (
              <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-6 border-2 border-lime-500/30 rounded-lg bg-black/40">
                <input 
                  type="text" placeholder="Username" required 
                  className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg text-sm" 
                  value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} 
                />
                <input 
                  type="email" placeholder="Email" required 
                  className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg text-sm" 
                  value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} 
                />
                <input 
                  type="password" placeholder="Hasło" required 
                  className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg text-sm" 
                  value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} 
                />
                <input 
                  type="password" placeholder="Powtórz hasło" required 
                  className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg text-sm" 
                  value={newAdmin.confirm_password} onChange={e => setNewAdmin({...newAdmin, confirm_password: e.target.value})} 
                />
                <button type="submit" className="w-full px-4 py-3 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors border-2 border-lime-500">
                  ZAPISZ
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-lime-500 border-b-2 border-lime-500/50">
                    <th className="p-3">Admin</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Data utworzenia</th>
                    <th className="p-3 text-right">Akcja</th>
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
                          USUŃ
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && !isLoading && (
                     <tr><td colSpan={4} className="p-6 text-center text-lime-500/50">Brak administratorów do wyświetlenia.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;