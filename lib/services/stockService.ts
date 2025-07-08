import clientPromise from '@/lib/mongodb';
import { StockItem, StockQuery, StockResponse, StockCategory } from '@/lib/models/stock';
import { WithId, Document } from 'mongodb';

const COLLECTION_NAME = 'hotel-stock-items';

export class StockService {
  private async getCollection() {
    const client = await clientPromise;
    const db = client.db('hotel-stock-db');
    return db.collection(COLLECTION_NAME);
  }

  async searchStock(query: StockQuery): Promise<StockResponse> {
    const collection = await this.getCollection();
    
    let filter: any = { isActive: true };
    
    if (query.search) {
      // Türkçe ve İngilizce arama için regex
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { nameTurkish: searchRegex },
        { description: searchRegex },
        { descriptionTurkish: searchRegex },
        { code: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.inStock) {
      filter.currentStock = { $gt: 0 };
    }

    if (query.lowStock) {
      filter.$expr = { $lte: ['$currentStock', '$minStock'] };
    }

    const items = await collection.find(filter).limit(10).toArray();
    const total = await collection.countDocuments(filter);

    // Alternatif ürünler var mı kontrol et
    const hasAlternatives = items.some(item => item.alternatives && item.alternatives.length > 0);

    return {
      items: items.map((item: any) => ({
        ...item,
        _id: item._id?.toString()
      })) as StockItem[],
      total,
      hasAlternatives
    };
  }

  async getAlternatives(itemCode: string): Promise<StockItem[]> {
    const collection = await this.getCollection();
    
    // Ana ürünü bul
    const mainItem = await collection.findOne({ code: itemCode, isActive: true });
    if (!mainItem || !mainItem.alternatives) {
      return [];
    }

    // Alternatif ürünleri getir
    const alternatives = await collection.find({
      code: { $in: mainItem.alternatives },
      isActive: true
    }).toArray();

    return alternatives.map((item: any) => ({
      ...item,
      _id: item._id?.toString()
    })) as StockItem[];
  }

  async getStockByCategory(category: StockCategory): Promise<StockItem[]> {
    const collection = await this.getCollection();
    
    const items = await collection.find({
      category,
      isActive: true
    }).limit(20).toArray();

    return items.map((item: any): StockItem => ({
      _id: item._id?.toString(),
      code: item.code,
      name: item.name,
      nameTurkish: item.nameTurkish,
      category: item.category,
      description: item.description,
      descriptionTurkish: item.descriptionTurkish,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      unitPrice: item.unitPrice,
      supplier: item.supplier,
      location: item.location,
      lastUpdated: item.lastUpdated,
      isActive: item.isActive,
      tags: item.tags || [],
      alternatives: item.alternatives || []
    }));
  }

  async getLowStockItems(): Promise<StockItem[]> {
    const collection = await this.getCollection();
    
    const items = await collection.find({
      $expr: { $lte: ['$currentStock', '$minStock'] },
      isActive: true
    }).limit(15).toArray();

    return items.map((item: any): StockItem => ({
      _id: item._id?.toString(),
      code: item.code,
      name: item.name,
      nameTurkish: item.nameTurkish,
      category: item.category,
      description: item.description,
      descriptionTurkish: item.descriptionTurkish,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      unitPrice: item.unitPrice,
      supplier: item.supplier,
      location: item.location,
      lastUpdated: item.lastUpdated,
      isActive: item.isActive,
      tags: item.tags || [],
      alternatives: item.alternatives || []
    }));
  }

  async insertSampleData(): Promise<void> {
    const collection = await this.getCollection();
    
    // Mevcut veri var mı kontrol et
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log('Sample data already exists');
      return;
    }

    const sampleData: Omit<StockItem, '_id'>[] = [
      // Balık ve Deniz Ürünleri
      {
        code: 'FISH001',
        name: 'Fresh Salmon',
        nameTurkish: 'Taze Somon',
        category: 'food-fish',
        description: 'Atlantic salmon, fresh, premium quality',
        descriptionTurkish: 'Atlantik somon, taze, premium kalite',
        unit: 'kg',
        currentStock: 25,
        minStock: 10,
        maxStock: 50,
        unitPrice: 120.00,
        supplier: 'Deniz Ürünleri A.Ş.',
        location: 'Soğuk Hava Deposu A-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['salmon', 'somon', 'fish', 'balık', 'premium'],
        alternatives: ['FISH002', 'FISH003']
      },
      {
        code: 'FISH002',
        name: 'Sea Bass',
        nameTurkish: 'Levrek',
        category: 'food-fish',
        description: 'Mediterranean sea bass, fresh',
        descriptionTurkish: 'Akdeniz levreki, taze',
        unit: 'kg',
        currentStock: 8,
        minStock: 12,
        maxStock: 30,
        unitPrice: 85.00,
        supplier: 'Deniz Ürünleri A.Ş.',
        location: 'Soğuk Hava Deposu A-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['seabass', 'levrek', 'fish', 'balık'],
        alternatives: ['FISH001', 'FISH003']
      },
      {
        code: 'FISH003',
        name: 'Sea Bream',
        nameTurkish: 'Çipura',
        category: 'food-fish',
        description: 'Fresh sea bream, Mediterranean',
        descriptionTurkish: 'Taze çipura, Akdeniz',
        unit: 'kg',
        currentStock: 15,
        minStock: 10,
        maxStock: 35,
        unitPrice: 75.00,
        supplier: 'Deniz Ürünleri A.Ş.',
        location: 'Soğuk Hava Deposu A-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['seabream', 'çipura', 'fish', 'balık'],
        alternatives: ['FISH001', 'FISH002']
      },
      {
        code: 'FISH004',
        name: 'Shrimp',
        nameTurkish: 'Karides',
        category: 'food-fish',
        description: 'Fresh medium shrimp',
        descriptionTurkish: 'Taze orta boy karides',
        unit: 'kg',
        currentStock: 12,
        minStock: 8,
        maxStock: 25,
        unitPrice: 180.00,
        supplier: 'Deniz Ürünleri A.Ş.',
        location: 'Soğuk Hava Deposu A-2',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['shrimp', 'karides', 'seafood', 'deniz ürünü']
      },
      {
        code: 'FISH005',
        name: 'Tuna',
        nameTurkish: 'Ton Balığı',
        category: 'food-fish',
        description: 'Fresh tuna steak',
        descriptionTurkish: 'Taze ton balığı steak',
        unit: 'kg',
        currentStock: 6,
        minStock: 8,
        maxStock: 20,
        unitPrice: 200.00,
        supplier: 'Deniz Ürünleri A.Ş.',
        location: 'Soğuk Hava Deposu A-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['tuna', 'ton', 'fish', 'balık', 'steak']
      },

      // Et Ürünleri
      {
        code: 'MEAT001',
        name: 'Beef Tenderloin',
        nameTurkish: 'Dana Bonfile',
        category: 'food-meat',
        description: 'Premium beef tenderloin',
        descriptionTurkish: 'Premium dana bonfile',
        unit: 'kg',
        currentStock: 20,
        minStock: 15,
        maxStock: 40,
        unitPrice: 250.00,
        supplier: 'Et ve Et Ürünleri Ltd.',
        location: 'Et Deposu B-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['beef', 'dana', 'tenderloin', 'bonfile', 'premium']
      },
      {
        code: 'MEAT002',
        name: 'Lamb Chops',
        nameTurkish: 'Kuzu Pirzola',
        category: 'food-meat',
        description: 'Fresh lamb chops',
        descriptionTurkish: 'Taze kuzu pirzola',
        unit: 'kg',
        currentStock: 18,
        minStock: 12,
        maxStock: 30,
        unitPrice: 180.00,
        supplier: 'Et ve Et Ürünleri Ltd.',
        location: 'Et Deposu B-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['lamb', 'kuzu', 'chops', 'pirzola']
      },

      // Sebze ve Meyve
      {
        code: 'VEG001',
        name: 'Organic Tomatoes',
        nameTurkish: 'Organik Domates',
        category: 'food-vegetables',
        description: 'Fresh organic tomatoes',
        descriptionTurkish: 'Taze organik domates',
        unit: 'kg',
        currentStock: 50,
        minStock: 20,
        maxStock: 100,
        unitPrice: 15.00,
        supplier: 'Organik Tarım Kooperatifi',
        location: 'Sebze Deposu C-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['tomato', 'domates', 'organic', 'organik', 'vegetable']
      },
      {
        code: 'VEG002',
        name: 'Fresh Lettuce',
        nameTurkish: 'Taze Marul',
        category: 'food-vegetables',
        description: 'Iceberg lettuce, crisp and fresh',
        descriptionTurkish: 'Buzdolabı marulu, çıtır ve taze',
        unit: 'piece',
        currentStock: 30,
        minStock: 20,
        maxStock: 80,
        unitPrice: 8.00,
        supplier: 'Organik Tarım Kooperatifi',
        location: 'Sebze Deposu C-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['lettuce', 'marul', 'salad', 'salata', 'green']
      },

      // Temizlik Malzemeleri
      {
        code: 'CLEAN001',
        name: 'Multi-Surface Cleaner',
        nameTurkish: 'Çok Amaçlı Temizleyici',
        category: 'cleaning',
        description: 'Professional multi-surface cleaner, 5L',
        descriptionTurkish: 'Profesyonel çok amaçlı temizleyici, 5L',
        unit: 'bottle',
        currentStock: 15,
        minStock: 10,
        maxStock: 50,
        unitPrice: 45.00,
        supplier: 'Temizlik Ürünleri San. Tic.',
        location: 'Temizlik Deposu D-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['cleaner', 'temizleyici', 'multi-surface', 'çok amaçlı']
      },

      // Misafir Amenity'leri
      {
        code: 'AMEN001',
        name: 'Premium Shampoo',
        nameTurkish: 'Premium Şampuan',
        category: 'amenities',
        description: 'Luxury hotel shampoo, 30ml bottles',
        descriptionTurkish: 'Lüks otel şampuanı, 30ml şişe',
        unit: 'bottle',
        currentStock: 200,
        minStock: 100,
        maxStock: 500,
        unitPrice: 8.50,
        supplier: 'Otel Amenity Tedarikçisi',
        location: 'Amenity Deposu E-1',
        lastUpdated: new Date(),
        isActive: true,
        tags: ['shampoo', 'şampuan', 'amenity', 'premium', 'guest']
      }
    ];

    await collection.insertMany(sampleData);
    console.log('Sample data inserted successfully');
  }
}

export const stockService = new StockService(); 