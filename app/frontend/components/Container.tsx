import React from "react";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-screen-xl mx-auto px-4 md:px-6 ${className ?? ""}`}>
      {children}
    </div>
  );
}
