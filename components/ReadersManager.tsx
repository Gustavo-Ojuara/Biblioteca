
import React, { useState } from 'react';
import { Reader } from '../types';
import { Plus, Search, Calendar, Trash2, X, Hospital, User, MapPin } from 'lucide-react';

interface Props {
  readers: Reader[];
  setReaders: React.Dispatch<React.SetStateAction<Reader[]>>;
}

const ReadersManager: React.FC<Props> = ({ readers, setReaders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReader, setNewReader] = useState({
    name: '',
    admissionDate: '',
    sector: '',
    wing: '',
    room: '',
    bed: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const reader: Reader = {
      ...newReader,
      id: crypto.randomUUID(),
      joinedAt: new Date().toISOString()
    };
    setReaders([...readers, reader]);
    setNewReader({ name: '', admissionDate: '', sector: '', wing: '', room: '', bed: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja remover este leitor?")) {
      setReaders(readers.filter(r => r.id !== id));
    }
  };

  const filteredReaders = readers.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.sector?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leitores</h1>
          <p className="text-slate-500">Gerenciamento de usuários e localizações hospitalares.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Leitor
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Pesquisar por nome ou setor..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Leitor</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Localização</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Internação</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReaders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Nenhum leitor encontrado.</td>
                </tr>
              ) : (
                filteredReaders.map(reader => (
                  <tr key={reader.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                          {reader.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{reader.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">{reader.sector} - {reader.wing}</p>
                        <p className="text-slate-400 text-xs">Q. {reader.room} - L. {reader.bed}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                        <Hospital size={14} />
                        {reader.admissionDate ? new Date(reader.admissionDate).toLocaleDateString() : 'Não informada'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(reader.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Cadastro de Leitor</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <User size={14} /> Nome Completo
                  </label>
                  <input required className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newReader.name} onChange={e => setNewReader({...newReader, name: e.target.value})} />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Hospital size={14} /> Data de Internação
                  </label>
                  <input type="date" required className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newReader.admissionDate} onChange={e => setNewReader({...newReader, admissionDate: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <MapPin size={14} /> Setor
                  </label>
                  <input required placeholder="Ex: UTI, Internação" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newReader.sector} onChange={e => setNewReader({...newReader, sector: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    Ala
                  </label>
                  <input required placeholder="Ex: Ala A, Norte" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newReader.wing} onChange={e => setNewReader({...newReader, wing: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quarto</label>
                  <input required placeholder="Ex: 102" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newReader.room} onChange={e => setNewReader({...newReader, room: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Leito</label>
                  <input required placeholder="Ex: 01" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={newReader.bed} onChange={e => setNewReader({...newReader, bed: e.target.value})} />
                </div>
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

export default ReadersManager;
