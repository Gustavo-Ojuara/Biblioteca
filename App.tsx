
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ClipboardList, 
  Menu, 
  X,
  Library,
  BarChart3
} from 'lucide-react';
import { View, Reader, Book, Loan } from './types';
import Dashboard from './components/Dashboard';
import BooksManager from './components/BooksManager';
import ReadersManager from './components/ReadersManager';
import LoansManager from './components/LoansManager';
import ReportsManager from './components/ReportsManager';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence logic
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('lib_books');
    return saved ? JSON.parse(saved) : [];
  });
  const [readers, setReaders] = useState<Reader[]>(() => {
    const saved = localStorage.getItem('lib_readers');
    return saved ? JSON.parse(saved) : [];
  });
  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('lib_loans');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lib_books', JSON.stringify(books));
    localStorage.setItem('lib_readers', JSON.stringify(readers));
    localStorage.setItem('lib_loans', JSON.stringify(loans));
  }, [books, readers, loans]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard books={books} readers={readers} loans={loans} />;
      case 'books':
        return <BooksManager books={books} setBooks={setBooks} />;
      case 'readers':
        return <ReadersManager readers={readers} setReaders={setReaders} />;
      case 'loans':
        return <LoansManager 
                  loans={loans} 
                  setLoans={setLoans} 
                  books={books} 
                  setBooks={setBooks} 
                  readers={readers} 
                />;
      case 'reports':
        return <ReportsManager books={books} loans={loans} readers={readers} />;
      default:
        return <Dashboard books={books} readers={readers} loans={loans} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Library size={24} />
          <span>BiblioSmart</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 text-slate-500">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed md:static z-40 w-64 h-full bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out md:translate-x-0
      `}>
        <div className="p-6 hidden md:flex items-center gap-3 text-indigo-600 font-bold text-2xl border-b border-slate-100 mb-6">
          <Library size={32} />
          <span>BiblioSmart</span>
        </div>
        
        <nav className="px-4 space-y-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('books')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'books' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Livros</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('readers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'readers' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users size={20} />
            <span className="font-medium">Leitores</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('loans')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'loans' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ClipboardList size={20} />
            <span className="font-medium">Empréstimos</span>
          </button>

          <button 
            onClick={() => setCurrentView('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'reports' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Relatórios</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
