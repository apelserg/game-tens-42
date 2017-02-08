// ============================
// Разработчик: apelserg ; https://github.com/apelserg/
// Лицензия: WTFPL
// ============================

"use strict";

//===
// Базовый объект - мяч
//===
APELSERG.MODEL.Ball = function () {
    this.X = APELSERG.CONFIG.SET.CourtWidth / 2;
    this.Y = APELSERG.CONFIG.SET.CourtHeight / 2;
    this.Radius = APELSERG.CONFIG.SET.BallSize / 2;
    this.DirX = 1;
    this.DirY = 1;
    this.DirXSpeedUp = 0; // ускорение по X
    this.DirYSpeedUp = 0; // ускорение по Y
}

//===
// Базовый объект - ракетка
//===
APELSERG.MODEL.Racket = function (racketNum) {

    this.Device = APELSERG.CONFIG.SET.UserDevice[racketNum];

    if (this.Device == 10) this.Name = "COMP";
    else if (this.Device == 11) this.Name = "COMP Exp";
    else this.Name = APELSERG.CONFIG.SET.UserName[racketNum];

    this.Points = 0;
    this.X = 0;
    this.Y = 0;
    this.Height = APELSERG.CONFIG.SET.RacketHeight;
    this.Width = APELSERG.CONFIG.SET.RacketWidth;
    this.MoveX = APELSERG.CONFIG.SET.RacketWidth;
    this.MoveY = APELSERG.CONFIG.SET.RacketHeight - (APELSERG.CONFIG.SET.RacketHeight / 5);
    this.RedCnt = 0;
    this.AceCnt = 0;
    this.SideCnt = 0;
    this.AudioCnt = 0;
    this.AudioTone = 0;
    this.AudioOsc;
}

//===
// Установить мяч на стартовую позицию
//===
APELSERG.MODEL.SetBallOnStart = function () {

    var ballX = 0;
    var ballY = 0;
    var dirX = 1;
    var dirY = 1;


    if ((APELSERG.CONFIG.PROC.Rackets[0].Points < APELSERG.CONFIG.PROC.Rackets[1].Points)
        || (APELSERG.CONFIG.PROC.Rackets[0].Points == 0 && APELSERG.CONFIG.PROC.Rackets[1].Points == 0)
        && (APELSERG.CONFIG.PROC.Rackets[1].Device != 0)) {

        ballX = APELSERG.CONFIG.PROC.Rackets[1].X - 60;
        ballY = APELSERG.CONFIG.PROC.Rackets[1].Y;
    }
    else if (APELSERG.CONFIG.PROC.Rackets[0].Device != 0) {

        ballX = (APELSERG.CONFIG.PROC.Rackets[0].X + 60);
        ballY = APELSERG.CONFIG.PROC.Rackets[0].Y;
        dirX = -1;
    }
    else {
        ballX = APELSERG.CONFIG.SET.CourtWidth / 2;
        ballY = APELSERG.CONFIG.SET.CourtHeight / 2;
    }

    APELSERG.CONFIG.PROC.Ball.X = ballX;
    APELSERG.CONFIG.PROC.Ball.Y = ballY;
    APELSERG.CONFIG.PROC.Ball.DirX = dirX;
    APELSERG.CONFIG.PROC.Ball.DirY = dirY;
    APELSERG.CONFIG.PROC.Ball.DirXSpeedUp = 0;
    APELSERG.CONFIG.PROC.Ball.DirYSpeedUp = 0;

    APELSERG.CONFIG.PROC.Rackets[0].Points = 0;
    APELSERG.CONFIG.PROC.Rackets[1].Points = 0;
}

//===
// Установить ракетку на стартовую позицию
//===
APELSERG.MODEL.SetRacketOnStart = function (racketNum) {

    var racketX = 2 * APELSERG.CONFIG.SET.RacketWidth;
    var racketY = (APELSERG.CONFIG.SET.CourtHeight / 2) - (APELSERG.CONFIG.SET.RacketHeight / 2);

    if (racketNum == 1) {
        racketX = APELSERG.CONFIG.SET.CourtWidth - 2 * APELSERG.CONFIG.SET.RacketWidth;
    }
    APELSERG.CONFIG.PROC.Rackets[racketNum].X = racketX;
    APELSERG.CONFIG.PROC.Rackets[racketNum].Y = racketY;
}

//===
// Случайное направление
//===
APELSERG.MODEL.GetRandomDir = function () {
    if (Math.round(Math.random() * 10) % 2 == 0) return 1;
    else return -1;
}

