import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What is VideoAI?",
        answer:
          "VideoAI is an AI-powered video generation platform that helps businesses create professional videos quickly. It includes a custom CRM system and full API integration for seamless workflow automation.",
      },
      {
        question: "How does the AI video generator work?",
        answer:
          "Our AI analyzes your content, applies professional templates, and generates high-quality videos automatically. You can customize the style, add branding, and export in various formats.",
      },
      {
        question: "Do I need video editing experience?",
        answer:
          "No! VideoAI is designed to be easy to use, even if you've never edited a video before. Our AI handles all the technical aspects for you.",
      },
    ],
  },
  {
    category: "Pricing & Plans",
    questions: [
      {
        question: "Is there a free trial?",
        answer:
          "Yes! All new accounts get a 14-day free trial with access to Professional plan features. No credit card required to start.",
      },
      {
        question: "Can I change my plan?",
        answer:
          "Absolutely. You can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. Enterprise customers can also pay via bank transfer.",
      },
    ],
  },
  {
    category: "CRM Features",
    questions: [
      {
        question: "What is included in the CRM?",
        answer:
          "Our CRM includes contact management, lead tracking, conversion monitoring, custom fields, and integration with the video generator to track engagement.",
      },
      {
        question: "Can I import my existing contacts?",
        answer:
          "Yes, you can easily import contacts from CSV files or sync with popular CRM platforms through our API.",
      },
      {
        question: "Is the CRM data secure?",
        answer:
          "Absolutely. All data is encrypted at rest and in transit. We follow industry-standard security practices and are compliant with GDPR and other data protection regulations.",
      },
    ],
  },
  {
    category: "API & Integration",
    questions: [
      {
        question: "What can I do with the API?",
        answer:
          "Our API allows you to programmatically generate videos, manage CRM contacts, track analytics, and integrate VideoAI into your existing workflows and applications.",
      },
      {
        question: "Is API documentation available?",
        answer:
          "Yes, comprehensive API documentation is available in your dashboard once you sign up for a Professional or Enterprise plan.",
      },
      {
        question: "Are there rate limits on the API?",
        answer:
          "Rate limits vary by plan. Professional plans have standard limits, while Enterprise plans can request custom rate limits based on their needs.",
      },
    ],
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-[#1E1E1E] transition-colors px-4 rounded-lg"
      >
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-jetbrains-mono pr-4">
          {question}
        </span>
        <ChevronDown
          className={`text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          size={20}
        />
      </button>
      {isOpen && (
        <div className="pb-6 px-4">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-jetbrains-mono">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      <section className="pt-32 pb-20 bg-gray-50 dark:bg-[#1E1E1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-jetbrains-mono">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-jetbrains-mono">
              Find answers to common questions about VideoAI
            </p>
          </div>

          <div className="space-y-12">
            {faqs.map((category, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-jetbrains-mono">
                  {category.category}
                </h2>
                <div className="bg-white dark:bg-[#262626] rounded-xl shadow-lg dark:ring-1 dark:ring-gray-700 overflow-hidden">
                  {category.questions.map((faq, faqIdx) => (
                    <FAQItem key={faqIdx} {...faq} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-white dark:bg-[#262626] rounded-xl p-8 shadow-lg dark:ring-1 dark:ring-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-jetbrains-mono">
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
