import React from 'react';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form className="flex flex-col gap-2 w-64">
        <input className="p-2 border rounded" type="text" placeholder="Username" />
        <input className="p-2 border rounded" type="password" placeholder="Password" />
        <button className="bg-blue-700 text-white p-2 rounded mt-2" type="submit">Login</button>
      </form>
    </div>
  );
}