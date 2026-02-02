export function Footer() {
  return (
    <footer className="py-12 bg-gray-900 dark:bg-[#0A0A0A] border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-100 mb-4 font-jetbrains-mono">
              VideoAI
            </h3>
            <p className="text-sm text-gray-400 font-jetbrains-mono">
              AI-powered video generation platform for businesses
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-100 mb-4 font-jetbrains-mono">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#features"
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors font-jetbrains-mono"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors font-jetbrains-mono"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors font-jetbrains-mono"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-100 mb-4 font-jetbrains-mono">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors font-jetbrains-mono"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/account/signin"
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors font-jetbrains-mono"
                >
                  Sign In
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-100 mb-4 font-jetbrains-mono">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors font-jetbrains-mono"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors font-jetbrains-mono"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400 font-jetbrains-mono">
            © 2026 VideoAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
