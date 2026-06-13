interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

export function EmptyState({ message, subMessage }: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-16">
      {/* Large ◈ watermark */}
      <span
        className="absolute text-[120px] font-bold text-surface-border select-none pointer-events-none leading-none"
        aria-hidden="true"
      >
        ◈
      </span>
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <p className="text-ink-muted text-sm">{message}</p>
        {subMessage && (
          <p className="text-ink-faint text-xs max-w-xs">{subMessage}</p>
        )}
      </div>
    </div>
  );
}
