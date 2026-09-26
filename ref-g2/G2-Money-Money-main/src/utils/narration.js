// src/utils/narration.js
// Narration script builder for MoneyQuest
// Strictly matches on-screen text 1:1

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to MoneyQuest! Let's investigate the big money mystery!"),
    say("If Oliver has a shiny two-dollar coin, three twenty-cent coins, and one ten-cent coin… that makes two dollars and seventy cents in total."),
    ask("Can he buy an eighty-five cent muffin and a fifty-cent pencil, and how much change will he get back?"),
    cheer("Let's investigate how counting coins and making change works!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("Oliver had been saving up all week by helping with chores at home."),
      say("On Saturday morning, his mum smiled and handed him some pocket money — a shiny two-dollar coin, three twenty-cent coins, and one ten-cent coin."),
      think("How much money do I have altogether? Oliver wondered, spreading the coins out on the table."),
      say("He carefully added them up: two dollars, then sixty cents, then ten cents more."),
      cheer("I have two dollars and seventy cents! he cheered proudly."),
    ],
    [
      say("At the school market, Oliver's eyes went wide at all the stalls."),
      say("He spotted a delicious-looking muffin with a price tag that read eighty-five cents."),
      ask("Do I have enough money to buy it? he asked nervously."),
      say("Emma, who was helping at the stall, grinned. It's simple! Your twenty-cent coins and ten-cent coin make seventy cents. You need eighty-five cents, so you need fifteen cents more."),
      cheer("You have two dollars and seventy cents in total, so you definitely have enough!"),
    ],
    [
      say("Oliver decided to buy the muffin. He handed over his one-dollar coin."),
      say("Emma smiled and opened the till. Your muffin costs eighty-five cents, and you gave me one dollar. So I need to give you back the difference!"),
      say("She counted carefully and placed one ten-cent coin and one five-cent coin into Oliver's palm."),
      cheer("That's fifteen cents change! Penny the Piggy Bank bounced excitedly. Change is the money you get back when you pay MORE than the price! One dollar minus eighty-five cents equals fifteen cents."),
    ],
    [
      say("By the end of the market day, Oliver had bought a muffin for eighty-five cents, a pencil for fifty cents, and a sticker pack for one dollar and twenty cents."),
      say("He spent two dollars and fifty-five cents in total! Starting with two dollars and seventy cents, he had fifteen cents left over."),
      say("I can add and subtract money just like regular numbers, Oliver said happily."),
      cheer("Emma high-fived him. You're a money master now, Oliver! Penny jingled with joy."),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — Coin Counter and Register Lab!"),
      instruct("Tap the coins in the tray to build the exact target amount shown. Tap any coin in your purse to remove it. Try using the fewest coins possible!"),
    ],
    [
      instruct("Welcome to Station B — Supermarket Scanner and Price Matcher!"),
      instruct("Scan items on the market conveyor, see the prices print on your receipt, and solve the shopping budget challenges!"),
    ],
    [
      instruct("Welcome to Station C — The Cashier Change Maker!"),
      instruct("You are the shopkeeper! A customer buys an item and pays with a larger coin or note. Calculate the change and dispense the exact coins from the till drawer!"),
    ],
    [
      instruct("Welcome to Station D — Receipt Detective!"),
      instruct("Detective Penny has found receipts with change calculation errors. Inspect the receipt, spot the mistake, and fix the amount!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [
    ask(questionText)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible streak! You are unstoppable! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three in a row! ⭐")];
  }
  return [cheer("Spot on! That's correct! 🎉")];
}

export function playWrongNarration() {
  return [
    think("Not quite — check the hint, count the coins carefully, and try again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here's your first hint! Look at the biggest coins or dollars first.")
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here's your final clue! Break down the dollars and cents step by step.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("World Complete! Spectacular job on this money district! 🌟")
  ];
}

export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Answer correctly to defeat the boss and claim your badge!")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Victory! You defeated the boss and claimed the World Badge! 👑")
  ];
}

export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase! Let's review the key money concepts and check your scorecard! 📓")
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered money, coins, notes, and making change! You are a true Money Master! 🏆")
  ];
}
