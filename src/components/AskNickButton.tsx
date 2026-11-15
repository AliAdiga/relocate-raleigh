'use client';

import { US_STATE_DATA } from '@/data/relocationStateData';
import { useContactModal } from './ContactModalProvider';
import { useMoveProfile } from './MoveProfileProvider';

/** Opens the request form with visible, editable context about where the visitor came from. */
export default function AskNickButton({ topic, className, children }: { topic: string; className?: string; children: React.ReactNode }) {
  const { open } = useContactModal();
  const { origin } = useMoveProfile();
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        open('contact', {
          context: `Interested in: ${topic}\nMoving from: ${US_STATE_DATA[origin].name}`,
          contextLabel: 'Details to include',
        })
      }
    >
      {children}
    </button>
  );
}
