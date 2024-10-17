const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

let player = {
  name: 'Исследователь',
  health: 100,
  inventory: [],
  location: 'start',
  hasPotion: false,
  hasDamagePotion: false,
  hasBerries: false,
  hasTraderPotion: false,
  foundArtifact: false,
  baseDamage: 20,
  damageBoost: 0
};

// Функция для изменения здоровья игрока
function updateHealth(amount) {
  player.health += amount;
  if (player.health > 100) player.health = 100;
  if (player.health <= 0) {
    console.log(`${player.name} потерял все здоровье. Игра окончена.`);
    process.exit();
  }
  console.log(`Здоровье игрока: ${player.health}`);
}

// Функция для изменения здоровья зверя
function updateBeastHealth(beast, amount) {
  beast.health += amount;
  if (beast.health <= 0) {
    console.log(`Вы победили зверя!`);
    return true;
  }
  console.log(`Здоровье зверя: ${beast.health}`);
  return false;
}

// Функция для работы с инвентарем
function openInventory() {
  if (player.inventory.length === 0) {
    console.log('Ваш инвентарь пуст.');
  } else {
    console.log('Инвентарь: ', player.inventory);
  }
}

// Функция для выбора предмета из инвентаря
async function chooseItem() {
  if (player.inventory.length === 0) {
    console.log('Ваш инвентарь пуст.');
    return;
  }

  console.log('Выберите предмет для использования:');
  player.inventory.forEach((item, index) => {
    console.log(`${index + 1}: ${item}`);
  });

  const answer = await new Promise(resolve => {
    readline.question('Введите номер предмета: ', resolve);
  });

  const itemIndex = parseInt(answer) - 1;
  if (itemIndex >= 0 && itemIndex < player.inventory.length) {
    useItem(player.inventory[itemIndex]);
  } else {
    console.log('Некорректный выбор.');
  }
}

// Функция для использования предметов
function useItem(item) {
  switch (item) {
    case 'Зелье Регенерации':
      console.log('Вы использовали зелье. Ваше здоровье восстанавливается на 40 очков.');
      updateHealth(40);
      player.inventory = player.inventory.filter(i => i !== 'Зелье');
      player.hasPotion = true;
      break;
    case 'Зелье Урона':
      console.log('Вы выпили зелье урона. Ваш урон увеличен на 10.');
      player.damageBoost = 10;
      player.inventory = player.inventory.filter(i => i !== 'Зелье урона');
      player.hasDamagePotion = true;
      break;
    case 'Ягоды':
      console.log('Вы съели ягоды. Ваше здоровье восстанавливается на 10 очков.');
      updateHealth(10);
      player.inventory = player.inventory.filter(i => i !== 'Ягоды');
      player.hasBerries = true;
      break;
    case 'Зелье торговца':
      console.log('Вы использовали зелье торговца. Урон и здоровье увеличены.');
      updateHealth(10);
      player.damageBoost += 5;
      player.inventory = player.inventory.filter(i => i !== 'Зелье торговца');
      player.hasTraderPotion = true;
      break;
    default:
      console.log('Этот предмет нельзя использовать.');
  }
}

// Локации и возможные действия
const locations = {
  start: {
    name: 'Начальная деревня',
    description: 'Тихая деревня, окруженная густым лесом.',
    choices: [
      { text: 'Пойти в лес', nextLocation: 'forest' },
      { text: 'Заглянуть на рынок', nextLocation: 'market' }
    ]
  },
  forest: {
    name: 'Темный лес',
    description: 'Опасный лес, полный загадок и сокровищ.',
    choices: [
      { text: 'Искать ягоды', event: 'findBerries' },
      { text: 'Углубиться в лес', nextLocation: 'deepForest' },
      { text: 'STOP!!!', event: 'findDamagePotion' },
      { text: 'Вернуться в деревню', nextLocation: 'start' }
    ]
  },
  deepForest: {
    name: 'Глубокий лес',
    description: 'Здесь таятся древние тайны и опасности.',
    choices: [
      { text: 'Сразиться с диким зверем', event: 'fightBeast' },
      { text: 'Тёмная пещера', event: 'findArtifact' },
      { text: 'Вернуться в деревню', nextLocation: 'start' }
    ]
  },
  market: {
    name: 'Рынок',
    description: 'Место, где можно найти редкие товары и услышать слухи.',
    choices: [
      { text: 'Купить зелье', event: 'buyPotion' },
      { text: 'Поговорить с торговцем', event: 'talkToMerchant' },
      { text: 'Вернуться в деревню', nextLocation: 'start' }
    ]
  }
};

