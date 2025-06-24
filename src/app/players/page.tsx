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

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch('/api/players');
        const data = await res.json();
        setPlayers(data.players);
      } catch (error) {
        console.error('Failed to fetch players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <main className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white print:bg-white print:text-black">
      <div className="px-4 py-6 lg:px-16">

        {/* Web header (hide in print) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-3xl font-bold text-green-300">Registered Players</h1>
          <div className="space-x-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Export as PDF
            </button>
            <Link href="/" className="text-green-400 hover:underline">
              ← Back to Registration
            </Link>
          </div>
        </div>

        {/* Players List */}
        {loading ? (
          <p className="text-center text-xl mt-20">Loading players...</p>
        ) : players.length === 0 ? (
          <p className="text-center text-xl mt-20">No players registered yet.</p>
        ) : (
          <div>
            {players.map((player, index) => (
              <div
                key={player._id}
                className="min-h-screen print:min-h-10 flex flex-col justify-center border-8 border-green-500 rounded-2xl p-10 my-10 print:my-4 bg-gray-800 shadow-xl print:shadow-none print:break-after-page"
              >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 h-full">
                  {/* Left Circular Image */}
                  <div className="w-[400px] h-[500px] rounded-2xl border-4 border-green-400 overflow-hidden flex items-center justify-center bg-gray-600">
                    {player.imageUrl ? (
                      <Image
                        src={player.imageUrl}
                        alt={player.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-white text-sm">No Image</span>
                    )}
                  </div>

                  {/* Center Details */}
                  <div className="text-center lg:text-left flex-1">
                    <h2 className="text-6xl font-bold font-serif mb-6">{player.name}</h2>
                    <p className="text-4xl text-green-300">
                      Mobile: <span className="text-white">{player.phone}</span>
                    </p>
                  </div>

                  {/* Right Chronological Number */}
                  <div className="text-9xl font-bold text-green-500">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
