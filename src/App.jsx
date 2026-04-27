import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, RotateCcw, Filter } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const games = gamesData;
  
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = ['All', 'Puzzle', 'Classic', 'Arcade', 'Action'];

  return (
    <div className="min-h-screen flex flex-col pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto" id="app-container">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6" id="headerSection">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-white">PORTAL GAMES</h1>
          </div>
          <p className="text-neutral-400 max-w-md">
            Clean, fast, and unblocked. High-quality web games for quick breaks.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative group" id="searchContainer">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              id="gameSearchBar"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-full py-2.5 pl-10 pr-4 w-full md:w-64 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-neutral-100 placeholder:text-neutral-600"
            />
          </div>
          <div className="flex flex-wrap gap-2" id="categoryFilters">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-transparent border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1" id="mainGrid">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                id={`card-${game.id}`}
                onClick={() => setSelectedGame(game)}
                className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-colors"
                whileHover={{ y: -4 }}
              >
                <div className="aspect-video relative overflow-hidden bg-neutral-800">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-400/20 backdrop-blur-md">
                      {game.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                    {game.title}
                  </h3>
                  <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-indigo-400" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500" id="noResults">
            <Filter className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">No games found matching your search.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
              className="mt-4 text-indigo-400 hover:underline text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col p-4 md:p-8"
            id="gameModal"
          >
            <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto w-full">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
                  title="Go Back"
                >
                  <X className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tighter text-white">
                    {selectedGame.title}
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">
                    Playing: {selectedGame.category}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const iframe = document.getElementById('game-iframe');
                    if (iframe) iframe.src = iframe.src;
                  }}
                  className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
                  title="Restart Game"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-full text-xs uppercase tracking-widest transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex-1 max-w-6xl mx-auto w-full glass-container relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-800"
              id="iframeWrapper"
            >
              <iframe
                id="game-iframe"
                src={selectedGame.url}
                className="w-full h-full border-none"
                title={selectedGame.title}
                allow="fullscreen"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-neutral-900 border-dashed" id="footerSection">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-600 text-xs font-mono uppercase tracking-widest">
          <p>© 2026 Portal Games - Unblocked Entertainment</p>
          <div className="flex gap-6">
            <span className="hover:text-indigo-400 cursor-pointer">Archive</span>
            <span className="hover:text-indigo-400 cursor-pointer">Request Game</span>
            <span className="hover:text-indigo-400 cursor-pointer">Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
