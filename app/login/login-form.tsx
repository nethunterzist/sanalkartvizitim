'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Lütfen kullanıcı adı ve şifre girin.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError('Kullanıcı adı veya şifre hatalı.');
        console.error('Giriş hatası:', result.error);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      setError('Giriş işlemi sırasında bir hata oluştu.');
      console.error('Giriş hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          {error}
        </div>
      )}
      
      <div className="-space-y-px rounded-md shadow-sm">
        <div>
          <label htmlFor="username" className="sr-only">
            Kullanıcı Adı
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
        >
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </div>
    </form>
  );
} 