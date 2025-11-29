import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    secondary: "bg-gray-800 text-gray-300 border-gray-700",
    outline: "bg-transparent text-gray-300 border-gray-700",
    success: "bg-green-500/20 text-green-300 border-green-500/30",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
