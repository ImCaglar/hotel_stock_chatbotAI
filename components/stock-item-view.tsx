"use client";

import { motion } from "framer-motion";
import { StockItem } from "@/lib/models/stock";
import { Package, MapPin, AlertTriangle, TrendingUp, Users, Calendar } from "lucide-react";

export const StockItemView = ({ 
  item, 
  alternatives = [] 
}: { 
  item?: StockItem;
  alternatives?: StockItem[];
}) => {
  if (!item) {
    return (
      <div className="md:max-w-[600px] max-w-[calc(100dvw-80px)] w-full pb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">Ürün bulunamadı.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:max-w-[600px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Ana Ürün Bilgisi */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {item.nameTurkish}
              </h2>
              <p className="text-gray-600 mb-1">{item.name}</p>
              <p className="text-blue-600 font-mono text-sm">{item.code}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.currentStock <= item.minStock 
                ? 'bg-red-100 text-red-800' 
                : item.currentStock <= item.minStock * 1.5
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {item.currentStock} {item.unit} mevcut
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{item.descriptionTurkish}</p>
          
          {/* Stok Bilgileri */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Mevcut Stok</div>
              <div className="font-semibold text-lg">{item.currentStock} {item.unit}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Min. Stok</div>
              <div className="font-semibold text-lg">{item.minStock} {item.unit}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Maks. Stok</div>
              <div className="font-semibold text-lg">{item.maxStock} {item.unit}</div>
            </div>
          </div>
          
          {/* Detay Bilgileri */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Lokasyon:</span>
              <span className="font-medium">{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Birim Fiyat:</span>
              <span className="font-medium">{item.unitPrice.toFixed(2)} ₺/{item.unit}</span>
            </div>
            {item.supplier && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Tedarikçi:</span>
                <span className="font-medium">{item.supplier}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Son Güncelleme:</span>
              <span className="font-medium">
                {new Date(item.lastUpdated).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
          
          {/* Uyarılar */}
          {item.currentStock <= item.minStock && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">
                  ⚠️ Kritik stok seviyesi!
                </span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Bu ürünün stoku minimum seviyede veya altında. Acil tedarik gerekli.
              </p>
            </div>
          )}
          
          {/* Etiketler */}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-2">Etiketler:</div>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Alternatif Ürünler */}
        {alternatives.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Alternatif Ürünler
            </h3>
            <div className="space-y-2">
              {alternatives.map((alt) => (
                <div key={alt.code} className="bg-white rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{alt.nameTurkish}</h4>
                      <p className="text-sm text-gray-600">{alt.name}</p>
                      <p className="text-xs text-blue-600 font-mono">{alt.code}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alt.currentStock <= alt.minStock 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {alt.currentStock} {alt.unit}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {alt.unitPrice.toFixed(2)} ₺/{alt.unit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}; 