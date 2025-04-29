import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SuggestedActions: Starting fetch');
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('/api/generate-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actions: [], // Send empty actions to request completely new suggestions
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await res.json();
        console.log('SuggestedActions: Received data:', data);

        if (data.starters && Array.isArray(data.starters.starters)) {
          setSuggestions(data.starters.starters);
        } else if (data.starters && Array.isArray(data.starters)) {
          setSuggestions(data.starters);
        } else {
          console.warn('Unexpected API response format');
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching chat starters:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();

    // Cleanup function to handle unmounting
    return () => {
      console.log('SuggestedActions: Cleanup');
    };
  }, []); // Empty dependency array means this only runs on mount

  console.log(
    'SuggestedActions: Rendering with loading:',
    loading,
    'suggestions:',
    suggestions.length,
  );

  if (loading) {
    return (
      <motion.div
        className="grid sm:grid-cols-2 gap-2 w-full"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="animate-pulse bg-muted rounded-xl px-4 py-3.5">
          <div className="h-5 w-24 bg-muted-foreground/20 rounded mb-1" />
          <div className="h-4 w-48 bg-muted-foreground/20 rounded" />
        </div>
        <div className="animate-pulse bg-muted rounded-xl px-4 py-3.5">
          <div className="h-5 w-32 bg-muted-foreground/20 rounded mb-1" />
          <div className="h-4 w-40 bg-muted-foreground/20 rounded" />
        </div>
        <div className="animate-pulse bg-muted rounded-xl px-4 py-3.5 hidden sm:block">
          <div className="h-5 w-28 bg-muted-foreground/20 rounded mb-1" />
          <div className="h-4 w-44 bg-muted-foreground/20 rounded" />
        </div>
        <div className="animate-pulse bg-muted rounded-xl px-4 py-3.5 hidden sm:block">
          <div className="h-5 w-36 bg-muted-foreground/20 rounded mb-1" />
          <div className="h-4 w-36 bg-muted-foreground/20 rounded" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {suggestions.map((suggestion, index) => {
        const title = suggestion.split(' ').slice(0, 3).join(' ');
        const label = suggestion.split(' ').slice(3).join(' ');

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.05 * index }}
            key={`suggested-action-${suggestion.replace(/\s+/g, '-').toLowerCase()}-${index}`}
            className={index > 1 ? 'hidden sm:block' : 'block'}
          >
            <Button
              variant="ghost"
              onClick={async () => {
                window.history.replaceState({}, '', `/chat/${chatId}`);

                append({
                  role: 'user',
                  content: suggestion,
                });
              }}
              className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
            >
              <div className="flex flex-col w-full">
                <span className="font-medium truncate">{title}</span>
                <span className="text-muted-foreground truncate">{label}</span>
              </div>
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
