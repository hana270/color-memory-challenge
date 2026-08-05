function GameOver({ score, bestScore, isNewRecord, restart }) {
  return (
    <div className="card">
      <div className="result-icon">😢</div>
      <h1>Partie terminée</h1>

      {isNewRecord && <span className="new-record">🎉 Nouveau record !</span>}

      <div className="result-stats">
        <div className="score-item">
          <span className="score-label">⭐ Score</span>
          <p className="score-value">{score}</p>
        </div>
        <div className="score-item best">
          <span className="score-label">🏆 Record</span>
          <p className="score-value">{bestScore}</p>
        </div>
      </div>

      <button className="btn-primary" onClick={restart}>
        Rejouer 🔄
      </button>
    </div>
  );
}

export default GameOver;