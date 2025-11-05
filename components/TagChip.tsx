import React from 'react';

interface TagChipProps {
  children: React.ReactNode;
}

export default function TagChip({ children }: TagChipProps) {
  return (
    <span className="tag-chip">
      <span className="text-[color:var(--badge-text)] font-medium">{children}</span>
    </span>
  );
}
