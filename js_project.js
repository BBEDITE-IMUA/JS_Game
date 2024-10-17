const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  let player = {
    name: 'Школьник',
    health: 100,
    inventory: [],
    location: 'start',
    hasBear: false,
    hasVodka: false,
    hasSeeds: false,
    hasSamogon: false,
    foundPistol: false,
    baseDamage: 20,
    damageBoost: 0,
    victories: 0
  };

  // Функция для изменения здоровья игрока
  function updateHealth(amount) {
    player.health += amount;
    if (player.health > 100) player.health = 100;
    if (player.health <= 0) {
      console.log(`${player.name} потерял все здоровье. Игра окончена.`);
      process.exit();
    }
    console.log(`Здоровье школьника: ${player.health}`);
  }
  
  // Функция для изменения здоровья зверя
  function updateBeastHealth(beast, amount) {
    beast.health += amount;
    if (beast.health <= 0) {
      console.log(`Вы победили бомжа!`);
      return true;
    }
    console.log(`Здоровье бомжа: ${beast.health}`);
    return false;
  }
  
  // Функция для работы с инвентарем
  function openInventory() {
    if (player.inventory.length === 0) {
      console.log('Ваши карманы пусты.');
    } else {
      console.log('Карманы: ', player.inventory);
    }
  }
  
  // Функция для генерации урона атаки
  function generateBeastDamage() { 
    return Math.floor(Math.random() * (30 - 10 + 1)) + 10; 
  }

  // Функция для выбора предмета из инвентаря
  async function chooseItem() {
    if (player.inventory.length === 0) {
      console.log('Ваши карманы пусты.');
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
      case 'Банка Пива':
        console.log('Вы использовали банку пива. Ваше здоровье восстанавливается на 40 очков.');
        updateHealth(40);
        player.inventory = player.inventory.filter(i => i !== 'Банка Пива');
        player.hasBear = true;
        break;
      case 'Бутылка Водки':
        console.log('Вы выпили бутылку водки. Ваш урон увеличен на 10.');
        player.damageBoost += 10;
        player.inventory = player.inventory.filter(i => i !== 'Бутылка Водки');
        player.hasVodka = true;
        break;
      case 'Семечки':
        console.log('Вы пощелкали семечки. Ваше здоровье восстанавливается на 10 очков.');
        updateHealth(10);
        player.inventory = player.inventory.filter(i => i !== 'Семечки');
        player.hasSeeds = true;
        break;
      case 'Самогон деда':
        console.log('Вы использовали самогон деда. Урон и здоровье увеличены.');
        updateHealth(10);
        player.damageBoost += 5;
        player.inventory = player.inventory.filter(i => i !== 'Самогон деда');
        player.hasSamogon = true;
        break;
      default:
        console.log('Этот предмет нельзя использовать.');
    }
  }
  
  const locations = {
    start: {
      name: 'Центральный район',
      description: 'Центральный район, окруженный спальными районами.',
      choices: [
        { text: 'Пойти в спальный район', nextLocation: 'sleeparea' },
        { text: 'Заглянуть на рынок', nextLocation: 'market' }
      ]
    },
    sleeparea: {
      name: 'Спальные районы',
      description: 'Спальные районы, полные алкашей и наркоманов.',
      choices: [
        { text: 'Искать семечки', event: 'findSeeds' },
        { text: 'Углубиться в спальные районы', nextLocation: 'deepSleeparea' },
        { text: 'Зайти в ночной клуб', event: 'findVodka' },
        { text: 'Вернуться в центральный район', nextLocation: 'start' }
      ]
    },
    deepSleeparea: {
      name: 'Глубь спальных районов',
      description: 'Здесь бухают алкаши и колются наркоманы.',
      choices: [
        { text: 'Сразиться с бухим бомжом', event: 'fightBomj' },
        { text: 'Войти в тёмный подъезд', event: 'findPistol' },
        { text: 'Вернуться в центральный район', nextLocation: 'start' }
      ]
    },
    market: {
      name: 'Рынок',
      description: 'Место, где можно найти еду и алкоголь.',
      choices: [
        { text: 'Купить банку пива', event: 'buyBear' },
        { text: 'Поговорить с дедом', event: 'talkToDed' },
        { text: 'Вернуться в центральный район', nextLocation: 'start' }
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
      case 'findSeeds':
        if (!player.hasSeeds) {
          console.log('Вы нашли семечки. Они добавлены в ваш карман.');
          player.inventory.push('Семечки');
          player.hasSeeds = true;
        } else {
          console.log('Вы уже забрали семечки.');
        }
        break;
      case 'buyBear':
        const correctAnswer = await solveMathProblem();
        if (correctAnswer) {
          if (!player.hasBear) {
            console.log('Вы купили банку пива. Она добавлена в ваш карман.');
            player.inventory.push('Банка Пива');
            player.hasBear = true;
          } else {
            console.log('Вы уже купили банку пива.');
          }
        }
        break;
      case 'findVodka':
        const allCorrect = await solveMultipleMathProblems(3);
        if (allCorrect) {
          if (!player.hasVodka) {
            console.log('Вы нашли бутылку водки. Она добавлена в ваш карман.');
            player.inventory.push('Бутылка Водки');
            player.hasVodka = true;
          } else {
            console.log('Вы уже нашли бутылку водки.');
          }
        }
        break;
      case 'talkToDed':
        if (!player.hasSamogon) {
          console.log('Дед дал вам самогон. Он увеличивает ваш урон и здоровье.');
          player.inventory.push('Самогон деда');
          player.hasSamogon = true;
        } else {
          console.log('Дед уже дал вам самогон.');
        }
        break;

      case 'fightBomj': 
        const beast = { health: 80 }; 
        console.log('Вы встретили бухого бомжа! Начинается бой...'); 
        while (beast.health > 0 && player.health > 0) { 
          const damage = player.baseDamage + player.damageBoost; 
          console.log(`Вы наносите бомжу ${damage} урона.`); 
          if (updateBeastHealth(beast, -damage)) break; 
       
          const beastDamage = generateBeastDamage();
          console.log(`Бомж атакует вас и наносит ${beastDamage} урона!`); 
          updateHealth(-beastDamage); 
        } 
        if (player.health > 0) { 
          console.log('Вы одержали победу над бомжом!'); 
          player.victories += 1;
          console.log(`Ваш счётчик побед: ${player.victories}`); 
          if (player.victories >= 3) { 
            console.log('Вы победили бомжа 3 раза! Игра завершена.'); 
            process.exit();
          } 
        } else { 
          console.log('Бомж победил вас...'); 
        } 
        break;
        
      case 'findArtifact':
        if (!player.foundPistol) {
          console.log('Вы нашли пистолет! Это приводит к неожиданной концовке.');
          player.foundPistol = true;
          console.log('Игра завершена. Вы выиграли, найдя пистолет!');
          process.exit();
        } else {
          console.log('Пистолет уже был найден.');
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
        readline.question('Выберите действие (или q для осмотра карманов, u для использования предмета): ', resolve);
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
  
  console.log('Добро пожаловать в игру "Россия"!');
  console.log('Вы начинаете своё приключение.');
  changeLocation('start').then(() => gameLoop());
