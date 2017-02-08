// ============================
// Разработчик: apelserg ; https://github.com/apelserg/
// Лицензия: WTFPL
// ============================

"use strict";

// Глобальные переменные
//

var APELSERG = {};

APELSERG.MAIN = {};
APELSERG.MODEL = {};
APELSERG.CANVA = {};
APELSERG.UI = {};
APELSERG.LANG = {};
APELSERG.CONFIG = {};
APELSERG.CONFIG.SET = {};
APELSERG.CONFIG.KEY = {};
APELSERG.CONFIG.PROC = {};
APELSERG.CONFIG.RESULT = {};

//===
// старт программы (начальная прорисовка)
//===
APELSERG.MAIN.OnLoad = function (initFirst) {

    // определить место загрузки
    //
    window.location.protocol == "file:" ? APELSERG.CONFIG.PROC.LoadFromWeb = false : APELSERG.CONFIG.PROC.LoadFromWeb = true;

    // инициализация данных из localeStorage
    //
    APELSERG.CONFIG.GetConfigOnLoad();
    APELSERG.CONFIG.GetResultOnLoad();

    // звук
    //
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        APELSERG.CONFIG.PROC.AudioCtx = new window.AudioContext();
    }
    catch (e) {
        APELSERG.CONFIG.PROC.AudioCtx = null;
    }

    // канва
    //
    APELSERG.CONFIG.PROC.CanvaID = document.getElementById('APELSERG_CanvasTens');
    APELSERG.CONFIG.PROC.Ctx = APELSERG.CONFIG.PROC.CanvaID.getContext('2d');
    APELSERG.CONFIG.PROC.CanvaID.width = APELSERG.CONFIG.SET.CourtWidth;
    APELSERG.CONFIG.PROC.CanvaID.height = APELSERG.CONFIG.SET.CourtHeight;
    APELSERG.CONFIG.PROC.CanvaID.style.cursor = "crosshair"; //"none"; //"crosshair"; //"move";

    // инициализация базовых объектов
    //
    APELSERG.CONFIG.PROC.Ball = new APELSERG.MODEL.Ball(); // мяч
    APELSERG.CONFIG.PROC.Rackets[0] = new APELSERG.MODEL.Racket(0); // ракетки
    APELSERG.CONFIG.PROC.Rackets[1] = new APELSERG.MODEL.Racket(1);
    APELSERG.MODEL.SetRacketOnStart(0);
    APELSERG.MODEL.SetRacketOnStart(1);

    APELSERG.MAIN.Stop(); // отрисовка наименований кнопок

    // только для начальной инициализации
    //
    if (initFirst) {
        APELSERG.MAIN.Animation(); // пуск анимации

        //===
        // Движения мыши
        //===
        APELSERG.CONFIG.PROC.CanvaID.addEventListener('mousemove', function (event) {

            if (!APELSERG.CONFIG.PROC.GamePause) {

                var mouseMoveX = event.clientX - APELSERG.CONFIG.PROC.CanvaID.offsetLeft;
                var mouseMoveY = event.clientY - APELSERG.CONFIG.PROC.CanvaID.offsetTop;

                if (APELSERG.CONFIG.PROC.Rackets[0].Device == 3
                    && mouseMoveX > 0
                    && mouseMoveX < APELSERG.CONFIG.SET.CourtWidth / 2 - APELSERG.CONFIG.SET.RacketWidth * 2) {

                    APELSERG.CONFIG.PROC.Rackets[0].X = mouseMoveX + APELSERG.CONFIG.SET.RacketWidth;
                    APELSERG.CONFIG.PROC.Rackets[0].Y = mouseMoveY - (APELSERG.CONFIG.SET.RacketHeight / 2);
                }

                if (APELSERG.CONFIG.PROC.Rackets[1].Device == 3
                    && mouseMoveX > (APELSERG.CONFIG.SET.CourtWidth / 2 + APELSERG.CONFIG.SET.RacketWidth * 2)
                    && mouseMoveX < APELSERG.CONFIG.SET.CourtWidth) {

                    APELSERG.CONFIG.PROC.Rackets[1].X = mouseMoveX - APELSERG.CONFIG.SET.RacketWidth;
                    APELSERG.CONFIG.PROC.Rackets[1].Y = mouseMoveY - (APELSERG.CONFIG.SET.RacketHeight / 2);
                }
            }
        });

        //===
        // Двойной клик мыши
        //===
        APELSERG.CONFIG.PROC.CanvaID.addEventListener('dblclick', function (event) {
            if (APELSERG.CONFIG.PROC.GameStop) APELSERG.MAIN.Start();
            if (APELSERG.CONFIG.PROC.GamePause) APELSERG.MAIN.Pause();
        });
    }
}

