
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { QrCode, RefreshCw } from 'lucide-react';

const QRCodeGenerator = () => {
  const [instanceName, setInstanceName] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const currentInstanceRef = useRef('');

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft === 0) {
      setTimeLeft(30);
      updateQRCode();
    }
  }, [timeLeft, timerActive]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimeLeft(30);
    setTimerActive(true);
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  };

  const generateQRCode = async () => {
    if (!instanceName) {
      toast({
        description: "Por favor, insira o nome da instância.",
        variant: "destructive"
      });
      return;
    }

    currentInstanceRef.current = instanceName;
    await fetchAndDisplayQRCode(true);
    startTimer();
  };

  const fetchAndDisplayQRCode = async (isInitial = false) => {
    setIsLoading(true);
    setQrCodeImage(null);

    try {
      const endpoint = isInitial 
        ? 'https://webhook.zonadeconversao.space/webhook/criar-instancia-evolution'
        : 'https://webhook.zonadeconversao.space/webhook/atualizar-qr-code';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instanceName: currentInstanceRef.current }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor');
      }

      // Verifica o tipo de conteúdo da resposta
      const contentType = response.headers.get('content-type');
      let imgSrc;

      if (contentType && contentType.includes('application/json')) {
        // Se for JSON, assuma que é uma string base64
        const data = await response.json();
        imgSrc = `data:image/png;base64,${data.qrCodeBase64}`;
      } else {
        // Se não for JSON, assuma que é um arquivo binário
        const blob = await response.blob();
        imgSrc = URL.createObjectURL(blob);
      }

      // Exibe o código QR
      setQrCodeImage(imgSrc);
      
      if (isInitial) {
        toast({
          description: "QR Code gerado com sucesso!",
        });
      }
    } catch (error) {
      console.error('Erro ao gerar código QR:', error);
      toast({
        variant: "destructive",
        description: "Erro ao gerar QR Code. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQRCode = async () => {
    if (currentInstanceRef.current) {
      await fetchAndDisplayQRCode();
    }
  };

  return (
    <div className="tech-card w-full max-w-md p-8 animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-2xl mb-1 text-primary font-bold tracking-tight">GERADOR DE QR CODE</h2>
        <p className="text-accent">Crie uma nova instância <em>(Não utilize espaço)</em></p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="instanceName" className="text-sm font-medium block text-left text-foreground">
            Nome da Instância
          </label>
          <input
            id="instanceName"
            type="text"
            placeholder="Digite o nome da instância"
            className="tech-input"
            value={instanceName}
            onChange={(e) => setInstanceName(e.target.value)}
            disabled={isLoading || timerActive}
          />
        </div>

        <button 
          onClick={generateQRCode} 
          className="tech-button w-full mt-6 flex items-center justify-center gap-2"
          disabled={isLoading || timerActive}
        >
          {isLoading ? (
            <div className="loader w-5 h-5 border-2"></div>
          ) : (
            <>
              <QrCode size={18} />
              <span>Gerar QR Code</span>
            </>
          )}
        </button>

        {timerActive && (
          <div className="mt-4 flex items-center justify-center text-sm">
            <RefreshCw size={16} className="mr-2 animate-spin" />
            <span>Novo QR Code em: <span className="text-primary font-bold">{timeLeft}s</span></span>
          </div>
        )}

        {qrCodeImage && (
          <div className="mt-6 flex flex-col items-center">
            <div className="tech-border p-4 inline-block rounded-lg">
              <img src={qrCodeImage} alt="QR Code" className="max-w-full h-auto" />
            </div>
            <p className="text-sm mt-2 text-muted-foreground">
              Escaneie este código com seu dispositivo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
