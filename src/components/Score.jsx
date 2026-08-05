function Score({ score, level, bestScore }) {
  return (
    <div className="score-box">
      <div className="score-item">
        <span className="score-label">⭐ Score</span>
        <p className="score-value">{score}</p>
      </div>

      <div className="score-item best">
        <span className="score-label">🏆 Record</span>
        <p className="score-value">{bestScore}</p>
      </div>

      <div className="score-item">
        <span className="score-label">🚀 Niveau</span>
        <p className="score-value">{level}</p>
      </div>
    </div>
  );
}

export default Score;