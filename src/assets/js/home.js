let notes = [
  "C_b", "C#_b", "D_b", "D#_b", "E_b", "F_b", "F#_b", "G_b", "G#_b", "A_b", "A#_b", "B_b", // Большая октава
  "C_m", "C#_m", "D_m", "D#_m", "E_m", "F_m", "F#_m", "G_m", "G#_m", "A_m", "A#_m", "B_m", // Малая октава
  "C_1", "C#_1", "D_1", "D#_1", "E_1", "F_1", "F#_1", "G_1", "G#_1", "A_1", "A#_1", "B_1", // 1-я октава
  "C_2", "C#_2", "D_2", "D#_2", "E_2", "F_2", "F#_2", "G_2", "G#_2", "A_2", "A#_2", "B_2", // 2-я октава
]

let Voice_note = {
  "C": "до",
  "C#": "до диез",
  "D": "ре",
  "D#": "ре диез",
  "E": "ми",
  "F": "фа",
  "F#": "фа диез",
  "G": "соль",
  "G#": "соль диез",
  "A": "ля",
  "A#": "ля диез",
  "B": "си",
}

let Voice_octave = {
  "m": "малой октавы",
  "b": "большой октавы",
  "1": "первой октавы",
  "2": "второй октавы",
}

let Voice_interval = {
  1: "Малая секунда",
  2: "Большая секунда",
  3: "Малая терция",
  4: "Большая терция",
  5: "Кварта",
  6: "Тритон",
  7: "Квинта",
  8: "Малая секста",
  9: "Большая секста",
  10: "Малая септима",
  11: "Большая септима",
  12: "Октава",
}

let setnResult = (v) => {
  nResult = v
  $('.nResult').text(v)
}
let getnResult = () => {
  return nResult
}

let setnCurrentQuest = (v) => {
  nCurrentQuest = v
  $('.nCurrentQuest').html(v)
}
let getnCurrentQuest = () => {
  return nCurrentQuest
}

let setnAllQuests = (v) => {
  nAllQuests = v
  $('#nQuestions').val(v)
  $('.nAllQuests').text(v)
}
let getnAllQuests = () => {
  return nAllQuests
}

const synth = window.speechSynthesis
const voices = synth.getVoices();

function speak(text) {
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.voice = voices[0];
  utterThis.volume = 0.6;
  synth.speak(utterThis);
}

function speak_notes(nnote1, nnote2) {
  let note, octave
  note = nnote1.split("_")[0]
  octave = nnote1.split("_")[1]
  let note1 = `${Voice_note[note]} - ${Voice_octave[octave]}`

  note = nnote2.split("_")[0]
  octave = nnote2.split("_")[1]
  let note2 = `${Voice_note[note]} - ${Voice_octave[octave]}`
  speak(`${note1} - ${note2}`)
}

function speak_stats() {
  let text = `Правильных ${getnResult()}. Текущий ${getnCurrentQuest()}. Всего ${getnAllQuests()}`
  speak(text)
}

const GameStates = {
  NOT_ANSWER: 0,
  ALREADY_ANSWER: 1,
  END_GAME: 2
}

const Intervals = {
  "1": 1, // SECUN_M
  "2": 2, // SECUN_B
  "3": 3, // TER_M
  "4": 4, // TER_B
  "5": 5, // KVAR
  "6": 6, // TRITON
  "7": 7, // KVIN
  "8": 8, // SECST_M
  "9": 9, // SECST_B
  "й": 10, // SEP_M
  "ц": 11, // SEP_B
  "у": 12, // OCTAVE
}

const Lvls = {
  "lvl_1": [1, 2],
  "lvl_2": [3, 4],
  "lvl_3": [1, 2, 3, 4],
  "lvl_4": [5, 6, 7],
  "lvl_5": [1, 2, 3, 4, 5, 6, 7],
  "lvl_6": [8, 9],
  "lvl_7": [10, 11, 12],
  "lvl_8": [8, 9, 10, 11, 12],
  "lvl_9": [5, 6, 7, 8, 9, 10, 11, 12],
  "lvl_10": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
}

let
  arrOrder,
  nOrder,

  note1,
  note2,

  nInterval,
  arrInterval,

  pl1,
  pl2,
  gameState, // type GameStates

  nCurrentQuest,
  nResult,
  nAllQuests,
  lvl


let game = () => {
  initPage()

  $(".start").on("click", function () {
    initPage()
    nextQuest()
  })

  $(".intervals").on("click", function () {
    let choosed_lvl = $(".intervals input").filter((i, checkbox) => checkbox.checked)
    localStorage.setItem("lvl", choosed_lvl.val())
    initPage()
  })

  $("#nQuestions").on("change", function () {
    localStorage.setItem("nQuestions", jQuery(this).val())
    initPage()
  })

  $(".order").on("change", function () {
    let order = []
    if ($('#asc')[0].checked === true) order.push("asc")
    if ($('#desc')[0].checked === true) order.push("desc")
    if ($('#garm')[0].checked === true) order.push("garm")
    localStorage.setItem("order", JSON.stringify(order))
    initPage()
  })

  jQuery('.play').on("click", function (event) {
    play_interval()
  });
}