//===
// Обработка нажатий клавиш
//===
window.addEventListener('keydown', function (event) {

    // предотвратить срабатывание при "всплытии" клика
    //
    document.getElementById("APELSERG_InputSettings").blur();
    document.getElementById("APELSERG_InputPoints").blur();
    document.getElementById("APELSERG_InputHelp").blur();
    document.getElementById("APELSERG_InputStartStop").blur();

    // пробел [SPACE]
    //
    if (event.keyCode == APELSERG.CONFIG.KEY.Space) {
        APELSERG.MAIN.Start();
        return;
    }

    // пауза [P]
    //
    if (event.keyCode == APELSERG.CONFIG.KEY.Pause) {
        APELSERG.MAIN.Pause();
        return;
    }

    // звук [S]
    //
    if (event.keyCode == APELSERG.CONFIG.KEY.Sound) {
        APELSERG.CONFIG.SET.OnSound = !APELSERG.CONFIG.SET.OnSound;
        return;
    }

    // стрелки
    //
    if (APELSERG.CONFIG.PROC.Rackets[0].Device == 1) {

        var racket = APELSERG.CONFIG.PROC.Rackets[0];

        if (event.keyCode == APELSERG.CONFIG.KEY.RightUp) {
            if (racket.Y > 0) racket.Y -= racket.MoveY;
            return;
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.RightDown) {
            if ((racket.Y + racket.Height) < APELSERG.CONFIG.SET.CourtHeight) racket.Y += racket.MoveY;
            return;
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.RightForward) {
            if ((racket.X - racket.Width) > 0) racket.X -= racket.MoveX;
            return;
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.RightBack) {
            if (racket.X < ((APELSERG.CONFIG.SET.CourtWidth / 2) - 50)) racket.X += racket.MoveX;
            return;
        }
    }
    if (APELSERG.CONFIG.PROC.Rackets[1].Device == 1) {

        var racket = APELSERG.CONFIG.PROC.Rackets[1];

        if (event.keyCode == APELSERG.CONFIG.KEY.RightUp) {
            if (racket.Y > 0) racket.Y -= racket.MoveY;
            return;
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.RightDown) {
            if ((racket.Y + racket.Height) < APELSERG.CONFIG.SET.CourtHeight) racket.Y += racket.MoveY;
            return;
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.RightForward) {
            if (racket.X > ((APELSERG.CONFIG.SET.CourtWidth / 2) + 50)) racket.X -= racket.MoveX;
            return;
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.RightBack) {
            if((racket.X + racket.Width) < APELSERG.CONFIG.SET.CourtWidth) racket.X += racket.MoveX;
            return;
        }
    }
});

//===
// Старт
//===
APELSERG.MAIN.Start = function () {

    // закрыть окна (если открыты - должны закрыться)
    //
    if (APELSERG.CONFIG.PROC.UiSettings) APELSERG.UI.ShowSettings();
    if (APELSERG.CONFIG.PROC.UiPoints) APELSERG.UI.ShowPoints();
    if (APELSERG.CONFIG.PROC.UiHelp) APELSERG.UI.ShowHelp();

    // старт
    //
    if (APELSERG.CONFIG.PROC.GameStop) {

        document.getElementById('APELSERG_InputSettings').value = '-';
        document.getElementById('APELSERG_InputPoints').value = '-';
        document.getElementById('APELSERG_InputHelp').value = '-';
        document.getElementById('APELSERG_InputStartStop').value = APELSERG.LANG.GetText('STOP');

        // новая игра - инициализация
        //
        APELSERG.CONFIG.PROC.GameStop = false;
        APELSERG.CONFIG.PROC.GamePause = false;
        APELSERG.CONFIG.PROC.CurrTime = 0;
        APELSERG.CONFIG.PROC.StartCnt = APELSERG.CONFIG.SET.StartCnt; // установить задержку старта

        APELSERG.MODEL.SetRacketOnStart(0); // установка ракеток
        APELSERG.MODEL.SetRacketOnStart(1);
        APELSERG.MODEL.SetBallOnStart(); // сброс очков здесь (очки влияют на позицию - у выигравшей ракетки)
    }
    else {
        if (APELSERG.CONFIG.PROC.GamePause) {
            APELSERG.MAIN.Pause();
        }
    }
}

