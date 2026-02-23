import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: any[]) {
  return twMerge(clsx(args));
}

// Primary interactive styles extracted for consistency
const BASE_BTN =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

const BTN_VARIANTS: Record<string, string> = {
  primary: "bg-gold text-ink hover:bg-amber shadow-sm",
  outline: "border border-ink/15 bg-white hover:bg-linen shadow-sm",
  ghost:   "bg-transparent hover:bg-black/5",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
}) {
  return (
    <button
      className={cn(BASE_BTN, BTN_VARIANTS[variant], className)}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-ink/10 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function A(props: React.ComponentProps<typeof Link>) {
  return <Link {...props} />;
}

// Reusable field label
export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="grid gap-1 text-sm font-medium text-ink/80">
      {children}
    </label>
  );
}

// Input
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 " +
        "focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20",
        className,
      )}
      {...props}
    />
  );
}

// Select
export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink " +
        "focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

// Textarea
export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 " +
        "focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20",
        className,
      )}
      {...props}
    />
  );
}
