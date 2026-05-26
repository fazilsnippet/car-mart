import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="min-h-screen px-4 py-10 bg-slate-50 text-slate-900 md:px-8">
      <div className="mx-auto space-y-10 max-w-7xl">
        {/* HERO */}
        <section className="relative p-8 overflow-hidden text-white shadow-xl rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 md:p-12">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center px-4 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-md">
              Account Settings
            </span>

            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Customize Your Experience
            </h1>

            <p className="text-base leading-relaxed text-slate-300 md:text-lg">
              Manage your account preferences, notifications, security, and
              personalization settings.
            </p>
          </div>

          <div className="absolute rounded-full -right-20 -top-20 w-72 h-72 bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 rounded-full -left-20 w-80 h-80 bg-indigo-500/20 blur-3xl" />
        </section>

        {/* PROFILE SETTINGS */}
        <section className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Profile Information
            </h2>
            <p className="mt-2 text-slate-500">
              Update your personal details and profile settings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-3 border outline-none rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="johndoe@example.com"
                className="w-full px-4 py-3 border outline-none rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <input
                type="text"
                defaultValue="+91 98765 43210"
                className="w-full px-4 py-3 border outline-none rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                type="text"
                defaultValue="Bangalore, India"
                className="w-full px-4 py-3 border outline-none rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button className="px-6 py-3 font-semibold text-white transition-opacity duration-300 rounded-2xl bg-slate-900 hover:opacity-90">
              Save Changes
            </button>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Notifications */}
          <div className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Notifications
                </h2>
                <p className="mt-1 text-slate-500">
                  Manage your notification preferences.
                </p>
              </div>

              <div className="text-4xl">🔔</div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 border rounded-2xl bg-slate-50 border-slate-200">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-slate-500">
                    Receive updates and alerts via email.
                  </p>
                </div>

                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    notifications ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                      notifications ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-2xl bg-slate-50 border-slate-200">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Push Notifications
                  </h3>
                  <p className="text-sm text-slate-500">
                    Get instant updates on your device.
                  </p>
                </div>

                <button className="relative bg-indigo-600 rounded-full w-14 h-7">
                  <span className="absolute w-5 h-5 bg-white rounded-full top-1 left-1 translate-x-7" />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Appearance
                </h2>
                <p className="mt-1 text-slate-500">
                  Personalize the application theme.
                </p>
              </div>

              <div className="text-4xl">🎨</div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 border rounded-2xl bg-slate-50 border-slate-200">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-slate-500">
                    Enable dark appearance mode.
                  </p>
                </div>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    darkMode ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                      darkMode ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 border rounded-2xl bg-slate-50 border-slate-200">
                <h3 className="mb-4 font-semibold text-slate-800">
                  Accent Color
                </h3>

                <div className="flex flex-wrap gap-3">
                  {[
                    "bg-indigo-500",
                    "bg-emerald-500",
                    "bg-rose-500",
                    "bg-amber-500",
                    "bg-cyan-500",
                  ].map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full ${color} border-4 border-white shadow-md hover:scale-110 transition-transform duration-300`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Security Settings
            </h2>
            <p className="mt-2 text-slate-500">
              Keep your account secure and protected.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-4 p-5 border md:flex-row md:items-center md:justify-between rounded-2xl bg-slate-50 border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Two-Factor Authentication
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add an extra security layer to your account.
                </p>
              </div>

              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  twoFactor ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                    twoFactor ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-5 border md:flex-row md:items-center md:justify-between rounded-2xl bg-slate-50 border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Change Password
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Update your account password regularly.
                </p>
              </div>

              <button className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-medium hover:opacity-90 transition-opacity duration-300">
                Update Password
              </button>
            </div>

            <div className="flex flex-col gap-4 p-5 border md:flex-row md:items-center md:justify-between rounded-2xl bg-rose-50 border-rose-200">
              <div>
                <h3 className="text-lg font-semibold text-rose-700">
                  Delete Account
                </h3>
                <p className="mt-1 text-sm text-rose-500">
                  Permanently remove your account and data.
                </p>
              </div>

              <button className="px-5 py-2.5 rounded-2xl bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors duration-300">
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
