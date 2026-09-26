// src/data/questionBank.js
// 100 Comprehensive Questions for MoneyQuest across 10 Themed Worlds (Grade 2-5 Math)

import { formatMoney } from '../utils/moneyMath.js';

export const DISTRICTS = [
  { id: 0, name: 'Coin Corner',        icon: '🪙', boss: { name: 'Coin Keeper',     emoji: '🪙', reward: 'Coin Expert Badge 🪙' } },
  { id: 1, name: 'Market Stall',       icon: '🍎', boss: { name: 'Stall Boss',      emoji: '🍉', reward: 'Market Star Badge 🍎' } },
  { id: 2, name: 'Note Bank',          icon: '💵', boss: { name: 'Banker Boss',     emoji: '🏦', reward: 'Note Master Badge 💵' } },
  { id: 3, name: 'Mixed Money Mart',   icon: '🛍️', boss: { name: 'Market Boss',     emoji: '🛒', reward: 'Mart Champion Badge 🛍️' } },
  { id: 4, name: 'Cents to Dollars',   icon: '💱', boss: { name: 'Exchange Boss',   emoji: '💱', reward: 'Converter Badge 💱' } },
  { id: 5, name: 'Which is More?',     icon: '⚖️', boss: { name: 'Scale Boss',      emoji: '⚖️', reward: 'Comparison Badge ⚖️' } },
  { id: 6, name: 'Adding Money',       icon: '➕', boss: { name: 'Calculator Boss', emoji: '🧮', reward: 'Adding Pro Badge ➕' } },
  { id: 7, name: 'Making Change',      icon: '🔄', boss: { name: 'Change Boss',     emoji: '💸', reward: 'Change Champion Badge 🔄' } },
  { id: 8, name: 'Word Problem Market',icon: '📝', boss: { name: 'Problem Boss',    emoji: '🧩', reward: 'Problem Solver Badge 📝' } },
  { id: 9, name: 'Money Master',       icon: '👑', boss: { name: 'Money King',      emoji: '👑', reward: 'Money Master Badge 👑' } },
];

