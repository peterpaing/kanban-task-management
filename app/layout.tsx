import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/app/components/Header"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
})


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body className={`min-h-screen flex flex-col ${plusJakartaSans.variable} bg-background-color`}>
        <div>
          <Header/>
        </div>
        {children}
        </body>
    </html>
  );
}
