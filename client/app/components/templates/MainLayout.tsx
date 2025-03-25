import Footer from "../layout/Footer";
import Header from "../layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