const RAW_QUESTIONS = [
  // ── WORLD 0: COIN CORNER (Questions 1 - 10: 5¢ and 10¢ coins) ────────────────
  {
    id: 1, districtId: 0, category: 'COUNT COINS', visual: 'coins',
    questionText: "Oliver has 4 ten-cent coins and 2 five-cent coins. How much money does he have in total?",
    options: ['50¢', '45¢', '40¢', '55¢'],
    correctAnswer: '50¢',
    explanation: "4 × 10¢ = 40¢. 2 × 5¢ = 10¢. Adding them together: 40¢ + 10¢ = 50¢.",
    hint1: "Count the 10¢ coins first: 10, 20, 30, 40...",
    hint2: "Now add the two 5¢ coins (10¢). 40¢ + 10¢ = 50¢.",
    visualData: { tens: 4, fives: 2, total: 50 }
  },
  {
    id: 2, districtId: 0, category: 'COUNT COINS', visual: 'coins',
    questionText: "Emma has 3 ten-cent coins and 3 five-cent coins. How much does she have?",
    options: ['45¢', '35¢', '50¢', '40¢'],
    correctAnswer: '45¢',
    explanation: "3 × 10¢ = 30¢. 3 × 5¢ = 15¢. 30¢ + 15¢ = 45¢.",
    hint1: "3 ten-cent coins equal 30¢.",
    hint2: "3 five-cent coins equal 15¢. 30¢ + 15¢ = 45¢.",
    visualData: { tens: 3, fives: 3, total: 45 }
  },
  {
    id: 3, districtId: 0, category: 'COIN VALUE', visual: 'coins',
    questionText: "How many 5¢ coins make a 50¢ amount?",
    options: ['10', '5', '8', '12'],
    correctAnswer: '10',
    explanation: "50 ÷ 5 = 10. It takes ten 5¢ coins to make 50¢.",
    hint1: "Count by 5s up to 50.",
    hint2: "5, 10, 15, 20, 25, 30, 35, 40, 45, 50 — that's 10 coins.",
    visualData: { fives: 10, total: 50 }
  },
  {
    id: 4, districtId: 0, category: 'COUNT COINS', visual: 'coins',
    questionText: "Oliver puts 5 ten-cent coins in his piggy bank. How much did he save?",
    options: ['50¢', '55¢', '45¢', '$1.00'],
    correctAnswer: '50¢',
    explanation: "5 × 10¢ = 50¢.",
    hint1: "Count by 10s: 10, 20, 30, 40, 50.",
    hint2: "5 coins of 10 cents equal 50¢.",
    visualData: { tens: 5, total: 50 }
  },
  {
    id: 5, districtId: 0, category: 'COIN VALUE', visual: 'coins',
    questionText: "Which is equal to 30¢?",
    options: ['3 ten-cent coins', '2 five-cent coins', '4 ten-cent coins', '5 five-cent coins'],
    correctAnswer: '3 ten-cent coins',
    explanation: "3 × 10¢ = 30¢.",
    hint1: "10¢ + 10¢ + 10¢ = 30¢.",
    hint2: "3 coins of 10¢ make exactly 30¢.",
    visualData: { tens: 3, total: 30 }
  },
  {
    id: 6, districtId: 0, category: 'COUNT COINS', visual: 'coins',
    questionText: "Sophie has 6 five-cent coins. How much money is that?",
    options: ['30¢', '25¢', '35¢', '20¢'],
    correctAnswer: '30¢',
    explanation: "6 × 5¢ = 30¢.",
    hint1: "Multiply 6 by 5.",
    hint2: "6 × 5 = 30 cents.",
    visualData: { fives: 6, total: 30 }
  },
  {
    id: 7, districtId: 0, category: 'COUNT COINS', visual: 'coins',
    questionText: "James has 2 ten-cent coins and 4 five-cent coins. How much does he have?",
    options: ['40¢', '30¢', '45¢', '35¢'],
    correctAnswer: '40¢',
    explanation: "2 × 10¢ = 20¢. 4 × 5¢ = 20¢. 20¢ + 20¢ = 40¢.",
    hint1: "2 ten-cent coins is 20¢. 4 five-cent coins is 20¢.",
    hint2: "20¢ + 20¢ = 40¢.",
    visualData: { tens: 2, fives: 4, total: 40 }
  },
  {
    id: 8, districtId: 0, category: 'MAKE AMOUNT', visual: 'coins',
    questionText: "What is the fewest number of coins needed to make 25¢ using only 5¢ and 10¢ coins?",
    options: ['3 coins (two 10¢, one 5¢)', '5 coins (five 5¢)', '4 coins', '2 coins'],
    correctAnswer: '3 coins (two 10¢, one 5¢)',
    explanation: "Use two 10¢ coins (20¢) and one 5¢ coin (5¢) for a total of 3 coins.",
    hint1: "Use the largest coins possible first.",
    hint2: "Two 10¢ coins make 20¢, plus one 5¢ coin makes 25¢.",
    visualData: { tens: 2, fives: 1, total: 25 }
  },
  {
    id: 9, districtId: 0, category: 'COUNT COINS', visual: 'coins',
    questionText: "Lucas has 7 ten-cent coins and 1 five-cent coin. What is the total value?",
    options: ['75¢', '70¢', '80¢', '65¢'],
    correctAnswer: '75¢',
    explanation: "7 × 10¢ = 70¢. 70¢ + 5¢ = 75¢.",
    hint1: "7 × 10¢ = 70¢.",
    hint2: "Add 5¢ more: 70¢ + 5¢ = 75¢.",
    visualData: { tens: 7, fives: 1, total: 75 }
  },
  {
    id: 10, districtId: 0, category: 'COUNT COINS', visual: 'coins',
    questionText: "Mia has 8 five-cent coins. How much money does she have?",
    options: ['40¢', '45¢', '35¢', '50¢'],
    correctAnswer: '40¢',
    explanation: "8 × 5¢ = 40¢.",
    hint1: "Count by 5s eight times.",
    hint2: "8 × 5 = 40 cents.",
    visualData: { fives: 8, total: 40 }
  },

  // ── WORLD 1: MARKET STALL (Questions 11 - 20: 20¢ & 50¢ coins) ───────────────
  {
    id: 11, districtId: 1, category: 'COUNT COINS', visual: 'coins',
    questionText: "Oliver has 2 twenty-cent coins and 1 fifty-cent coin. How much is that altogether?",
    options: ['90¢', '80¢', '70¢', '$1.00'],
    correctAnswer: '90¢',
    explanation: "2 × 20¢ = 40¢. 40¢ + 50¢ = 90¢.",
    hint1: "Start with the 50¢ coin.",
    hint2: "50¢ + 20¢ + 20¢ = 90¢.",
    visualData: { fifties: 1, twenties: 2, total: 90 }
  },
  {
    id: 12, districtId: 1, category: 'COUNT COINS', visual: 'coins',
    questionText: "Emma has 3 twenty-cent coins. How much does she have?",
    options: ['60¢', '50¢', '80¢', '40¢'],
    correctAnswer: '60¢',
    explanation: "3 × 20¢ = 60¢.",
    hint1: "20 + 20 + 20 = 60.",
    hint2: "Three 20¢ coins make 60¢.",
    visualData: { twenties: 3, total: 60 }
  },
  {
    id: 13, districtId: 1, category: 'COUNT COINS', visual: 'coins',
    questionText: "Noah has 2 fifty-cent coins. How much money does he have?",
    options: ['$1.00', '90¢', '80¢', '$1.50'],
    correctAnswer: '$1.00',
    explanation: "50¢ + 50¢ = 100¢ = $1.00.",
    hint1: "Two 50¢ coins make 100 cents.",
    hint2: "100 cents equals $1.00.",
    visualData: { fifties: 2, total: 100 }
  },
  {
    id: 14, districtId: 1, category: 'COUNT COINS', visual: 'coins',
    questionText: "Ava has 1 fifty-cent coin, 1 twenty-cent coin, and 1 ten-cent coin. How much total?",
    options: ['80¢', '70¢', '90¢', '85¢'],
    correctAnswer: '80¢',
    explanation: "50¢ + 20¢ + 10¢ = 80¢.",
    hint1: "Add 50¢ + 20¢ = 70¢.",
    hint2: "Add 10¢ more: 70¢ + 10¢ = 80¢.",
    visualData: { fifties: 1, twenties: 1, tens: 1, total: 80 }
  },
  {
    id: 15, districtId: 1, category: 'COIN EQUIVALENCE', visual: 'coins',
    questionText: "How many 20¢ coins make $1.00?",
    options: ['5', '4', '6', '10'],
    correctAnswer: '5',
    explanation: "100 ÷ 20 = 5. Five 20¢ coins equal $1.00.",
    hint1: "$1.00 is 100 cents.",
    hint2: "20, 40, 60, 80, 100 — that's 5 coins.",
    visualData: { twenties: 5, total: 100 }
  },
  {
    id: 16, districtId: 1, category: 'COUNT COINS', visual: 'coins',
    questionText: "Ethan has 4 twenty-cent coins. How much money is that?",
    options: ['80¢', '60¢', '70¢', '90¢'],
    correctAnswer: '80¢',
    explanation: "4 × 20¢ = 80¢.",
    hint1: "4 × 20 = 80.",
    hint2: "4 coins of 20 cents equal 80¢.",
    visualData: { twenties: 4, total: 80 }
  },
  {
    id: 17, districtId: 1, category: 'COUNT COINS', visual: 'coins',
    questionText: "Grace has 1 fifty-cent coin and 3 twenty-cent coins. What is her total?",
    options: ['$1.10', '$1.00', '90¢', '$1.20'],
    correctAnswer: '$1.10',
    explanation: "50¢ + (3 × 20¢) = 50¢ + 60¢ = 110¢ = $1.10.",
    hint1: "3 twenty-cent coins make 60¢.",
    hint2: "50¢ + 60¢ = 110¢, which is $1.10.",
    visualData: { fifties: 1, twenties: 3, total: 110 }
  },
  {
    id: 18, districtId: 1, category: 'MAKE AMOUNT', visual: 'coins',
    questionText: "Which set of coins makes exactly 70¢?",
    options: ['One 50¢ and one 20¢', 'Three 20¢ coins', 'Two 50¢ coins', 'Four 20¢ coins'],
    correctAnswer: 'One 50¢ and one 20¢',
    explanation: "50¢ + 20¢ = 70¢.",
    hint1: "50 + 20 = 70.",
    hint2: "A 50¢ coin and a 20¢ coin make 70¢.",
    visualData: { fifties: 1, twenties: 1, total: 70 }
  },
  {
    id: 19, districtId: 1, category: 'COUNT COINS', visual: 'coins',
    questionText: "Henry has 2 fifty-cent coins and 2 twenty-cent coins. How much money is that?",
    options: ['$1.40', '$1.20', '$1.50', '$1.00'],
    correctAnswer: '$1.40',
    explanation: "(2 × 50¢) + (2 × 20¢) = 100¢ + 40¢ = $1.40.",
    hint1: "Two 50¢ coins make $1.00.",
    hint2: "Two 20¢ coins make 40¢. $1.00 + 40¢ = $1.40.",
    visualData: { fifties: 2, twenties: 2, total: 140 }
  },
  {
    id: 20, districtId: 1, category: 'COUNT COINS', visual: 'coins',
    questionText: "Lily has 5 twenty-cent coins and 1 fifty-cent coin. What is the total?",
    options: ['$1.50', '$1.40', '$1.20', '$1.60'],
    correctAnswer: '$1.50',
    explanation: "(5 × 20¢) + 50¢ = 100¢ + 50¢ = 150¢ = $1.50.",
    hint1: "5 twenty-cent coins make $1.00.",
    hint2: "$1.00 + 50¢ = $1.50.",
    visualData: { twenties: 5, fifties: 1, total: 150 }
  },

  // ── WORLD 2: NOTE BANK (Questions 21 - 30: $1, $2, $5, $10 Notes) ────────────
  {
    id: 21, districtId: 2, category: 'COUNT NOTES', visual: 'notes',
    questionText: "Oliver counts 3 five-dollar notes ($5). How much money does he have?",
    options: ['$15.00', '$10.00', '$12.00', '$20.00'],
    correctAnswer: '$15.00',
    explanation: "3 × $5 = $15.00.",
    hint1: "Count by 5s: 5, 10, 15.",
    hint2: "Three $5 notes equal $15.00.",
    visualData: { fives: 3, total: 1500 }
  },
  {
    id: 22, districtId: 2, category: 'COUNT NOTES', visual: 'notes',
    questionText: "Emma has 4 two-dollar notes ($2). How much does she have?",
    options: ['$8.00', '$6.00', '$10.00', '$4.00'],
    correctAnswer: '$8.00',
    explanation: "4 × $2 = $8.00.",
    hint1: "4 × 2 = 8.",
    hint2: "Four $2 notes equal $8.00.",
    visualData: { twos: 4, total: 800 }
  },
  {
    id: 23, districtId: 2, category: 'COUNT NOTES', visual: 'notes',
    questionText: "Jack has 2 ten-dollar notes ($10) and 1 five-dollar note ($5). What is his total?",
    options: ['$25.00', '$20.00', '$30.00', '$15.00'],
    correctAnswer: '$25.00',
    explanation: "(2 × $10) + $5 = $20 + $5 = $25.00.",
    hint1: "Two $10 notes make $20.",
    hint2: "Add $5 to get $25.00.",
    visualData: { tensNotes: 2, fiveNotes: 1, total: 2500 }
  },
  {
    id: 24, districtId: 2, category: 'NOTE VALUE', visual: 'notes',
    questionText: "How many $2 notes make $10?",
    options: ['5', '4', '6', '10'],
    correctAnswer: '5',
    explanation: "10 ÷ 2 = 5. Five $2 notes make $10.",
    hint1: "Count by 2s up to 10.",
    hint2: "2, 4, 6, 8, 10 — that is 5 notes.",
    visualData: { twos: 5, total: 1000 }
  },
  {
    id: 25, districtId: 2, category: 'COUNT NOTES', visual: 'notes',
    questionText: "Chloe has 1 ten-dollar note ($10), 1 five-dollar note ($5), and 2 two-dollar notes ($2). Total?",
    options: ['$19.00', '$17.00', '$20.00', '$18.00'],
    correctAnswer: '$19.00',
    explanation: "$10 + $5 + (2 × $2) = $15 + $4 = $19.00.",
    hint1: "$10 + $5 = $15.",
    hint2: "Two $2 notes is $4. $15 + $4 = $19.00.",
    visualData: { tensNotes: 1, fiveNotes: 1, twos: 2, total: 1900 }
  },
  {
    id: 26, districtId: 2, category: 'NOTE VALUE', visual: 'notes',
    questionText: "How many $5 notes are needed to make $20?",
    options: ['4', '5', '3', '2'],
    correctAnswer: '4',
    explanation: "20 ÷ 5 = 4.",
    hint1: "Count by 5s: 5, 10, 15, 20.",
    hint2: "That is 4 notes.",
    visualData: { fiveNotes: 4, total: 2000 }
  },
  {
    id: 27, districtId: 2, category: 'COUNT NOTES', visual: 'notes',
    questionText: "Ryan has 5 two-dollar notes ($2) and 1 ten-dollar note ($10). How much money is that?",
    options: ['$20.00', '$15.00', '$25.00', '$12.00'],
    correctAnswer: '$20.00',
    explanation: "(5 × $2) + $10 = $10 + $10 = $20.00.",
    hint1: "5 × $2 = $10.",
    hint2: "$10 + $10 = $20.00.",
    visualData: { twos: 5, tensNotes: 1, total: 2000 }
  },
  {
    id: 28, districtId: 2, category: 'MAKE AMOUNT', visual: 'notes',
    questionText: "Which combination makes exactly $16.00?",
    options: ['One $10, one $5, one $1 coin', 'Three $5 notes', 'Two $10 notes', 'Eight $1 coins'],
    correctAnswer: 'One $10, one $5, one $1 coin',
    explanation: "$10 + $5 + $1 = $16.00.",
    hint1: "Look for numbers that add up to 16.",
    hint2: "10 + 5 + 1 = 16.",
    visualData: { tensNotes: 1, fiveNotes: 1, ones: 1, total: 1600 }
  },
  {
    id: 29, districtId: 2, category: 'COUNT NOTES', visual: 'notes',
    questionText: "Ella has 3 ten-dollar notes ($10). How much does she have?",
    options: ['$30.00', '$20.00', '$35.00', '$25.00'],
    correctAnswer: '$30.00',
    explanation: "3 × $10 = $30.00.",
    hint1: "Count by 10s three times.",
    hint2: "10, 20, 30.",
    visualData: { tensNotes: 3, total: 3000 }
  },
  {
    id: 30, districtId: 2, category: 'COUNT NOTES', visual: 'notes',
    questionText: "James has 6 two-dollar notes ($2). What is the total value?",
    options: ['$12.00', '$10.00', '$14.00', '$8.00'],
    correctAnswer: '$12.00',
    explanation: "6 × $2 = $12.00.",
    hint1: "6 × 2 = 12.",
    hint2: "Six $2 notes equal $12.00.",
    visualData: { twos: 6, total: 1200 }
  },

  // ── WORLD 3: MIXED MONEY MART (Questions 31 - 40: Mixed Coins & Notes) ───────
  {
    id: 31, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Oliver has one $2 coin, two 50¢ coins, and one 20¢ coin. Total amount?",
    options: ['$3.20', '$3.00', '$2.70', '$3.50'],
    correctAnswer: '$3.20',
    explanation: "$2.00 + (2 × 50¢) + 20¢ = $2.00 + $1.00 + 20¢ = $3.20.",
    hint1: "Two 50¢ coins make $1.00.",
    hint2: "$2.00 + $1.00 + 20¢ = $3.20.",
    visualData: { twos: 1, fifties: 2, twenties: 1, total: 320 }
  },
  {
    id: 32, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Emma has one $5 note, one $1 coin, and three 10¢ coins. How much in her purse?",
    options: ['$6.30', '$6.20', '$5.30', '$6.50'],
    correctAnswer: '$6.30',
    explanation: "$5.00 + $1.00 + (3 × 10¢) = $6.00 + 30¢ = $6.30.",
    hint1: "Add the dollars first: $5 + $1 = $6.",
    hint2: "Then add the cents: 3 × 10¢ = 30¢. Total is $6.30.",
    visualData: { fiveNotes: 1, ones: 1, tens: 3, total: 630 }
  },
  {
    id: 33, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Noah's wallet has one $2 coin, three 20¢ coins, and one 5¢ coin. How much is inside?",
    options: ['$2.65', '$2.60', '$2.55', '$2.75'],
    correctAnswer: '$2.65',
    explanation: "$2.00 + (3 × 20¢) + 5¢ = $2.00 + 60¢ + 5¢ = $2.65.",
    hint1: "Three 20¢ coins make 60¢.",
    hint2: "$2.00 + 60¢ + 5¢ = $2.65.",
    visualData: { twos: 1, twenties: 3, fives: 1, total: 265 }
  },
  {
    id: 34, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Ava has one $5 note, two 50¢ coins, and four 10¢ coins. How much does she have?",
    options: ['$6.40', '$6.50', '$5.90', '$6.20'],
    correctAnswer: '$6.40',
    explanation: "$5.00 + (2 × 50¢) + (4 × 10¢) = $5.00 + $1.00 + 40¢ = $6.40.",
    hint1: "Two 50¢ coins make $1.00. $5 + $1 = $6.00.",
    hint2: "Add 40¢ to get $6.40.",
    visualData: { fiveNotes: 1, fifties: 2, tens: 4, total: 640 }
  },
  {
    id: 35, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Lucas has three $1 coins, one 50¢ coin, and one 20¢ coin. Total amount?",
    options: ['$3.70', '$3.50', '$3.60', '$4.00'],
    correctAnswer: '$3.70',
    explanation: "$3.00 + 50¢ + 20¢ = $3.70.",
    hint1: "3 dollars is $3.00.",
    hint2: "50¢ + 20¢ = 70¢. Total is $3.70.",
    visualData: { ones: 3, fifties: 1, twenties: 1, total: 370 }
  },
  {
    id: 36, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Sophie has one $10 note and three 50¢ coins. How much money is that?",
    options: ['$11.50', '$11.00', '$12.00', '$10.50'],
    correctAnswer: '$11.50',
    explanation: "$10.00 + (3 × 50¢) = $10.00 + $1.50 = $11.50.",
    hint1: "3 fifty-cent coins is $1.50.",
    hint2: "$10.00 + $1.50 = $11.50.",
    visualData: { tensNotes: 1, fifties: 3, total: 1150 }
  },
  {
    id: 37, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Ethan has two $2 coins, one 20¢ coin, and two 5¢ coins. What is his total?",
    options: ['$4.30', '$4.20', '$4.25', '$4.40'],
    correctAnswer: '$4.30',
    explanation: "(2 × $2) + 20¢ + (2 × 5¢) = $4.00 + 20¢ + 10¢ = $4.30.",
    hint1: "Two $2 coins = $4.00.",
    hint2: "20¢ + 10¢ = 30¢. Total is $4.30.",
    visualData: { twos: 2, twenties: 1, fives: 2, total: 430 }
  },
  {
    id: 38, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Grace has one $5 note and four 20¢ coins. How much money does she have?",
    options: ['$5.80', '$5.60', '$6.00', '$5.40'],
    correctAnswer: '$5.80',
    explanation: "$5.00 + (4 × 20¢) = $5.00 + 80¢ = $5.80.",
    hint1: "4 × 20¢ = 80¢.",
    hint2: "$5.00 + 80¢ = $5.80.",
    visualData: { fiveNotes: 1, twenties: 4, total: 580 }
  },
  {
    id: 39, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Henry has one $2 coin, one $1 coin, and six 10¢ coins. What is his total?",
    options: ['$3.60', '$3.50', '$3.70', '$4.00'],
    correctAnswer: '$3.60',
    explanation: "$2.00 + $1.00 + (6 × 10¢) = $3.00 + 60¢ = $3.60.",
    hint1: "$2 + $1 = $3.00.",
    hint2: "6 × 10¢ = 60¢. Total is $3.60.",
    visualData: { twos: 1, ones: 1, tens: 6, total: 360 }
  },
  {
    id: 40, districtId: 3, category: 'MIXED MONEY', visual: 'mixed',
    questionText: "Lily has two $1 coins, two 20¢ coins, and one 5¢ coin. Total?",
    options: ['$2.45', '$2.40', '$2.50', '$2.35'],
    correctAnswer: '$2.45',
    explanation: "$2.00 + 40¢ + 5¢ = $2.45.",
    hint1: "Two $1 coins = $2.00.",
    hint2: "40¢ + 5¢ = 45¢. Total is $2.45.",
    visualData: { ones: 2, twenties: 2, fives: 1, total: 245 }
  },

  // ── WORLD 4: CENTS TO DOLLARS (Questions 41 - 50: 100¢ = $1 Conversion) ─────
  {
    id: 41, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "How many dollars is 250 cents?",
    options: ['$2.50', '$25.00', '$0.25', '$2.05'],
    correctAnswer: '$2.50',
    explanation: "250 cents = 200 cents + 50 cents = $2.50.",
    hint1: "100 cents = $1.00.",
    hint2: "200 cents is $2.00, plus 50¢ = $2.50.",
    visualData: { cents: 250, dollars: 2.50 }
  },
  {
    id: 42, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "$3.75 is the same as how many cents?",
    options: ['375 cents', '37 cents', '3750 cents', '75 cents'],
    correctAnswer: '375 cents',
    explanation: "$3.75 = 3 × 100¢ + 75¢ = 375 cents.",
    hint1: "$3 is 300 cents.",
    hint2: "300 cents + 75 cents = 375 cents.",
    visualData: { dollars: 3.75, cents: 375 }
  },
  {
    id: 43, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "What is 400 cents written in dollars?",
    options: ['$4.00', '$40.00', '$0.40', '$400.00'],
    correctAnswer: '$4.00',
    explanation: "400 ÷ 100 = 4. 400 cents = $4.00.",
    hint1: "Every 100 cents is $1.",
    hint2: "400 cents = $4.00.",
    visualData: { cents: 400, dollars: 4.00 }
  },
  {
    id: 44, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "$1.05 is the same as how many cents?",
    options: ['105 cents', '150 cents', '15 cents', '1005 cents'],
    correctAnswer: '105 cents',
    explanation: "$1.00 = 100 cents. 100 + 5 = 105 cents.",
    hint1: "$1.00 is 100 cents.",
    hint2: "100 cents + 5 cents = 105 cents.",
    visualData: { dollars: 1.05, cents: 105 }
  },
  {
    id: 45, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "Express 180 cents in dollars and cents.",
    options: ['$1.80', '$18.00', '$0.18', '$1.08'],
    correctAnswer: '$1.80',
    explanation: "180 cents = 100¢ + 80¢ = $1.80.",
    hint1: "100 cents is $1.00.",
    hint2: "100 cents + 80 cents = $1.80.",
    visualData: { cents: 180, dollars: 1.80 }
  },
  {
    id: 46, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "$5.20 is equal to:",
    options: ['520 cents', '52 cents', '502 cents', '5200 cents'],
    correctAnswer: '520 cents',
    explanation: "$5.20 = 500¢ + 20¢ = 520 cents.",
    hint1: "$5 = 500 cents.",
    hint2: "500 + 20 = 520 cents.",
    visualData: { dollars: 5.20, cents: 520 }
  },
  {
    id: 47, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "How many cents are in $0.95?",
    options: ['95 cents', '950 cents', '9.5 cents', '59 cents'],
    correctAnswer: '95 cents',
    explanation: "$0.95 = 95 cents.",
    hint1: "There are 0 whole dollars and 95 cents.",
    hint2: "The amount is 95 cents.",
    visualData: { dollars: 0.95, cents: 95 }
  },
  {
    id: 48, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "605 cents is equal to:",
    options: ['$6.05', '$6.50', '$60.50', '$0.65'],
    correctAnswer: '$6.05',
    explanation: "605 cents = 600¢ + 5¢ = $6.05.",
    hint1: "600 cents is $6.00.",
    hint2: "Add 5 cents: $6.05.",
    visualData: { cents: 605, dollars: 6.05 }
  },
  {
    id: 49, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "Convert $8.00 into cents.",
    options: ['800 cents', '80 cents', '8000 cents', '8 cents'],
    correctAnswer: '800 cents',
    explanation: "8 × 100 = 800 cents.",
    hint1: "Multiply 8 by 100.",
    hint2: "8 × 100 = 800 cents.",
    visualData: { dollars: 8.00, cents: 800 }
  },
  {
    id: 50, districtId: 4, category: 'CONVERSION', visual: 'conversion',
    questionText: "315 cents in dollars is:",
    options: ['$3.15', '$31.50', '$0.35', '$3.50'],
    correctAnswer: '$3.15',
    explanation: "315 cents = 300¢ + 15¢ = $3.15.",
    hint1: "300 cents is $3.00.",
    hint2: "$3.00 + 15¢ = $3.15.",
    visualData: { cents: 315, dollars: 3.15 }
  },

  // ── WORLD 5: WHICH IS MORE? (Questions 51 - 60: Comparing Money) ─────────────
  {
    id: 51, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Which is MORE: $1.80 or $1.08?",
    options: ['$1.80', '$1.08', 'They are equal', 'Cannot tell'],
    correctAnswer: '$1.80',
    explanation: "$1.80 is 180 cents. $1.08 is 108 cents. 180 cents is more than 108 cents.",
    hint1: "Compare the cents part: 80¢ vs 8¢.",
    hint2: "80 cents is more than 8 cents, so $1.80 is more.",
    visualData: { amountA: 180, amountB: 108 }
  },
  {
    id: 52, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Which is LESS: 95¢ or $1.05?",
    options: ['95¢', '$1.05', 'They are equal', 'Cannot tell'],
    correctAnswer: '95¢',
    explanation: "95¢ is less than 100¢ ($1.00), while $1.05 is 105¢.",
    hint1: "Convert both to cents: 95¢ vs 105¢.",
    hint2: "95 cents is less than 105 cents.",
    visualData: { amountA: 95, amountB: 105 }
  },
  {
    id: 53, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Put these amounts in order from LEAST to GREATEST: $2.40, 95¢, $1.50.",
    options: ['95¢ < $1.50 < $2.40', '$1.50 < 95¢ < $2.40', '$2.40 < $1.50 < 95¢', '95¢ < $2.40 < $1.50'],
    correctAnswer: '95¢ < $1.50 < $2.40',
    explanation: "In cents: 95¢ < 150¢ < 240¢.",
    hint1: "Find the smallest amount first (less than a dollar).",
    hint2: "95¢ is smallest, then $1.50, then $2.40.",
    visualData: { sorted: ['95¢', '$1.50', '$2.40'] }
  },
  {
    id: 54, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Which is GREATER: three 50¢ coins or two $1 coins?",
    options: ['Two $1 coins ($2.00)', 'Three 50¢ coins ($1.50)', 'They are equal', 'Cannot tell'],
    correctAnswer: 'Two $1 coins ($2.00)',
    explanation: "Three 50¢ coins = $1.50. Two $1 coins = $2.00. $2.00 is greater than $1.50.",
    hint1: "3 × 50¢ = $1.50.",
    hint2: "2 × $1 = $2.00. $2.00 is bigger.",
    visualData: { amountA: 150, amountB: 200 }
  },
  {
    id: 55, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Which is LESS: $3.25 or $3.52?",
    options: ['$3.25', '$3.52', 'They are equal', 'Cannot tell'],
    correctAnswer: '$3.25',
    explanation: "Both have $3. Comparing cents: 25¢ is less than 52¢.",
    hint1: "Look at the cents: 25¢ vs 52¢.",
    hint2: "25¢ is smaller, so $3.25 is less.",
    visualData: { amountA: 325, amountB: 352 }
  },
  {
    id: 56, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Is 200 cents equal to $2.00?",
    options: ['Yes, exactly equal', 'No, 200 cents is more', 'No, $2.00 is more', 'Cannot tell'],
    correctAnswer: 'Yes, exactly equal',
    explanation: "100 cents = $1.00, so 200 cents = $2.00.",
    hint1: "Divide 200 by 100.",
    hint2: "200 ÷ 100 = 2. They are exactly equal.",
    visualData: { amountA: 200, amountB: 200 }
  },
  {
    id: 57, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Which is MORE: six 20¢ coins or one $1 coin?",
    options: ['Six 20¢ coins ($1.20)', 'One $1 coin ($1.00)', 'They are equal', 'Cannot tell'],
    correctAnswer: 'Six 20¢ coins ($1.20)',
    explanation: "6 × 20¢ = 120¢ = $1.20. $1.20 is more than $1.00.",
    hint1: "Calculate 6 × 20¢.",
    hint2: "6 × 20¢ = $1.20, which is more than $1.00.",
    visualData: { amountA: 120, amountB: 100 }
  },
  {
    id: 58, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Which amount is the LARGEST?",
    options: ['$4.10', '$4.01', '$3.99', '$4.05'],
    correctAnswer: '$4.10',
    explanation: "In cents: 410¢ > 405¢ > 401¢ > 399¢.",
    hint1: "$4.10 is 410 cents.",
    hint2: "410 cents is larger than 405, 401, or 399 cents.",
    visualData: { amountA: 410 }
  },
  {
    id: 59, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Which is LESS: four $2 notes or one $10 note?",
    options: ['Four $2 notes ($8.00)', 'One $10 note ($10.00)', 'They are equal', 'Cannot tell'],
    correctAnswer: 'Four $2 notes ($8.00)',
    explanation: "4 × $2 = $8.00. $8.00 is less than $10.00.",
    hint1: "4 × $2 = $8.00.",
    hint2: "$8.00 is less than $10.00.",
    visualData: { amountA: 800, amountB: 1000 }
  },
  {
    id: 60, districtId: 5, category: 'COMPARE', visual: 'comparison',
    questionText: "Put from GREATEST to LEAST: $5.00, $5.50, $0.55.",
    options: ['$5.50 > $5.00 > $0.55', '$5.00 > $5.50 > $0.55', '$0.55 > $5.00 > $5.50', '$5.50 > $0.55 > $5.00'],
    correctAnswer: '$5.50 > $5.00 > $0.55',
    explanation: "$5.50 (550¢) > $5.00 (500¢) > $0.55 (55¢).",
    hint1: "550¢ is the largest, followed by 500¢, then 55¢.",
    hint2: "$5.50 > $5.00 > $0.55.",
    visualData: { sorted: ['$5.50', '$5.00', '$0.55'] }
  },

  // ── WORLD 6: ADDING MONEY (Questions 61 - 70: Summing Prices) ────────────────
  {
    id: 61, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "Oliver buys a pencil for 40¢ and an eraser for 25¢. How much does he spend in total?",
    options: ['65¢', '60¢', '70¢', '55¢'],
    correctAnswer: '65¢',
    explanation: "40¢ + 25¢ = 65¢.",
    hint1: "Add the tens: 40 + 20 = 60.",
    hint2: "Add the ones: 60 + 5 = 65¢.",
    visualData: { itemA: 'Pencil', priceA: 40, itemB: 'Eraser', priceB: 25, total: 65 }
  },
  {
    id: 62, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "Emma buys a muffin for 85¢ and a juice box for 60¢. How much in total?",
    options: ['$1.45', '$1.35', '$1.50', '$1.25'],
    correctAnswer: '$1.45',
    explanation: "85¢ + 60¢ = 145¢ = $1.45.",
    hint1: "85 + 60 = 145 cents.",
    hint2: "145 cents is $1.45.",
    visualData: { itemA: 'Muffin', priceA: 85, itemB: 'Juice box', priceB: 60, total: 145 }
  },
  {
    id: 63, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "Noah buys a ruler for $1.20 and a notebook for $2.30. Total cost?",
    options: ['$3.50', '$3.40', '$3.60', '$3.20'],
    correctAnswer: '$3.50',
    explanation: "$1.20 + $2.30 = $3.50.",
    hint1: "Add the dollars: $1 + $2 = $3.",
    hint2: "Add the cents: 20¢ + 30¢ = 50¢. Total is $3.50.",
    visualData: { itemA: 'Ruler', priceA: 120, itemB: 'Notebook', priceB: 230, total: 350 }
  },
  {
    id: 64, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "Sophie buys a sticker pack for 75¢ and a bookmark for 45¢. How much altogether?",
    options: ['$1.20', '$1.10', '$1.25', '$1.15'],
    correctAnswer: '$1.20',
    explanation: "75¢ + 45¢ = 120¢ = $1.20.",
    hint1: "75 + 45 = 120 cents.",
    hint2: "120 cents is $1.20.",
    visualData: { itemA: 'Sticker pack', priceA: 75, itemB: 'Bookmark', priceB: 45, total: 120 }
  },
  {
    id: 65, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "James spends $3.50 on lunch and $1.50 on dessert. What is his total bill?",
    options: ['$5.00', '$4.50', '$5.50', '$4.00'],
    correctAnswer: '$5.00',
    explanation: "$3.50 + $1.50 = $5.00.",
    hint1: "$3 + $1 = $4. 50¢ + 50¢ = $1.00.",
    hint2: "$4.00 + $1.00 = $5.00.",
    visualData: { itemA: 'Lunch', priceA: 350, itemB: 'Dessert', priceB: 150, total: 500 }
  },
  {
    id: 66, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "Ava buys coloured pencils for $2.40 and a sketch pad for $1.60. Total?",
    options: ['$4.00', '$3.90', '$4.10', '$3.80'],
    correctAnswer: '$4.00',
    explanation: "$2.40 + $1.60 = $4.00.",
    hint1: "$2 + $1 = $3. 40¢ + 60¢ = $1.00.",
    hint2: "$3.00 + $1.00 = $4.00.",
    visualData: { itemA: 'Pencils', priceA: 240, itemB: 'Pad', priceB: 160, total: 400 }
  },
  {
    id: 67, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "Ethan buys an apple for 50¢, a banana for 40¢, and a milk carton for 80¢. Total spent?",
    options: ['$1.70', '$1.60', '$1.80', '$1.50'],
    correctAnswer: '$1.70',
    explanation: "50¢ + 40¢ + 80¢ = 170¢ = $1.70.",
    hint1: "50 + 40 = 90¢.",
    hint2: "90¢ + 80¢ = 170¢ = $1.70.",
    visualData: { itemA: 'Fruits & Milk', priceA: 170, total: 170 }
  },
  {
    id: 68, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "Grace spends $4.25 on a storybook and $2.50 on a toy car. How much does she spend?",
    options: ['$6.75', '$6.50', '$6.65', '$7.00'],
    correctAnswer: '$6.75',
    explanation: "$4.25 + $2.50 = $6.75.",
    hint1: "$4 + $2 = $6.",
    hint2: "25¢ + 50¢ = 75¢. Total is $6.75.",
    visualData: { itemA: 'Storybook', priceA: 425, itemB: 'Toy car', priceB: 250, total: 675 }
  },
  {
    id: 69, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "Henry buys a badge for 70¢ and a ribbon for 35¢. Total cost?",
    options: ['$1.05', '$1.00', '$1.10', '95¢'],
    correctAnswer: '$1.05',
    explanation: "70¢ + 35¢ = 105¢ = $1.05.",
    hint1: "70 + 35 = 105 cents.",
    hint2: "105 cents is $1.05.",
    visualData: { itemA: 'Badge', priceA: 70, itemB: 'Ribbon', priceB: 35, total: 105 }
  },
  {
    id: 70, districtId: 6, category: 'ADDITION', visual: 'receipt',
    questionText: "Chloe buys 2 packs of cards at $1.50 each. How much does she pay?",
    options: ['$3.00', '$2.50', '$3.50', '$2.00'],
    correctAnswer: '$3.00',
    explanation: "$1.50 + $1.50 = $3.00.",
    hint1: "Double $1.50.",
    hint2: "$1.50 + $1.50 = $3.00.",
    visualData: { itemA: 'Cards (x2)', priceA: 300, total: 300 }
  },

  // ── WORLD 7: MAKING CHANGE (Questions 71 - 80: Calculating Change) ───────────
  {
    id: 71, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Oliver buys a muffin for 85¢ and pays with a $1.00 coin. How much change does he get?",
    options: ['15¢', '25¢', '10¢', '20¢'],
    correctAnswer: '15¢',
    explanation: "$1.00 − 85¢ = 100¢ − 85¢ = 15¢ change.",
    hint1: "Change = Amount Paid − Price.",
    hint2: "100¢ − 85¢ = 15¢.",
    visualData: { price: 85, paid: 100, change: 15 }
  },
  {
    id: 72, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Emma buys a pencil for 40¢ and pays with a 50¢ coin. How much change?",
    options: ['10¢', '5¢', '15¢', '20¢'],
    correctAnswer: '10¢',
    explanation: "50¢ − 40¢ = 10¢.",
    hint1: "Subtract 40¢ from 50¢.",
    hint2: "50 − 40 = 10¢.",
    visualData: { price: 40, paid: 50, change: 10 }
  },
  {
    id: 73, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Noah buys a juice box for $1.30 and pays with a $2.00 coin. What is his change?",
    options: ['70¢', '60¢', '80¢', '50¢'],
    correctAnswer: '70¢',
    explanation: "$2.00 − $1.30 = 200¢ − 130¢ = 70¢.",
    hint1: "$2.00 is 200 cents.",
    hint2: "200¢ − 130¢ = 70¢.",
    visualData: { price: 130, paid: 200, change: 70 }
  },
  {
    id: 74, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Sophie buys a book for $3.50 and pays with a $5.00 note. How much change does she receive?",
    options: ['$1.50', '$2.50', '$1.00', '$2.00'],
    correctAnswer: '$1.50',
    explanation: "$5.00 − $3.50 = $1.50.",
    hint1: "$5.00 − $3.00 = $2.00.",
    hint2: "$2.00 − 50¢ = $1.50.",
    visualData: { price: 350, paid: 500, change: 150 }
  },
  {
    id: 75, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Jack buys an eraser for 65¢ and pays with a $1.00 coin. What is his change?",
    options: ['35¢', '45¢', '25¢', '30¢'],
    correctAnswer: '35¢',
    explanation: "100¢ − 65¢ = 35¢.",
    hint1: "100 − 65 = ?",
    hint2: "65 + 35 = 100, so change is 35¢.",
    visualData: { price: 65, paid: 100, change: 35 }
  },
  {
    id: 76, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Ava buys a snack for $2.40 and gives the cashier $5.00. How much change is returned?",
    options: ['$2.60', '$3.60', '$2.40', '$3.40'],
    correctAnswer: '$2.60',
    explanation: "$5.00 − $2.40 = $2.60.",
    hint1: "500¢ − 240¢ = 260¢.",
    hint2: "260¢ is $2.60.",
    visualData: { price: 240, paid: 500, change: 260 }
  },
  {
    id: 77, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Ethan buys a toy for $1.75 and pays with two $1 coins ($2.00). How much change?",
    options: ['25¢', '35¢', '15¢', '50¢'],
    correctAnswer: '25¢',
    explanation: "$2.00 − $1.75 = 25¢.",
    hint1: "200 − 175 = 25.",
    hint2: "Change is 25¢.",
    visualData: { price: 175, paid: 200, change: 25 }
  },
  {
    id: 78, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Grace pays $10.00 for a backpack costing $7.20. What is her change?",
    options: ['$2.80', '$3.80', '$2.20', '$3.20'],
    correctAnswer: '$2.80',
    explanation: "$10.00 − $7.20 = $2.80.",
    hint1: "$10.00 − $7.00 = $3.00.",
    hint2: "$3.00 − 20¢ = $2.80.",
    visualData: { price: 720, paid: 1000, change: 280 }
  },
  {
    id: 79, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Henry buys a sticker for 15¢ and pays with a 50¢ coin. How much change does he get?",
    options: ['35¢', '25¢', '40¢', '30¢'],
    correctAnswer: '35¢',
    explanation: "50¢ − 15¢ = 35¢.",
    hint1: "50 − 15 = 35.",
    hint2: "Change is 35¢.",
    visualData: { price: 15, paid: 50, change: 35 }
  },
  {
    id: 80, districtId: 7, category: 'CHANGE', visual: 'change',
    questionText: "Chloe buys a water bottle for $1.10 and hands over a $5.00 note. What change is due?",
    options: ['$3.90', '$4.10', '$3.80', '$4.90'],
    correctAnswer: '$3.90',
    explanation: "$5.00 − $1.10 = $3.90.",
    hint1: "$5.00 − $1.00 = $4.00.",
    hint2: "$4.00 − 10¢ = $3.90.",
    visualData: { price: 110, paid: 500, change: 390 }
  },

  // ── WORLD 8: WORD PROBLEM MARKET (Questions 81 - 90: Shopping Word Problems) ─
  {
    id: 81, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "Oliver has $5.00. He buys a notebook for $2.50 and a pen for $1.00. How much money does he have left?",
    options: ['$1.50', '$2.00', '$1.00', '$2.50'],
    correctAnswer: '$1.50',
    explanation: "Total spent = $2.50 + $1.00 = $3.50. Money left = $5.00 − $3.50 = $1.50.",
    hint1: "Find total spent first: $2.50 + $1.00 = $3.50.",
    hint2: "Subtract from $5.00: $5.00 − $3.50 = $1.50.",
    visualData: { starting: 500, spent: 350, left: 150 }
  },
  {
    id: 82, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "Emma wants to buy a game costing $4.80. She has saved $3.20. How much more money does she need?",
    options: ['$1.60', '$1.40', '$1.80', '$2.00'],
    correctAnswer: '$1.60',
    explanation: "$4.80 − $3.20 = $1.60 needed.",
    hint1: "Subtract what she has from the cost.",
    hint2: "$4.80 − $3.20 = $1.60.",
    visualData: { target: 480, have: 320, need: 160 }
  },
  {
    id: 83, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "A storybook costs $6.00. A comic book costs $2.50. How much more does the storybook cost?",
    options: ['$3.50', '$4.00', '$3.00', '$4.50'],
    correctAnswer: '$3.50',
    explanation: "$6.00 − $2.50 = $3.50 difference.",
    hint1: "Find the difference between $6.00 and $2.50.",
    hint2: "$6.00 − $2.50 = $3.50.",
    visualData: { itemA: 600, itemB: 250, diff: 350 }
  },
  {
    id: 84, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "Noah has $2.00. An ice cream costs $2.40. Does he have enough money?",
    options: ['No, he needs 40¢ more', 'Yes, he has exact amount', 'Yes, with 40¢ change', 'No, he needs $1 more'],
    correctAnswer: 'No, he needs 40¢ more',
    explanation: "$2.00 is less than $2.40. He needs $2.40 − $2.00 = 40¢ more.",
    hint1: "$2.00 < $2.40.",
    hint2: "He is short by $2.40 − $2.00 = 40¢.",
    visualData: { have: 200, need: 240, diff: 40 }
  },
  {
    id: 85, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "Sophie saves 50¢ every day. How much money will she have in 6 days?",
    options: ['$3.00', '$2.50', '$3.50', '$2.00'],
    correctAnswer: '$3.00',
    explanation: "6 × 50¢ = 300¢ = $3.00.",
    hint1: "Multiply 6 by 50 cents.",
    hint2: "6 × 50¢ = 300 cents = $3.00.",
    visualData: { days: 6, daily: 50, total: 300 }
  },
  {
    id: 86, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "James buys 3 muffins at 80¢ each. How much does he pay altogether?",
    options: ['$2.40', '$2.00', '$2.60', '$1.80'],
    correctAnswer: '$2.40',
    explanation: "3 × 80¢ = 240¢ = $2.40.",
    hint1: "3 × 80 = 240 cents.",
    hint2: "240 cents = $2.40.",
    visualData: { qty: 3, unitPrice: 80, total: 240 }
  },
  {
    id: 87, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "Ava has $10.00. She spends $4.20 on lunch and $1.80 on juice. How much does she have left?",
    options: ['$4.00', '$4.50', '$3.80', '$5.00'],
    correctAnswer: '$4.00',
    explanation: "Total spent = $4.20 + $1.80 = $6.00. Left = $10.00 − $6.00 = $4.00.",
    hint1: "Spent: $4.20 + $1.80 = $6.00.",
    hint2: "$10.00 − $6.00 = $4.00.",
    visualData: { starting: 1000, spent: 600, left: 400 }
  },
  {
    id: 88, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "Ethan and Lucas put their pocket money together. Ethan has $2.70 and Lucas has $3.30. Total?",
    options: ['$6.00', '$5.90', '$6.10', '$5.50'],
    correctAnswer: '$6.00',
    explanation: "$2.70 + $3.30 = $6.00.",
    hint1: "$2 + $3 = $5.",
    hint2: "70¢ + 30¢ = $1.00. $5 + $1 = $6.00.",
    visualData: { personA: 270, personB: 330, total: 600 }
  },
  {
    id: 89, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "A box of crayons costs $3.60. Oliver pays with a $5.00 note. What change should he receive?",
    options: ['$1.40', '$1.60', '$2.40', '$1.20'],
    correctAnswer: '$1.40',
    explanation: "$5.00 − $3.60 = $1.40.",
    hint1: "500¢ − 360¢ = 140¢.",
    hint2: "140¢ = $1.40.",
    visualData: { price: 360, paid: 500, change: 140 }
  },
  {
    id: 90, districtId: 8, category: 'WORD PROBLEM', visual: 'word_problem',
    questionText: "Grace bought 4 sticker packs for $1.00 each and gave the cashier a $10.00 note. How much change?",
    options: ['$6.00', '$5.00', '$7.00', '$4.00'],
    correctAnswer: '$6.00',
    explanation: "4 × $1.00 = $4.00. $10.00 − $4.00 = $6.00 change.",
    hint1: "Total cost = 4 × $1 = $4.",
    hint2: "$10 − $4 = $6.00.",
    visualData: { price: 400, paid: 1000, change: 600 }
  },

  // ── WORLD 9: MONEY MASTER (Questions 91 - 100: Grand Challenge Mixed Review) ─
  {
    id: 91, districtId: 9, category: 'GRAND CHALLENGE', visual: 'mixed',
    questionText: "Convert 845 cents into dollars and cents.",
    options: ['$8.45', '$84.50', '$0.85', '$8.05'],
    correctAnswer: '$8.45',
    explanation: "845 cents = $8.45.",
    hint1: "800 cents = $8.00.",
    hint2: "800¢ + 45¢ = $8.45.",
    visualData: { cents: 845, dollars: 8.45 }
  },
  {
    id: 92, districtId: 9, category: 'GRAND CHALLENGE', visual: 'coins',
    questionText: "Which is greater: ten 10¢ coins or two 50¢ coins?",
    options: ['They are exactly equal ($1.00)', 'Ten 10¢ coins is more', 'Two 50¢ coins is more', 'Cannot tell'],
    correctAnswer: 'They are exactly equal ($1.00)',
    explanation: "10 × 10¢ = 100¢ = $1.00. 2 × 50¢ = 100¢ = $1.00. They are equal!",
    hint1: "10 × 10¢ = 100¢.",
    hint2: "2 × 50¢ = 100¢. Both are $1.00.",
    visualData: { amountA: 100, amountB: 100 }
  },
  {
    id: 93, districtId: 9, category: 'GRAND CHALLENGE', visual: 'receipt',
    questionText: "Oliver buys a book for $4.35 and a bookmark for 85¢. How much in total?",
    options: ['$5.20', '$5.15', '$5.25', '$5.10'],
    correctAnswer: '$5.20',
    explanation: "$4.35 + 85¢ = 435¢ + 85¢ = 520¢ = $5.20.",
    hint1: "435 + 85 = 520 cents.",
    hint2: "520 cents = $5.20.",
    visualData: { itemA: 'Book', priceA: 435, itemB: 'Bookmark', priceB: 85, total: 520 }
  },
  {
    id: 94, districtId: 9, category: 'GRAND CHALLENGE', visual: 'change',
    questionText: "Emma pays with a $10.00 note for a $6.45 purchase. What is her change?",
    options: ['$3.55', '$3.65', '$4.55', '$3.45'],
    correctAnswer: '$3.55',
    explanation: "$10.00 − $6.45 = $3.55.",
    hint1: "1000 − 645 = 355.",
    hint2: "Change is $3.55.",
    visualData: { price: 645, paid: 1000, change: 355 }
  },
  {
    id: 95, districtId: 9, category: 'GRAND CHALLENGE', visual: 'coins',
    questionText: "What is the fewest coins needed to make 85¢?",
    options: ['3 coins (50¢ + 20¢ + 15¢ is not possible: 50¢ + 20¢ + 10¢ + 5¢ is 4 coins)', '4 coins (50¢ + 20¢ + 10¢ + 5¢)', '5 coins', '6 coins'],
    correctAnswer: '4 coins (50¢ + 20¢ + 10¢ + 5¢)',
    explanation: "One 50¢, one 20¢, one 10¢, and one 5¢ = 4 coins.",
    hint1: "Use largest denomination first: 50¢, then 20¢ (70¢), then 10¢ (80¢), then 5¢ (85¢).",
    hint2: "Total is 4 coins.",
    visualData: { fifties: 1, twenties: 1, tens: 1, fives: 1, total: 85 }
  },
  {
    id: 96, districtId: 9, category: 'GRAND CHALLENGE', visual: 'mixed',
    questionText: "Jack has one $5 note, two $2 coins, and three 20¢ coins. How much in total?",
    options: ['$9.60', '$9.40', '$8.60', '$9.50'],
    correctAnswer: '$9.60',
    explanation: "$5.00 + $4.00 + 60¢ = $9.60.",
    hint1: "Dollars: $5 + $4 = $9.",
    hint2: "Cents: 3 × 20¢ = 60¢. Total is $9.60.",
    visualData: { fiveNotes: 1, twos: 2, twenties: 3, total: 960 }
  },
  {
    id: 97, districtId: 9, category: 'GRAND CHALLENGE', visual: 'comparison',
    questionText: "Which is the smallest amount?",
    options: ['85¢', '$1.05', '90¢', '$0.88'],
    correctAnswer: '85¢',
    explanation: "In cents: 85¢ < 88¢ < 90¢ < 105¢.",
    hint1: "Compare all in cents: 85, 105, 90, 88.",
    hint2: "85¢ is the smallest.",
    visualData: { sorted: ['85¢', '$0.88', '90¢', '$1.05'] }
  },
  {
    id: 98, districtId: 9, category: 'GRAND CHALLENGE', visual: 'word_problem',
    questionText: "A toy robot costs $8.50. Sophie saves $1.50 every week. In how many weeks can she buy it (with money left over)?",
    options: ['6 weeks ($9.00)', '5 weeks ($7.50)', '4 weeks ($6.00)', '7 weeks'],
    correctAnswer: '6 weeks ($9.00)',
    explanation: "5 weeks = $7.50 (not enough). 6 weeks = $9.00 (enough to buy robot for $8.50).",
    hint1: "Multiply $1.50 by weeks: 5 × 1.5 = $7.50 (too little).",
    hint2: "6 × $1.50 = $9.00 (enough!).",
    visualData: { weekly: 150, target: 850, weeks: 6 }
  },
  {
    id: 99, districtId: 9, category: 'GRAND CHALLENGE', visual: 'receipt',
    questionText: "Ryan bought 3 apples at 50¢ each and 2 juices at $1.20 each. How much did he spend?",
    options: ['$3.90', '$3.50', '$4.00', '$3.70'],
    correctAnswer: '$3.90',
    explanation: "(3 × 50¢) + (2 × $1.20) = $1.50 + $2.40 = $3.90.",
    hint1: "Apples: 3 × 50¢ = $1.50.",
    hint2: "Juices: 2 × $1.20 = $2.40. $1.50 + $2.40 = $3.90.",
    visualData: { itemA: 'Apples', priceA: 150, itemB: 'Juices', priceB: 240, total: 390 }
  },
  {
    id: 100, districtId: 9, category: 'GRAND CHALLENGE', visual: 'change',
    questionText: "Oliver has $10.00. He buys lunch for $4.65 and dessert for $2.35. How much change does he keep?",
    options: ['$3.00', '$2.50', '$3.50', '$2.00'],
    correctAnswer: '$3.00',
    explanation: "Total spent = $4.65 + $2.35 = $7.00. Change = $10.00 − $7.00 = $3.00.",
    hint1: "$4.65 + $2.35 = $7.00 spent.",
    hint2: "$10.00 − $7.00 = $3.00 remaining.",
    visualData: { starting: 1000, spent: 700, left: 300 }
  }
];

export default RAW_QUESTIONS;
