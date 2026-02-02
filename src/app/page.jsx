import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Play, Video, Zap, DollarSign } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gray-50 dark:bg-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-tight font-jetbrains-mono">
              AI Video Generator for Your Business
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-jetbrains-mono">
              Transform your content into stunning videos with our AI-powered
              platform. Complete with custom CRM and API integration for
              seamless workflow automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <a
                href="/account/signup"
                className="px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono text-lg"
              >
                Get Started Free
              </a>
              <a
                href="/pricing"
                className="px-8 py-4 bg-white dark:bg-[#262626] text-gray-900 dark:text-gray-100 rounded-lg font-medium border-2 border-gray-900 dark:border-gray-100 hover:bg-gray-50 dark:hover:bg-[#1E1E1E] transition-colors font-jetbrains-mono text-lg"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-[#121212]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm font-medium rounded-full mb-6 font-jetbrains-mono">
              Features
            </span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
              Everything you need in one platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-jetbrains-mono">
              AI video generation, CRM, and API integration all working together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-[#1E1E1E] rounded-xl p-8">
              <div className="w-12 h-12 bg-orange-500 rounded-lg mb-6 flex items-center justify-center">
                <Video className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                AI Video Generator
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-jetbrains-mono">
                Create professional videos in minutes using our advanced AI
                technology. No video editing experience required.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-[#1E1E1E] rounded-xl p-8">
              <div className="w-12 h-12 bg-orange-500 rounded-lg mb-6 flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                Custom CRM
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-jetbrains-mono">
                Manage your customers, track leads, and monitor conversions all
                in one integrated dashboard.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-[#1E1E1E] rounded-xl p-8">
              <div className="w-12 h-12 bg-orange-500 rounded-lg mb-6 flex items-center justify-center">
                <Play className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                API Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-jetbrains-mono">
                Connect your existing tools and workflows with our powerful API.
                Full documentation included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-jetbrains-mono">
              Choose the plan that fits your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-[#262626] rounded-xl p-8 shadow-lg dark:ring-1 dark:ring-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                Starter
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                  $49
                </span>
                <span className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                  /month
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                  10 videos/month
                </li>
                <li className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                  Basic CRM
                </li>
                <li className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                  Email support
                </li>
              </ul>
            </div>

            <div className="bg-orange-500 rounded-xl p-8 shadow-lg transform scale-105">
              <h3 className="text-2xl font-bold text-white mb-2 font-jetbrains-mono">
                Professional
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white font-jetbrains-mono">
                  $149
                </span>
                <span className="text-orange-100 font-jetbrains-mono">
                  /month
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="text-white font-jetbrains-mono">
                  50 videos/month
                </li>
                <li className="text-white font-jetbrains-mono">
                  Full CRM access
                </li>
                <li className="text-white font-jetbrains-mono">API access</li>
                <li className="text-white font-jetbrains-mono">
                  Priority support
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-[#262626] rounded-xl p-8 shadow-lg dark:ring-1 dark:ring-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                Enterprise
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                  Custom
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                  Unlimited videos
                </li>
                <li className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                  Advanced CRM
                </li>
                <li className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                  Full API access
                </li>
                <li className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                  Dedicated support
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/pricing"
              className="inline-block px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
            >
              View Full Pricing Details
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 dark:bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-100 mb-6 font-jetbrains-mono">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-jetbrains-mono">
            Join businesses using VideoAI to create amazing content
          </p>
          <a
            href="/account/signup"
            className="inline-block px-8 py-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors font-jetbrains-mono text-lg"
          >
            Start Free Trial
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
