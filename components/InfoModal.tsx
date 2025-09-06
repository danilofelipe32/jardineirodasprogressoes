import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 text-left relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
        style={{fontFamily: "'Nunito', sans-serif"}}
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full text-gray-600 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center font-bold text-xl"
            aria-label="Fechar modal"
        >
            &times;
        </button>
        <h2 id="info-modal-title" className="text-2xl md:text-3xl font-extrabold text-green-800 mb-6">Informações do Jogo</h2>
        
        <div className="space-y-6 text-gray-700">
            <div>
                <h3 className="text-xl font-bold text-green-700 mb-2">O Jogo</h3>
                <p>O Jardineiro das Progressões é um jogo educativo para praticar seu conhecimento sobre sequências numéricas. Complete os padrões para ajudar as flores do jardineiro a crescer!</p>
            </div>

            <div>
                <h3 className="text-xl font-bold text-green-700 mb-2">Como Jogar</h3>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Escolha um nível de dificuldade para começar.</li>
                    <li>Observe a sequência de números nos vasos de flores. Alguns estarão faltando.</li>
                    <li>Preencha os vasos vazios (<span className="font-mono font-bold">?</span>) com os números corretos para completar o padrão.</li>
                    <li>Determine se a sequência é uma <strong>Progressão Aritmética (PA)</strong> ou uma <strong>Progressão Geométrica (PG)</strong> e selecione a opção correta.</li>
                    <li>Insira a <strong>razão</strong> da progressão.</li>
                    <li>Clique em <strong>Verificar</strong> para ver se sua resposta está correta. Se estiver, uma linda flor crescerá!</li>
                </ol>
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-green-700 mb-2">Tipos de Progressão</h3>
                <div className="space-y-3">
                     <div>
                        <h4 className="font-semibold text-gray-800">Progressão Aritmética (PA)</h4>
                        <p>Uma sequência onde a diferença entre termos consecutivos é constante. Essa diferença é chamada de <strong>razão</strong>. Você <strong className="text-green-600">soma</strong> a razão para obter o próximo termo.</p>
                        <p className="mt-1 p-2 bg-green-50 rounded-md"><strong>Exemplo:</strong> 2, 5, 8, 11... (A razão é +3)</p>
                     </div>
                     <div>
                        <h4 className="font-semibold text-gray-800">Progressão Geométrica (PG)</h4>
                        <p>Uma sequência onde cada termo, a partir do segundo, é o <strong className="text-green-600">produto</strong> do termo anterior por uma constante, a <strong>razão</strong>.</p>
                        <p className="mt-1 p-2 bg-green-50 rounded-md"><strong>Exemplo:</strong> 3, 6, 12, 24... (A razão é x2)</p>
                     </div>
                </div>
            </div>

             <div>
                <h3 className="text-xl font-bold text-green-700 mb-2">Níveis de Dificuldade</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Iniciante:</strong> Sequências curtas com razões simples e positivas.</li>
                    <li><strong>Intermediário:</strong> Introduz razões negativas e fracionárias (divisão).</li>
                    <li><strong>Avançado:</strong> Sequências mais longas com razões mais complexas, incluindo padrões alternados.</li>
                </ul>
            </div>

        </div>
      </div>
    </div>
  );
};

export default InfoModal;
