
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Race Market Brasil",
  description: "O marketplace da velocidade.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body>
        <header>
          <div className="container nav">
            <Link href="/" className="brand">RACE MARKET<small>BRASIL</small></Link>
            <nav className="menu">
              <Link href="/#comprar">Comprar</Link>
              <Link href="/#categorias">Categorias</Link>
              <Link href="/#planos">Preços</Link>
              <Link href="/minha-race">Minha Race Market</Link>
            </nav>
            <div className="actions">
              <Link href="/login" className="btn btn-dark">Entrar</Link>
              <Link href="/anunciar" className="btn btn-red">+ Anunciar</Link>
            </div>
          </div>
        </header>
        {children}
        <footer><div className="container">
      <div>© 2026 Race Market Brasil — O marketplace da velocidade.</div>
      <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
        <Link href="/termos">Termos</Link>
        <Link href="/privacidade">Privacidade</Link>
        <Link href="/contato">Contato</Link>
      </div>
    </div></footer>
      </body>
    </html>
  );
}