//===
// Переместить мяч
//===
APELSERG.MODEL.UpdateBall = function () {

    if (APELSERG.CONFIG.PROC.GameStop || APELSERG.CONFIG.PROC.GamePause)
        return;

    var ball = APELSERG.CONFIG.PROC.Ball;
    var racketL = APELSERG.CONFIG.PROC.Rackets[0];
    var racketR = APELSERG.CONFIG.PROC.Rackets[1];

    if(ball.X < APELSERG.CONFIG.SET.CourtWidth / 2) {

        // Отскок от левой ракетки
        //
        if (racketL.Device != 0) {
            if (((ball.X - ball.Radius) <= racketL.X)
              && ((ball.X - ball.Radius) >= (racketL.X - racketL.Width - 10)) // 10 - защита от проскакивания
              && ((ball.Y + ball.Radius) >= racketL.Y)
              && ((ball.Y - ball.Radius) <= (racketL.Y + racketL.Height))
              && (ball.DirX < 0)) {

                APELSERG.MODEL.RacketBallKickback(ball, racketL);  // отскок от ракетки

                ball.X = racketL.X + ball.Radius;
                ball.DirX *= -1;
            }
        }

        // Отскок от левой стороны корта
        //
        if (ball.X <= ball.Radius) {

            ball.X = ball.Radius;
            ball.DirX *= -1;

            if (ball.DirXSpeedUp > 3) ball.DirXSpeedUp -= 3; // защита от зацикливаний
            if (ball.DirYSpeedUp > 3) ball.DirYSpeedUp -= 3; // защита от зацикливаний

            racketR.Points++; // очко другой стороне

            if (racketL.Device != 0) { // красный
                racketL.RedCnt = APELSERG.CONFIG.SET.RedCnt;
            }

            // звук - отскок
            //
            if (racketL.AudioCnt == 0) {
                racketL.AudioCnt = APELSERG.CONFIG.SET.AudioCnt;
                racketL.AudioTone = APELSERG.CONFIG.SET.AudioToneRed;
            }
        }
    }
    else {
        // Отскок от правой ракетки
        //
        if (racketR.Device != 0) {
            if (((ball.X + ball.Radius) >= racketR.X)
              && ((ball.X + ball.Radius) <= (racketR.X + racketR.Width + 10)) // 10 - защита от проскакивания
              && ((ball.Y + ball.Radius) >= racketR.Y)
              && ((ball.Y - ball.Radius) <= (racketR.Y + racketR.Height))
              && (ball.DirX > 0)) {

                APELSERG.MODEL.RacketBallKickback(ball, racketR); // отскок от ракетки

                ball.X = racketR.X - ball.Radius;
                ball.DirX *= -1;
            }
        }

        // Отскок от правой стороны корта
        //
        if (ball.X >= (APELSERG.CONFIG.SET.CourtWidth - ball.Radius)) {

            ball.X = APELSERG.CONFIG.SET.CourtWidth - ball.Radius;
            ball.DirX *= -1;

            if (ball.DirXSpeedUp > 3) ball.DirXSpeedUp -= 3; // защита от зацикливаний
            if (ball.DirYSpeedUp > 3) ball.DirYSpeedUp -= 3; // защита от зацикливаний

            racketL.Points++; // очко другой стороне

            if (racketR.Device != 0) { // красный
                racketR.RedCnt = APELSERG.CONFIG.SET.RedCnt;
            }

            // звук - отскок
            //
            if (racketR.AudioCnt == 0) {
                racketR.AudioCnt = APELSERG.CONFIG.SET.AudioCnt;
                racketR.AudioTone = APELSERG.CONFIG.SET.AudioToneRed;
            }
        }
    }

    if (ball.Y < APELSERG.CONFIG.SET.CourtHeight / 2) {

        // Отскок от верха корта
        //
        if (ball.Y <= ball.Radius) {
            ball.Y = ball.Radius;
            ball.DirY *= -1;
        }
    }
    else {
        // Отскок от низа корта
        //
        if (ball.Y >= (APELSERG.CONFIG.SET.CourtHeight - ball.Radius)) {
            ball.Y = APELSERG.CONFIG.SET.CourtHeight - ball.Radius;
            ball.DirY *= -1;
        }
    }

    // игра завершена?
    //
    if ((racketL.Points >= APELSERG.CONFIG.SET.PointWin || racketR.Points >= APELSERG.CONFIG.SET.PointWin)
        && (Math.abs(racketL.Points - racketR.Points) > 1)
        && (racketL.Device != 0 && racketR.Device != 0)) {

        APELSERG.CONFIG.SetResult();
        APELSERG.MAIN.Stop();

    }
    else {
        // движение мяча
        //
        if (ball.DirX > 0) {
            ball.X += ball.DirX + ball.DirXSpeedUp;
        }
        else {
            ball.X += ball.DirX - ball.DirXSpeedUp;
        }

        if (ball.DirY > 0) {
            ball.Y += ball.DirY + ball.DirYSpeedUp;;
        }
        else {
            ball.Y += ball.DirY - ball.DirYSpeedUp;;
        }
    }
}

