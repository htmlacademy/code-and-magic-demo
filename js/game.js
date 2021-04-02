export default function startGame (
  fireballSize,
  getFireballSpeed,
  wizardWidth,
  wizardSpeed,
  getWizardHeight,
  getWizardX,
  getWizardY,
) {
  const GameConstants = {
    Fireball: {
      size: fireballSize || 24,
      speed: getFireballSpeed || function (movingLeft) {
        return movingLeft ? 2 : 5;
      },
    },
    Wizard: {
      speed: wizardSpeed || 2,
      width: wizardWidth || 61,
      getHeight: getWizardHeight || function (width) {
        return 1.377 * width;
      },
      getX: getWizardX || function (width) {
        return width / 3;
      },
      getY: getWizardY || function (height) {
        return height - 100;
      },
    },
  };

  /**
     * @const
     * @type {number}
     */
  const HEIGHT = 300;

  /**
     * @const
     * @type {number}
     */
  const WIDTH = 700;

  /**
     * ID уровней.
     * @enum {number}
     */
  const Level = {
    INTRO: 0,
    MOVE_LEFT: 1,
    MOVE_RIGHT: 2,
    LEVITATE: 3,
    HIT_THE_MARK: 4,
  };

  const NAMES = ['Кекс', 'Катя', 'Игорь'];

  /**
     * Порядок прохождения уровней.
     * @type {Array.<Level>}
     */
  const LevelSequence = [
    Level.INTRO,
  ];

  /**
     * Начальный уровень.
     * @type {Level}
     */
  const INITIAL_LEVEL = LevelSequence[0];

  /**
     * Допустимые виды объектов на карте.
     * @enum {number}
     */
  const ObjectType = {
    ME: 0,
    FIREBALL: 1,
  };

  /**
     * Допустимые состояния объектов.
     * @enum {number}
     */
  const ObjectState = {
    OK: 0,
    DISPOSED: 1,
  };

  /**
     * Коды направлений.
     * @enum {number}
     */
  const Direction = {
    NULL: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 4,
    DOWN: 8,
  };

  /**
     * Карта спрайтов игры.
     * @type {Object.<ObjectType, Object>}
     */
  const SpriteMap = {};
  const REVERSED = '-reversed';

  SpriteMap[ObjectType.ME] = {
    width: 61,
    height: 84,
    url: 'img/wizard.gif',
  };

  // TODO: Find a clever way
  SpriteMap[ObjectType.ME + REVERSED] = {
    width: 61,
    height: 84,
    url: 'img/wizard-reversed.gif',
  };

  SpriteMap[ObjectType.FIREBALL] = {
    width: 24,
    height: 24,
    url: 'img/fireball.gif',
  };

  /**
     * Правила перерисовки объектов в зависимости от состояния игры.
     * @type {Object.<ObjectType, function(Object, Object, number): Object>}
     */
  const ObjectsBehaviour = {};

  /**
     * Обновление движения мага. Движение мага зависит от нажатых в данный момент
     * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
     * На движение мага влияет его пересечение с препятствиями.
     * @param {Object} object
     * @param {Object} state
     * @param {number} timeframe
     */
  ObjectsBehaviour[ObjectType.ME] = function (object, state, timeframe) {
    // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
    // в воздухе на определенной высоте.
    // NB! Сложность заключается в том, что поведение описано в координатах
    // канваса, а не координатах, относительно нижней границы игры.
    if (state.keysPressed.UP && object.y > 0) {
      object.direction = object.direction & ~Direction.DOWN;
      object.direction = object.direction | Direction.UP;
      object.y -= object.speed * timeframe * 2;
    }

    // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
    // опускается на землю.
    if (!state.keysPressed.UP) {
      if (object.y < HEIGHT - object.height) {
        object.direction = object.direction & ~Direction.UP;
        object.direction = object.direction | Direction.DOWN;
        object.y += object.speed * timeframe / 3;
      }
    }

    // Если зажата стрелка влево, маг перемещается влево.
    if (state.keysPressed.LEFT) {
      object.direction = object.direction & ~Direction.RIGHT;
      object.direction = object.direction | Direction.LEFT;
      object.x -= object.speed * timeframe;
    }

    // Если зажата стрелка вправо, маг перемещается вправо.
    if (state.keysPressed.RIGHT) {
      object.direction = object.direction & ~Direction.LEFT;
      object.direction = object.direction | Direction.RIGHT;
      object.x += object.speed * timeframe;
    }

    // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
    if (object.y < 0) {
      object.y = 0;
    }

    if (object.y > HEIGHT - object.height) {
      object.y = HEIGHT - object.height;
    }

    if (object.x < 0) {
      object.x = 0;
    }

    if (object.x > WIDTH - object.width) {
      object.x = WIDTH - object.width;
    }
  };

  /**
     * Обновление движения файрбола. Файрбол выпускается в определенном направлении
     * и после этого неуправляемо движется по прямой в заданном направлении. Если
     * он пролетает весь экран насквозь, он исчезает.
     * @param {Object} object
     * @param {Object} _state
     * @param {number} timeframe
     */
  ObjectsBehaviour[ObjectType.FIREBALL] = function (object, _state, timeframe) {
    if (object.direction & Direction.LEFT) {
      object.x -= object.speed * timeframe;
    }

    if (object.direction & Direction.RIGHT) {
      object.x += object.speed * timeframe;
    }

    if (object.x < 0 || object.x > WIDTH) {
      object.state = ObjectState.DISPOSED;
    }
  };

  /**
     * ID возможных ответов функций, проверяющих успех прохождения уровня.
     * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
     * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
     * нужно прервать.
     * @enum {number}
     */
  const Verdict = {
    CONTINUE: 0,
    WIN: 1,
    FAIL: 2,
    PAUSE: 3,
    INTRO: 4,
  };

  /**
     * Правила завершения уровня. Ключами служат ID уровней, значениями функции
     * принимающие на вход состояние уровня и возвращающие true, если раунд
     * можно завершать или false если нет.
     * @type {Object.<Level, function(Object):boolean>}
     */
  const LevelsRules = {};

  /**
     * Уровень считается пройденным, если был выпущен файлболл и он улетел
     * за экран.
     * @param {Object} state
     * @return {Verdict}
     */
  LevelsRules[Level.INTRO] = function (state) {
    const deletedFireballs = state.garbage.filter((object) => {
      return object.type === ObjectType.FIREBALL;
    });

    const fenceHit = deletedFireballs.filter((fireball) => {
      // Did we hit the fence?
      return fireball.x < 10 && fireball.y > 240;
    })[0];

    return fenceHit ? Verdict.WIN : Verdict.CONTINUE;
  };

  /**
     * Начальные условия для уровней.
     * @enum {Object.<Level, function>}
     */
  const LevelsInitialize = {};

  /**
     * Первый уровень.
     * @param {Object} state
     * @return {Object}
     */
  LevelsInitialize[Level.INTRO] = function (state) {
    state.objects.push(
      // Установка персонажа в начальное положение. Он стоит в крайнем левом
      // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
      // уровне равна 2px за кадр.
      {
        direction: Direction.RIGHT,
        height: GameConstants.Wizard.getHeight(GameConstants.Wizard.width),
        speed: GameConstants.Wizard.speed,
        sprite: SpriteMap[ObjectType.ME],
        state: ObjectState.OK,
        type: ObjectType.ME,
        width: GameConstants.Wizard.width,
        x: GameConstants.Wizard.getX(WIDTH),
        y: GameConstants.Wizard.getY(HEIGHT),
      },
    );

    return state;
  };

  /**
     * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
     * и показывает приветственный экран.
     * @param {Element} container
     * @constructor
     */
  const Game = function (container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._pauseListener = this._pauseListener.bind(this);

    this.setDeactivated(false);
  };

  Game.prototype = {
    /**
       * Текущий уровень игры.
       * @type {Level}
       */
    level: INITIAL_LEVEL,

    /** @param {boolean} deactivated */
    setDeactivated: function (deactivated) {
      if (this._deactivated === deactivated) {
        return;
      }

      this._deactivated = deactivated;

      if (deactivated) {
        this._removeGameListeners();
      } else {
        this._initializeGameListeners();
      }
    },

    /**
       * Состояние игры. Описывает местоположение всех объектов на игровой карте
       * и время проведенное на уровне и в игре.
       * @return {Object}
       */
    getInitialState: function () {
      return {
        // Статус игры. Если CONTINUE, то игра продолжается.
        currentStatus: Verdict.CONTINUE,

        // Объекты, удаленные на последнем кадре.
        garbage: [],

        // Время с момента отрисовки предыдущего кадра.
        lastUpdated: null,

        // Состояние нажатых клавиш.
        keysPressed: {
          ESC: false,
          LEFT: false,
          RIGHT: false,
          SPACE: false,
          UP: false,
        },

        // Время начала прохождения уровня.
        levelStartTime: null,

        // Все объекты на карте.
        objects: [],

        // Время начала прохождения игры.
        startTime: null,
      };
    },

    /**
       * Начальные проверки и запуск текущего уровня.
       * @param {boolean=} restart
       */
    initializeLevelAndStart: function (restart) {
      restart = typeof restart === 'undefined' ? true : restart;

      if (restart || !this.state) {
        // При перезапуске уровня, происходит полная перезапись состояния
        // игры из изначального состояния.
        this.state = this.getInitialState();
        this.state = LevelsInitialize[this.level](this.state);
      } else {
        // При продолжении уровня состояние сохраняется, кроме записи о том,
        // что состояние уровня изменилось с паузы на продолжение игры.
        this.state.currentStatus = Verdict.CONTINUE;
      }

      // Запись времени начала игры и времени начала уровня.
      this.state.levelStartTime = Date.now();
      if (!this.state.startTime) {
        this.state.startTime = this.state.levelStartTime;
      }

      const preRenderGameLevel = () => {
        // Предварительная отрисовка игрового экрана.
        this.render();

        // Установка обработчиков событий.
        this._initializeGameListeners();

        // Запуск игрового цикла.
        this.update();
      };

      this._preloadImagesForLevel(preRenderGameLevel.bind(this));
    },

    /**
       * Временная остановка игры.
       * @param {Verdict=} verdict
       */
    pauseLevel: function (verdict) {
      if (verdict) {
        this.state.currentStatus = verdict;
      }

      this.state.keysPressed.ESC = false;
      this.state.lastUpdated = null;

      this._removeGameListeners();
      window.addEventListener('keydown', this._pauseListener);

      this._drawPauseScreen();
    },

    /**
       * Обработчик событий клавиатуры во время паузы.
       * @param {KeyboardsEvent} evt
       * @private
       * @private
       */
    _pauseListener: function (evt) {
      if (evt.keyCode === 32 && !this._deactivated) {
        evt.preventDefault();
        const needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
            this.state.currentStatus === Verdict.FAIL;
        this.initializeLevelAndStart(needToRestartTheGame);

        window.removeEventListener('keydown', this._pauseListener);
      }
    },

    /**
       * Отрисовка экрана паузы.
       */
    _drawPauseScreen: function () {
      let message;
      switch (this.state.currentStatus) {
        case Verdict.WIN:
          if (window.renderStatistics) {
            const statistics = this._generateStatistics(new Date() - this.state.startTime);
            const keys = this._schuffleArray(Object.keys(statistics));
            window.renderStatistics(this.ctx, keys, keys.map((it) => {
              return statistics[it];
            }));
            return;
          }
          message = 'Вы победили Газебо!\nУра!';
          break;
        case Verdict.FAIL:
          message = 'Вы проиграли!';
          break;
        case Verdict.PAUSE:
          message = 'Игра на паузе!\nНажмите Пробел, чтобы продолжить';
          break;
        case Verdict.INTRO:
          message = 'Добро пожаловать!\nНажмите Пробел для начала игры';
          break;
      }

      this._drawMessage(message);
    },

    _generateStatistics: function (time) {
      const generationIntervalSec = 3000;
      const minTimeInSec = 1000;

      const statistic = {
        'Вы': time,
      };

      for (let i = 0; i < NAMES.length; i++) {
        const diffTime = Math.random() * generationIntervalSec;
        let userTime = time + (diffTime - generationIntervalSec / 2);
        if (userTime < minTimeInSec) {
          userTime = minTimeInSec;
        }
        statistic[NAMES[i]] = userTime;
      }

      return statistic;
    },

    _schuffleArray: function (array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    _drawMessage: function (message) {
      const ctx = this.ctx;

      const drawCloud = function (x, y, width, heigth) {
        const offset = 10;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + offset, y + heigth / 2);
        ctx.lineTo(x, y + heigth);
        ctx.lineTo(x + width / 2, y + heigth - offset);
        ctx.lineTo(x + width, y + heigth);
        ctx.lineTo(x + width - offset, y + heigth / 2);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width / 2, y + offset);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
        ctx.fill();
      };

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      drawCloud(190, 40, 320, 100);

      ctx.fillStyle = 'rgba(256, 256, 256, 1.0)';
      drawCloud(180, 30, 320, 100);

      ctx.fillStyle = '#000';
      ctx.font = '16px PT Mono';
      message.split('\n').forEach((line, i) => {
        ctx.fillText(line, 200, 80 + 20 * i);
      });
    },

    /**
       * Предзагрузка необходимых изображений для уровня.
       * @param {function} callback
       * @private
       */
    _preloadImagesForLevel: function (callback) {
      if (typeof this._imagesArePreloaded === 'undefined') {
        this._imagesArePreloaded = [];
      }

      if (this._imagesArePreloaded[this.level]) {
        callback();
        return;
      }

      const keys = Object.keys(SpriteMap);
      let imagesToGo = keys.length;

      const self = this;

      const loadSprite = function (sprite) {
        const image = new Image(sprite.width, sprite.height);
        image.onload = function () {
          sprite.image = image;
          if (--imagesToGo === 0) {
            self._imagesArePreloaded[self.level] = true;
            callback();
          }
        };
        image.src = sprite.url;
      };

      for (let i = 0; i < keys.length; i++) {
        loadSprite(SpriteMap[keys[i]]);
      }
    },

    /**
       * Обновление статуса объектов на экране. Добавляет объекты, которые должны
       * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
       * должны исчезнуть.
       * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
       */
    updateObjects: function (delta) {
      // Персонаж.
      const me = this.state.objects.filter((object) => {
        return object.type === ObjectType.ME;
      })[0];

      // Добавляет на карту файрбол по нажатию на Shift.
      if (this.state.keysPressed.SHIFT) {
        this.state.objects.push({
          direction: me.direction,
          height: GameConstants.Fireball.size,
          speed: GameConstants.Fireball.speed(me.direction & Direction.LEFT),
          sprite: SpriteMap[ObjectType.FIREBALL],
          type: ObjectType.FIREBALL,
          width: GameConstants.Fireball.size,
          x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - GameConstants.Fireball.size,
          y: me.y + me.height / 2,
        });

        this.state.keysPressed.SHIFT = false;
      }

      this.state.garbage = [];

      // Убирает в garbage не используемые на карте объекты.
      const remainingObjects = this.state.objects.filter(function (object) {
        ObjectsBehaviour[object.type](object, this.state, delta);

        if (object.state === ObjectState.DISPOSED) {
          this.state.garbage.push(object);
          return false;
        }

        return true;
      }, this);

      this.state.objects = remainingObjects;
    },

    /**
       * Проверка статуса текущего уровня.
       */
    checkStatus: function () {
      // Нет нужны запускать проверку, нужно ли останавливать уровень, если
      // заранее известно, что да.
      if (this.state.currentStatus !== Verdict.CONTINUE) {
        return;
      }

      if (!this.commonRules) {
        // Проверки, не зависящие от уровня, но влияющие на его состояние.
        this.commonRules = [

          /**
             * Если персонаж мертв, игра прекращается.
             * @param {Object} state
             * @return {Verdict}
             */
          function (state) {
            const me = state.objects.filter((object) => {
              return object.type === ObjectType.ME;
            })[0];

            return me.state === ObjectState.DISPOSED ?
              Verdict.FAIL :
              Verdict.CONTINUE;
          },

          /**
             * Если нажата клавиша Esc игра ставится на паузу.
             * @param {Object} state
             * @return {Verdict}
             */
          function (state) {
            return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
          },

          /**
             * Игра прекращается если игрок продолжает играть в нее два часа подряд.
             * @param {Object} state
             * @return {Verdict}
             */
          function (state) {
            return Date.now() - state.startTime > 3 * 60 * 1000 ?
              Verdict.FAIL :
              Verdict.CONTINUE;
          },
        ];
      }

      // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
      // по всем универсальным проверкам и проверкам конкретного уровня.
      // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
      // любое другое состояние кроме CONTINUE или пока не пройдут все
      // проверки. После этого состояние сохраняется.
      const allChecks = this.commonRules.concat(LevelsRules[this.level]);
      let currentCheck = Verdict.CONTINUE;
      let currentRule;

      while (currentCheck === Verdict.CONTINUE && allChecks.length) {
        currentRule = allChecks.shift();
        currentCheck = currentRule(this.state);
      }

      this.state.currentStatus = currentCheck;
    },

    /**
       * Принудительная установка состояния игры. Используется для изменения
       * состояния игры от внешних условий, например, когда необходимо остановить
       * игру, если она находится вне области видимости и установить вводный
       * экран.
       * @param {Verdict} status
       */
    setGameStatus: function (status) {
      if (this.state.currentStatus !== status) {
        this.state.currentStatus = status;
      }
    },

    /**
       * Отрисовка всех объектов на экране.
       */
    render: function () {
      // Удаление всех отрисованных на странице элементов.
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Выставление всех элементов, оставшихся в this.state.objects согласно
      // их координатам и направлению.
      this.state.objects.forEach(function (object) {
        if (object.sprite) {
          const reversed = object.direction & Direction.LEFT;
          const sprite = SpriteMap[object.type + (reversed ? REVERSED : '')] || SpriteMap[object.type];
          this.ctx.drawImage(sprite.image, object.x, object.y, object.width, object.height);
        }
      }, this);
    },

    /**
       * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
       * и обновляет их согласно правилам их поведения, а затем запускает
       * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
       * проверка не вернет состояние FAIL, WIN или PAUSE.
       */
    update: function () {
      if (!this.state.lastUpdated) {
        this.state.lastUpdated = Date.now();
      }

      const delta = (Date.now() - this.state.lastUpdated) / 10;
      this.updateObjects(delta);
      this.checkStatus();

      const updateGame = () => {
        this.update();
      };

      switch (this.state.currentStatus) {
        case Verdict.CONTINUE:
          this.state.lastUpdated = Date.now();
          this.render();
          requestAnimationFrame(updateGame.bind(this));
          break;

        case Verdict.WIN:
        case Verdict.FAIL:
        case Verdict.PAUSE:
        case Verdict.INTRO:
          this.pauseLevel();
          break;
      }
    },

    /**
       * @param {KeyboardEvent} evt [description]
       * @private
       */
    _onKeyDown: function (evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = true;
          break;
        case 39:
          this.state.keysPressed.RIGHT = true;
          break;
        case 38:
          this.state.keysPressed.UP = true;
          break;
        case 27:
          this.state.keysPressed.ESC = true;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = true;
      }
    },

    /**
       * @param {KeyboardEvent} evt [description]
       * @private
       */
    _onKeyUp: function (evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = false;
          break;
        case 39:
          this.state.keysPressed.RIGHT = false;
          break;
        case 38:
          this.state.keysPressed.UP = false;
          break;
        case 27:
          this.state.keysPressed.ESC = false;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = false;
      }
    },

    /** @private */
    _initializeGameListeners: function () {
      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
    },

    /** @private */
    _removeGameListeners: function () {
      window.removeEventListener('keydown', this._onKeyDown);
      window.removeEventListener('keyup', this._onKeyUp);
    },
  };

  Game.Verdict = Verdict;

  const game = new Game(document.querySelector('.demo'));
  game.initializeLevelAndStart();
  game.setGameStatus(Verdict.INTRO);

  return game;
}
