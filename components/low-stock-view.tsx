"use client";

import { motion } from "framer-motion";
import { StockItem } from "@/lib/models/stock";
import { AlertTriangle, Package, ShoppingCart, TrendingDown } from "lucide-react";

export const LowStockView = ({ 
  items 
}: { 
  items: StockItem[];
}) => {
  const criticalItems = items.filter(item => item.currentStock === 0);
  const veryLowItems = items.filter(item => item.currentStock > 0 && item.currentStock <= item.minStock);
  const warningItems = items.filter(item => item.currentStock > item.minStock && item.currentStock <= item.minStock * 1.5);

  return (
    <div className="md:max-w-[600px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Başlık ve Özet */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-900">
              Kritik Stok Durumu
            </h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-red-100 rounded-lg p-3">
              <div className="text-xl font-bold text-red-800">{criticalItems.length}</div>
              <div className="text-xs text-red-600">Tükendi</div>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <div className="text-xl font-bold text-orange-800">{veryLowItems.length}</div>
              <div className="text-xs text-orange-600">Kritik Seviye</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3">
              <div className="text-xl font-bold text-yellow-800">{warningItems.length}</div>
              <div className="text-xs text-yellow-600">Uyarı Seviyesi</div>
            </div>
          </div>
        </div>
        
        {items.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <Package className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Harika Haber!
            </h3>
            <p className="text-green-700">
              Şu anda kritik stok seviyesinde ürün bulunmuyor. Tüm ürünler yeterli stok seviyesinde.
            </p>
          </div>
        ) : (
          <>
            {/* Kritik Ürünler (Stok = 0) */}
            {criticalItems.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  🚨 Acil Durum - Stok Tükendi ({criticalItems.length})
                </h3>
                <div className="space-y-2">
                  {criticalItems.map((item, index) => (
                    <motion.div
                      key={item.code}
                      className="bg-white border-l-4 border-red-500 rounded-lg p-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.nameTurkish}</h4>
                          <p className="text-sm text-gray-600">{item.name}</p>
                          <p className="text-xs text-blue-600 font-mono">{item.code}</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                            STOK YOK
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Min: {item.minStock} {item.unit}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        📍 {item.location} • {item.unitPrice.toFixed(2)} ₺/{item.unit}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Çok Düşük Stok */}
            {veryLowItems.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  ⚠️ Kritik Seviye ({veryLowItems.length})
                </h3>
                <div className="space-y-2">
                  {veryLowItems.map((item, index) => (
                    <motion.div
                      key={item.code}
                      className="bg-white border-l-4 border-orange-500 rounded-lg p-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.nameTurkish}</h4>
                          <p className="text-sm text-gray-600">{item.name}</p>
                          <p className="text-xs text-blue-600 font-mono">{item.code}</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                            {item.currentStock} {item.unit}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Min: {item.minStock} {item.unit}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        📍 {item.location} • {item.unitPrice.toFixed(2)} ₺/{item.unit}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Uyarı Seviyesi */}
            {warningItems.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  💡 Uyarı Seviyesi ({warningItems.length})
                </h3>
                <div className="space-y-2">
                  {warningItems.map((item, index) => (
                    <motion.div
                      key={item.code}
                      className="bg-white border-l-4 border-yellow-500 rounded-lg p-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.nameTurkish}</h4>
                          <p className="text-sm text-gray-600">{item.name}</p>
                          <p className="text-xs text-blue-600 font-mono">{item.code}</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                            {item.currentStock} {item.unit}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Min: {item.minStock} {item.unit}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        📍 {item.location} • {item.unitPrice.toFixed(2)} ₺/{item.unit}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Aksiyon Önerileri */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                💼 Önerilen Aksiyonlar
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                {criticalItems.length > 0 && (
                  <li>🔴 Acil: {criticalItems.length} ürün için hemen tedarik başlatın</li>
                )}
                {veryLowItems.length > 0 && (
                  <li>🟡 Bu hafta: {veryLowItems.length} ürün için sipariş verin</li>
                )}
                {warningItems.length > 0 && (
                  <li>🟢 Planlama: {warningItems.length} ürün için tedarik planlaması yapın</li>
                )}
                <li>📊 Stok takibini düzenli olarak kontrol edin</li>
                <li>📞 Tedarikçilerle iletişime geçin</li>
              </ul>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}; 