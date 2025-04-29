import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedRepliesProps {
  append: UseChatHelpers['append'];
  previousResponse: string;
}

function PureSuggestedReplies({
  append,
  previousResponse,
}: SuggestedRepliesProps) {
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        console.log('SuggestedReplies: Fetching replies for response:', {
          length: previousResponse?.length,
          content: previousResponse,
        });

        if (!previousResponse?.trim()) {
          console.log(
            'SuggestedReplies: Empty previous response, skipping fetch',
          );
          setLoading(false);
          return;
        }

        const res = await fetch('/api/generate-replies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            previous_response: previousResponse,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          console.error('SuggestedReplies: API error:', error);
          throw new Error('Failed to fetch replies');
        }

        const data = await res.json();
        console.log('SuggestedReplies: API success:', data);

        if (data.starters?.replies && Array.isArray(data.starters.replies)) {
          setReplies(data.starters.replies);
        }
      } catch (err) {
        console.error('SuggestedReplies: Error:', err);
        setReplies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [previousResponse]);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 w-full">
        <div className="animate-pulse bg-muted h-10 w-32 rounded-lg" />
        <div className="animate-pulse bg-muted h-10 w-40 rounded-lg" />
        <div className="animate-pulse bg-muted h-10 w-36 rounded-lg" />
      </div>
    );
  }

  if (!replies.length) return null;

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {replies.map((reply, index) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-reply-${reply.slice(0, 20).replace(/\s+/g, '-')}-${index}`}
        >
          <Button
            variant="outline"
            onClick={() =>
              append({
                role: 'user',
                content: reply,
              })
            }
            className="whitespace-normal text-sm px-4 py-2 h-auto"
          >
            {reply}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedReplies = memo(PureSuggestedReplies);
