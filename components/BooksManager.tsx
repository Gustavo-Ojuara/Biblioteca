
import React, { useState } from 'react';
import { Book } from '../types';
// Fixed: Added 'X' to the imports from lucide-react
import { Search, Plus, Trash2, Sparkles, Loader2, X } from 'lucide-react';
import { getBookDetails } from '../services/gemini';

interface Props {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const BooksManager: React.FC<Props> = ({ books, setBooks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: ''
  });

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const book: Book = {
      ...newBook,
      id: crypto.randomUUID(),
      status: 'available'
    };
    setBooks([...books, book]);
    setNewBook({ title: '', author: '', isbn: '', genre: '', description: '' });
    setIsModalOpen(false);
  };

  const handleMagicFill = async () => {
    if (!newBook.title || !newBook.author) {
      alert("Por favor, preencha Título e Autor para usar a IA.");
      return;
    }
    setIsAiLoading(true);
    const details = await getBookDetails(newBook.title, newBook.author);
    setNewBook(prev => ({
      ...prev,
      genre: details.genre,
      description: details.description
    }));
    setIsAiLoading(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este livro?")) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Acervo de Livros</h1>
          <p className="text-slate-500">Gerencie os títulos disponíveis na sua biblioteca.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Livro
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Pesquisar por título ou autor..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400">
            Nenhum livro encontrado.
          </div>
        ) : (
          filteredBooks.map(book => (
            <div key={book.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-slate-100 text-slate-600`}>
                    {book.genre || 'Sem Gênero'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${book.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {book.status === 'available' ? 'Disponível' : 'Emprestado'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{book.author}</p>
                <p className="text-xs text-slate-400 line-clamp-3 italic mb-4">"{book.description || 'Sem descrição.'}"</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <span className="text-xs text-slate-400">ISBN: {book.isbn || 'N/A'}</span>
                <button 
                  onClick={() => handleDelete(book.id)}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Novo Livro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Cadastrar Novo Livro</h2>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                  <input required className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Autor</label>
                  <input required className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
                  <input className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
                </div>
              </div>
              
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium text-slate-700">Gênero</label>
                   <button 
                    type="button" 
                    onClick={handleMagicFill}
                    disabled={isAiLoading}
                    className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:text-indigo-800 disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Preencher com IA
                  </button>
                </div>
                <input className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newBook.genre} onChange={e => setNewBook({...newBook, genre: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})} />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksManager;
