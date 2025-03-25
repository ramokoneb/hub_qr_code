
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, LogIn } from 'lucide-react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Adding credentials and correct CORS headers for deployment environments
      const response = await fetch('https://webhook.zonadeconversao.space/webhook/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      console.log('Login response:', data); // Debug response

      if (data.status === 'success') {
        toast({
          description: data.mensagem || "Login realizado com sucesso!",
        });
        // Store authentication state in localStorage to persist across page refreshes
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          description: data.mensagem || "Erro ao fazer login. Verifique suas credenciais.",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        description: "Erro ao conectar com o servidor. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tech-card w-full max-w-md p-8 animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-2xl mb-1 text-primary font-bold tracking-tight">ZONA DE CONVERSÃO</h2>
        <p className="text-accent">Entre com suas credenciais</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium block text-left text-foreground">
            Usuário
          </label>
          <input
            id="username"
            type="text"
            placeholder="Seu nome de usuário"
            className="tech-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium block text-left text-foreground">
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Sua senha"
            className="tech-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="tech-button w-full mt-6 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="loader w-5 h-5 border-2"></div>
          ) : (
            <>
              <LogIn size={18} />
              <span>Entrar</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
