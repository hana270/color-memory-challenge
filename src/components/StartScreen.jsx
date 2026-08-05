function StartScreen({ startGame }) {
  return (
    <div className="card">
      <span className="brand-eyebrow">Jeu de mémoire</span>
      <h1>🎮 Color Memory Challenge</h1>
      <p>
        Observez la séquence de couleurs, mémorisez-la, puis reproduisez-la
        dans le bon ordre. Chaque niveau ajoute une couleur de plus !
      </p>

      <ul className="rules-list">
        <li>
          <span className="step-num">1</span>
          Regardez attentivement la séquence qui s'illumine.
        </li>
        <li>
          <span className="step-num">2</span>
          Reproduisez-la en cliquant sur les mêmes couleurs, dans l'ordre.
        </li>
        <li>
          <span className="step-num">3</span>
          Une erreur termine la partie — allez le plus loin possible !
        </li>
      </ul>

      <button className="btn-primary" onClick={startGame}>
        Commencer 🚀
      </button>
    </div>
  );
}

export default StartScreen;