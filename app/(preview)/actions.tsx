import { Message, TextStreamMessage } from "@/components/message";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateId } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { StockSearchView } from "@/components/stock-search-view";
import { StockItemView } from "@/components/stock-item-view";
import { StockCategoryView } from "@/components/stock-category-view";
import { LowStockView } from "@/components/low-stock-view";
import { stockService } from "@/lib/services/stockService";
import { StockCategory } from "@/lib/models/stock";

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  // Check if required environment variables are set
  if (!process.env.OPENAI_API_KEY) {
    const errorStream = createStreamableValue("");
    errorStream.update("❌ OpenAI API anahtarı eksik! Lütfen .env.local dosyasına OPENAI_API_KEY ekleyin.");
    errorStream.done();
    return <TextStreamMessage content={errorStream.value} />;
  }

  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('your_mongodb_connection_string_here')) {
    const errorStream = createStreamableValue("");
    errorStream.update("❌ MongoDB bağlantısı eksik! Lütfen .env.local dosyasında MONGODB_URI ayarlayın.\n\n📋 Setup için:\n1. MongoDB Atlas hesabı oluşturun\n2. Cluster oluşturun\n3. Database user ekleyin\n4. Connection string'i .env.local'e ekleyin");
    errorStream.done();
    return <TextStreamMessage content={errorStream.value} />;
  }

  const { value: stream } = await streamUI({
    model: openai("gpt-4o"),
    system: `\
Sen bir otel stok yönetim sistemi asistanısın. 
Türkçe konuşan otel çalışanlarına yardım ediyorsun.
Stok öğeleri, envanter durumu ve alternatif ürünler hakkında bilgi veriyorsun.
Her zaman dostça ve yardımsever ol.
Yanıtlarını Türkçe ver.

ÖNEMLI: Eğer veritabanı bağlantı hatası alırsan, kullanıcıya MongoDB Atlas kurulumu yapması gerektiğini söyle.

Kullanıcı bir ürün sorduğunda:
1. Önce o ürünü ara
2. Varsa stok durumunu göster
3. Yoksa benzer alternatifleri öner
4. Stok az ise uyarı ver

Örnek yanıt tarzın:
"Taze somon arıyorsunuz. Stokta 25 kg mevcut. Kodu: FISH001. Lokasyon: Soğuk Hava Deposu A-1. Alternatif olarak levrek (FISH002) veya çipura (FISH003) da önerebilirim."
    `,
    messages: messages.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      searchStock: {
        description: "Stok öğelerini ara - balık, et, sebze, temizlik malzemeleri vb.",
        parameters: z.object({
          searchTerm: z.string().describe("Aranacak ürün adı veya kategorisi"),
          category: z.enum([
            "food-fish", "food-meat", "food-vegetables", "food-dairy", 
            "food-beverages", "food-spices", "cleaning", "amenities", 
            "linens", "kitchen-equipment", "maintenance", "office", "laundry"
          ]).optional().describe("Ürün kategorisi")
        }),
        generate: async function* ({ searchTerm, category }) {
          const toolCallId = generateId();

          const searchResults = await stockService.searchStock({
            search: searchTerm,
            category: category as StockCategory,
            inStock: true
          });

          // Don't call messages.done() here, just update
          messages.update([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "searchStock",
                  args: { searchTerm, category },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "searchStock",
                  toolCallId,
                  result: `${searchResults.total} adet ürün bulundu: ${searchTerm}`,
                },
              ],
            },
          ]);

          return <Message role="assistant" content={<StockSearchView results={searchResults} searchTerm={searchTerm} />} />;
        },
      },
      showStockDetails: {
        description: "Belirli bir stok öğesinin detaylarını göster",
        parameters: z.object({
          itemCode: z.string().describe("Ürün kodu (örn: FISH001)")
        }),
        generate: async function* ({ itemCode }) {
          const toolCallId = generateId();

          const item = await stockService.searchStock({ search: itemCode });
          const alternatives = item.items.length > 0 ? await stockService.getAlternatives(itemCode) : [];

          // Don't call messages.done() here, just update
          messages.update([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "showStockDetails",
                  args: { itemCode },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "showStockDetails",
                  toolCallId,
                  result: item.items.length > 0 ? `${itemCode} ürünü bulundu` : `${itemCode} ürünü bulunamadı`,
                },
              ],
            },
          ]);

          return <Message role="assistant" content={<StockItemView item={item.items[0]} alternatives={alternatives} />} />;
        },
      },
      showLowStock: {
        description: "Stoku azalan ürünleri göster",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();

          const lowStockItems = await stockService.getLowStockItems();

          // Don't call messages.done() here, just update
          messages.update([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "showLowStock",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "showLowStock",
                  toolCallId,
                  result: `${lowStockItems.length} adet ürünün stoku azalmış`,
                },
              ],
            },
          ]);

          return <Message role="assistant" content={<LowStockView items={lowStockItems} />} />;
        },
      },
      showCategory: {
        description: "Belirli bir kategorideki ürünleri göster",
        parameters: z.object({
          category: z.enum([
            "food-fish", "food-meat", "food-vegetables", "food-dairy", 
            "food-beverages", "food-spices", "cleaning", "amenities", 
            "linens", "kitchen-equipment", "maintenance", "office", "laundry"
          ]).describe("Ürün kategorisi")
        }),
        generate: async function* ({ category }) {
          const toolCallId = generateId();

          const categoryItems = await stockService.getStockByCategory(category as StockCategory);

          // Don't call messages.done() here, just update
          messages.update([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "showCategory",
                  args: { category },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "showCategory",
                  toolCallId,
                  result: `${category} kategorisinde ${categoryItems.length} ürün bulundu`,
                },
              ],
            },
          ]);

          return <Message role="assistant" content={<StockCategoryView category={category as StockCategory} items={categoryItems} />} />;
        },
      },
    },
  });

  return stream;
};

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export type UIState = Array<ReactNode>;

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // MongoDB'ye konuşma geçmişini kaydet (opsiyonel)
    }
  },
});
