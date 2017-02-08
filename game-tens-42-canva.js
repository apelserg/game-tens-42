// ============================
// Разработчик: apelserg ; https://github.com/apelserg/
// Лицензия: WTFPL
// ============================

"use strict";

//===
// Полная отрисовка
//===
APELSERG.CANVA.CourtRewrite = function () {
    
    var ctx = APELSERG.CONFIG.PROC.Ctx;

    // Корт
    //
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, APELSERG.CONFIG.SET.CourtWidth, APELSERG.CONFIG.SET.CourtHeight);

    // Разметка
    //
    var lineOffset = 10;

    ctx.lineWidth = 5;
    ctx.strokeStyle = "silver";
    ctx.strokeRect(lineOffset, lineOffset, (APELSERG.CONFIG.SET.CourtWidth / 2) - lineOffset, APELSERG.CONFIG.SET.CourtHeight - (lineOffset * 2));
    ctx.strokeRect(APELSERG.CONFIG.SET.CourtWidth / 2, lineOffset, (APELSERG.CONFIG.SET.CourtWidth / 2) - lineOffset, APELSERG.CONFIG.SET.CourtHeight - (lineOffset * 2));

    // Мяч
    //
    APELSERG.CANVA.BallRewrite(ctx);
     
    // Ракетки
    //
    APELSERG.CANVA.RacketRewrite(ctx, 0);
    APELSERG.CANVA.RacketRewrite(ctx, 1);
    
    // Пауза
    //
    if (APELSERG.CONFIG.PROC.GamePause && !APELSERG.CONFIG.PROC.GameStop) {
        APELSERG.CANVA.TextRewrite(ctx, APELSERG.LANG.GetText("PAUSE"));
    }

    // Стоп
    //
    if (APELSERG.CONFIG.PROC.GameStop) {
        APELSERG.CANVA.TextRewrite(ctx, APELSERG.LANG.GetText("STOP"));
    }

    // Инфо
    //
    APELSERG.CANVA.InfoRewrite(ctx);

    // Обратный отсчёт задаржки
    //
    if (APELSERG.CONFIG.PROC.StartCnt > 0) {

        ctx.font = (40).toString() + "px Arial"; //ctx.font = "30px Arial";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center";
        ctx.fillText(APELSERG.CONFIG.PROC.StartCnt.toString(), APELSERG.CONFIG.SET.CourtWidth / 2, APELSERG.CONFIG.SET.CourtHeight / 2 - 20);

        APELSERG.CONFIG.PROC.StartCnt--;
    }

    // Обратный отсчёт сообщения об ошибке
    //
    if (APELSERG.CONFIG.PROC.ErrorCnt > 0) {

        ctx.font = (30).toString() + "px Arial"; //ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(APELSERG.CONFIG.PROC.ErrorMsg, APELSERG.CONFIG.SET.CourtWidth / 2, APELSERG.CONFIG.SET.CourtHeight / 2 + 10);

        APELSERG.CONFIG.PROC.ErrorCnt--;
        if (APELSERG.CONFIG.PROC.ErrorCnt == 0) APELSERG.CONFIG.PROC.ErrorMsg = "";
    }

    // Бордюрная рамка (рисовать в конце)
    //
    ctx.lineWidth = 10;
    ctx.strokeStyle = "white";
    ctx.strokeRect(0, 0, APELSERG.CONFIG.SET.CourtWidth, APELSERG.CONFIG.SET.CourtHeight);
}

//===
// Мяч
//===
APELSERG.CANVA.BallRewrite = function (ctx) {

    var ball = APELSERG.CONFIG.PROC.Ball;

    ctx.beginPath();
    ctx.arc(ball.X, ball.Y, ball.Radius, 0, 2 * Math.PI, false);
    //ctx.stroke();
    ctx.fillStyle = 'yellow';
    ctx.fill();
}


//===
// Ракетки
//===
APELSERG.CANVA.RacketRewrite = function (ctx, racketNum) {

    var racket = APELSERG.CONFIG.PROC.Rackets[racketNum];

    if (racket.Device != 0) {
        ctx.fillStyle = 'darkblue';
        if (racket.RedCnt > 0) { //-- красная ракетка
            racket.RedCnt--;
            ctx.fillStyle = "red";
        }
        if (racket.AceCnt > 0) { //-- белая ракетка
            racket.AceCnt--;
            ctx.fillStyle = "white";
        }
        if (racket.SideCnt > 0) { //-- желтая ракетка
            racket.SideCnt--;
            ctx.fillStyle = "yellow";
        }
        if (racketNum == 0) ctx.fillRect(racket.X, racket.Y, -(racket.Width), racket.Height);
        else ctx.fillRect(racket.X, racket.Y, racket.Width, racket.Height);
    }
}

//===
// Текст
//===
APELSERG.CANVA.TextRewrite = function (ctx, strText) {

    var fontHight = APELSERG.CONFIG.SET.BallSize;

    if (fontHight < 20) fontHight = 20;
    if (fontHight > 30) fontHight = 30;

    ctx.font = fontHight.toString() + "px Arial"; //ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(strText, APELSERG.CONFIG.SET.CourtWidth / 2, APELSERG.CONFIG.SET.CourtHeight / 2);
}

//===
// Инфо
//===
APELSERG.CANVA.InfoRewrite = function (ctx) {

    var fontHight = APELSERG.CONFIG.SET.BallSize;

    if (fontHight < 20) fontHight = 20;
    if (fontHight > 30) fontHight = 30;

    var strText = APELSERG.CONFIG.PROC.Rackets[0].Name + " : " + APELSERG.CONFIG.PROC.Rackets[0].Points;
    strText += "                        ";
    strText += APELSERG.CONFIG.PROC.Rackets[1].Name + " : " + APELSERG.CONFIG.PROC.Rackets[1].Points;

    ctx.font = fontHight.toString() + "px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(strText, APELSERG.CONFIG.SET.CourtWidth / 2, APELSERG.CONFIG.SET.CourtHeight - 20);
}
