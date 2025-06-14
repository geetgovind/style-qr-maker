
import { QrCode, Github } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-secondary">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <QrCode className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">QR Code Generator</h1>
        </div>
        <a href="https://github.com/kozakdenys/qr-code-styling" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
          <Github className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
        </a>
      </div>
    </header>
  );
};

export default Header;
