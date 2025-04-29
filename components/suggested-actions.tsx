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
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-2 w-full">
        Loading suggestions...
      </div>
    );
  }

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
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
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
