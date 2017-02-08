// ============================
// Разработчик: apelserg ; https://github.com/apelserg/
// Лицензия: WTFPL
// ============================

"use strict";

APELSERG.CONFIG.SET.Version = "0-1-0"
APELSERG.CONFIG.SET.LocalStorageName = "APELSERG-Tens42";

APELSERG.CONFIG.SET.BallSize = 20; // размер шарика (в пикселях)
APELSERG.CONFIG.SET.RacketHeight = 100; // 100, 150, 200
APELSERG.CONFIG.SET.RacketWidth = 25; // не утоньшать - будут проскакивания

APELSERG.CONFIG.SET.CourtWidth = 600; // 600, 800, 1000 -- ширина корта (в пикселях)
APELSERG.CONFIG.SET.CourtHeight = 400; // 400, 500, 600 -- высота корта (в пикселях)

APELSERG.CONFIG.SET.StartCnt = 50; // задержка подачи (100 ~ 1.3 секунды)
APELSERG.CONFIG.SET.RedCnt = 20; // число циклов красной/белой стрелялки при промахе/попадании
APELSERG.CONFIG.SET.ErrorCnt = 100; // число циклов сообщения об ошибке

APELSERG.CONFIG.SET.AudioCnt = 3; // число циклов звука
APELSERG.CONFIG.SET.AudioToneRed = 1000; // частота герцы
APELSERG.CONFIG.SET.AudioToneRacket = 500;
APELSERG.CONFIG.SET.AudioToneRacketSide = 100;

APELSERG.CONFIG.SET.SpeedX = [2.5, 2.0, 1.5, 1.0]; // делитель от 1.3 до 2.6 (от 5 до 10 px за ~13-14 мс)
APELSERG.CONFIG.SET.SpeedY = [6.0, 5.0, 4.0, 3.0]; // делитель от 3.0 до 6.0 (от 2 до 6 px за ~13-14 мс)
APELSERG.CONFIG.SET.SpeedSelector = 1;

APELSERG.CONFIG.SET.UserName = ["Left", "Right"];
APELSERG.CONFIG.SET.UserDevice = [10, 3]; // 0 - нет, 1 - клава, 3 - мышь, 10 - комп, 11 - комп(эксперт)
APELSERG.CONFIG.SET.PointWin = 21; // длина партии 3/11/21

APELSERG.CONFIG.SET.Lang = "EN"; // RU, EN
APELSERG.CONFIG.SET.OnSound = false; // вкл/выкл звук (срабатывает по [S])

APELSERG.CONFIG.KEY.Space = 32;
APELSERG.CONFIG.KEY.Pause = 80;
APELSERG.CONFIG.KEY.Sound = 83;

APELSERG.CONFIG.KEY.RightUp = 38; // 8
APELSERG.CONFIG.KEY.RightDown = 40; // 2
APELSERG.CONFIG.KEY.RightForward = 37; // 4
APELSERG.CONFIG.KEY.RightBack = 39; // 6

APELSERG.CONFIG.PROC.Ball;
APELSERG.CONFIG.PROC.Rackets = [{}, {}];

APELSERG.CONFIG.PROC.GameStop = true;
APELSERG.CONFIG.PROC.GamePause = false;

APELSERG.CONFIG.PROC.CurrTime = 0;

APELSERG.CONFIG.PROC.StartCnt = 0;  // в начале партии устанавливается = SET.StartCnt
APELSERG.CONFIG.PROC.ErrorCnt = 0; // при ошибке устанавливается SET.ErrorCnt
APELSERG.CONFIG.PROC.ErrorMsg = ""; // устанавливается при ошибке

APELSERG.CONFIG.PROC.UiSettings = false; // для синхронизации интерфейса и режима игры
APELSERG.CONFIG.PROC.UiPoints = false; // для показа очков
APELSERG.CONFIG.PROC.UiHelp = false; // для показа помощи

APELSERG.CONFIG.PROC.LoadFromWeb = false; // HTML загружен с сети или локального диска (надо для сохранения результатов и конфигурации)

APELSERG.CONFIG.PROC.CanvaID;
APELSERG.CONFIG.PROC.Ctx;

APELSERG.CONFIG.PROC.AudioCtx = null;
APELSERG.CONFIG.PROC.AudioOsc;

