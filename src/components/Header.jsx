import { Menu, X } from "lucide-react";
import { useState } from "react";
import useUser from "@/utils/useUser";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center h-16">
        {/* Logo */}
        <a
          href="/"
          className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono"
        >
          VideoAI
        </a>

        {/* Navigation menu - hidden on mobile, shown on larger screens */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <a
            href="/#features"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
          >
            Features
          </a>
          <a
            href="/pricing"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
          >
            Pricing
          </a>
          <a
            href="/contact"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
          >
            Contact
          </a>
          <a
            href="/faq"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
          >
            FAQ
          </a>
          {user ? (
            <a
              href="/dashboard"
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
            >
              Dashboard
            </a>
          ) : (
            <a
              href="/account/signin"
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
            >
              Sign In
            </a>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <a
              href="/#features"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
            >
              Features
            </a>
            <a
              href="/pricing"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
            >
              Pricing
            </a>
            <a
              href="/contact"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
            >
              Contact
            </a>
            <a
              href="/faq"
              className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
            >
              FAQ
            </a>
            {user ? (
              <a
                href="/dashboard"
                className="block px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium text-center font-jetbrains-mono"
              >
                Dashboard
              </a>
            ) : (
              <a
                href="/account/signin"
                className="block px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium text-center font-jetbrains-mono"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
