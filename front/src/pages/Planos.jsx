import "../style/Planos.css"
import Button from "../components/button";
import { Link } from "react-router-dom"

export default function Planos(){
  return(
   
      <div className="container-geral">
        <div className="container-planos">

          <div className="card-plano">
            <h3>Básico</h3>
            <p>720p</p>
          </div>

          <div className="card-plano">
            <h3>Padrão</h3>
            <p>1080p</p>
          </div>

          <div className="card-plano">
            <h3>Premium</h3>
            <p>4K + HDR</p>
          </div>

        </div>

        <div className="descricao-plano">
          

          <div className="line-description">
            <span>Preço mensal:</span>
            <span>R$ 39,90</span>
          </div>
          
          <div className="line-description">
            <span>Qualidade de vídeo:</span>
            <span>Full HD</span>
          </div>
          
          <div className="line-description">
            <span>Permite download:</span>
            <span>Sim</span>
          </div>
          
          <div className="line-description">
            <span >Telas simultâneas:</span>
            <span>2 dispositivos</span>
          </div>

          <div className="line-description">
            <span >Com anúncios:</span>
            <span>Sim</span>
          </div>

          <div className="line-description">
            <span >Acesso a conteúdo exclusivo:</span>
            <span>Sim</span>
          </div>

  
        </div>

        
          <Button className="button-plano"><Link to="/pagamento">Selecionar plano</Link></Button>
        
        
      </div>
    
  );
}