export function randomEmoji() {
  const emojies = [
    ["🖐️", "🧠", "🎀", "🎃", "🎲", "🧸"],
    ["🐤", "🐧", "🕊️", "🦢", "🦕", "🦖"],
    ["🐳", "🐬", "🐙", "🐚", "🪸", "🪼"],
    ["🌸", "🌹", "🥀", "🌺", "🌻", "🌼", "🌱", "🌵", "🦋", "🐝"],
    ["🍇", "🍊", "🍋", "🍌", "🍒", "🫐", "🥝", "🥥", "🌶️"],
    ["🌙", "🌞", "☁️", "🌀", "❄️"],
  ];

  const group = emojies[Math.floor(Math.random() * emojies.length)];
  return group[Math.floor(Math.random() * group.length)];
}
