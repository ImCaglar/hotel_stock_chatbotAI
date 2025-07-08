"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { StockDashboard } from "@/components/stock-dashboard";
import { FloatingActionMenu } from "@/components/floating-action-menu";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Search, AlertTriangle, BarChart3, 
  Fish, Beef, Carrot, Utensils, ShowerHead,
  Hotel, TrendingDown, Activity, Clock, Star,
  ChevronRight, Zap, Eye, Filter
} from "lucide-react";

export default function Home() {
  const { sendMessage } = useActions();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const quickSearchCategories = [
    { 
      name: "Balık & Deniz Ürünleri", 
      query: "Balık ve deniz ürünleri kategorisini göster",
      icon: Fish,
      color: "blue",
      count: "12 ürün"
    },
    { 
      name: "Et Ürünleri", 
      query: "Et ürünleri kategorisini göster",
      icon: Beef,
      color: "red",
      count: "8 ürün"
    },
         { 
       name: "Sebze & Meyve", 
       query: "Sebze ve meyve kategorisini göster",
       icon: Carrot,
       color: "green",
       count: "15 ürün"
     },
     { 
       name: "Temizlik", 
       query: "Temizlik malzemeleri kategorisini göster",
       icon: Package,
       color: "purple",
       count: "6 ürün"
     }
  ];

  const quickActions = [
    {
      title: "Kritik Stok Uyarıları",
      description: "Azalan ürünleri göster",
      query: "Stoku azalan ürünleri göster",
      icon: AlertTriangle,
      color: "red",
      priority: "high"
    },
    {
      title: "Tüm Stok Durumu",
      description: "Genel stok özetini göster",
      query: "Tüm stok durumunu özetle",
      icon: BarChart3,
      color: "blue",
      priority: "medium"
    },
    {
      title: "Popüler Ürünler",
      description: "En çok kullanılan ürünler",
      query: "Popüler ürünleri göster",
      icon: Star,
      color: "yellow",
      priority: "low"
    },
    {
      title: "Son Güncellemeler",
      description: "Yeni eklenen ürünler",
      query: "Son güncellemeleri göster",
      icon: Clock,
      color: "green",
      priority: "medium"
    }
  ];

  const suggestedQueries = [
    "Somon balığı var mı?",
    "FISH001 detaylarını göster",
    "Stok seviyesi düşük ürünler",
    "Balık kategorisindeki ürünler"
  ];

  const handleQuickAction = async (query: string) => {
    setIsLoading(true);
    setMessages((messages) => [
      ...messages,
      <Message key={messages.length} role="user" content={query} />,
    ]);
    
    try {
      const response: ReactNode = await sendMessage(query);
      setMessages((messages) => [...messages, response]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setInput("");
    setIsLoading(true);
    setShowQuickActions(false);

    setMessages((messages) => [
      ...messages,
      <Message key={messages.length} role="user" content={userInput} />,
    ]);

    try {
      const response: ReactNode = await sendMessage(userInput);
      setMessages((messages) => [...messages, response]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-800">
      {/* Sidebar - Quick Actions */}
      <motion.div 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col w-80 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl border-r border-gray-200/50 dark:border-zinc-700/50 p-6 gap-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">Hızlı Erişim</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Anlık stok kontrolü</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs opacity-90">Toplam Kategori</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs opacity-90">Kritik Stok</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Hızlı İşlemler</h3>
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction(action.query)}
              className={`w-full p-3 rounded-xl text-left bg-gradient-to-r hover:shadow-lg transition-all group ${
                action.color === 'red' ? 'from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 dark:from-red-900/20 dark:to-red-800/20' :
                action.color === 'blue' ? 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20' :
                action.color === 'yellow' ? 'from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20' :
                'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 dark:from-green-900/20 dark:to-green-800/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <action.icon className={`w-5 h-5 ${
                  action.color === 'red' ? 'text-red-600' :
                  action.color === 'blue' ? 'text-blue-600' :
                  action.color === 'yellow' ? 'text-yellow-600' :
                  'text-green-600'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{action.description}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Category Quick Access */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Kategoriler</h3>
          {quickSearchCategories.map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleQuickAction(category.query)}
              className="w-full p-3 rounded-xl text-left bg-white/60 dark:bg-zinc-700/60 hover:bg-white/90 dark:hover:bg-zinc-700/90 transition-all group"
            >
              <div className="flex items-center gap-3">
                <category.icon className={`w-5 h-5 ${
                  category.color === 'blue' ? 'text-blue-600' :
                  category.color === 'red' ? 'text-red-600' :
                  category.color === 'green' ? 'text-green-600' :
                  'text-purple-600'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{category.count}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-scroll px-4 py-6"
        >
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-zinc-700/50">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl">
                        <Package className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                        <Activity className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Otel Stok Yönetim Sistemi
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    AI destekli akıllı stok asistanınız. Türkçe komutlarla tüm stok işlemlerinizi yönetin.
                  </p>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                      <Zap className="w-8 h-8 text-blue-600 mb-3" />
                      <h3 className="font-bold text-blue-900 dark:text-blue-100">Hızlı Arama</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-200">Doğal dil ile anında ürün bulma</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                      <Eye className="w-8 h-8 text-green-600 mb-3" />
                      <h3 className="font-bold text-green-900 dark:text-green-100">Anlık Takip</h3>
                      <p className="text-sm text-green-700 dark:text-green-200">Gerçek zamanlı stok durumu</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                      <Filter className="w-8 h-8 text-purple-600 mb-3" />
                      <h3 className="font-bold text-purple-900 dark:text-purple-100">Akıllı Filtre</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-200">Otomatik kategori önerileri</p>
                    </div>
                  </div>

                                     {/* Sample Queries */}
                   {showQuickActions && (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
                     >
                       {suggestedQueries.map((query, index) => (
                         <motion.button
                           key={index}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.1 }}
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => handleQuickAction(query)}
                           className="p-4 bg-white/60 dark:bg-zinc-700/60 rounded-xl text-left hover:bg-white/90 dark:hover:bg-zinc-700/90 transition-all border border-gray-200/50 dark:border-zinc-600/50 group"
                         >
                           <div className="flex items-center gap-3">
                             <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                             <span className="text-gray-700 dark:text-gray-200 font-medium">{query}</span>
                           </div>
                         </motion.button>
                       ))}
                     </motion.div>
                   )}

                   {/* Stock Dashboard */}
                   {showQuickActions && (
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.5 }}
                     >
                       <StockDashboard onQuickAction={handleQuickAction} />
                     </motion.div>
                   )}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/50 dark:border-zinc-700/50">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">AI yanıt hazırlıyor...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200/50 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg disabled:opacity-50"
                placeholder="Stok durumunu sorgulayın... (örn: 'Somon balığı var mı?', 'Kritik stok uyarıları')"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
                     </form>
         </div>
       </div>

       {/* Floating Action Menu for Mobile */}
       <FloatingActionMenu onQuickAction={handleQuickAction} />
     </div>
  );
}
