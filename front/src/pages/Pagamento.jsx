import Button from "../components/button";
import InputField from "../components/inputField";
import {Link} from "react-router-dom";
import "../style/Pagamento.css";

export default function Pagamento(){

  return(
    <div className="container-pagamento">
        
          <div className="pagamento-box">
    
            <p id="titulo-pagamentos">Informe os dados do seu cartão de crédito ou débito</p>

            <form>
              <InputField type="text" placeholder="Nome do cartão" className="input-pagamento"/>

              <div className="double-cards">
                <InputField type="text" placeholder="Data de validade" className="input-pagamento"/>

                <InputField type="text" placeholder="CVV" className="input-pagamento"/>
              </div>

              
              
              <InputField type="password" placeholder="CPF" className="input-pagamento"/>

              <div className="double-cards">
                <InputField type="password" placeholder="Crédito" className="input-pagamento"/>
                <InputField type="password" placeholder="Debito" className="input-pagamento"/>
              </div>

              <InputField type="password" placeholder="CEP" className="input-pagamento"/>
             
              <Button type="submit" className="button-pagamento">Iniciar assinatura </Button>

            </form>

           
        </div>
        </div>
  );
}