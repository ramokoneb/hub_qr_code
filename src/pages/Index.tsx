
import { useEffect } from 'react';
import LoginForm from '@/components/LoginForm';

const Index = () => {
  useEffect(() => {
    document.title = "Login | Zona de Conversão";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-8 text-xs text-skyblue text-center">
          © 2023 Zona de Conversão. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Index;
