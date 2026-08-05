import { useState, useEffect, useRef, useCallback } from "react";

import StartScreen from "./components/StartScreen";
import GameBoard from "./components/GameBoard";
import Score from "./components/Score";
import GameOver from "./components/GameOver";

import { playErrorSound } from "./utils/sound";
import "./App.css";

const COLORS = [
  { id: "ruby", hex: "#ff4d6d" },
  { id: "sapphire", hex: "#4d7fff" },
  { id: "emerald", hex: "#2ed573" },
  { id: "amber", hex: "#ffc947" },
  { id: "amethyst", hex: "#b455f0" },
  { id: "tangerine", hex: "#ff8a3d" },
];

const FLASH_ON_MS = 550;
const FLASH_OFF_MS = 250;
const NEXT_ROUND_DELAY_MS = 900;
const FEEDBACK_MS = 350;

// "idle" | "showing" | "input" | "gameover"
function App() {
  const [gameState, setGameState] = useState("idle");
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    () => parseInt(localStorage.getItem("bestScore"), 10) || 0
  );
  const [activeColor, setActiveColor] = useState(null);
  const [feedback, setFeedback] = useState(null); // { colorId, type: "correct" | "wrong" }
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);

  const timeouts = useRef([]);

  const clearTimers = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };
  const after = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timeouts.current.push(id);
    return id;
  };

  useEffect(() => clearTimers, []);

  const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

  // Joue la séquence à l'écran, couleur par couleur
  const playSequence = useCallback((seq) => {
    clearTimers();
    setGameState("showing");
    setUserSequence([]);
    setActiveColor(null);
    setRevealIndex(-1);

    let delay = 400;
    seq.forEach((color, i) => {
      after(() => {
        setActiveColor(color.id);
        setRevealIndex(i);
      }, delay);
      after(() => setActiveColor(null), delay + FLASH_ON_MS);
      delay += FLASH_ON_MS + FLASH_OFF_MS;
    });

    after(() => setGameState("input"), delay);
  }, []);

  function startGame() {
    clearTimers();
    setScore(0);
    setLevel(1);
    setIsNewRecord(false);
    setFeedback(null);
    const first = [randomColor()];
    setSequence(first);
    playSequence(first);
  }

  function endGame(finalScore) {
    clearTimers();
    setGameState("gameover");
    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem("bestScore", String(finalScore));
      setIsNewRecord(true);
    }
  }

  function handleClick(color) {
    if (gameState !== "input") return;

    const newUserSequence = [...userSequence, color];
    const index = newUserSequence.length - 1;
    const expected = sequence[index];

    if (color.id !== expected.id) {
      playErrorSound();
      setFeedback({ colorId: color.id, type: "wrong" });
      setGameState("locked");
      after(() => endGame(score), FEEDBACK_MS + 250);
      return;
    }

    setFeedback({ colorId: color.id, type: "correct" });
    after(() => setFeedback(null), FEEDBACK_MS);
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      const newScore = score + level * 10;
      setScore(newScore);
      setLevel((l) => l + 1);
      setGameState("locked");

      after(() => {
        const nextSeq = [...sequence, randomColor()];
        setSequence(nextSeq);
        playSequence(nextSeq);
      }, NEXT_ROUND_DELAY_MS);
    }
  }

  function restart() {
    startGame();
  }

  return (
    <div className="app">
      {gameState === "idle" && <StartScreen startGame={startGame} />}

      {gameState !== "idle" && gameState !== "gameover" && (
        <div className="game-container">
          <h1>🎨 Color Memory Challenge</h1>

          <Score score={score} level={level} bestScore={bestScore} />

          <span
            className={
              "status-badge " + (gameState === "showing" ? "showing" : "input")
            }
          >
            <span className="status-dot" />
            {gameState === "showing" ? "Mémorisez..." : "À vous de jouer"}
          </span>

          <div className="progress-track">
            {sequence.map((_, i) => {
              const filled =
                gameState === "showing"
                  ? i <= revealIndex
                  : i < userSequence.length;
              const isCurrent = gameState === "showing" && i === revealIndex;
              return (
                <span
                  key={i}
                  className={
                    "progress-dot" +
                    (filled ? " filled" : "") +
                    (isCurrent ? " current" : "")
                  }
                />
              );
            })}
          </div>

          <GameBoard
            colors={COLORS}
            activeColor={activeColor}
            feedback={feedback}
            disabled={gameState !== "input"}
            onColorClick={handleClick}
          />

          <p className="instruction">
            {gameState === "showing"
              ? "Observez attentivement la séquence de couleurs."
              : "Reproduisez la séquence dans le bon ordre."}
          </p>
        </div>
      )}

      {gameState === "gameover" && (
        <GameOver
          score={score}
          bestScore={bestScore}
          isNewRecord={isNewRecord}
          restart={restart}
        />
      )}
    </div>
  );
}

export default App;