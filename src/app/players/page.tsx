'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Player {
  _id: string;
  name: string;
  battingType: string;
  bowlingType: string;
  age: string;
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
    <main className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 overflow-hidden text-white">
      <div className="px-4 py-6 sm:py-10 lg:px-16">
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

        {loading ? (
          <p className="text-center text-xl mt-20">Loading players...</p>
        ) : players.length === 0 ? (
          <p className="text-center text-xl mt-20">No players registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
            {players.map((player) => (
              <div
                key={player._id}
                className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <div className="flex-shrink-0">
                  {player.imageUrl ? (
                    <Image
                      src={player.imageUrl}
                      alt={player.name}
                      width={500}
                      height={500}
                      className="rounded-full border-4 border-green-400 object-cover"
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] flex items-center justify-center rounded-full bg-gray-600 text-white text-sm border-4 border-green-400">
                      No Image
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-6xl font-semibold font-serif">
                    {player.name}
                  </h2>
                  {/* <p className="text-green-300 mt-2">
                    Batting Type: <span className="text-white">{player.battingType}</span>
                  </p>
                  <p className="text-green-300">
                    Bowling Type: <span className="text-white">{player.bowlingType}</span>
                  </p> */}
                  <p className="text-4xl text-green-300">
                    Mobile: <span className="text-white">{player.age}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
