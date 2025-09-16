// frontend/app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Redirect to wall page if logged in
      router.replace("/wall");
    }
  }, [router]);

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to your KEEPR collection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="KEEPR Logo"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900">KEEPR</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Keep Your Memories
            <span className="text-orange-500"> Safe</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            KEEPR is your digital memory vault. Store precious moments with secure keyword protection and unlock them whenever you want to relive those special times.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-lg transition-colors shadow-lg"
            >
              Start Keeping Memories
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-xl font-semibold text-lg transition-colors"
            >
              Access My Vault
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Storage</h3>
            <p className="text-gray-600">Protect your memories with personal keywords that only you know.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Rich Memories</h3>
            <p className="text-gray-600">Store photos, descriptions, and moments that matter most to you.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Access</h3>
            <p className="text-gray-600">Unlock and relive your memories anytime with your secret keywords.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-3xl p-12 shadow-sm">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to start keeping?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust KEEPR to safeguard their most precious memories.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-lg transition-colors shadow-lg"
          >
            Create Your KEEPR Account
          </Link>
        </div>
      </div>
    </div>
  );
}
