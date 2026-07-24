
export default function Page(){
  return <section><div className="container"><div className="panel">
    <div className="eyebrow">RACE MARKET BRASIL</div>
    <h1 style={{fontSize:42}}>Contato</h1>
    <p className="muted">Precisa de ajuda, tem dúvidas sobre um anúncio ou quer solicitar a divulgação em story? Fale com a gente:</p>

    <div style={{marginTop:24,display:"grid",gap:14}}>
      <div><strong>Responsável:</strong> <span className="muted">Lucas Torres</span></div>
      <div><strong>WhatsApp:</strong> <span className="muted">(51) 98010-3004</span></div>
      <div><strong>Instagram:</strong> <span className="muted">@LucasTorres_77_</span></div>
    </div>

    <a className="btn btn-red" style={{marginTop:24,display:"inline-block"}} href="https://wa.me/5551980103004" target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a>
  </div></div></section>
}
