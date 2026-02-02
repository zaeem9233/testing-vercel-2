import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      <section className="pt-32 pb-20 bg-gray-50 dark:bg-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-jetbrains-mono">
              Choose your plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-jetbrains-mono">
              Simple, transparent pricing that grows with your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Starter Plan */}
            <div className="bg-white dark:bg-[#262626] rounded-xl p-8 shadow-lg dark:ring-1 dark:ring-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                Starter
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                  $49
                </span>
                <span className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                  /month
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-jetbrains-mono">
                Perfect for small businesses getting started
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    10 AI-generated videos per month
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    Basic CRM with up to 100 contacts
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    Email support
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    1080p video quality
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    Standard templates
                  </span>
                </li>
              </ul>
              <a
                href="/account/signup"
                className="block w-full py-3 text-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
              >
                Get Started
              </a>
            </div>

            {/* Professional Plan */}
            <div className="bg-orange-500 rounded-xl p-8 shadow-2xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-medium font-jetbrains-mono">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-jetbrains-mono">
                Professional
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white font-jetbrains-mono">
                  $149
                </span>
                <span className="text-orange-100 font-jetbrains-mono">
                  /month
                </span>
              </div>
              <p className="text-orange-100 mb-6 font-jetbrains-mono">
                For growing businesses that need more power
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check
                    className="text-white mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-white font-jetbrains-mono">
                    50 AI-generated videos per month
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-white mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-white font-jetbrains-mono">
                    Full CRM with unlimited contacts
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-white mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-white font-jetbrains-mono">
                    Full API access
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-white mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-white font-jetbrains-mono">
                    Priority email & chat support
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-white mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-white font-jetbrains-mono">
                    4K video quality
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-white mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-white font-jetbrains-mono">
                    Premium templates & custom branding
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-white mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-white font-jetbrains-mono">
                    Advanced analytics
                  </span>
                </li>
              </ul>
              <a
                href="/account/signup"
                className="block w-full py-3 text-center bg-white text-orange-500 rounded-lg font-medium hover:bg-gray-100 transition-colors font-jetbrains-mono"
              >
                Get Started
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-[#262626] rounded-xl p-8 shadow-lg dark:ring-1 dark:ring-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                Enterprise
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                  Custom
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-jetbrains-mono">
                For large organizations with custom needs
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    Unlimited AI-generated videos
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    Advanced CRM with custom fields
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    Full API access with higher rate limits
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    Dedicated account manager
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    8K video quality
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    Custom templates & white labeling
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-orange-500 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-300 font-jetbrains-mono">
                    SLA guarantees
                  </span>
                </li>
              </ul>
              <a
                href="/contact"
                className="block w-full py-3 text-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
              >
                Contact Sales
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center font-jetbrains-mono">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                  Can I change plans later?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes take effect at the start of your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                  We accept all major credit cards, debit cards, and support
                  payment via bank transfer for enterprise customers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                  Yes! All new accounts get a 14-day free trial with access to
                  Professional plan features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
