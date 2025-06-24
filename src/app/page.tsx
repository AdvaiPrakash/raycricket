'use client';
import { useState } from 'react';

type PlayerForm = {
  name: string;
  battingType: string;
  bowlingType: string;
  age: string;
  image: File | null;
};

export default function Home() {
  const [form, setForm] = useState<PlayerForm>({
    name: '',
    battingType: '',
    bowlingType: '',
    age: '',
    image: null,
  });

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

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as Blob | string);
      }
    });

    const res = await fetch('/api/register', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    alert(result.message);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Register Player</h1>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-gray-500 placeholder:text-gray-500"
        />

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-gray-500"
          required
        />

        <select
          name="battingType"
          value={form.battingType}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-gray-500"
          required
        >
          <option value="">Select Batting Type</option>
          <option value="Right Hand">Right Hand</option>
          <option value="Left Hand">Left Hand</option>
        </select>

        <select
          name="bowlingType"
          value={form.bowlingType}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-gray-500"
          required
        >
          <option value="">Select Bowling Type</option>
          <option value="Right Hand">Right Hand</option>
          <option value="Left Hand">Left Hand</option>
        </select>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-gray-500"
          required
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </main>
  );
}