APELSERG.CONFIG.RESULT.Best = [];

//===
// Получить имя хранения конфигурации
//===
APELSERG.CONFIG.GetLocalStorageConfigName = function () {
    return APELSERG.CONFIG.SET.LocalStorageName + "-Config-" + APELSERG.CONFIG.SET.Version;
}

//===
// Получить имя хранения результатов
//===
APELSERG.CONFIG.GetLocalStorageResultName = function () {
    return APELSERG.CONFIG.SET.LocalStorageName + "-Results";
}

//===
// Получить результаты
//===
APELSERG.CONFIG.GetResultOnLoad = function () {

    if (APELSERG.CONFIG.PROC.LoadFromWeb) {

        var resultName = APELSERG.CONFIG.GetLocalStorageResultName();

        // восстановить результаты из хранилища
        //
        if (localStorage[resultName] !== undefined) {

            APELSERG.CONFIG.RESULT = JSON.parse(localStorage[resultName]);
        }
    }
}

//===
// Получить конфигурацию
//===
APELSERG.CONFIG.GetConfigOnLoad = function () {

    if (APELSERG.CONFIG.PROC.LoadFromWeb) {

        var configName = APELSERG.CONFIG.GetLocalStorageConfigName();

        // восстановить конфигурацию из хранилища
        //
        if (localStorage[configName] !== undefined) {
            APELSERG.CONFIG.SET = JSON.parse(localStorage[configName]);
        }
    }
}

//===
// Сохранить результат
//===
APELSERG.CONFIG.SetResult = function () {
    
    var dateCurrent = new Date();
    var dateCurrentStr = dateCurrent.toJSON().substring(0, 10);

    var resultCurrent = {};

    resultCurrent.Date = dateCurrentStr;

    if (APELSERG.CONFIG.PROC.Rackets[0].Points > APELSERG.CONFIG.PROC.Rackets[1].Points) {

        resultCurrent.NameWin = APELSERG.CONFIG.PROC.Rackets[0].Name;
        resultCurrent.PointsWin = APELSERG.CONFIG.PROC.Rackets[0].Points;
        resultCurrent.NameLost = APELSERG.CONFIG.PROC.Rackets[1].Name;
        resultCurrent.PointsLost = APELSERG.CONFIG.PROC.Rackets[1].Points;
    }
    else {
        resultCurrent.NameWin = APELSERG.CONFIG.PROC.Rackets[1].Name;
        resultCurrent.PointsWin = APELSERG.CONFIG.PROC.Rackets[1].Points;
        resultCurrent.NameLost = APELSERG.CONFIG.PROC.Rackets[0].Name;
        resultCurrent.PointsLost = APELSERG.CONFIG.PROC.Rackets[0].Points;
    }

    // 20 последних результатов
    //
    APELSERG.CONFIG.RESULT.Best.unshift(resultCurrent); // вставить в начало
    if (APELSERG.CONFIG.RESULT.Best.length > 20) {
        APELSERG.CONFIG.RESULT.Best.pop(); // удалить с конца
    }

    // сохранить в localStorage
    //
    if (APELSERG.CONFIG.PROC.LoadFromWeb) {
        var resultName = APELSERG.CONFIG.GetLocalStorageResultName();
        localStorage[resultName] = JSON.stringify(APELSERG.CONFIG.RESULT);
    }
}

//===
// Сброс результата
//===
APELSERG.CONFIG.ResetResult = function () {

    var resultName = APELSERG.CONFIG.GetLocalStorageResultName();

    localStorage.removeItem(resultName);

    APELSERG.CONFIG.RESULT.Best = [];

    if (APELSERG.CONFIG.PROC.UiPoints) {
        APELSERG.UI.ShowPoints();
    }
}

//===
// Сброс конфигурации
//===
APELSERG.CONFIG.ResetConfig = function () {

    var configName = APELSERG.CONFIG.GetLocalStorageConfigName();

    localStorage.removeItem(configName);

    if (APELSERG.CONFIG.PROC.UiSettings) {
        APELSERG.UI.ShowSettings();
    }

    document.getElementById('APELSERG_DivCanvas').innerHTML = APELSERG.LANG.GetText('RELOAD_PAGE');
}
