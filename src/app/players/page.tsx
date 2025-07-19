'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Player {
  _id: string;
  name: string;
  battingType: string;
  bowlingType: string;
  phone: string;
  imageUrl?: string;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Player>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null); // id of player being deleted/edited
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      setPlayers(data.players || []);
    } catch {
      setError('Failed to fetch players');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = async (_id: string) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    setActionLoading(_id);
    setError(null);
    try {
      const res = await fetch('/api/players', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id }),
      });
      const result = await res.json();
      if (result.success) {
        setPlayers((prev) => prev.filter((p) => p._id !== _id));
      } else {
        setError(result.message || 'Failed to delete player');
      }
    } catch {
      setError('Failed to delete player');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (player: Player) => {
    setEditId(player._id);
    setEditForm({ ...player });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!editId) return;
    setActionLoading(editId);
    setError(null);
    try {
      const res = await fetch('/api/players', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: editId, ...editForm }),
      });
      const result = await res.json();
      if (result.success) {
        setPlayers((prev) =>
          prev.map((p) => (p._id === editId ? { ...p, ...editForm } : p))
        );
        setEditId(null);
        setEditForm({});
      } else {
        setError(result.message || 'Failed to update player');
      }
    } catch {
      setError('Failed to update player');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({});
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 text-gray-900 flex flex-col items-center py-10">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold print:hidden text-blue-700">Registered Players</h1>
          <div className="space-x-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
            >
              Export as PDF
            </button>
            <Link href="/" className="text-blue-500 hover:underline font-semibold">
              ← Back to Registration
            </Link>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-center font-medium border border-red-200 animate-fade-in">
            {error}
          </div>
        )}
        {loading ? (
          <p className="text-center text-xl mt-20">Loading players...</p>
        ) : !players || players.length === 0 ? (
          <p className="text-center text-xl mt-20">No players registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {players?.map((player, index) => (
              <div
                key={player._id}
                className={`relative bg-white rounded-2xl  shadow-lg border border-blue-100 p-6 flex flex-col items-center transition-transform hover:scale-[1.02] print:shadow-none print:border-0 print:p-0 print:bg-white print:items-center print:justify-center ${index !== (players?.length || 0) - 1 ? 'print:break-after-page' : ''}`}
              >
                <div
                  className="w-60 h-60 rounded-full print:rounded-2xl border-4 border-blue-300 overflow-hidden flex items-center justify-center bg-blue-50 mb-4 print:w-[27rem] print:h-[27rem] print:border-[8px] print:mb-8"
                >
                  {player.imageUrl ? (
                    <Image
                      src={player.imageUrl}
                      alt={player.name}
                      width={380}
                      height={380}
                      className="object-cover w-full h-full print:w-[26rem] print:h-[26rem]"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm print:text-2xl">No Image</span>
                  )}
                </div>
                {editId === player._id ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name || ''}
                      onChange={handleEditChange}
                      className="mb-2 w-full p-2 border border-blue-200 rounded text-gray-700 text-2xl font-bold text-center"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone || ''}
                      onChange={handleEditChange}
                      className="mb-2 w-full p-2 border border-blue-200 rounded text-gray-700 text-center"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleEditSave}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-semibold disabled:opacity-60"
                        disabled={actionLoading === player._id}
                      >
                        {actionLoading === player._id ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded font-semibold"
                        disabled={actionLoading === player._id}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full flex flex-col items-center print:items-center">
                      <div className="print:text-[10rem] print:font-extrabold print:text-blue-200 text-lg text-blue-300 font-bold mb-2 print:mb-8">#{index + 1}</div>
                      <h2 className="text-2xl font-bold mb-1 text-blue-700 text-center print:text-[3.5rem] print:mb-4 print:text-blue-900 print:font-extrabold">{player.name}</h2>
                      <p className="text-lg text-blue-500 mb-1 text-center print:text-[2.5rem] print:mb-4 print:text-blue-700 print:font-bold">
                        Mobile: <span className="text-gray-700 print:text-blue-900 print:font-extrabold">{player.phone}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4 print:hidden">
                      <button
                        onClick={() => handleEdit(player)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded font-semibold"
                        disabled={actionLoading === player._id}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(player._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold"
                        disabled={actionLoading === player._id}
                      >
                        {actionLoading === player._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