//===
// Отскок от ракетки
//===
APELSERG.MODEL.RacketBallKickback = function (ball, racket) {

    var racketCenter = 10;

    ball.DirXSpeedUp = Math.abs(ball.DirX * Math.random());
    ball.DirYSpeedUp = Math.abs(ball.DirY * Math.random());
    ball.DirY *= APELSERG.MODEL.GetRandomDir();

    // центр ракетки
    //
    if (ball.Y > (racket.Y + racket.Height / 2 - racketCenter) && ball.Y < (racket.Y + racket.Height / 2 + racketCenter)) {
        ball.DirXSpeedUp *= 1.5;
        ball.DirYSpeedUp *= 3;
        racket.AceCnt = APELSERG.CONFIG.SET.RedCnt;
    }

    // бок ракетки
    //
    if (ball.Y < racket.Y || ball.Y > (racket.Y + racket.Height)) {
        ball.DirYSpeedUp *= 4;
        //ball.DirX *= dirMove; // при попадании в бок ракетки можно отбить или "проиграть"
        racket.SideCnt = APELSERG.CONFIG.SET.RedCnt;

        // звук - отскок (бок)
        //
        if (racket.AudioCnt == 0) {
            racket.AudioCnt = APELSERG.CONFIG.SET.AudioCnt;
            racket.AudioTone = APELSERG.CONFIG.SET.AudioToneRacketSide;
        }
    }

    // звук - отскок
    //
    if (racket.AudioCnt == 0) {
        racket.AudioCnt = APELSERG.CONFIG.SET.AudioCnt;
        racket.AudioTone = APELSERG.CONFIG.SET.AudioToneRacket;
    }
}

//===
// Звук
//===
APELSERG.MODEL.Sound = function (racketNum) {

    if (APELSERG.CONFIG.PROC.Rackets[racketNum].AudioCnt == 0)
        return;

    if (!APELSERG.CONFIG.SET.OnSound)
        return;

    if (APELSERG.CONFIG.PROC.AudioCtx == null)
        return;

    var racket = APELSERG.CONFIG.PROC.Rackets[racketNum];

    if (racket.AudioCnt == APELSERG.CONFIG.SET.AudioCnt) {

        racket.AudioOsc = APELSERG.CONFIG.PROC.AudioCtx.createOscillator();
        racket.AudioOsc.frequency.value = racket.AudioTone;
        racket.AudioOsc.connect(APELSERG.CONFIG.PROC.AudioCtx.destination);
        racket.AudioOsc.start();

    }
    if (racket.AudioCnt == 1) {
        racket.AudioOsc.stop();
    }

    racket.AudioCnt--;
}

//===
// Играет комп
//===
APELSERG.MODEL.CompGame = function (racketNum) {

    if (APELSERG.CONFIG.PROC.Rackets[racketNum].Device < 10)
        return;

    var racket = APELSERG.CONFIG.PROC.Rackets[racketNum];

    var distance = APELSERG.CONFIG.PROC.Ball.Y - (racket.Y + racket.Height / 2);

    var speedMax = 5;
    var speedNorm = 3;
    var speedMin = 1;

    if (racket.Device == 11) {
        speedMax = 10;
        speedNorm = 6;
        speedMin = 2;
    }

    // игра у задней линии (Y)
    //
    if ((APELSERG.CONFIG.PROC.Ball.DirX > 0 && racketNum == 1) || (APELSERG.CONFIG.PROC.Ball.DirX < 0 && racketNum == 0)) {
        if (distance > 50) racket.Y += speedMax + APELSERG.CONFIG.SET.SpeedSelector;
        else if (distance > 30) racket.Y += speedNorm + APELSERG.CONFIG.SET.SpeedSelector;
        else if (distance > 0) racket.Y += speedMin + APELSERG.CONFIG.SET.SpeedSelector;

        if (distance < -50) racket.Y -= speedMax + APELSERG.CONFIG.SET.SpeedSelector;
        else if (distance < -30) racket.Y -= speedNorm + APELSERG.CONFIG.SET.SpeedSelector;
        else if (distance < 0) racket.Y -= speedMin + APELSERG.CONFIG.SET.SpeedSelector;
    }

    // выход к сетке (X)
    //
    if (racket.Device == 11) {
        if (Math.abs(distance) < 30) {
            if (racketNum == 0 && racket.X < APELSERG.CONFIG.SET.CourtWidth / 2 - 50) racket.X += 3;
            else if (racketNum == 1 && racket.X > APELSERG.CONFIG.SET.CourtWidth / 2 + 50) racket.X -= 3;
        }
        else {
            if (racketNum == 0 && racket.X > APELSERG.CONFIG.SET.RacketWidth * 2) racket.X -= 3;
            else if (racketNum == 1 && racket.X < APELSERG.CONFIG.SET.CourtWidth - APELSERG.CONFIG.SET.RacketWidth * 2) racket.X += 3;
        }
    }
}
