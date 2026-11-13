import { useContext } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RotaProtegida({ children, soOrganizador = false }) {
  const { usuario } = useContext(AuthContext);
  const local = useLocation();
  if (!usuario)
    return <Navigate to="/login" state={{ destino: local.pathname }} replace />;
  if (soOrganizador && usuario.perfil !== "organizador") {
    return (
      <section className="caixa">
        <h1>Acesso negado</h1>
        <p>Esta página é exclusiva do organizador.</p>
        <Link to="/">Voltar ao início</Link>
      </section>
    );
  }
  return children;
}
