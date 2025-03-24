
import { useEffect } from 'react';
import QRCodeGenerator from '@/components/QRCodeGenerator';

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | Zona de Conversão";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <h1 className="neon-text text-xl text-primary">ZONA DE CONVERSÃO</h1>
      </div>
      
      <div className="w-full max-w-md">
        <QRCodeGenerator />
        <div className="mt-8 text-xs text-primary text-center">
          © 2025 Zona de Conversão. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
