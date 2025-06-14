
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QRCodeGenerator from '@/components/QRCodeGenerator';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <QRCodeGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
