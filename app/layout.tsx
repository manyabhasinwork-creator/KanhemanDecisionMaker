import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decision Coach",
  description:
    "A conversational decision reflection tool, grounded in decision-science concepts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
