"use client";

import { useState, useCallback } from "react";
import {
  AlertTriangle,
  Shield,
  ShieldCheck,
  ShieldX,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRiskColor, getRiskIcon } from "@/lib/agent/permissions";

export interface PermissionDialogProps {
  open: boolean;
  action: string;
  category: string;
  description: string;
  risk: "low" | "medium" | "high";
  onGrant: () => void;
  onDeny: () => void;
  onClose: () => void;
}

export default function PermissionDialog({
  open,
  action,
  category,
  description,
  risk,
  onGrant,
  onDeny,
  onClose,
}: PermissionDialogProps) {
  const [rememberChoice, setRememberChoice] = useState(false);

  const handleGrant = useCallback(() => {
    onGrant();
    onClose();
  }, [onGrant, onClose]);

  const handleDeny = useCallback(() => {
    onDeny();
    onClose();
  }, [onDeny, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a1a] p-6 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-500 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  risk === "high"
                    ? "bg-red-500/20"
                    : risk === "medium"
                    ? "bg-yellow-500/20"
                    : "bg-green-500/20"
                }`}
              >
                {risk === "high" ? (
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                ) : (
                  <Shield className="h-6 w-6 text-yellow-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Permission Required</h3>
                <p className="text-sm text-slate-400">INCLAW needs your approval</p>
              </div>
            </div>

            {/* Details */}
            <div className="mb-6 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Action</span>
                <span className="text-sm font-mono text-cyan-400">{action}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Category</span>
                <span className="text-sm capitalize text-slate-400">{category}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">Risk Level</span>
                <span className={`text-sm font-medium ${getRiskColor(risk)}`}>
                  {getRiskIcon(risk)} {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </span>
              </div>
              <p className="text-sm text-slate-400 border-t border-white/5 pt-3">
                {description}
              </p>
            </div>

            {/* Remember checkbox */}
            <label className="mb-4 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberChoice}
                onChange={(e) => setRememberChoice(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-transparent text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm text-slate-400">Remember for this session</span>
            </label>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDeny}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition"
              >
                <ShieldX className="h-4 w-4" />
                Deny
              </button>
              <button
                onClick={handleGrant}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-400 transition"
              >
                <ShieldCheck className="h-4 w-4" />
                Allow
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
