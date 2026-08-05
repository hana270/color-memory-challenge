// Génère des notes façon piano avec la Web Audio API — aucune installation
// ni fichier audio nécessaire. Une note différente par couleur, sur une
// gamme pentatonique (toujours agréable, quel que soit l'ordre des clics).

const NOTE_FREQUENCIES = {
  ruby: 523.25, // Do5
  sapphire: 587.33, // Ré5
  emerald: 659.25, // Mi5
  amber: 783.99, // Sol5
  amethyst: 880.0, // La5
  tangerine: 1046.5, // Do6
};

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Les navigateurs suspendent le contexte tant qu'il n'y a pas eu
  // d'interaction utilisateur : on le relance à chaque appel.
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Joue une note "piano" pour l'id de couleur donné.
export function playColorSound(colorId) {
  const freq = NOTE_FREQUENCIES[colorId];
  if (!freq) return;

  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.25;
  masterGain.connect(ctx.destination);

  // Deux oscillateurs superposés (fondamentale + octave) pour un timbre
  // plus riche et rond, façon corde de piano.
  const partials = [
    { type: "triangle", detune: 0, gain: 0.7 },
    { type: "sine", detune: 1200, gain: 0.25 }, // octave au-dessus
  ];

  partials.forEach(({ type, detune, gain }) => {
    const osc = ctx.createOscillator();
    const envelope = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;

    // Enveloppe "attaque-déclin" typique d'un piano : montée quasi
    // instantanée puis décroissance exponentielle douce.
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(gain, now + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(envelope);
    envelope.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.9);
  });
}

// Petit son grave et sourd joué lors d'une erreur.
export function playErrorSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const envelope = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(70, now + 0.35);

  envelope.gain.setValueAtTime(0.2, now);
  envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  osc.connect(envelope);
  envelope.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}