// Функция для смены локации
async function changeLocation(location) {
  console.log(`Перемещение в ${locations[location].name}...`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  player.location = location;
  console.log(locations[location].description);
  showChoices(location);
}

// Вывод доступных действий
function showChoices(location) {
  const choices = locations[location].choices;
  choices.forEach((choice, index) => {
    console.log(`${index + 1}: ${choice.text}`);
  });
}

// Случайный математический пример
function generateMathProblem() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { question: `${num1} + ${num2}`, answer: num1 + num2 };
}

// Проверка математического примера
async function solveMathProblem() {
  const { question, answer } = generateMathProblem();
  const userAnswer = await new Promise(resolve => {
    readline.question(`Решите пример: ${question} = `, resolve);
  });
  if (parseInt(userAnswer) === answer) {
    return true;
  } else {
    console.log('Неправильный ответ.');
    return false;
  }
}

// Проверка нескольких примеров
async function solveMultipleMathProblems(count) {
  for (let i = 0; i < count; i++) {
    const correct = await solveMathProblem();
    if (!correct) {
      console.log('Неправильный ответ. Покупка не состоялась.');
      return false;
    }
  }
  return true;
}

async function handleEvent(event) {
  switch (event) {
    case 'findBerries':
      if (!player.hasBerries) {
        console.log('Вы нашли ягоды. Они добавлены в ваш инвентарь.');
        player.inventory.push('Ягоды');
        player.hasBerries = true;
      } else {
        console.log('Вы уже собрали ягоды.');
      }
      break;
    case 'buyPotion':
      const correctAnswer = await solveMathProblem();
      if (correctAnswer) {
        if (!player.hasPotion) {
          console.log('Вы купили зелье. Оно добавлено в ваш инвентарь.');
          player.inventory.push('Зелье');
          player.hasPotion = true;
        } else {
          console.log('Вы уже купили зелье.');
        }
      }
      break;
    case 'findDamagePotion':
      const allCorrect = await solveMultipleMathProblems(3);
      if (allCorrect) {
        if (!player.hasDamagePotion) {
          console.log('Вы нашли зелье урона. Оно добавлено в ваш инвентарь.');
          player.inventory.push('Зелье урона');
          player.hasDamagePotion = true;
        } else {
          console.log('Вы уже нашли зелье урона.');
        }
      }
      break;
    case 'talkToMerchant':
      if (!player.hasTraderPotion) {
        console.log('Торговец дал вам зелье. Оно увеличивает ваш урон и здоровье.');
        player.inventory.push('Зелье торговца');
        player.hasTraderPotion = true;
      } else {
        console.log('Торговец уже дал вам зелье.');
      }
      break;
    case 'fightBeast':
      const beast = { health: 80 };
      console.log('Вы встретили дикого зверя! Начинается бой...');
      while (beast.health > 0 && player.health > 0) {
        const damage = player.baseDamage + player.damageBoost;
        console.log(`Вы наносите зверю ${damage} урона.`);
        if (updateBeastHealth(beast, -damage)) break;

        console.log('Зверь атакует вас!');
        updateHealth(-20);
      }
      if (player.health > 0) {
        console.log('Вы одержали победу над зверем!');
      } else {
        console.log('Зверь победил вас...');
      }
      break;
    case 'findArtifact':
      if (!player.foundArtifact) {
        console.log('Вы нашли редкий артефакт! Это приводит к неожиданной концовке.');
        player.foundArtifact = true;
        console.log('Игра завершена. Вы выиграли, найдя артефакт!');
        process.exit();
      } else {
        console.log('Артефакт уже был найден.');
      }
      break;
  
    default:
      console.log('Неизвестное событие.');
    }
  }

// Основной игровой цикл
async function gameLoop() {
  while (true) {
    const location = locations[player.location];
    const choices = location.choices;

    const answer = await new Promise(resolve => {
      readline.question('Выберите действие (или q для инвентаря, u для использования предмета): ', resolve);
    });

    if (answer.toLowerCase() === 'q') {
      openInventory();
      continue;
    }

    if (answer.toLowerCase() === 'u') {
      await chooseItem();
      continue;
    }

    const choice = choices[parseInt(answer) - 1];
    if (!choice) {
      console.log('Некорректный выбор. Попробуйте снова.');
      continue;
    }

    if (choice.nextLocation) {
      await changeLocation(choice.nextLocation);
    } else if (choice.event) {
      await handleEvent(choice.event);
    }
  }
}

console.log('Добро пожаловать в игру "Мир путешествий"!');
console.log('Вы начинаете своё приключение.');
changeLocation('start').then(() => gameLoop());
