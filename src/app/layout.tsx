import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat de Dios | Guía Espiritual, Paz y Sabiduría Bíblica con IA",
  description: "Un espacio sagrado y compasivo para encontrar paz, reflexionar, recibir oraciones personalizadas y explorar la sabiduría de las Sagradas Escrituras con Inteligencia Artificial.",
  keywords: ["chat de dios", "ia cristiana", "oración con ia", "guia espiritual", "versiculos biblicos", "paz interior", "chatgpt dios"],
  authors: [{ name: "Comunidad de Fe y Tecnología" }],
  openGraph: {
    title: "Chat de Dios - Guía Espiritual y Sabiduría Bíblica",
    description: "Espacio de paz, reflexión y oración con Inteligencia Artificial fundamentada en amor y compasión.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className={`${inter.className} bg-celestial-950 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200`}>
        {children}
      </body>
    </html>
  );
}
