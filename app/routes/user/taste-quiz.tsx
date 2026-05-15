import React, { useState } from 'react';
import { Link } from 'react-router'; // lub 'react-router-dom' w zależności od Twojego setupu

const TasteQuiz: React.FC = () => {
  const [formData, setFormData] = useState({
    shop_type: 0,
    is_zabka: false,
    high_budget: false,
    sugar_free: false,
    taste_preference: 0
  });

  const [results, setResults] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://localhost:8000/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data: string[] = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching your matches. Please try again.');
    } finally {
      setIsLoading(false);
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
        >
          ⌂
        </Link>
      </div>

      <div className="w-full max-w-2xl mt-16 flex flex-col items-center">
        <h1 className="text-3xl text-lime-500 font-bold text-center mb-4 uppercase tracking-widest">
          Taste Quiz
        </h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          Answer a few quick questions to find your perfect Monster Energy match!
        </p>

        <div className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border-2 border-lime-500/30 rounded-lg p-8 shadow-[0_0_30px_rgba(163,230,53,0.1)]">
          
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="form-control">
              <label className="block text-lime-500 font-bold mb-2 uppercase text-sm">
                What taste profile do you prefer?
              </label>
              <select 
                className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-lime-500/50 focus:border-lime-500 text-white outline-none rounded-lg cursor-pointer transition-colors"
                value={formData.taste_preference}
                onChange={e => setFormData({...formData, taste_preference: Number(e.target.value)})}
              >
                <option value={0}>Sweet</option>
                <option value={1}>Sour</option>
                <option value={2}>Moderate / Balanced</option>
              </select>
            </div>

            <div className="form-control">
              <label className="block text-lime-500 font-bold mb-2 uppercase text-sm">
                Where do you usually buy?
              </label>
              <select 
                className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-lime-500/50 focus:border-lime-500 text-white outline-none rounded-lg cursor-pointer transition-colors"
                value={formData.shop_type}
                onChange={e => setFormData({...formData, shop_type: Number(e.target.value)})}
              >
                <option value={0}>Local Store / Supermarket</option>
                <option value={1}>Online Stores</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              
              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-lime-500/30 rounded-lg hover:border-lime-500/80 transition-colors bg-black/40">
                <input 
                  type="checkbox" 
                  className="accent-lime-500 w-5 h-5"
                  checked={formData.sugar_free}
                  onChange={e => setFormData({...formData, sugar_free: e.target.checked})}
                />
                <span className="font-bold text-sm">Zero Sugar</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-lime-500/30 rounded-lg hover:border-lime-500/80 transition-colors bg-black/40">
                <input 
                  type="checkbox" 
                  className="accent-lime-500 w-5 h-5"
                  checked={formData.is_zabka}
                  onChange={e => setFormData({...formData, is_zabka: e.target.checked})}
                />
                <span className="font-bold text-sm">Żabka available</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-lime-500/30 rounded-lg hover:border-lime-500/80 transition-colors bg-black/40">
                <input 
                  type="checkbox" 
                  className="accent-lime-500 w-5 h-5"
                  checked={formData.high_budget}
                  onChange={e => setFormData({...formData, high_budget: e.target.checked})}
                />
                <span className="font-bold text-sm">High Budget (Imports)</span>
              </label>

            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-8 px-8 py-4 bg-lime-500 text-black font-bold text-lg rounded-lg hover:bg-lime-400 transition-colors border-2 border-lime-500 disabled:opacity-50"
            >
              {isLoading ? 'FINDING MATCHES...' : 'GET RECOMMENDATIONS'}
            </button>
          </form>

        </div>

        {error && (
          <div className="w-full max-w-2xl mt-8 p-4 border-2 border-red-500 bg-red-500/10 text-red-500 text-center rounded-lg font-bold">
            {error}
          </div>
        )}

        {results !== null && !isLoading && (
          <div className="w-full max-w-2xl mt-8 flex flex-col gap-4">
            <h2 className="text-xl text-lime-500 font-bold uppercase border-b-2 border-lime-500/30 pb-2 mb-4">
              Your Recommended Monsters:
            </h2>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((monster, index) => (
                  <div 
                    key={index}
                    className="p-4 border-2 border-lime-500/50 rounded-lg bg-black/60 flex items-center justify-between shadow-[0_0_15px_rgba(163,230,53,0.1)]"
                  >
                    <span className="font-bold text-lg">{monster}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border-2 border-lime-500/30 rounded-lg bg-black/40 text-center text-gray-400">
                Sorry, we couldn't find a Monster matching these exact criteria. Try changing your preferences!
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TasteQuiz;