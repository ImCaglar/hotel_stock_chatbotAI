export interface StockItem {
  _id?: string;
  code: string;
  name: string;
  nameTurkish: string;
  category: StockCategory;
  subCategory?: string;
  description: string;
  descriptionTurkish: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier?: string;
  location: string;
  lastUpdated: Date;
  isActive: boolean;
  tags: string[];
  alternatives?: string[]; // codes of alternative items
}

export type StockCategory = 
  | 'food-fish'          // Balık ve Deniz Ürünleri
  | 'food-meat'          // Et ve Et Ürünleri  
  | 'food-vegetables'    // Sebze ve Meyve
  | 'food-dairy'         // Süt ve Süt Ürünleri
  | 'food-beverages'     // İçecekler
  | 'food-spices'        // Baharat ve Soslar
  | 'cleaning'           // Temizlik Malzemeleri
  | 'amenities'          // Misafir Amenity'leri
  | 'linens'             // Çarşaf ve Havlu
  | 'kitchen-equipment'  // Mutfak Ekipmanları
  | 'maintenance'        // Bakım ve Onarım
  | 'office'             // Ofis Malzemeleri
  | 'laundry';           // Çamaşırhane

export interface StockQuery {
  search?: string;
  category?: StockCategory;
  inStock?: boolean;
  lowStock?: boolean;
}

export interface StockResponse {
  items: StockItem[];
  total: number;
  hasAlternatives?: boolean;
} 