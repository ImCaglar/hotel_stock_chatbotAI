import { NextResponse } from 'next/server';
import { stockService } from '@/lib/services/stockService';

export async function POST() {
  try {
    await stockService.insertSampleData();
    return NextResponse.json({ message: 'Veritabanı başarıyla başlatıldı!' });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Veritabanı başlatılamadı: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 