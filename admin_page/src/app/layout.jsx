import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster  /> {/* 👈 Toaster will show top-left */}
      </body>
    </html>
  );
}
