import react from "react";

export default function HelpSupportPage() {
  const faqItems = [
    {
      question: "How do I list my car for sale?",
      answer:
        "Go to your dashboard, click on 'Add Car', fill in the vehicle details, upload images, and publish your listing.",
    },
    {
      question: "How do I contact a seller?",
      answer:
        "Open the car details page and use the contact button to connect directly with the seller.",
    },
    {
      question: "Can I edit my car listing after publishing?",
      answer:
        "Yes. Visit your dashboard, open your listings, and click 'Edit' to update vehicle information anytime.",
    },
    {
      question: "How do I report suspicious activity?",
      answer:
        "Please use the report feature available on listings or contact our support team immediately.",
    },
  ];

  const supportCards = [
    {
      title: "Email Support",
      description:
        "Reach out to our support team for account, listing, or technical issues.",
      value: "support@autoresale.com",
    },
    {
      title: "Phone Support",
      description:
        "Available Monday to Saturday from 9 AM to 7 PM.",
      value: "+91 98765 43210",
    },
    {
      title: "Live Chat",
      description:
        "Connect instantly with our customer support agents.",
      value: "Available 24/7",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-10 bg-slate-50 text-slate-900 md:px-8">
      <div className="mx-auto space-y-10 max-w-7xl">
        {/* HERO SECTION */}
        <section className="relative p-8 overflow-hidden text-white shadow-xl rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 md:p-12">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center px-4 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-md">
              Help & Support Center
            </span>

            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              We’re Here To Help You
            </h1>

            <p className="text-base leading-relaxed text-slate-300 md:text-lg">
              Get assistance with buying, selling, account management,
              payments, listings, and everything related to your AutoResale
              experience.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="px-6 py-3 font-semibold transition-transform duration-300 bg-white rounded-2xl text-slate-900 hover:scale-105">
                Contact Support
              </button>

              <button className="px-6 py-3 font-semibold transition-all duration-300 border rounded-2xl border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20">
                View FAQs
              </button>
            </div>
          </div>

          <div className="absolute w-64 h-64 rounded-full -right-16 -top-16 bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 rounded-full -left-20 w-72 h-72 bg-indigo-500/20 blur-3xl" />
        </section>

        {/* SUPPORT OPTIONS */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Contact Options
              </h2>
              <p className="mt-1 text-slate-500">
                Choose the best way to reach our support team.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {supportCards.map((item) => (
              <div
                key={item.title}
                className="p-6 transition-all duration-300 bg-white border shadow-sm group rounded-3xl border-slate-200 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-center mb-5 text-2xl transition-transform duration-300 w-14 h-14 rounded-2xl bg-slate-100 group-hover:scale-110">
                  {item.title === "Email Support"
                    ? "📧"
                    : item.title === "Phone Support"
                    ? "📞"
                    : "💬"}
                </div>

                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mb-5 leading-relaxed text-slate-500">
                  {item.description}
                </p>

                <div className="px-4 py-3 font-semibold break-all rounded-2xl bg-slate-100 text-slate-700">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-500">
              Quick answers to common questions.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <details
                key={index}
                className="overflow-hidden border group rounded-2xl border-slate-200 bg-slate-50"
              >
                <summary className="flex items-center justify-between px-5 py-4 font-semibold list-none transition-colors duration-300 cursor-pointer text-slate-800 hover:bg-slate-100">
                  {faq.question}

                  <span className="text-xl transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="px-5 pb-5 leading-relaxed text-slate-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* SUPPORT FORM */}
        <section className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200 md:p-8">
          <div className="grid items-start grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 text-3xl font-bold text-slate-900">
                Send Us A Message
              </h2>

              <p className="leading-relaxed text-slate-500">
                Fill out the form and our support team will get back to you as
                soon as possible.
              </p>

              <div className="mt-8 space-y-4 text-slate-600">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <p>Fast response from our support team</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔒</span>
                  <p>Your information stays private and secure</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚗</span>
                  <p>Dedicated support for buyers and sellers</p>
                </div>
              </div>
            </div>

            <form className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border outline-none rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border outline-none rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 border outline-none rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Describe your issue or question"
                  className="w-full px-4 py-3 border outline-none resize-none rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 font-semibold text-white transition-opacity duration-300 rounded-2xl bg-slate-900 hover:opacity-90"
              >
                Submit Request
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
