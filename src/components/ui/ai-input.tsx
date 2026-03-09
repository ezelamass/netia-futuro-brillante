"use client";

import { CornerRightUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

interface AIInputProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function AIInput({
  id = "ai-input",
  placeholder = "Type your message...",
  minHeight = 52,
  maxHeight = 200,
  onSubmit,
  disabled,
  className,
}: AIInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
  const [inputValue, setInputValue] = useState("");

  const handleReset = () => {
    if (!inputValue.trim() || disabled) return;
    onSubmit?.(inputValue);
    setInputValue("");
    adjustHeight(true);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <Textarea
          ref={textareaRef}
          id={id}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border border-border/60 bg-muted/50 px-4 py-3 pr-12 text-sm text-foreground",
            "resize-none overflow-hidden",
            "placeholder:text-muted-foreground",
            "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            setInputValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleReset();
            }
          }}
        />

        <button
          onClick={handleReset}
          type="button"
          disabled={disabled}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 right-3",
            "rounded-xl bg-primary/10 py-1 px-1",
            "transition-all duration-200",
            inputValue.trim()
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <CornerRightUp className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
}
