const fs = require('fs');
const path = require('path');

const output = path.join(__dirname, '..', 'assets', 'sounds');
fs.mkdirSync(output, { recursive: true });

function wav(name, notes) {
  const rate = 22050;
  const samples = [];
  for (const { frequency, duration, volume = 0.22 } of notes) {
    const length = Math.floor(rate * duration);
    for (let i = 0; i < length; i += 1) {
      const fade = Math.min(1, i / 150, (length - i) / 350);
      const wave = Math.sin((2 * Math.PI * frequency * i) / rate);
      samples.push(Math.round(32767 * volume * fade * wave));
    }
  }
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24);
  buffer.writeUInt32LE(rate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  samples.forEach((sample, index) => buffer.writeInt16LE(sample, 44 + index * 2));
  fs.writeFileSync(path.join(output, name), buffer);
}

wav('tap.wav', [{ frequency: 520, duration: 0.07, volume: 0.12 }]);
wav('correct.wav', [
  { frequency: 523.25, duration: 0.1 },
  { frequency: 659.25, duration: 0.1 },
  { frequency: 783.99, duration: 0.18 },
]);
wav('try-again.wav', [
  { frequency: 440, duration: 0.12, volume: 0.14 },
  { frequency: 392, duration: 0.16, volume: 0.12 },
]);
wav('win.wav', [
  { frequency: 523.25, duration: 0.1 },
  { frequency: 659.25, duration: 0.1 },
  { frequency: 783.99, duration: 0.1 },
  { frequency: 1046.5, duration: 0.25 },
]);
