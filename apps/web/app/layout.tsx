import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Billetera Digital | ePayco",
  description: "Registro, recarga, consulta de saldo y pagos con confirmación OTP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} font-sans antialiased bg-background flex flex-col min-h-screen`}
      suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <main className="flex-1 flex flex-col">
            <div className="mx-auto w-full max-w-6xl flex-1 flex flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <Navbar />
              <div className="flex-1 flex flex-col items-center w-full">
                {children}
              </div>
            </div>
          </main>
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
        </body>
    </html>
  );
}
