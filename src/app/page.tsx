'use client';
import { useState } from 'react';

type PlayerForm = {
  name: string;
  battingType: string;
  bowlingType: string;
  phone: string;
  image: File | null;
};

export default function Home() {
  const [form, setForm] = useState<PlayerForm>({
    name: '',
    battingType: 'N/A',
    bowlingType: 'N/A',
    phone: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as Blob | string);
      }
    });

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success === false && result.message) {
        setError(result.message);
      } else {
        setMessage(result.message || 'Registration successful!');
        setForm({
          name: '',
          battingType: 'N/A',
          bowlingType: 'N/A',
          phone: '',
          image: null,
        });
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6 tracking-tight">Register Player</h1>
        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center font-medium border border-green-200 animate-fade-in">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-center font-medium border border-red-200 animate-fade-in">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Profile Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-2 text-gray-700"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-200"
              required
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Phone Number</label>
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-200"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {loading ? 'Registering...' : 'Submit'}
          </button>
        </form>
      </div>
    </main>
  );
}
