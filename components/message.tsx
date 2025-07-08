"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className="flex items-start gap-4 mb-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <BotIcon />
        </div>
      </div>

      <div className="flex-1 max-w-3xl">
        <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-2xl rounded-tl-md p-6 shadow-lg border border-gray-200/50 dark:border-zinc-700/50">
          <div className="text-gray-800 dark:text-gray-100">
            <Markdown>{text || ""}</Markdown>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 ml-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">AI Asistan</span>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  const isUser = role === "user";
  
  return (
    <motion.div
      className={`flex items-start gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}>
          {isUser ? <UserIcon /> : <BotIcon />}
        </div>
      </div>

      <div className={`flex-1 max-w-3xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`backdrop-blur-xl rounded-2xl p-6 shadow-lg border ${
          isUser 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 rounded-tr-md'
            : 'bg-white/90 dark:bg-zinc-800/90 border-gray-200/50 dark:border-zinc-700/50 rounded-tl-md'
        }`}>
          <div className={`${
            isUser 
              ? 'text-green-800 dark:text-green-100' 
              : 'text-gray-800 dark:text-gray-100'
          }`}>
            {typeof content === 'string' ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {content}
              </div>
            ) : (
              content
            )}
          </div>
        </div>
        <div className={`flex items-center gap-2 mt-2 ${isUser ? 'mr-4' : 'ml-4'}`}>
          <div className={`w-2 h-2 rounded-full ${
            isUser ? 'bg-green-500' : 'bg-blue-500 animate-pulse'
          }`}></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isUser ? 'Siz' : 'AI Asistan'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
