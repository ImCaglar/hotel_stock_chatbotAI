"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, AlertTriangle, BarChart3, Search, Star, 
  Clock, X, Package 
} from "lucide-react";

interface FloatingActionMenuProps {
  onQuickAction: (query: string) => void;
}

export const FloatingActionMenu = ({ onQuickAction }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      label: "Kritik Stok",
      query: "Stoku azalan ürünleri göster",
      icon: AlertTriangle,
      color: "red"
    },
    {
      label: "Stok Durumu",
      query: "Tüm stok durumunu özetle", 
      icon: BarChart3,
      color: "blue"
    },
    {
      label: "Hızlı Arama",
      query: "Somon balığı var mı?",
      icon: Search,
      color: "green"
    },
    {
      label: "Son Güncellenen",
      query: "Son güncellemeler",
      icon: Clock,
      color: "purple"
    }
  ];

  const handleActionClick = (query: string) => {
    onQuickAction(query);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleActionClick(action.query)}
                className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-lg backdrop-blur-xl border ${
                  action.color === 'red' ? 'bg-red-500/90 text-white border-red-400' :
                  action.color === 'blue' ? 'bg-blue-500/90 text-white border-blue-400' :
                  action.color === 'green' ? 'bg-green-500/90 text-white border-green-400' :
                  'bg-purple-500/90 text-white border-purple-400'
                }`}
              >
                <action.icon className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center backdrop-blur-xl"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Package className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}; 