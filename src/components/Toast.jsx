import PixelSprite from './PixelSprite';
import { useGame } from '../game/GameContext';

// Achievement pop-ups, bottom-right.
export default function Toasts() {
  const { toasts } = useGame();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <PixelSprite name="star" size={4} />
          <div>
            <p className="toast-kicker">Achievement unlocked</p>
            <p className="toast-title">{t.title}</p>
            <p className="toast-text">{t.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
