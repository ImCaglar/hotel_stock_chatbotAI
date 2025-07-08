"use client";

import { motion } from "framer-motion";
import { StockItem, StockCategory } from "@/lib/models/stock";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";

const categoryNames: Record<StockCategory, string> = {
  'food-fish': '🐟 Balık ve Deniz Ürünleri',
  'food-meat': '🥩 Et ve Et Ürünleri',
  'food-vegetables': '🥬 Sebze ve Meyve',
  'food-dairy': '🥛 Süt ve Süt Ürünleri',
  'food-beverages': '🥤 İçecekler',
  'food-spices': '🧂 Baharat ve Soslar',
  'cleaning': '🧽 Temizlik Malzemeleri',
  'amenities': '🧴 Misafir Amenityleri',
  'linens': '🛏️ Çarşaf ve Havlu',
  'kitchen-equipment': '🍳 Mutfak Ekipmanları',
  'maintenance': '🔧 Bakım ve Onarım',
  'office': '📝 Ofis Malzemeleri',
  'laundry': '👕 Çamaşırhane'
};

export const StockCategoryView = ({ 
  category, 
  items 
}: { 
  category: StockCategory;
  items: StockItem[];
}) => {
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const lowStockCount = items.filter(item => item.currentStock <= item.minStock).length;

  return (
    <div className="md:max-w-[600px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Kategori Başlığı ve Özet */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {categoryNames[category]}
              </h2>
              <p className="text-gray-600">{items.length} ürün</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">
                {totalValue.toLocaleString('tr-TR', { 
                  style: 'currency', 
                  currency: 'TRY' 
                })}
              </div>
              <div className="text-xs text-gray-500">Toplam Değer</div>
            </div>
          </div>
          
          {lowStockCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  {lowStockCount} ürünün stoku kritik seviyede
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Ürün Listesi */}
        {items.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Bu kategoride ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((item, index) => (
              <motion.div
                key={item.code}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.nameTurkish}
                    </h3>
                    <p className="text-sm text-gray-600">{item.name}</p>
                    <p className="text-xs text-blue-600 font-mono">{item.code}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium mb-1 ${
                      item.currentStock <= item.minStock 
                        ? 'bg-red-100 text-red-800' 
                        : item.currentStock <= item.minStock * 1.5
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.currentStock} {item.unit}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {item.minStock} {item.unit}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    📍 {item.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {item.unitPrice.toFixed(2)} ₺/{item.unit}
                    </span>
                  </div>
                </div>
                
                {item.currentStock <= item.minStock && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded p-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">
                        Kritik stok! Tedarik gerekli.
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Kategori İstatistikleri */}
        {items.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📊 Kategori İstatistikleri</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="font-medium text-blue-800">{items.length}</div>
                <div className="text-blue-600">Toplam Ürün</div>
              </div>
              <div>
                <div className="font-medium text-blue-800">{lowStockCount}</div>
                <div className="text-blue-600">Kritik Stok</div>
              </div>
              <div>
                <div className="font-medium text-blue-800">
                  {items.filter(item => item.currentStock > item.minStock).length}
                </div>
                <div className="text-blue-600">Normal Stok</div>
              </div>
              <div>
                <div className="font-medium text-blue-800">
                  ₺{(totalValue / items.length).toFixed(0)}
                </div>
                <div className="text-blue-600">Ort. Değer</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}; 