// Инициализация начала теста
let initPage = () => {
  setnCurrentQuest(0)
  setnResult(0)
  setnAllQuests(Number(localStorage.getItem("nQuestions")) || 10)

  arrOrder = JSON.parse(localStorage.getItem("order")) || ['asc']
  arrOrder.forEach((elem) => {
    $('#' + elem)[0].checked = true
  })

  lvl = localStorage.getItem('lvl') || 'lvl_1'
  $(`.intervals #${lvl}`)[0].checked = true

  gameState = GameStates.NOT_ANSWER
}

// Переход на след вопрос
let nextQuest = () => {
  if (getnCurrentQuest() === getnAllQuests()) {
    gameState = GameStates.END_GAME
    speak_stats()
    return
  }

  setnCurrentQuest(getnCurrentQuest() + 1)
  generate()
  play_interval()
  gameState = GameStates.NOT_ANSWER
}

let rand = (max) => Math.floor(Math.random() * (max + 1))

// Генерация вопроса
let generate = () => {
  pl1 = jQuery('#pl_1').get(0);
  pl2 = jQuery('#pl_2').get(0);
  // Генерация порядка воспроизведения
  arrOrder = $(".order input")
    .filter((i, checkbox) => checkbox.checked)
    .map((i, checkbox) => checkbox.name)
  nOrder = rand(arrOrder.length - 1)

  // Генерация интервала
  let arr_available_intervals = Lvls[lvl]
  nInterval = arr_available_intervals[rand(arr_available_intervals.length - 1)]
  // Генерация нот (вычисляем индекс массива notes)
  note1 = rand(notes.length - nInterval - 1)
  note2 = note1 + nInterval
  // Вычисляем порядок запуска нот
  switch (arrOrder[nOrder]) {
    case "asc": arrInterval = [note1, note2].sort((a, b) => a - b).map((note) => notes[note]); break;
    case "desc": arrInterval = [note1, note2].sort((a, b) => b - a).map((note) => notes[note]); break;
    case "garm": arrInterval = [note1, note2].map((note) => notes[note]); break;
  }
  console.log(arrInterval)
  console.log("интервал: " + nInterval)
  1 == 1
  pl1.src = "audio/notes/" + arrInterval[0].replace("#", "%23") + ".mp3";
  pl2.src = "audio/notes/" + arrInterval[1].replace("#", "%23") + ".mp3";
}

$(document).keyup(function (e) {
  switch (gameState) {
    case GameStates.NOT_ANSWER: not_answer_keyup(e); break;
    case GameStates.ALREADY_ANSWER: already_answer_keyup(e); break;
    // case GameStates.END_GAME: end_game_keyup(e); break;
  }

  switch(e.key) { // Общие опции
    case 'п': // Повторить
      play_interval()
      break;
    case 'с': // Статистика
      speak_stats()
      break;
    case ' ': // Начать игру заново
      initPage()
      nextQuest()
      break;
  }

  // function end_game_keyup(e) {
  //   switch(e.key) {
  //     case ' ': // Начать игру заново
  //       initPage()
  //       nextQuest()
  //   }
  // }

  function not_answer_keyup(e) {
    let pl_tool = $("#pl_tools").get(0)

    switch (e.key) {
      case Object.keys(Intervals).find(key => Intervals[key] === nInterval): // Правильный интервал
        setnResult(getnResult() + 1) 
        pl_tool.src = "audio/tools/rightly.mp3"
        pl_tool.volume = 0.1
        pl_tool.play()
        gameState = GameStates.ALREADY_ANSWER
        break;
      case Object.keys(Intervals).find(key => key === e.key): // Неправильный интервал
        pl_tool.src = "audio/tools/wrong.mp3"
        pl_tool.volume = 0.2
        pl_tool.play()
        gameState = GameStates.ALREADY_ANSWER
        break;
    }
  }

  function already_answer_keyup(e) {
    let speech, text
    switch (e.key) {
      case 'д': // Дальше
        nextQuest()
        break;
      case 'н': // Назвать ноты
        speak_notes(notes[note1], notes[note2])
        break;
      case 'и': // Назвать интервал
        speak(Voice_interval[nInterval])
        break;
    }
  }
});

function play_interval() {
  //Запускаем ноты
  if (arrOrder[nOrder] === "garm") {
    pl1.play()
    pl2.play()
  } else {
    pl1.volume = 1
    pl1.play()
    let timer = setInterval(() => {
      if (pl1.currentTime > 1 || pl1.ended) {
        pl1.pause()
        pl1.currentTime = 0
        pl2.play()
        clearTimeout(timer)
      }
    }, 100)
  }
}



game()