//===
// Стоп
//===
APELSERG.MAIN.Stop = function () {

    document.getElementById('APELSERG_InputSettings').value = APELSERG.LANG.GetText('CONFIG');
    document.getElementById('APELSERG_InputPoints').value = APELSERG.LANG.GetText('SCORE');
    document.getElementById('APELSERG_InputHelp').value = APELSERG.LANG.GetText('HELP');
    document.getElementById('APELSERG_InputStartStop').value = APELSERG.LANG.GetText('START');

    APELSERG.CONFIG.PROC.GameStop = true;
}

//===
// Старт/Стоп/Продолжить (для кнопки)
//===
APELSERG.MAIN.StartStopContinue = function () {
    if (APELSERG.CONFIG.PROC.GameStop) {
        APELSERG.MAIN.Start();
    }
    else {
        if (APELSERG.CONFIG.PROC.GamePause) {
            APELSERG.MAIN.Pause();
        }
        else {
            APELSERG.MAIN.Stop();
        }
    }
}

//===
// Пауза
//===
APELSERG.MAIN.Pause = function () {
    if (!APELSERG.CONFIG.PROC.GameStop) {
        if (APELSERG.CONFIG.PROC.GamePause) {
            document.getElementById('APELSERG_InputStartStop').value = APELSERG.LANG.GetText('STOP');
            APELSERG.CONFIG.PROC.GamePause = false;
        }
        else {
            document.getElementById('APELSERG_InputStartStop').value = APELSERG.LANG.GetText('CONTINUE');
            APELSERG.CONFIG.PROC.GamePause = true;
        }
    }
}

//===
// Рабочий цикл анимации
//===
APELSERG.MAIN.Animation = function () {

    // определить время между циклами
    //
    var prevTime = APELSERG.CONFIG.PROC.CurrTime;

    APELSERG.CONFIG.PROC.CurrTime = new Date().getTime();

    var timeDelta = APELSERG.CONFIG.PROC.CurrTime - prevTime;

    if (timeDelta > 30) timeDelta = 30; // попробовать "скорректировать" лаг (но это не всегда эффективно)

    // перемещение шарика
    //
    if (!APELSERG.CONFIG.PROC.GameStop && !APELSERG.CONFIG.PROC.GamePause) {

        // обратный отсчёт перед подачей
        //
        if (APELSERG.CONFIG.PROC.StartCnt == 0) {
            // определить скорость шарика для текущего цикла
            //
            var speedBallX = timeDelta / APELSERG.CONFIG.SET.SpeedX[APELSERG.CONFIG.SET.SpeedSelector];
            var speedBallY = timeDelta / APELSERG.CONFIG.SET.SpeedY[APELSERG.CONFIG.SET.SpeedSelector];

            if (APELSERG.CONFIG.PROC.Ball.DirX > 0) {
                APELSERG.CONFIG.PROC.Ball.DirX = speedBallX;
            }
            else {
                APELSERG.CONFIG.PROC.Ball.DirX = speedBallX * (-1);
            }

            if (APELSERG.CONFIG.PROC.Ball.DirY > 0) {
                APELSERG.CONFIG.PROC.Ball.DirY = speedBallY;
            }
            else {
                APELSERG.CONFIG.PROC.Ball.DirY = speedBallY * (-1);
            }

            // пересчитать положение шарика
            //
            APELSERG.MODEL.UpdateBall(); // окончание игры срабатывает здесь

            // играет комп
            //
            APELSERG.MODEL.CompGame(0);
            APELSERG.MODEL.CompGame(1);

        }
    }

    // звук (здесь, чтобы при остановке звук смог прекратиться)
    //
    APELSERG.MODEL.Sound(0);
    APELSERG.MODEL.Sound(1);

    // отрисовка
    //
    APELSERG.CANVA.CourtRewrite();

    // отрисовка (при паузе и остановке цикл отрисовки не прекращается)
    //
    window.requestAnimationFrame(function () {
        APELSERG.MAIN.Animation();
    });
}
