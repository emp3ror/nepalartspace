import { cn } from "@/lib/cn";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-transparent bg-[#fffcf8] p-6 shadow-[0_10px_20px_rgba(0,0,0,0.05)] transition will-change-transform hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
