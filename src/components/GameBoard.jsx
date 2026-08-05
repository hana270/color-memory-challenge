import { playColorSound } from "../utils/sound";

function GameBoard({ colors, activeColor, feedback, disabled, onColorClick }) {
  function handleClick(color) {
    playColorSound(color.id);
    onColorClick(color);
  }

  return (
    <div className="board">
      {colors.map((color) => {
        const isActive = activeColor === color.id;
        const isFeedback = feedback && feedback.colorId === color.id;

        const className =
          "color" +
          (isActive ? " active" : "") +
          (isFeedback ? " " + feedback.type : "");

        return (
          <button
            key={color.id}
            className={className}
            style={{
              backgroundColor: color.hex,
              "--glow-color": color.hex,
            }}
            disabled={disabled}
            aria-label={color.id}
            onClick={() => handleClick(color)}
          />
        );
      })}
    </div>
  );
}

export default GameBoard;