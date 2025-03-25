
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    document.title = "Dashboard | Zona de Conversão";
    
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      toast({
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    setIsAuthenticated(true);
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast({
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/');
  };

  if (!isAuthenticated) {
    return null; // Don't render content until authentication check is complete
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <h1 className="text-xl text-primary">ZONA DE CONVERSÃO</h1>
      </div>
      
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="text-primary hover:text-primary/80 underline text-sm"
        >
          Sair
        </button>
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
