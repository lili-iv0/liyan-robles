import PixelSprite from './PixelSprite';

// Pseudo-random but fixed star positions (no layout jumping between renders).
const rand = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({ length: 46 }, (_, i) => ({
  left: rand(i + 1) * 100,
  top: rand(i + 60) * 58,
  delay: rand(i + 120) * 4,
  big: rand(i + 9) > 0.82,
}));

const CLOUDS = [
  { top: '9%', size: 5, dur: 70, delay: -20 },
  { top: '30%', size: 4, dur: 95, delay: -60 },
  { top: '17%', size: 6, dur: 120, delay: -95 },
];

// Decorative background for the home hero: sky, clouds, ground and props. Nothing here is interactive.
export default function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-bg">
        {STARS.map((s, i) => (
          <span
            key={i}
            className={`star ${s.big ? 'star-big' : ''}`}
            style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
          />
        ))}
        <div className="orb"><PixelSprite name="orb" size={8} /></div>
        {CLOUDS.map((c, i) => (
          <div key={i} className="cloud" style={{ top: c.top, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}>
            <PixelSprite name="cloud" size={c.size} />
          </div>
        ))}
        <div className="props">
          <div className="prop" style={{ left: '4%' }}><PixelSprite name="tree" size={7} /></div>
          <div className="prop prop-md" style={{ left: '13%' }}><PixelSprite name="bush" size={6} /></div>
          <div className="prop prop-md" style={{ left: '63%' }}><PixelSprite name="bush" size={5} /></div>
          <div className="prop" style={{ right: '5%' }}><PixelSprite name="tree" size={6} /></div>
          <div className="prop prop-md" style={{ right: '14%' }}><PixelSprite name="chest" size={5} /></div>
        </div>
        <div className="ground" />
      </div>
    </div>
  );
}
