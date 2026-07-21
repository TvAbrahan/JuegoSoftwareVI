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

function effect(name, duration, sampleAt) {
  const rate = 22050;
  const length = Math.floor(rate * duration);
  const samples = Array.from({ length }, (_, index) => {
    const time = index / rate;
    const fade = Math.min(1, index / 180, (length - index) / 500);
    return Math.max(-32767, Math.min(32767, Math.round(32767 * fade * sampleAt(time, index, rate))));
  });
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + dataSize, 4); buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24); buffer.writeUInt32LE(rate * 2, 28); buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34); buffer.write('data', 36); buffer.writeUInt32LE(dataSize, 40);
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

const sine = (frequency, time) => Math.sin(2 * Math.PI * frequency * time);
effect('ambulance.wav', 0.9, (t) => 0.2 * sine(720 + 170 * Math.sin(2 * Math.PI * 2.1 * t), t));
effect('police.wav', 0.9, (t) => 0.2 * sine((Math.floor(t * 5) % 2 ? 860 : 610), t));
effect('fire-truck.wav', 1.0, (t) => 0.22 * sine(520 + 110 * Math.sin(2 * Math.PI * 1.4 * t), t));
effect('horn.wav', 0.45, (t) => 0.18 * sine(330, t) + 0.09 * sine(440, t));
effect('truck-horn.wav', 0.55, (t) => 0.2 * sine(165, t) + 0.1 * sine(220, t));
effect('engine.wav', 0.75, (t, i) => 0.14 * sine(90 + 210 * t, t) + 0.05 * (((i * 73) % 101) / 50 - 1));
effect('tractor.wav', 0.8, (t) => 0.17 * sine(72, t) * (Math.sin(2 * Math.PI * 9 * t) > -0.15 ? 1 : 0.25));
effect('helicopter.wav', 0.8, (t) => 0.18 * sine(38, t) * (Math.sin(2 * Math.PI * 14 * t) > 0 ? 1 : -0.4));
effect('train.wav', 0.8, (t) => 0.18 * sine(420 + 150 * t, t) + 0.08 * sine(630 + 220 * t, t));
effect('boat.wav', 0.8, (t) => 0.13 * sine(82, t) + 0.05 * Math.sin(2 * Math.PI * 3 * t));
effect('bicycle.wav', 0.45, (t) => 0.16 * sine(1250, t) * Math.exp(-5 * t) + (t > 0.2 ? 0.13 * sine(1450, t - 0.2) * Math.exp(-8 * (t - 0.2)) : 0));
effect('spray.wav', 0.55, (_t, i) => 0.12 * (((i * 97) % 211) / 105 - 1));
effect('signal.wav', 0.5, (t) => 0.18 * sine(880, t) * (Math.floor(t * 8) % 2));
