"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react"; // You'll need to install lucide-react for icons
import DeleteAccountModal from "./deleteAccountModal"; // the modal we built earlier



export default function AccountModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);


  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
        setEmail(data.email);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Semi-transparent overlay */}
        <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={onClose}
        />
        <div className="relative bg-black  rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-300">
          <h2 className="text-2xl font-bold text-white">Account Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Section */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">
              Manage your personal information.
            </h3>
            
            {/* Profile Picture */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white mb-2">Profile picture</h4>
              <p className="text-sm text-zinc-400 mb-4">PNG, JPG or GIF max size of 4MB</p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-purple-700 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">BV</span>
                </div>
                <button className="px-4 py-2 bg-purple-700 hover:bg-[#b14cff] rounded-lg text-white text-sm font-medium transition-colors">
                  Change picture
                </button>
              </div>
            </div>

            {/* Username */}
            <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-white mb-2">Username</label>
                <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
                </div>
                <input
                    type="text"
                    value={username}
                    readOnly
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-5 pr-4 py-3 text-white focus:outline-none "
                />
                </div>
            </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email address</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
                  </div>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-5 pr-4 py-3 text-white focus:outline-none "
                  />
                </div>
              </div>
              
            </div>
          </section>

          {/* Account Settings */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">
              Customize your preferences and security.
            </h3>
            
            <div className="space-y-4">
              {/* Account Privacy */}
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-700">
                <div>
                  <h4 className="font-medium text-white">Account privacy</h4>
                  <p className="text-sm text-zinc-400">Only your friends can see your profile details.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-purple-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b14cff]"></div>
                </label>
              </div>

              {/* Two-factor Security */}
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-700">
                <div>
                  <h4 className="font-medium text-white">Two-factor security</h4>
                  <p className="text-sm text-zinc-400">Extra security requiring two steps.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-purple-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b14cff]"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-700">
                <div>
                  <h4 className="font-medium text-white">Push notifications</h4>
                  <p className="text-sm text-zinc-400">Real-time alerts from apps.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-purple-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b14cff]"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Delete Account */}
          <section>
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">Delete account</h4>
                <button 
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors">
                  Delete account
                </button>
              </div>
              <p className="text-sm text-zinc-400">
                Before deleting your account, review our policy.
              </p>
            </div>
            {/* Show confirmation modal if open */}
            {open && <DeleteAccountModal onClose={() => setOpen(false)} />}
          </section>
        </div>
      </div>
    </div>
  );
}