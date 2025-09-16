"use client";

import { useState } from "react";
import { post } from "../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await post("/auth/login", { email, password });
    if (res.token) {
      localStorage.setItem("token", res.token);
      router.push("/wall");
    } else {
      alert(res.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 flex items-center justify-center p-4 relative">
      {/* Background decorative shapes */}
      <div className="absolute top-16 left-16 w-32 h-24 bg-amber-200 rounded-3xl opacity-80 rotate-12"></div>
      <div className="absolute bottom-16 right-16 w-24 h-20 bg-orange-200 rounded-2xl opacity-70 -rotate-12"></div>
      
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="KEEPR Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back to KEEPR</h1>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-8">Log in to unlock your memories</p>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-4 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all placeholder-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-4 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all placeholder-gray-400"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 mt-6 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
              </svg>
              Log In & Continue
            </button>
          </form>

          {/* Bottom Links */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <Link href="/forgot-password" className="text-gray-600 hover:text-orange-600 transition-colors">
              Forgot Password?
            </Link>
            <Link href="/signup" className="text-gray-600 hover:text-orange-600 transition-colors">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}