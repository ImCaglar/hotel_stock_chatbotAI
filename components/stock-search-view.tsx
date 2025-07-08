"use client";

import { motion } from "framer-motion";
import { StockResponse } from "@/lib/models/stock";
import { Package, MapPin, AlertTriangle, TrendingUp } from "lucide-react";

export const StockSearchView = ({ 
  results, 
  searchTerm 
}: { 
  results: StockResponse;
  searchTerm: string;
}) => {
  return (
    <div className="md:max-w-[600px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg">
            &quot;{searchTerm}&quot; için {results.total} sonuç bulundu
          </h3>
        </div>
        
        {results.items.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">
                Aradığınız ürün bulunamadı. Lütfen farklı bir arama terimi deneyin.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {results.items.map((item, index) => (
              <motion.div
                key={item.code}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {item.nameTurkish}
                    </h4>
                    <p className="text-sm text-gray-600">{item.name}</p>
                    <p className="text-xs text-blue-600 font-mono">{item.code}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.currentStock <= item.minStock 
                        ? 'bg-red-100 text-red-800' 
                        : item.currentStock <= item.minStock * 1.5
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.currentStock} {item.unit}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  {item.descriptionTurkish}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    {item.unitPrice.toFixed(2)} ₺/{item.unit}
                  </div>
                </div>
                
                {item.currentStock <= item.minStock && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded p-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">
                        ⚠️ Kritik stok seviyesi! Tedarik gerekli.
                      </span>
                    </div>
                  </div>
                )}
                
                {item.alternatives && item.alternatives.length > 0 && (
                  <div className="mt-2 text-xs text-blue-600">
                    💡 Alternatif ürünler mevcut
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        {results.hasAlternatives && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 Bu ürünler için alternatif seçenekler mevcut. Detaylı bilgi için ürün kodunu sorun.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}; 