<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="AI Tutor">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#0f172a">
  <meta name="description" content="Голосовой ИИ-репетитор иностранных языков на базе Gemini Live">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">

  <!-- v3.17.0: убран 'unsafe-eval' (не используется), добавлены object-src/base-uri -->
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self' 'unsafe-inline' blob: data:;
                 connect-src 'self' wss://generativelanguage.googleapis.com;
                 img-src 'self' https://images.unsplash.com data:;
                 media-src 'self' blob:;
                 object-src 'none'; base-uri 'none';">
  <title>AI Language Tutor v3.25.0</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }

    body {
      background: linear-gradient(160deg, #0f172a, #1e293b);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      color: #f8fafc;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100dvh;
      min-height: 100vh;
      overflow: hidden;
      transition: background-image 0.5s ease;
    }

    .app-container {
      width: 100%;
      max-width: 480px;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    header {
      padding: calc(12px + env(safe-area-inset-top, 0px)) 20px 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
      z-index: 10;
    }

    .header-left { display: flex; flex-direction: column; min-width: 0; }
    .header-title { font-weight: 600; font-size: 1.05rem; }
    .profile-badge { font-size: 0.8rem; color: #94a3b8; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .header-right { display: flex; align-items: center; gap: 10px; }
    .timer-badge {
      font-size: 0.9rem;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(15, 23, 42, 0.6);
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid rgba(56, 189, 248, 0.3);
      display: none;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      user-select: none;
      transition: transform 0.1s ease, border-color 0.2s ease, background 0.2s ease;
    }
    .timer-badge:active { transform: scale(0.95); }
    .timer-warning { color: #f59e0b; border-color: rgba(245, 158, 11, 0.4); animation: blink 1.2s infinite alternate; }
    @keyframes blink { 0% { opacity: 1; } 100% { opacity: 0.4; } }
    .btn-icon { background: none; border: none; color: #f8fafc; font-size: 1.4rem; cursor: pointer; padding: 4px; }

    button:focus-visible, select:focus-visible, input:focus-visible, a:focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px 20px;
      text-align: center;
      overflow: hidden;
      position: relative;
    }

    .progress-pill {
      display: none;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 600;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
    }

    .avatar-wrapper {
      position: relative;
      width: 190px;
      height: 190px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar-halo {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(37, 99, 235, 0) 70%);
      transition: opacity 0.1s ease-out;
      transform: scale(1);
      opacity: 0.3;
      z-index: 1;
      will-change: transform, opacity;
    }
    .avatar-card {
      position: relative;
      width: 165px;
      height: 165px;
      border-radius: 50%;
      background: #0f172a;
      border: 3px solid #38bdf8;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.3);
      overflow: hidden;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .avatar-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
    .avatar-emoji { display: none; font-size: 4.6rem; line-height: 1; align-items: center; justify-content: center; width: 100%; height: 100%; background: radial-gradient(circle at 50% 35%, #1e3a5f, #0f172a); }
    .avatar-card.speaking { border-color: #c084fc; animation: landmarkPulse 1.6s infinite alternate ease-in-out; }
    .avatar-card.speaking img { transform: scale(1.08); }
    @keyframes landmarkPulse {
      0% { transform: scale(1); box-shadow: 0 8px 30px rgba(0,0,0,0.7), 0 0 35px rgba(192, 132, 252, 0.5); }
      100% { transform: scale(1.05); box-shadow: 0 12px 40px rgba(0,0,0,0.9), 0 0 60px rgba(192, 132, 252, 0.85); }
    }

    .status-text {
      font-size: 1.05rem;
      font-weight: 500;
      color: #e2e8f0;
      margin-top: 10px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.6);
      min-height: 28px;
      padding: 0 8px;
    }

    .stats-row {
      margin-top: 14px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      font-size: 0.82rem;
      color: #cbd5e1;
    }
    .stat-chip { background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 5px 12px; }

    .captions {
      display: none;
      margin-top: 14px;
      width: 100%;
      max-height: 120px;
      overflow: hidden;
      text-align: left;
      font-size: 0.92rem;
      line-height: 1.4;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 10px 12px;
    }
    .captions .cap-user { color: #94a3b8; margin-bottom: 4px; }
    .captions .cap-tutor { color: #f1f5f9; }

    footer {
      padding: 14px 20px calc(16px + env(safe-area-inset-bottom, 0px)) 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }
    .btn-main {
      width: 100%;
      max-width: 340px;
      padding: 15px;
      border-radius: 14px;
      border: none;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-start { background: #2563eb; color: white; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4); }
    .btn-stop { background: #ef4444; color: white; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); }
    .btn-turn { background: #0284c7; color: white; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4); }
    .btn-interrupt { background: #d97706; color: white; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4); display: none; }
    .btn-main:active { transform: scale(0.97); }
    .btn-main:disabled { opacity: 0.5; cursor: not-allowed; }

    .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); justify-content: center; align-items: center; padding: 20px; z-index: 50; }
    .modal-content { background: #1e293b; padding: 22px; border-radius: 16px; width: 100%; max-width: 420px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .modal-content input, .modal-content select { border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 16px; width: 100%; height: 44px; padding: 0 12px; }   /* 16px — иначе iOS приближает страницу при фокусе */
    .modal-content select {
      -webkit-appearance: none; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
    }
    .modal-content label { font-size: 0.82rem; color: #94a3b8; margin-bottom: -5px; text-align: left; }
    .modal-content button { padding: 11px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
    .modal-content a { color: #38bdf8; font-size: 0.8rem; text-align: left; }
    .btn-save { background: #2563eb; color: white; margin-top: 4px; }
    .btn-backup { background: #0369a1; color: white; }
    .btn-reset-current { background: #475569; color: #f8fafc; }
    .btn-reset-all { background: #991b1b; color: #fee2e2; }
    .btn-close { background: transparent; color: #94a3b8; }
    .mem-info { font-size: 0.78rem; color: #94a3b8; text-align: left; }
    .hint { font-size: 0.75rem; color: #64748b; text-align: left; margin-top: -4px; }

    .toast {
      position: fixed;
      left: 50%;
      bottom: calc(96px + env(safe-area-inset-bottom, 0px));
      transform: translateX(-50%) translateY(12px);
      max-width: min(92vw, 420px);
      background: #0b1220;
      color: #f8fafc;
      border: 1px solid rgba(56, 189, 248, 0.4);
      border-radius: 12px;
      padding: 11px 16px;
      font-size: 0.9rem;
      line-height: 1.35;
      text-align: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
      z-index: 100;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    @media (prefers-reduced-motion: reduce) {
      .avatar-card.speaking, .timer-warning { animation: none; }
      .avatar-card img, .btn-main, .toast { transition: none; }
    }
  </style>
</head>
<body>

  <div class="app-container">
    <header>
      <div class="header-left">
        <div class="header-title" id="headerTitle">AI Tutor</div>
        <div class="profile-badge" id="profileBadge">Загрузка...</div>
      </div>

      <div class="header-right">
        <div class="timer-badge" id="timerBadge">15:00</div>
        <button class="btn-icon" id="btnSettings" title="Настройки" aria-label="Настройки">⚙</button>
      </div>
    </header>

    <main>
      <div class="progress-pill" id="progressPill">Блок 1 • Разминка и фразы 1–5</div>

      <div class="avatar-wrapper">
        <div class="avatar-halo" id="avatarHalo"></div>
        <div class="avatar-card" id="avatarCard">
          <img id="landmarkImage" alt="" style="display:none">
          <div class="avatar-emoji" id="avatarEmoji"></div>
        </div>
      </div>
      <div class="status-text" id="statusText" aria-live="polite">Нажмите «Начать урок» для старта</div>
      <div class="stats-row" id="statsRow"></div>
      <div class="captions" id="captions" aria-live="off">
        <div class="cap-user" id="capUser"></div>
        <div class="cap-tutor" id="capTutor"></div>
      </div>
    </main>

    <footer>
      <button class="btn-main btn-interrupt" id="btnInterrupt">Перебить / Хватит ✋</button>
      <button class="btn-main btn-turn" id="btnEndTurn" style="display: none;">Я всё сказал ➔</button>
      <div class="turn-hint" id="turnHint" style="display: none; font-size: 0.75rem; color: rgba(255,255,255,0.5); text-align: center; margin-top: 4px; margin-bottom: 6px;">Репетитор ответит сам после паузы, или нажмите кнопку</div>
      <button class="btn-main btn-start" id="btnAction">Начать урок</button>
    </footer>
  </div>

  <div class="toast" id="toast" role="status"></div>

  <div class="modal" id="modalSettings" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
    <div class="modal-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
        <h3 id="settingsTitle" style="margin: 0; text-align: left;">Настройки</h3>
        <span class="js-version" style="font-size: 0.8rem; font-weight: 700; color: #38bdf8; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); padding: 2px 8px; border-radius: 6px;"></span>
      </div>

      <label id="lblUiLang" for="selectUiLang">Язык интерфейса:</label>
      <select id="selectUiLang">
        <option value="ru">Русский</option>
        <option value="uk">Українська</option>
        <option value="en">English</option>
      </select>

      <label id="lblUserName" for="inputUserName">Ваше имя (необязательно):</label>
      <input type="text" id="inputUserName" placeholder="Например: Денис / Анна"
             autocomplete="name" spellcheck="false">

      <label id="lblKey" for="inputApiKey">Google AI Studio API Key:</label>
      <input type="password" id="inputApiKey" placeholder="AIzaSy..."
             autocomplete="off" spellcheck="false" autocapitalize="off">
      <a id="msgGetUrl" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Где взять ключ (бесплатно, в Google AI Studio)</a>

      <label id="lblStorageMode" for="selectStorageMode">Режим хранения ключа:</label>
      <select id="selectStorageMode">
        <option value="local">На этом устройстве</option>
        <option value="session">Только на время сессии</option>
      </select>

      <div style="display: flex; gap: 10px;">
        <div style="flex: 1;">
          <label id="lblTargetLang" for="selectLanguage">Изучаемый язык:</label>
          <select id="selectLanguage"></select>
        </div>
        <div style="flex: 1;">
          <label id="lblTeacherVoice" for="selectTeacher">Голос репетитора:</label>
          <select id="selectTeacher">
            <option value="female">Женский</option>
            <option value="male">Мужской</option>
          </select>
        </div>
      </div>

      <div style="display: flex; gap: 10px;">
        <div style="flex: 1;">
          <label id="lblStudentGender" for="selectStudentGender">Пол ученика (обращение):</label>
          <select id="selectStudentGender">
            <option value="auto">Определить самому</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>
        <div style="flex: 1;">
          <label id="lblNativeLang" for="selectNativeLang">Язык объяснений:</label>
          <select id="selectNativeLang">
            <option value="ru">Русский</option>
            <option value="uk">Українська</option>
            <option value="auto">Автоопределение</option>
          </select>
        </div>
      </div>

      <div style="display: flex; gap: 10px;">
        <div style="flex: 1;">
          <label id="lblLevelLabel" for="selectLevel">Ваш уровень:</label>
          <select id="selectLevel">
            <option value="auto">Определить по памяти</option>
            <option value="A0">С нуля (A0)</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
          </select>
        </div>
        <div style="flex: 1;">
          <label id="lblMinutes" for="selectMinutes">Длина урока:</label>
          <select id="selectMinutes">
            <option value="10">10 минут</option>
            <option value="15">15 минут</option>
            <option value="20">20 минут</option>
          </select>
        </div>
      </div>

      <label id="lblAudioMode" for="selectAudioMode">Аудио-режим:</label>
      <select id="selectAudioMode">
        <option value="auto">Авто (наушники / динамик)</option>
        <option value="half">Динамик (микрофон ждёт)</option>
        <option value="full">Наушники (можно перебивать)</option>
      </select>

      <label id="lblStrict" for="selectStrict">Проверка вашего произношения:</label>
      <select id="selectStrict">
        <option value="strict">Строгая</option>
        <option value="normal">Мягкая</option>
      </select>

      <label id="lblVad" for="selectVad">Пауза перед ответом репетитора:</label>
      <select id="selectVad">
        <option value="default">Стандартная</option>
        <option value="patient">Терпеливая</option>
        <option value="very">Очень терпеливая</option>
      </select>

      <label id="lblCaptions" for="selectCaptions">Текст реплик (субтитры):</label>
      <select id="selectCaptions">
        <option value="off">Выключены</option>
        <option value="on">Показывать</option>
      </select>

      <label id="lblVibration" for="selectVibration">Вибрация:</label>
      <select id="selectVibration">
        <option value="on">Включена</option>
        <option value="off">Выключена</option>
      </select>

      <label id="lblModelLabel" for="selectModel">Модель Gemini Live:</label>
      <select id="selectModel"></select>
      <div class="hint" id="hintText">Если урок не стартует с ошибкой «модель недоступна» — выберите другую модель. «Определить самому» — пол ученика определяется по имени и речи.</div>

      <button class="btn-save" id="btnSaveKey">Сохранить настройки</button>
      <button type="button" class="btn-backup" id="btnInstallApp" style="display: none;" onclick="installApp()">📲 Установить как приложение</button>

      <div class="mem-info" id="memInfo"></div>

      <div style="display: flex; gap: 10px; margin-top: 2px;">
        <button type="button" class="btn-backup" id="btnExportMemory" style="flex: 1; font-size: 0.8rem;">📥 Экспорт (JSON)</button>
        <button type="button" class="btn-backup" id="btnImportMemory" style="flex: 1; font-size: 0.8rem; background: #0d9488;">📤 Импорт (JSON)</button>
      </div>
      <input type="file" id="inputImportFile" accept=".json" style="display: none;">

      <button class="btn-reset-current" id="btnUndoMemory">↩ Откатить последнее сохранение памяти</button>
      <button class="btn-reset-current" id="btnResetCurrentLang">Сбросить память текущего языка</button>
      <button class="btn-reset-all" id="btnResetAllMemory">Сбросить всю память (все языки)</button>
      <button class="btn-close" id="btnCloseModal">Закрыть</button>
      <div style="font-size: 0.75rem; color: #64748b; text-align: center; margin-top: 4px;"><span class="js-version"></span> • Natural Turn Taking &amp; Cumulative Spaced Repetition</div>
    </div>
  </div>

  <script>
  'use strict';

  /* ==========================================================================
     AI Language Tutor v3.18.0  (монолит, без сборки)
     v3.18.0: подключены manifest/service worker/иконки (PWA), исправлен импорт (форма затирала импортированные настройки),
     проверка записи памяти, восстановление микрофона, уровень и длина урока, напоминание о резервной копии, доступность.
     Изменения относительно v3.16.0 — см. отчёт аудита. Главное:
       • сессия >15 мин больше не обрывается (contextWindowCompression + sessionResumption + авто-переподключение)
       • «Данные сохранены» говорится только если они реально сохранены; есть откат памяти
       • исправлены гонки (async onmessage, двойной proceedToSave/completeCleanup, смена языка посреди урока)
       • исправлен RMS в AudioWorklet, детектор гарнитуры, реальное прерывание кнопкой ✋
     ========================================================================== */

  const APP_VERSION = '3.25.0';

    const I18N = {
  "uk": {
    "settingsTitle": "Налаштування",
    "lblKey": "API ключ Google AI Studio:",
    "lblKeyMode": "Зберігання ключа:",
    "optLocal": "На цьому пристрої",
    "optSession": "Лише на сесію",
    "lblTarget": "Мова вивчення:",
    "lblVoice": "Голос репетитора:",
    "optFemale": "Жіночий",
    "optMale": "Чоловічий",
    "lblGender": "Стать учня:",
    "optAutoGen": "Визначити авто",
    "lblNative": "Мова пояснень:",
    "optAutoNat": "Автовизначення",
    "lblUiLang": "Мова інтерфейсу:",
    "lblAudio": "Аудіо-режим:",
    "optAutoAud": "Авто (Навушники / Динамік)",
    "optHalf": "Динамік (мікрофон чекає)",
    "optFull": "Навушники (можна перебивати)",
    "lblStrict": "Перевірка вимови:",
    "optStrict": "Сувора",
    "optSoft": "М'яка",
    "lblVad": "Пауза перед відповіддю:",
    "optDef": "Стандартна",
    "optPat": "Терпляча",
    "optVery": "Дуже терпляча",
    "lblCap": "Субтитри:",
    "optOff": "Вимкнено",
    "optOn": "Увімкнено",
    "lblModel": "Модель Gemini Live:",
    "btnSave": "Зберегти налаштування",
    "btnExp": "📥 Експорт (JSON)",
    "btnImp": "📤 Імпорт (JSON)",
    "btnUndo": "↩ Відкотити пам'ять",
    "btnRstCur": "Скинути поточну мову",
    "btnRstAll": "Скинути ВСЮ пам'ять",
    "btnClose": "Закрити",
    "btnStart": "Почати урок",
    "btnStop": "Завершити урок",
    "btnInterrupt": "Перебити / Досить ✋",
    "btnTurn": "Я все сказав ➔",
    "turnHint": "Репетитор відповість сам після паузи, або натисніть кнопку",
    "stList": "Слухаю вас...",
    "stSpeak": "Репетитор говорить...",
    "stThink": "Готує відповідь...",
    "stTurn": "Ваша черга говорити...",
    "stConn": "З’єднання...",
    "stReconn": "Відновлення зв’язку...",
    "stSave": "Збереження...",
    "stFin": "Репетитор договорює...",
    "msgGetUrl": "Де взяти ключ (безкоштовно)",
    "msgInterrupted": "Репліку перервано (почуто шум/голос)",
    "msgTimeDone": "Час вичерпано. Завершення...",
    "hintText": "Якщо урок не стартує — виберіть іншу модель.",
    "memTemplate": "Пам'ять «{lang}»: {lKb} КБ • загальна: {gKb} КБ • локально",
    "prog1": "Розминка 1–5",
    "prog2": "Практика 6–10",
    "prog3": "Закріплення 11–15",
    "profAct": "Профіль активний",
    "profNew": "Новий курс",
    "audAuto": "авто",
    "audHead": "Навушники",
    "audSpeak": "Динамік",
    "msgAskKey": "Натисніть ⚙ і вставте ключ API",
    "hintIos": "iPhone/iPad: відкрийте в Safari → «Поділитися» → «На екран Домашній».",
    "hintInApp": "Щоб встановити додаток, відкрийте посилання у звичайному браузері (Chrome).",
    "lblLevel": "Ваш рівень:",
    "optLvAuto": "За пам'яттю",
    "optLvA0": "З нуля (A0)",
    "lblMinutes": "Тривалість уроку:",
    "optMin": "{n} хв",
    "btnInstall": "📲 Встановити як додаток",
    "unitMin": "хв",
    "capYou": "Ви"
  },
  "ru": {
    "settingsTitle": "Настройки",
    "lblKey": "API ключ Google AI Studio:",
    "lblKeyMode": "Хранение ключа:",
    "optLocal": "На этом устройстве",
    "optSession": "Только на сессию",
    "lblTarget": "Изучаемый язык:",
    "lblVoice": "Голос репетитора:",
    "optFemale": "Женский",
    "optMale": "Мужской",
    "lblGender": "Пол ученика:",
    "optAutoGen": "Определить самому",
    "lblNative": "Язык объяснений:",
    "optAutoNat": "Автоопределение",
    "lblUiLang": "Язык интерфейса:",
    "lblAudio": "Аудио-режим:",
    "optAutoAud": "Авто (Наушники / Динамик)",
    "optHalf": "Динамик (микрофон ждет)",
    "optFull": "Наушники (перебивать)",
    "lblStrict": "Проверка произношения:",
    "optStrict": "Строгая",
    "optSoft": "Мягкая",
    "lblVad": "Пауза перед ответом:",
    "optDef": "Стандартная",
    "optPat": "Терпеливая",
    "optVery": "Очень терпеливая",
    "lblCap": "Субтитры:",
    "optOff": "Выключены",
    "optOn": "Включены",
    "lblModel": "Модель Gemini Live:",
    "btnSave": "Сохранить настройки",
    "btnExp": "📥 Экспорт (JSON)",
    "btnImp": "📤 Импорт (JSON)",
    "btnUndo": "↩ Откатить память",
    "btnRstCur": "Сбросить текущий язык",
    "btnRstAll": "Сбросить ВСЮ память",
    "btnClose": "Закрыть",
    "btnStart": "Начать урок",
    "btnStop": "Завершить урок",
    "btnInterrupt": "Перебить / Хватит ✋",
    "btnTurn": "Я всё сказал ➔",
    "turnHint": "Репетитор ответит сам после паузы, или нажмите кнопку",
    "stList": "Слушаю вас...",
    "stSpeak": "Репетитор говорит...",
    "stThink": "Готовит ответ...",
    "stTurn": "Ваша очередь говорить...",
    "stConn": "Соединение...",
    "stReconn": "Восстановление связи...",
    "stSave": "Сохранение...",
    "stFin": "Репетитор договаривает...",
    "msgGetUrl": "Где взять ключ (бесплатно)",
    "msgInterrupted": "Реплика прервана (услышан шум/голос)",
    "msgTimeDone": "Время истекло. Завершение...",
    "hintText": "Если урок не стартует — выберите другую модель.",
    "memTemplate": "Память «{lang}»: {lKb} КБ • общая: {gKb} КБ • локально",
    "prog1": "Разминка 1–5",
    "prog2": "Практика 6–10",
    "prog3": "Закрепление 11–15",
    "profAct": "Профиль активен",
    "profNew": "Новый курс",
    "audAuto": "авто",
    "audHead": "Наушники",
    "audSpeak": "Динамик",
    "msgAskKey": "Нажмите ⚙ и вставьте ключ API",
    "hintIos": "iPhone/iPad: откройте в Safari → «Поделиться» → «На экран Домой».",
    "hintInApp": "Чтобы установить приложение, откройте ссылку в обычном браузере (Chrome).",
    "lblLevel": "Ваш уровень:",
    "optLvAuto": "По памяти",
    "optLvA0": "С нуля (A0)",
    "lblMinutes": "Длина урока:",
    "optMin": "{n} мин",
    "btnInstall": "📲 Установить как приложение",
    "unitMin": "мин",
    "capYou": "Вы"
  },
  "en": {
    "settingsTitle": "Settings",
    "lblKey": "Google AI Studio API Key:",
    "lblKeyMode": "Key storage:",
    "optLocal": "On this device",
    "optSession": "Session only",
    "lblTarget": "Target language:",
    "lblVoice": "Tutor voice:",
    "optFemale": "Female",
    "optMale": "Male",
    "lblGender": "Student gender:",
    "optAutoGen": "Auto-detect",
    "lblNative": "Explanation lang:",
    "optAutoNat": "Auto-detect",
    "lblUiLang": "Interface lang:",
    "lblAudio": "Audio mode:",
    "optAutoAud": "Auto (Headset/Speaker)",
    "optHalf": "Speaker (mic waits)",
    "optFull": "Headset (can interrupt)",
    "lblStrict": "Pronunciation check:",
    "optStrict": "Strict",
    "optSoft": "Soft",
    "lblVad": "Pause before answer:",
    "optDef": "Standard",
    "optPat": "Patient",
    "optVery": "Very patient",
    "lblCap": "Subtitles:",
    "optOff": "Off",
    "optOn": "On",
    "lblModel": "Gemini Live Model:",
    "btnSave": "Save settings",
    "btnExp": "📥 Export (JSON)",
    "btnImp": "📤 Import (JSON)",
    "btnUndo": "↩ Undo memory",
    "btnRstCur": "Reset current lang",
    "btnRstAll": "Reset ALL memory",
    "btnClose": "Close",
    "btnStart": "Start lesson",
    "btnStop": "End lesson",
    "btnInterrupt": "Interrupt ✋",
    "btnTurn": "I am done ➔",
    "turnHint": "The tutor answers automatically after a pause, or tap the button",
    "stList": "Listening...",
    "stSpeak": "Tutor speaking...",
    "stThink": "Thinking...",
    "stTurn": "Your turn to speak...",
    "stConn": "Connecting...",
    "stReconn": "Reconnecting...",
    "stSave": "Saving...",
    "stFin": "Finishing...",
    "msgGetUrl": "Get API key (Free)",
    "msgInterrupted": "Interrupted (noise/voice detected)",
    "msgTimeDone": "Time is up. Finishing...",
    "hintText": "If lesson fails to start, choose another model.",
    "memTemplate": "Memory \"{lang}\": {lKb} KB • global: {gKb} KB • local",
    "prog1": "Warm-up 1–5",
    "prog2": "Practice 6–10",
    "prog3": "Review 11–15",
    "profAct": "Profile active",
    "profNew": "New course",
    "audAuto": "auto",
    "audHead": "Headset",
    "audSpeak": "Speaker",
    "msgAskKey": "Click ⚙ and paste API key",
    "hintIos": "iPhone/iPad: open in Safari → \"Share\" → \"Add to Home Screen\".",
    "hintInApp": "To install the app, open this link in a standard browser (Chrome).",
    "lblLevel": "Your level:",
    "optLvAuto": "From memory",
    "optLvA0": "Beginner (A0)",
    "lblMinutes": "Lesson length:",
    "optMin": "{n} min",
    "btnInstall": "📲 Install as app",
    "unitMin": "min",
    "capYou": "You"
  }
};

    // MSG dict
    const MSG = {
  ru: {
    saved: 'Настройки сохранены.',
    keyEmpty: 'Настройки сохранены, но ключ API пустой — без него урок не начнётся.',
    keyOdd: 'Настройки сохранены. Ключ выглядит необычно: ключи Google AI Studio начинаются с «AIza».',
    storeFail: 'Не удалось записать настройки в браузер (приватный режим или нет места).',
    locked: 'Настройки доступны, когда урок завершён.',
    expDone: 'Резервная копия скачана (ключ API в неё не входит).',
    impBig: 'Файл слишком большой для резервной копии.',
    impConfirm: 'Импорт заменит текущую память теми данными, что есть в файле. Продолжить?',
    impDone: 'Память профиля импортирована из файла.',
    impBad: 'Ошибка чтения файла. Проверьте, что это резервная копия в формате JSON.',
    undoNone: 'Предыдущей версии памяти пока нет.',
    undoConfirm: 'Вернуть память к состоянию перед последним сохранением? Текущая версия станет «предыдущей».',
    undoDone: 'Память возвращена к предыдущей версии.',
    rstLangConfirm: 'Сбросить историю и прогресс для текущего языка?',
    rstLangDone: 'Прогресс текущего языка очищен (можно откатить кнопкой «Откатить память»).',
    rstAllConfirm: 'ВНИМАНИЕ: удалить ВСЕ данные профиля и прогресс по всем языкам?',
    rstAllDone: 'Весь профиль сброшен.',
    memShrunk: 'Память сохранена в безопасном режиме: новая запись была короче старой, поэтому она добавлена, а не заменила.',
    memWriteFail: 'Не удалось записать память в браузер (нет места или приватный режим). Сделайте экспорт в настройках ⚙.',
    backupChip: '💾 Сделайте резервную копию (⚙)',
    offline: 'Нет подключения к интернету. Урок требует связи с Google.',
    noNet: 'Нет интернета',
    micDenied: 'Доступ к микрофону запрещён. Разрешите его в настройках браузера и повторите.',
    micNotFound: 'Микрофон не найден. Подключите микрофон и повторите.',
    micBusy: 'Микрофон занят другим приложением. Закройте его и повторите.',
    micFail: 'Не удалось включить микрофон или звук.',
    micBack: 'Микрофон восстановлен.',
    micLost: 'Завершите урок и начните заново.',
    clAuth: 'Google не принял ключ API. Проверьте ключ в настройках ⚙.',
    clModel: 'Выбранная модель недоступна для вашего ключа. Выберите другую модель в настройках ⚙.',
    clQuota: 'Исчерпан лимит Google AI Studio (квота или оплата). Попробуйте позже.',
    clConn: 'Не удалось установить соединение. Проверьте интернет и ключ API.',
    clGeneric: 'Соединение закрыто сервером{reason}',
    finSaved: 'Урок и прогресс сохранены.',
    finDone: 'Урок завершён.',
    finLostBeforeSave: 'Связь оборвалась до сохранения. Итоги урока записать не удалось.',
    finLost: 'Связь с сервером потеряна. Итоги этого урока сохранить не удалось.',
    finTimeout: 'Репетитор не вернул итоги урока вовремя. Урок засчитан, но слова и ошибки этого занятия не сохранились.',
    finNoConn: 'Связи нет — итоги урока сохранить не удалось.',
    finishing: 'Завершение реплики...',
    installed: 'Готово: значок «AI Tutor» появился на экране. Запускайте программу оттуда.',
    startHint: 'Нажмите «Начать урок» для старта',
    noKeyStatus: 'Нажмите ⚙ и вставьте ключ Google AI Studio, затем «Начать урок»',
    noKeyToast: 'Сначала вставьте ключ Google AI Studio в настройках ⚙',
    audioInit: 'Инициализация звука...'
  },
  uk: {
    saved: 'Налаштування збережено.',
    keyEmpty: 'Налаштування збережено, але ключ API порожній — без нього урок не почнеться.',
    keyOdd: 'Налаштування збережено. Ключ виглядає незвично: ключі Google AI Studio починаються з «AIza».',
    storeFail: 'Не вдалося записати налаштування в браузер (приватний режим або немає місця).',
    locked: 'Налаштування доступні, коли урок завершено.',
    expDone: 'Резервну копію завантажено (ключ API до неї не входить).',
    impBig: 'Файл завеликий для резервної копії.',
    impConfirm: 'Імпорт замінить поточну пам\'ять даними з файлу. Продовжити?',
    impDone: 'Пам\'ять профілю імпортовано з файлу.',
    impBad: 'Помилка читання файлу. Перевірте, що це резервна копія у форматі JSON.',
    undoNone: 'Попередньої версії пам\'яті поки немає.',
    undoConfirm: 'Повернути пам\'ять до стану перед останнім збереженням? Поточна версія стане «попередньою».',
    undoDone: 'Пам\'ять повернуто до попередньої версії.',
    rstLangConfirm: 'Скинути історію та прогрес для поточної мови?',
    rstLangDone: 'Прогрес поточної мови очищено (можна відкотити кнопкою «Відкотити пам\'ять»).',
    rstAllConfirm: 'УВАГА: видалити ВСІ дані профілю та прогрес за всіма мовами?',
    rstAllDone: 'Увесь профіль скинуто.',
    memShrunk: 'Пам\'ять збережено в безпечному режимі: новий запис був коротший за старий, тому його додано, а не замінено.',
    memWriteFail: 'Не вдалося записати пам\'ять у браузер (немає місця або приватний режим). Зробіть експорт у налаштуваннях ⚙.',
    backupChip: '💾 Зробіть резервну копію (⚙)',
    offline: 'Немає підключення до інтернету. Урок потребує зв\'язку з Google.',
    noNet: 'Немає інтернету',
    micDenied: 'Доступ до мікрофона заборонено. Дозвольте його в налаштуваннях браузера та повторіть.',
    micNotFound: 'Мікрофон не знайдено. Підключіть мікрофон і повторіть.',
    micBusy: 'Мікрофон зайнятий іншою програмою. Закрийте її та повторіть.',
    micFail: 'Не вдалося увімкнути мікрофон або звук.',
    micBack: 'Мікрофон відновлено.',
    micLost: 'Завершіть урок і почніть заново.',
    clAuth: 'Google не прийняв ключ API. Перевірте ключ у налаштуваннях ⚙.',
    clModel: 'Обрана модель недоступна для вашого ключа. Виберіть іншу модель у налаштуваннях ⚙.',
    clQuota: 'Вичерпано ліміт Google AI Studio (квота або оплата). Спробуйте пізніше.',
    clConn: 'Не вдалося встановити з\'єднання. Перевірте інтернет і ключ API.',
    clGeneric: 'З\'єднання закрито сервером{reason}',
    finSaved: 'Урок і прогрес збережено.',
    finDone: 'Урок завершено.',
    finLostBeforeSave: 'Зв\'язок обірвався до збереження. Підсумки уроку записати не вдалося.',
    finLost: 'Зв\'язок із сервером втрачено. Підсумки цього уроку зберегти не вдалося.',
    finTimeout: 'Репетитор не повернув підсумки уроку вчасно. Урок зараховано, але слова й помилки цього заняття не збереглися.',
    finNoConn: 'Зв\'язку немає — підсумки уроку зберегти не вдалося.',
    finishing: 'Завершення репліки...',
    installed: 'Готово: значок «AI Tutor» з\'явився на екрані. Запускайте програму звідти.',
    startHint: 'Натисніть «Почати урок» для старту',
    noKeyStatus: 'Натисніть ⚙ і вставте ключ Google AI Studio, потім «Почати урок»',
    noKeyToast: 'Спочатку вставте ключ Google AI Studio в налаштуваннях ⚙',
    audioInit: 'Ініціалізація звуку...'
  },
  en: {
    saved: 'Settings saved.',
    keyEmpty: 'Settings saved, but the API key is empty — the lesson cannot start without it.',
    keyOdd: 'Settings saved. The key looks unusual: Google AI Studio keys start with "AIza".',
    storeFail: 'Could not write settings to the browser (private mode or no space).',
    locked: 'Settings are available when the lesson is finished.',
    expDone: 'Backup downloaded (the API key is not included).',
    impBig: 'The file is too large for a backup.',
    impConfirm: 'Import will replace the current memory with the data from the file. Continue?',
    impDone: 'Profile memory imported from the file.',
    impBad: 'Could not read the file. Make sure it is a JSON backup.',
    undoNone: 'There is no previous version of the memory yet.',
    undoConfirm: 'Restore the memory to its state before the last save? The current version will become the "previous" one.',
    undoDone: 'Memory restored to the previous version.',
    rstLangConfirm: 'Reset history and progress for the current language?',
    rstLangDone: 'Progress for the current language cleared (you can undo with the "Undo memory" button).',
    rstAllConfirm: 'WARNING: delete ALL profile data and progress for all languages?',
    rstAllDone: 'The whole profile has been reset.',
    memShrunk: 'Memory saved in safe mode: the new record was shorter than the old one, so it was appended instead of replacing it.',
    memWriteFail: 'Could not write memory to the browser (no space or private mode). Make an export in settings ⚙.',
    backupChip: '💾 Make a backup (⚙)',
    offline: 'No internet connection. The lesson needs a connection to Google.',
    noNet: 'No internet',
    micDenied: 'Microphone access denied. Allow it in the browser settings and try again.',
    micNotFound: 'Microphone not found. Connect a microphone and try again.',
    micBusy: 'The microphone is used by another app. Close it and try again.',
    micFail: 'Could not turn on the microphone or sound.',
    micBack: 'Microphone restored.',
    micLost: 'End the lesson and start again.',
    clAuth: 'Google rejected the API key. Check the key in settings ⚙.',
    clModel: 'The selected model is not available for your key. Choose another model in settings ⚙.',
    clQuota: 'Google AI Studio limit reached (quota or billing). Try again later.',
    clConn: 'Could not establish a connection. Check your internet and API key.',
    clGeneric: 'Connection closed by the server{reason}',
    finSaved: 'Lesson and progress saved.',
    finDone: 'Lesson finished.',
    finLostBeforeSave: 'The connection dropped before saving. The lesson summary could not be recorded.',
    finLost: 'Connection to the server lost. The summary of this lesson could not be saved.',
    finTimeout: 'The tutor did not return the lesson summary in time. The lesson is counted, but the words and mistakes of this session were not saved.',
    finNoConn: 'No connection — the lesson summary could not be saved.',
    finishing: 'Finishing the reply...',
    installed: 'Done: the "AI Tutor" icon is now on your screen. Launch the app from there.',
    startHint: 'Press "Start lesson" to begin',
    noKeyStatus: 'Press ⚙ and paste your Google AI Studio key, then "Start lesson"',
    noKeyToast: 'First paste your Google AI Studio key in settings ⚙',
    audioInit: 'Initializing sound...'
  }
};

    Object.assign(I18N.ru, { lblUserName: "Ваше имя:",  lblVib: 'Вибрация:', optVibOn: 'Включена', optVibOff: 'Выключена', blk1: 'Блок 1 • Разминка и новые фразы', blk2: 'Блок 2 • Практика и диалоги', blk3: 'Блок 3 • Закрепление и итоги', statNone: 'Уроков пока нет — начнём? 🙂', statStreak: '🔥 Серия: {n} дн.', statMin: '⏱ {n} мин' });
    Object.assign(I18N.uk, { lblUserName: "Ваше ім'я:",  lblVib: 'Вібрація:', optVibOn: 'Увімкнена', optVibOff: 'Вимкнена', blk1: 'Блок 1 • Розминка та нові фрази', blk2: 'Блок 2 • Практика та діалоги', blk3: 'Блок 3 • Закріплення та підсумки', statNone: 'Уроків поки немає — почнемо? 🙂', statStreak: '🔥 Серія: {n} дн.', statMin: '⏱ {n} хв' });
    Object.assign(I18N.en, { lblUserName: "Your name:",  lblVib: 'Vibration:', optVibOn: 'On', optVibOff: 'Off', blk1: 'Block 1 • Warm-up and new phrases', blk2: 'Block 2 • Practice and dialogues', blk3: 'Block 3 • Review and summary', statNone: 'No lessons yet — shall we start? 🙂', statStreak: '🔥 Streak: {n} d.', statMin: '⏱ {n} min' });

    function t(key, params = {}) {
      const l = cfg.uiLang || 'ru';
      let dict = I18N[l] || I18N.en;
      let text = dict[key];
      if (!text && MSG[l]) text = MSG[l][key];
      if (!text) { dict = I18N.en; text = dict[key] || (MSG.en ? MSG.en[key] : key); }
      if (!text) return key;
      for (const [k, v] of Object.entries(params)) text = text.replace('{'+k+'}', v);
      return text;
    }
    
    
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const btn = $('btnInstallApp');
      if(btn) btn.style.display = 'block';
    });
    function installApp() {
      if(deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
             $('btnInstallApp').style.display = 'none';
          }
          deferredPrompt = null;
        });
      }
    }

    function langDisp(k) { return cfg.uiLang === 'ru' ? LANGS[k].ru : LANGS[k].label; }

    function updateInterface() {
      const setText = (id, key, params) => { const el = $(id); if (el) el.textContent = t(key, params); };
      document.documentElement.lang = cfg.uiLang;

      setText('btnEndTurn', 'btnTurn');
      setText('turnHint', 'turnHint');
      setText('btnInterrupt', 'btnInterrupt');
      setText('btnSaveKey', 'btnSave');
      setText('btnExportMemory', 'btnExp');
      setText('btnImportMemory', 'btnImp');
      setText('btnUndoMemory', 'btnUndo');
      setText('btnResetCurrentLang', 'btnRstCur');
      setText('btnResetAllMemory', 'btnRstAll');
      setText('btnCloseModal', 'btnClose');
      setText('btnInstallApp', 'btnInstall');
      if (btnAction && !isFinalizing) btnAction.textContent = isSessionActive ? t('btnStop') : t('btnStart');

      const setOpts = (id, keys) => {
        const sel = $(id);
        if (!sel) return;
        Array.from(sel.options).forEach((opt, idx) => { if (keys[idx]) opt.textContent = t(keys[idx]); });
      };
      setOpts('selectStorageMode', ['optLocal', 'optSession']);
      setOpts('selectTeacher', ['optFemale', 'optMale']);
      setOpts('selectStudentGender', ['optAutoGen', 'optMale', 'optFemale']);
      setOpts('selectNativeLang', [null, null, 'optAutoNat']);
      setOpts('selectAudioMode', ['optAutoAud', 'optHalf', 'optFull']);
      setOpts('selectStrict', ['optStrict', 'optSoft']);
      setOpts('selectVad', ['optDef', 'optPat', 'optVery']);
      setOpts('selectCaptions', ['optOff', 'optOn']);
      setOpts('selectVibration', ['optVibOn', 'optVibOff']);
      setOpts('selectLevel', ['optLvAuto', 'optLvA0']);
      if (selectMinutes) Array.from(selectMinutes.options).forEach(opt => { opt.textContent = t('optMin', { n: opt.value }); });
      if (selectLanguage) Array.from(selectLanguage.options).forEach(opt => { opt.textContent = langDisp(opt.value); });

      setText('lblKey', 'lblKey');
      setText('lblUiLang', 'lblUiLang');
      setText('lblUserName', 'lblUserName');
      setText('lblStorageMode', 'lblKeyMode');
      setText('lblTargetLang', 'lblTarget');
      setText('lblTeacherVoice', 'lblVoice');
      setText('lblStudentGender', 'lblGender');
      setText('lblNativeLang', 'lblNative');
      setText('lblLevelLabel', 'lblLevel');
      setText('lblAudioMode', 'lblAudio');
      setText('lblStrict', 'lblStrict');
      setText('lblVad', 'lblVad');
      setText('lblCaptions', 'lblCap');
      setText('lblVibration', 'lblVib');
      setText('lblModelLabel', 'lblModel');
      setText('lblMinutes', 'lblMinutes');
      setText('settingsTitle', 'settingsTitle');
      setText('msgGetUrl', 'msgGetUrl');
      setText('hintText', 'hintText');
      const bs = $('btnSettings');
      if (bs) { bs.title = t('settingsTitle'); bs.setAttribute('aria-label', t('settingsTitle')); }

      if (!isSessionActive && !isFinalizing) setStatus(getStoredApiKey() ? t('startHint') : t('noKeyStatus'));
    }

  const MAX_RECONNECT = 3;
  const WS_BASE = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';

  const MODELS = [
    { id: 'gemini-2.5-flash-native-audio-latest', label: 'Gemini 2.5 Native Audio' },
    { id: 'gemini-2.5-flash-native-audio-preview-12-2025', label: 'Gemini 2.5 · фиксированная' },
    { id: 'gemini-3.8-live', label: 'Gemini 3.8 Live (новая)' }
  ];

  // Названия разделов памяти — единый источник (раньше в трёх местах писались по-разному)
  const SEC_LOG = '[ЖУРНАЛ УРОКОВ]';
  const SEC_VOC = '[НАКОПИТЕЛЬНЫЙ СЛОВАРЬ]';
  const SEC_ERR = '[БАНК ОШИБОК И ЗАКРЕПЛЕНИЯ]';
  const SEC_NEXT = '[СОГЛАСОВАННАЯ ТЕМА СЛЕДУЮЩЕГО УРОКА]';

  const LANGS = {
    french: {
      ru: 'Французский', label: 'Français', gen: 'французского', adv: 'по-французски', hello: 'Bonjour', emoji: '🥖',
      teachers: { female: { full: 'Камилла (Camille)', short: 'Camille' }, male: { full: 'Лоран (Laurent)', short: 'Laurent' } },
      photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=75',
      bg: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1280&q=70',
      grad: 'linear-gradient(160deg,#0f172a,#1e3a5f)'
    },
    english: {
      ru: 'Английский', label: 'English', gen: 'английского', adv: 'по-английски', hello: 'Hello', emoji: '☂️',
      teachers: { female: { full: 'Эмма (Emma)', short: 'Emma' }, male: { full: 'Артур (Arthur)', short: 'Arthur' } },
      photo: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=75',
      bg: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=1280&q=70',
      grad: 'linear-gradient(160deg,#0f172a,#3b1d3f)'
    },
    spanish: {
      ru: 'Испанский', label: 'Español', gen: 'испанского', adv: 'по-испански', hello: '¡Hola', emoji: '💃',
      teachers: { female: { full: 'Кармен (Carmen)', short: 'Carmen' }, male: { full: 'Диего (Diego)', short: 'Diego' } },
      photo: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=400&q=75',
      bg: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1280&q=70',
      grad: 'linear-gradient(160deg,#0f172a,#4a2a14)'
    }
  };

  /* ---------- Безопасное хранилище (Safari private mode и переполнение квоты не должны ронять приложение) ---------- */
  const store = {
    get(k, d = '') { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    remove(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const sstore = {
    get(k, d = '') { try { const v = sessionStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, v); return true; } catch (e) { return false; } },
    remove(k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  function readJSON(k, d) { try { const v = JSON.parse(store.get(k, '')); return v === null || v === undefined ? d : v; } catch (e) { return d; } }
  function getStoredApiKey() { return sstore.get('gemini_api_key') || store.get('gemini_api_key') || ''; }

  /* ---------- Настройки ---------- */
  const cfg = {
    keyMode: store.get('api_storage_mode', 'local'),
    teacher: store.get('teacher_gender', 'female'),
    student: store.get('student_gender', 'auto'),
    lang: store.get('target_language', 'french'),
    native: store.get('native_lang', 'ru'),
    audio: store.get('audio_mode', 'auto'),
    model: store.get('model_id', MODELS[0].id),
    vad: store.get('vad_mode', 'default'),
    captions: store.get('captions', 'off'),
    strict: store.get('strict_mode', 'strict'),
    level: store.get('level_hint', 'auto'),
    minutes: parseInt(store.get('lesson_minutes', '15'), 10) || 15,
    uiLang: store.get('ui_lang', 'ru'),
    userName: store.get('user_name', ''),
    vibration: store.get('vibration', 'on')
  };
  if (!['ru', 'uk', 'en'].includes(cfg.uiLang)) cfg.uiLang = 'ru';
  if (!['on', 'off'].includes(cfg.vibration)) cfg.vibration = 'on';
  if (!LANGS[cfg.lang]) cfg.lang = 'french';
  if (!MODELS.some(m => m.id === cfg.model)) cfg.model = MODELS[0].id;
  if (![10, 15, 20].includes(cfg.minutes)) cfg.minutes = 15;
  if (!['auto', 'A0', 'A1', 'A2', 'B1', 'B2'].includes(cfg.level)) cfg.level = 'auto';
  let apiKey = getStoredApiKey();

  /* ---------- Элементы ---------- */
  const $ = id => document.getElementById(id);
  const btnAction = $('btnAction'), btnEndTurn = $('btnEndTurn'), btnInterrupt = $('btnInterrupt'), turnHint = $('turnHint');
  const statusText = $('statusText'), avatarCard = $('avatarCard'), avatarHalo = $('avatarHalo');
  const profileBadge = $('profileBadge'), timerBadge = $('timerBadge'), progressPill = $('progressPill');
  const headerTitle = $('headerTitle'), modalSettings = $('modalSettings'), statsRow = $('statsRow');
  const captionsBox = $('captions'), capUser = $('capUser'), capTutor = $('capTutor');
  const landmarkImage = $('landmarkImage'), avatarEmoji = $('avatarEmoji');
  const inputApiKey = $('inputApiKey'), selectStorageMode = $('selectStorageMode'), selectTeacher = $('selectTeacher');
  const selectStudentGender = $('selectStudentGender'), selectLanguage = $('selectLanguage'), selectNativeLang = $('selectNativeLang'), selectUiLang = $('selectUiLang'), selectVibration = $('selectVibration');
  const selectAudioMode = $('selectAudioMode'), selectVad = $('selectVad'), selectStrict = $('selectStrict'), selectCaptions = $('selectCaptions'), selectModel = $('selectModel');
  const memInfo = $('memInfo');
  const inputImportFile = $('inputImportFile');
  const selectLevel = $('selectLevel'), selectMinutes = $('selectMinutes');
  document.querySelectorAll('.js-version').forEach(el => { el.textContent = 'v' + APP_VERSION; });

  Object.keys(LANGS).forEach(k => {
    const o = document.createElement('option'); o.value = k; o.textContent = LANGS[k].ru; selectLanguage.appendChild(o);
  });
  MODELS.forEach(m => {
    const o = document.createElement('option'); o.value = m.id; o.textContent = m.label; selectModel.appendChild(o);
  });

  /* ---------- Тексты статусов (ru / uk) ---------- */
  const STR = {
    listening: ['Слушаю вас...', 'Слухаю вас...'],
    speaking: ['Репетитор говорит...', 'Репетитор говорить...'],
    thinking: ['Репетитор готовит ответ...', 'Репетитор готує відповідь...'],
    yourTurn: ['Ваша очередь говорить...', 'Ваша черга говорити...'],
    connecting: ['Соединение с сервером...', 'З’єднання із сервером...'],
    reconnecting: ['Связь прервалась, восстанавливаю...', 'Зв’язок перервано, відновлюю...'],
    saving: ['Сохранение прогресса...', 'Збереження прогресу...'],
    finishing: ['Репетитор договаривает...', 'Репетитор договорює...']
  };
  const ST_KEYS = { listening: 'stList', speaking: 'stSpeak', thinking: 'stThink', yourTurn: 'stTurn', connecting: 'stConn', reconnecting: 'stReconn', saving: 'stSave', finishing: 'stFin' };
  const st = k => t(ST_KEYS[k] || k);   // язык статусов = язык ИНТЕРФЕЙСА (раньше зависел от «языка объяснений»)
  function vibrate(pattern) {
    if (cfg.vibration !== 'off' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  function setStatus(text) { statusText.textContent = text; }

  let toastTimer = null;
  function toast(msg, ms = 3400) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms);
  }

  /* ---------- Память ---------- */
  const EMPTY_MEM = ['Чистый лист.', 'Чистий аркуш.', 'Чистый лист (урок 1).'];
  const isEmptyMem = s => !s || s.trim() === '' || EMPTY_MEM.includes(s.trim());
  const memKey = l => `memory_${l}`;
  const getGlobalMem = () => store.get('global_memory', '');
  const getLangMem = (l = cfg.lang) => store.get(memKey(l), '');
  // локальная дата (toISOString давал UTC — вечером в Европе это «вчера»)
  const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

  // Защита от «усыхания»: если модель вернула память заметно короче старой — ничего не теряем, а дописываем.
  function guardShrink(oldText, newText) {
    const o = (oldText || '').trim();
    if (o.length > 300 && newText.length < o.length * 0.6) {
      return { text: o + `\n\n[ДОПОЛНЕНИЕ ${todayStr()}]: ` + newText, shrunk: true };
    }
    return { text: newText, shrunk: false };
  }

  // v3.18.0: запись проверяется. Раньше при нехватке места/приватном режиме приложение всё равно говорило «прогресс сохранён».
  function putWithRetry(k, v) { return store.set(k, v) || (store.remove(k + '__prev'), store.set(k, v)); }

  function commitMemory(args, lang) {
    const g = typeof args.global_memory === 'string' ? args.global_memory.trim() : '';
    const l = typeof args.lang_memory === 'string' ? args.lang_memory.trim() : '';
    let shrunk = false, writeFailed = false;
    if (g) {
      const old = getGlobalMem();
      store.set('global_memory__prev', old);
      const r = guardShrink(old, g); shrunk = shrunk || r.shrunk;
      if (!putWithRetry('global_memory', r.text)) writeFailed = true;
    }
    if (l) {
      const old = getLangMem(lang);
      store.set(memKey(lang) + '__prev', old);
      const r = guardShrink(old, l); shrunk = shrunk || r.shrunk;
      if (!putWithRetry(memKey(lang), r.text)) writeFailed = true;
    }
    if (writeFailed) toast(t('memWriteFail'), 8000);
    else if (shrunk) toast(t('memShrunk'), 6000);
    return l.length > 0 && !writeFailed;
  }

  /* ---------- Статистика уроков (считает приложение, а не ИИ) ---------- */
  const dayKey = d => { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`; };
  function computeStats() {
    const arr = readJSON('lesson_log', []);
    const lessonsLang = arr.filter(x => x.l === cfg.lang).length;
    const minutes = Math.round(arr.reduce((a, x) => a + (x.s || 0), 0) / 60);
    const days = new Set(arr.map(x => dayKey(x.t)));
    let streak = 0;
    const d = new Date();
    if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
    while (days.has(dayKey(d))) { streak++; d.setDate(d.getDate() - 1); }
    return { total: arr.length, lessonsLang, minutes, streak };
  }
  function renderStats() {
    if (isSessionActive) { statsRow.style.display = 'none'; return; }
    const s = computeStats();
    statsRow.style.display = 'flex';
    if (s.total === 0) { statsRow.innerHTML = '<span class="stat-chip">' + t('statNone') + '</span>'; return; }
    statsRow.innerHTML =
      `<span class="stat-chip">${t('statStreak', { n: s.streak })}</span>` +
      `<span class="stat-chip">📚 ${langDisp(cfg.lang)}: ${s.lessonsLang}</span>` +
      `<span class="stat-chip">${t('statMin', { n: s.minutes })}</span>`;
  }

  /* ---------- Прочие переменные состояния ---------- */
  let socket = null;
  let audioContext = null, mediaStream = null, sourceNode = null, lpFilter1 = null, lpFilter2 = null, dummyGain = null, audioWorkletNode = null;
  let playbackContext = null, playbackGain = null, analyser = null, analyserBuf = null;
  let scheduledPlayTime = 0;
  let wakeLock = null;

  let isSessionActive = false, isSetupComplete = false, isBotSpeaking = false, isServerTurnActive = false;
  let isExtractingMemory = false, isWaitingForResponse = false, isTimeWarningPending = false, isTimeWarningSent = false;
  let isFinalizing = false, isStopping = false;
  let lessonStarted = false, memoryCommitted = false, lessonLogged = false, finishScheduled = false;
  let suppressIncomingAudio = false, interruptedPending = false, receivedAudioThisTurn = false;
  let saveNudges = 0, reconnectAttempts = 0, resumeHandle = null;
  let sessionId = 0, sessionLang = 'french', sessionGlobalMem = '', sessionLangMem = '', sessionSystemText = '';
  let lessonStartedAtReal = 0, lessonEndsAt = 0;

  let botSpeechDrainTimeout = null, watchdogTimer = null, saveTimeoutId = null, connectTimer = null, reconnectTimer = null, suppressTimer = null;
  let lessonTimerInterval = null, levelRaf = 0;
  let activeAudioSources = [];
  let isHeadsetConnected = false, headsetChecked = false;
  let micLevel = 0, haloLevel = 0;
  let captionNewTurn = true;
  let lastAudioChunkAt = 0, stuckInterval = null;

  /* ---------- UI ---------- */
  function updateAudioChip() {
    const mode = currentAudioMode();
    let chip;
    if (cfg.audio === 'auto' && !headsetChecked) chip = '🎧/🔈 ' + t('audAuto');
    else chip = mode === 'full' ? '🎧 ' + t('audHead') : '🔈 ' + t('audSpeak');
    return chip;
  }

  function updateUI() {
    const L = LANGS[cfg.lang];
    const hasProgress = !isEmptyMem(getLangMem());
    profileBadge.textContent = (hasProgress ? t('profAct') : t('profNew')) + ' • ' + updateAudioChip();
    headerTitle.textContent = `${L.teachers[cfg.teacher].short} • ${L.label}`;

    avatarEmoji.textContent = L.emoji;
    if (L.photo) {
      avatarEmoji.style.display = 'none';
      landmarkImage.style.display = 'block';
      if (landmarkImage.getAttribute('src') !== L.photo) landmarkImage.src = L.photo;
    } else {
      landmarkImage.style.display = 'none';
      avatarEmoji.style.display = 'flex';
    }
    document.body.style.backgroundImage = L.bg
      ? `linear-gradient(rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.98)), url('${L.bg}')`
      : L.grad;
    renderStats();
  }
  landmarkImage.onerror = () => { landmarkImage.style.display = 'none'; avatarEmoji.style.display = 'flex'; };

  function currentAudioMode() { return cfg.audio === 'auto' ? (isHeadsetConnected ? 'full' : 'half') : cfg.audio; }

  function kb(s) { return (new Blob([s || '']).size / 1024).toFixed(1); }
  function refreshMemInfo() {
    memInfo.textContent = t('memTemplate', { lang: langDisp(cfg.lang), lKb: kb(getLangMem()), gKb: kb(getGlobalMem()) });
  }

  function syncSettingsForm() {
    selectStorageMode.value = cfg.keyMode; selectTeacher.value = cfg.teacher; selectStudentGender.value = cfg.student;
    selectLanguage.value = cfg.lang; selectNativeLang.value = cfg.native; selectAudioMode.value = cfg.audio;
    selectVad.value = cfg.vad; selectStrict.value = cfg.strict; selectCaptions.value = cfg.captions; if($('selectVibration')) $('selectVibration').value = cfg.vibration; if($('selectUiLang')) $('selectUiLang').value = cfg.uiLang; if($('inputUserName')) $('inputUserName').value = cfg.userName || ''; selectModel.value = cfg.model;
    selectLevel.value = cfg.level; selectMinutes.value = String(cfg.minutes);
  }

  function openSettings() {
    if (isSessionActive || isFinalizing) { toast(t('locked')); return; }
    inputApiKey.value = apiKey;
    syncSettingsForm();
    updateInterface();
    refreshMemInfo();
    modalSettings.style.display = 'flex';
  }
  if (selectUiLang) {
    selectUiLang.onchange = () => {
      cfg.uiLang = selectUiLang.value;
      store.set('ui_lang', cfg.uiLang);
      updateInterface();
      updateUI();
      refreshMemInfo();
    };
  }
  const closeSettings = () => { modalSettings.style.display = 'none'; };
  $('btnSettings').onclick = openSettings;
  $('btnCloseModal').onclick = closeSettings;
  modalSettings.addEventListener('click', e => { if (e.target === modalSettings) closeSettings(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalSettings.style.display === 'flex') closeSettings(); });

  $('btnSaveKey').onclick = () => {
    apiKey = inputApiKey.value.trim();
    cfg.keyMode = selectStorageMode.value; cfg.teacher = selectTeacher.value; cfg.student = selectStudentGender.value;
    cfg.lang = selectLanguage.value; cfg.native = selectNativeLang.value; cfg.audio = selectAudioMode.value;
    cfg.vad = selectVad.value; cfg.strict = selectStrict.value; cfg.captions = selectCaptions.value; if($('selectVibration')) cfg.vibration = $('selectVibration').value; if($('selectUiLang')) cfg.uiLang = $('selectUiLang').value; updateInterface(); if($('btnInstallApp')) $('btnInstallApp').textContent = t('btnInstall'); cfg.model = selectModel.value;
    cfg.level = selectLevel.value; cfg.minutes = parseInt(selectMinutes.value, 10) || 15; if($('inputUserName')) cfg.userName = $('inputUserName').value.trim();

    let ok = store.set('api_storage_mode', cfg.keyMode);
    if (cfg.keyMode === 'local') { ok = store.set('gemini_api_key', apiKey) && ok; sstore.remove('gemini_api_key'); }
    else { sstore.set('gemini_api_key', apiKey); store.remove('gemini_api_key'); }
    store.set('teacher_gender', cfg.teacher); store.set('student_gender', cfg.student); store.set('target_language', cfg.lang);
    store.set('native_lang', cfg.native); store.set('audio_mode', cfg.audio); store.set('model_id', cfg.model);
    store.set('vad_mode', cfg.vad); store.set('captions', cfg.captions); store.set('strict_mode', cfg.strict);
    store.set('level_hint', cfg.level); store.set('lesson_minutes', String(cfg.minutes));
    store.set('ui_lang', cfg.uiLang); store.set('vibration', cfg.vibration); store.set('user_name', cfg.userName);

    updateUI();
    closeSettings();
    if (!ok) toast(t('storeFail'), 5000);
    else if (!apiKey) toast(t('keyEmpty'), 5000);
    else toast(t('saved'));
  };

  /* ---------- Экспорт / импорт ---------- */
  $('btnExportMemory').onclick = () => {
    const data = {
      version: APP_VERSION,
      exportDate: new Date().toISOString(),
      global_memory: getGlobalMem(),
      teacher_gender: cfg.teacher, student_gender: cfg.student, native_lang: cfg.native, target_language: cfg.lang,
      audio_mode: cfg.audio, vad_mode: cfg.vad, captions: cfg.captions, strict_mode: cfg.strict,
      level_hint: cfg.level, lesson_minutes: cfg.minutes, ui_lang: cfg.uiLang, user_name: cfg.userName, vibration: cfg.vibration,
      lesson_log: readJSON('lesson_log', [])
    };
    Object.keys(LANGS).forEach(l => { data[memKey(l)] = getLangMem(l); });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `ai_tutor_backup_${todayStr()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    store.set('last_backup', String(Date.now()));
    renderStats();
    toast(t('expDone'));
  };

  $('btnImportMemory').onclick = () => { inputImportFile.value = ''; inputImportFile.click(); };

  inputImportFile.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast(t('impBig')); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('bad format');
        if (!confirm(t('impConfirm'))) return;
        const putStr = (k, v) => { if (typeof v === 'string') { const old = store.get(k, ''); if (old) store.set(k + '__prev', old); store.set(k, v); } };
        putStr('global_memory', data.global_memory);
        Object.keys(LANGS).forEach(l => putStr(memKey(l), data[memKey(l)]));
        if (['male', 'female'].includes(data.teacher_gender)) { cfg.teacher = data.teacher_gender; store.set('teacher_gender', cfg.teacher); }
        if (['auto', 'male', 'female'].includes(data.student_gender)) { cfg.student = data.student_gender; store.set('student_gender', cfg.student); }
        if (['ru', 'uk', 'auto'].includes(data.native_lang)) { cfg.native = data.native_lang; store.set('native_lang', cfg.native); }
        if (LANGS[data.target_language]) { cfg.lang = data.target_language; store.set('target_language', cfg.lang); }
        if (['auto', 'half', 'full'].includes(data.audio_mode)) { cfg.audio = data.audio_mode; store.set('audio_mode', cfg.audio); }
        if (['default', 'patient', 'very'].includes(data.vad_mode)) { cfg.vad = data.vad_mode; store.set('vad_mode', cfg.vad); }
        if (['off', 'on'].includes(data.captions)) { cfg.captions = data.captions; store.set('captions', cfg.captions); }
        if (['strict', 'normal'].includes(data.strict_mode)) { cfg.strict = data.strict_mode; store.set('strict_mode', cfg.strict); }
        if (['auto', 'A0', 'A1', 'A2', 'B1', 'B2'].includes(data.level_hint)) { cfg.level = data.level_hint; store.set('level_hint', cfg.level); }
        if ([10, 15, 20].includes(data.lesson_minutes)) { cfg.minutes = data.lesson_minutes; store.set('lesson_minutes', String(cfg.minutes)); }
        if (['ru', 'uk', 'en'].includes(data.ui_lang)) { cfg.uiLang = data.ui_lang; store.set('ui_lang', cfg.uiLang); }
        if (['on', 'off'].includes(data.vibration)) { cfg.vibration = data.vibration; store.set('vibration', cfg.vibration); }
        if (typeof data.user_name === 'string') { cfg.userName = data.user_name; store.set('user_name', cfg.userName); }
        if (Array.isArray(data.lesson_log)) {
          store.set('lesson_log', JSON.stringify(data.lesson_log.filter(x => x && typeof x.t === 'number').slice(-500)));
        }
        syncSettingsForm();   // иначе в открытой форме остаются старые значения, и кнопка «Сохранить» затёрла бы импортированные
        updateUI(); refreshMemInfo();
        toast(t('impDone'));
      } catch (err) {
        toast(t('impBad'), 5000);
      }
    };
    reader.readAsText(file);
  };

  $('btnUndoMemory').onclick = () => {
    const kLang = memKey(cfg.lang);   // откат затрагивает текущий язык и общую базу о жизни
    const prevLang = store.get(kLang + '__prev', null), prevGlobal = store.get('global_memory__prev', null);
    if (prevLang === null && prevGlobal === null) { toast(t('undoNone')); return; }
    if (!confirm(t('undoConfirm'))) return;
    if (prevLang !== null) { const cur = getLangMem(); store.set(kLang, prevLang); store.set(kLang + '__prev', cur); }
    if (prevGlobal !== null) { const cur = getGlobalMem(); store.set('global_memory', prevGlobal); store.set('global_memory__prev', cur); }
    updateUI(); refreshMemInfo();
    toast(t('undoDone'));
  };

  $('btnResetCurrentLang').onclick = () => {
    if (!confirm(t('rstLangConfirm'))) return;
    const k = memKey(cfg.lang);
    const old = store.get(k, ''); if (old) store.set(k + '__prev', old);
    store.remove(k);

    // Удаляем уроки текущего языка из журнала статистики
    const log = readJSON('lesson_log', []).filter(x => x && x.l !== cfg.lang);
    store.set('lesson_log', JSON.stringify(log));

    // Если по другим языкам уроков нет — очищаем и общую память о жизни, чтобы начать курс с чистого листа
    if (log.length === 0) {
      const og = getGlobalMem(); if (og) store.set('global_memory__prev', og);
      store.remove('global_memory');
    }

    updateUI(); refreshMemInfo(); closeSettings();
    toast(t('rstLangDone'));
  };

  $('btnResetAllMemory').onclick = () => {
    if (!confirm(t('rstAllConfirm'))) return;
    Object.keys(LANGS).forEach(l => { const k = memKey(l); const old = store.get(k, ''); if (old) store.set(k + '__prev', old); store.remove(k); });
    const og = getGlobalMem(); if (og) store.set('global_memory__prev', og);
    store.remove('global_memory');
    store.remove('lesson_log');   // Полный сброс журнала уроков и статистики

    updateUI(); refreshMemInfo(); closeSettings();
    toast(t('rstAllDone'));
  };

  /* ==========================================================================
     Системный промпт (методика сохранена; правки — только где был логический конфликт, см. отчёт)
     ========================================================================== */
  function detectGenderFromName(name) {
    if (!name || typeof name !== 'string') return null;
    const n = name.trim().toLowerCase();
    const maleNames = ['сергей', 'sergey', 'sergei', 'александр', 'alexander', 'алексей', 'alexey', 'андрей', 'andrey', 'антон', 'артем', 'артём', 'борис', 'вадим', 'валентин', 'валерий', 'василий', 'виктор', 'виталий', 'владимир', 'владислав', 'вячеслав', 'геннадий', 'георгий', 'глеб', 'григорий', 'даниил', 'данил', 'денис', 'дмитрий', 'dmitry', 'евгений', 'егор', 'иван', 'ivan', 'игорь', 'илья', 'кирилл', 'константин', 'лев', 'леонид', 'максим', 'maxim', 'матвей', 'михаил', 'mikhail', 'никита', 'николай', 'олег', 'павел', 'петр', 'пётр', 'роман', 'руслан', 'семен', 'семён', 'станислав', 'степан', 'тимофей', 'тимур', 'федор', 'фёдор', 'юрий', 'ярослав'];
    const femaleNames = ['анна', 'anna', 'елена', 'elena', 'мария', 'maria', 'ольга', 'olga', 'татьяна', 'tatyana', 'наталья', 'наталия', 'natalia', 'ирина', 'irina', 'светлана', 'екатерина', 'юлия', 'алена', 'алёна', 'дарья', 'даша', 'виктория', 'полина', 'анастасия', 'ксения', 'надежда', 'любовь', 'вера', 'марина', 'евгения', 'александра'];
    for (const m of maleNames) { if (n.includes(m)) return 'male'; }
    for (const f of femaleNames) { if (n.includes(f)) return 'female'; }
    return null;
  }

  function getSystemInstruction(lang, globalMem, langMem) {
    const L = LANGS[lang];
    const male = cfg.teacher === 'male';
    const tName = L.teachers[cfg.teacher].full;
    const tRole = male ? 'эмпатичный и теплый преподаватель' : 'эмпатичная и теплая преподавательница';
    const langName = L.gen, langAdverb = L.adv;
    const OB = male ? 'ОБЯЗАН' : 'ОБЯЗАНА';
    const ob = male ? 'обязан' : 'обязана';
    const RADA = male ? 'рад' : 'рада';
    const SAM = male ? 'сам' : 'сама';

    let effectiveGender = cfg.student;
    if (effectiveGender === 'auto') {
      const fromUserName = detectGenderFromName(cfg.userName);
      const fromGlobalMem = detectGenderFromName(globalMem);
      effectiveGender = fromUserName || fromGlobalMem || 'auto';
    }

    let genderDirective = '';
    if (effectiveGender === 'male') {
      genderDirective = `ПОЛ УЧЕНИКА (ГРАММАТИЧЕСКИЙ РОД): Ученик — МУЖЧИНА (${cfg.userName ? 'имя: ' + cfg.userName : 'установлено'}).
Обращайся к нему ИСКЛЮЧИТЕЛЬНО в МУЖСКОМ роде («ты сказал», «ты понял», «ты повторил», «ты готов», «молодец, справился»)!
КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО обращаться в женском роде («ты сказала», «ты поняла», «ты сделала», «ты готова», «справилась»)! Это грубейшая ошибка!`;
    } else if (effectiveGender === 'female') {
      genderDirective = `ПОЛ УЧЕНИКА (ГРАММАТИЧЕСКИЙ РОД): Ученик — ЖЕНЩИНА (${cfg.userName ? 'имя: ' + cfg.userName : 'установлено'}).
Обращайся к ней ИСКЛЮЧИТЕЛЬНО в ЖЕНСКОМ роде («ты сказала», «ты поняла», «ты повторила», «ты готова», «молодец, справилась»).`;
    } else {
      genderDirective = `ПОЛ УЧЕНИКА (АВТООПРЕДЕЛЕНИЕ ПО ИМЕНИ И РЕЧИ):
1. ЕСЛИ УЧЕНИК НАЗВАЛ МУЖСКОЕ ИМЯ (Сергей, Александр, Алексей, Андрей, Антон, Артем, Денис, Дмитрий, Иван, Михаил, Максим, Николай, Роман и др.):
   - Он 100% МУЖЧИНА!
   - КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО обращаться к нему в женском роде («ты сказала», «ты поняла», «ты сделала», «ты готова», «справилась»)!
   - ВСЕ обращения ОБЯЗАНЫ быть СТРОГО в МУЖСКОМ роде: «ты сказал», «ты понял», «ты повторил», «ты готов», «молодец, справился»!
2. ЕСЛИ УЧЕНИК НАЗВАЛ ЖЕНСКОЕ ИМЯ (Анна, Елена, Мария, Ольга, Татьяна и др.):
   - Обращайся СТРОГО в женском роде: «ты сказала», «ты поняла», «ты готова», «молодец, справилась»!
3. Обязательно зафиксируй определенный пол в памяти при сохранении профиля!`;
    }

    const nameKnown = !isEmptyMem(globalMem);
    const langIsNew = isEmptyMem(langMem);
    const nameScenario = `1. ХОД 1 (ЗНАКОМСТВО): Тепло поздоровайся ${langAdverb} и задай ОДИН-ЕДИНСТВЕННЫЙ вопрос: как зовут ученика. Больше ничего не говори, не называй никаких имён и не предлагай фраз. Замолчи и жди ГОЛОСОВОГО ответа!
2. ХОД 2 (ИМЯ): Называть ученика по имени можно ТОЛЬКО если ты сам чётко УСЛЫШАЛ имя в его голосовом ответе. Если имя не прозвучало, было неразборчивым или ученик ответил не на вопрос — мягко переспроси («Как тебя зовут? Повтори, пожалуйста, имя») и снова замолчи. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать любые придуманные имена! Обращаться по имени разрешено ТОЛЬКО после того, как ученик сам четко назвал его в микрофон.
ВАЖНЕЙШЕЕ ПРАВИЛО СОГЛАСОВАНИЯ РОДА: Как только услышал имя (например, Сергей) — МГНОВЕННО определи пол (Сергей — МУЖЧИНА) и с этой же секунды обращайся СТРОГО в соответствующем роде (к мужчине — ТОЛЬКО: «ты сказал», «ты понял», «ты готов», женский род КАТЕГОРИЧЕСКИ ЗАПРЕЩЕН)!
Когда имя услышано — радостно отреагируй («Очень приятно, Сергей!») и задай ОДИН вопрос: ${langIsNew ? 'изучал ли ты этот язык раньше' : 'как у тебя дела или настроение (' + langAdverb + ', без перевода)'}. Замолчи и жди ответа.
3. ХОД 3: Выслушай ответ ${langIsNew ? 'и предложи ученику выбрать первую тему для изучения. Как только тема выбрана — СРАЗУ обучай первой новой фразе по «Главному алгоритму обучения» (смысл на родном -> ДВАЖДЫ медленно на иностранном -> «Повтори»)! КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО спрашивать ученика «как это сказать» на новую фразу!' : 'и дальше продолжай по сценарию повторных уроков'}.`;
    const newLangScenario = `1. ПЕРВЫЙ УРОК ЭТОГО ЯЗЫКА - ХОД 1: Радостно поздоровайся по имени из памяти и задай ОДИН вопрос: изучал(а) ли он(а) этот язык раньше. Замолчи и жди ГОЛОСОВОГО ответа!
2. ХОД 2: Выслушай ответ, живо отреагируй и предложи ученику выбрать первую тему для изучения. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО предлагать «вспомнить слова с прошлых уроков» — по этому языку их нет!`;
    const repeatScenario = `1. ПОВТОРНЫЕ УРОКИ - ХОД 1 (ТОЛЬКО ПРИВЕТСТВИЕ И SMALL TALK): Радостно поздоровайся по имени. Задай ТОЛЬКО ОДИН дружеский вопрос о делах/настроении ${langAdverb} БЕЗ перевода на русский/украинский. И СРАЗУ ЗАМОЛКНИ! Никаких проверок слов и тем уроков в этой реплике! Жди ответа!
2. ПОВТОРНЫЕ УРОКИ - ХОД 2 (АНАЛИЗ ОТВЕТА + СИГНАЛ ПЕРЕХОДА К ПОВТОРЕНИЮ + ВОПРОС 1): Внимательно выслушай, что ответил ученик. Живо и тепло отреагируй на его слова ${langAdverb} (например: «Здорово, я ${RADA}!»). ЗАТЕМ дай явный сигнал-мостик перехода на родном языке ученика: «Отлично! Перед новой темой давай разомнемся и вспомним пару слов, которые мы проходили на прошлых уроках». Выдержи небольшую тишину и задай ВОПРОС 1 (выбери слово или фразу не только из последнего урока, а распределенно из материала прошлых 2–3 занятий из [НАКОПИТЕЛЬНОГО СЛОВАРЯ] для интервального повторения) строго по методике проверки. И СРАЗУ ЗАМОЛКНИ!
3. ПОВТОРНЫЕ УРОКИ - ХОД 3 (АНАЛИЗ ОТВЕТА 1 + ВОПРОС 2): Проанализируй ответ ученика. Похвали или поправь (согласуя род с учеником). ЗАТЕМ задай ВОПРОС 2 (слово или конструкцию обязательно из [БАНКА ОШИБОК И ЗАКРЕПЛЕНИЯ] за прошлые занятия в обратном направлении проверки; если банк пуст — возьми слово из [НАКОПИТЕЛЬНОГО СЛОВАРЯ]). И СРАЗУ ЗАМОЛКНИ!
4. ПОВТОРНЫЕ УРОКИ - ХОД 4 (АНАЛИЗ ОТВЕТА 2 + МОСТИК К ТЕМЕ УРОКА): Оцени ответ. Сделай переход к теме: напомни тему, которую намечали ранее, или обязательно спроси ученика: «Или, может быть, у тебя есть свое пожелание, какую тему разберем сегодня?». Дождись выбора темы учеником!`;

    const startScenario = nameKnown
      ? (langIsNew ? newLangScenario : repeatScenario)
      : (langIsNew ? nameScenario : nameScenario + '\nПОСЛЕ ЗНАКОМСТВА ПРОДОЛЖАЙ ТАК:\n' + repeatScenario);

    const originalPrompt = `Ты — ${tName}, ${tRole} ${langName} языка. Твой голос — ${male ? 'приятный мужской' : 'мягкий женский'}.
Твоя главная черта — искреннее дружелюбие, теплота и естественность. Общайся как хороший друг, а не как строгий робот-учитель. Веди диалог плавно, реплика за репликой. НЕ задавай несколько вопросов подряд.

КОРНЕВЫЕ ПРАВИЛА ДИАЛОГА (ВАЖНЕЕ ВСЕХ ОСТАЛЬНЫХ ИНСТРУКЦИЙ):
1. ПРИНЦИП АКТИВНОГО СЛУШАНИЯ (ТЫ СЛУШАЕШЬ, А НЕ ЧИТАЕШЬ МОНОЛОГ):
Каждая твоя реплика ОБЯЗАНА быть прямым и живым ответом на то, ЧТО ТОЛЬКО ЧТО СКАЗАЛ УЧЕНИК. Запрещено игнорировать слова ученика и механически перескакивать на следующие фразы урока!
2. ОДНА РЕПЛИКА — ОДИН ВОПРОС ИЛИ ЗАДАНИЕ: Задав вопрос, ты ${OB} полностью замолчать и терпеливо ждать ответа ученика. Никогда не продолжай говорить ${SAM} после своего вопроса!
2. Об ученике ты знаешь ТОЛЬКО то, что написано в секретной памяти, и то, что он САМ сказал голосом. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО выдумывать имя, пол, возраст, профессию, город или ответы ученика. Имя тебе изначально неизвестно: обращаться по имени можно ТОЛЬКО после того, как ученик четко назвал его голосом в текущем уроке. Если ты не расслышал или ответ неразборчив — вежливо переспроси.
3. Каждая твоя следующая реплика строится ТОЛЬКО на том, что ученик действительно ответил на твой последний вопрос. Пока ответа на текущий вопрос нет — не переходи к следующему шагу сценария и не предлагай фразы для разучивания.
4. Сообщения в квадратных скобках — это служебные инструкции для тебя, а не слова ученика. Не озвучивай их и не принимай за ответ ученика.

${genderDirective}

СЕКРЕТНАЯ ПАМЯТЬ ОБ УЧЕНИКЕ (НЕ ОЗВУЧИВАЙ ЭТО, ИСПОЛЬЗУЙ ДЛЯ ДИАЛОГА):
[ИМЯ УЧЕНИКА ИЗ НАСТРОЕК]: ${cfg.userName ? cfg.userName : 'Ученик еще не назвал имя (спроси его на первом уроке)'}
[ОБЩИЕ ДАННЫЕ О ЖИЗНИ (КРОСС-ЯЗЫКОВАЯ БАЗА)]: ${globalMem || 'Пока ничего неизвестно.'}
[НАКОПИТЕЛЬНАЯ ПАМЯТЬ ЯЗЫКА (НЕ СТИРАТЬ, ИСПОЛЬЗОВАТЬ ДЛЯ ИНТЕРВАЛЬНОГО ПОВТОРЕНИЯ)]: ${langMem || 'Чистый лист (урок 1).'}

ПРАВИЛО ЯЗЫКА ПОЯСНЕНИЙ:
Язык пояснений определяет настройка приложения (см. «УТОЧНЕНИЕ НАСТРОЙКИ ЯЗЫКА» ниже). Только если настройка — автоопределение: когда ученик говорит на УКРАИНСКОМ — давай пояснения СТРОГО НА УКРАИНСКОМ, когда на русском — на русском.

ГЛАВНЫЙ АЛГОРИТМ ОБУЧЕНИЯ НОВЫМ ФРАЗАМ (АВТОРСКАЯ МЕТОДИКА — СТРОГИЙ ПОРЯДОК И ТЕМП):
КОГДА ТЫ ЗНАКОМИШЬ УЧЕНИКА С НОВОЙ ФРАЗОЙ ИЛИ СЛОВОМ:
КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО спрашивать ученика «как бы ты сказал?», «как это будет?», «переведи» на новую фразу! Ученик ЕЩЕ НЕ ЗНАЕТ новую фразу, он пришел её выучить!
Ты ${OB} САМ(А) дать эталон строго по трехшаговому алгоритму:
1. СНАЧАЛА скажи смысл фразы на РОДНОМ языке ученика (на русском/украинском):
   Пример: «Давай разучим полезную фразу: "Подскажите, пожалуйста, где находится вокзал?"».
2. ЗАТЕМ САМ(А) произнеси эту фразу на изучаемом языке (${langAdverb}) РОВНО ДВА РАЗА, НАМНОГО МЕДЛЕННЕЕ ОБЫЧНОГО ТЕМПА, чтобы ученик успел расслышать каждое слово. Между первым и вторым повтором ОБЯЗАТЕЛЬНО сделай паузу тишины в 2 секунды. Не части и не склеивай повторения в одну сплошную фразу! Ни в коем случае не произноси вслух служебные слова или подсказки!
3. В САМОМ КОНЦЕ скажи ученику команду: «Повтори» (или «Теперь ты») — И СРАЗУ ЗАМОЛКНИ!
Ученик ОБЯЗАН сначала услышать два медленных образца от тебя и затем повторить фразу.
КАТЕГОРИЧЕСКИЙ ЗАПРЕТ: Никогда не ставь перевод на русский язык в конец реплики перед повтором ученика! Последним звуком в ушах ученика должна звучать только речь ${langAdverb}!

АДАПТИВНОСТЬ:
Ученик устно управляет уроком. Просит меньше переводить — прекрати автоперевод. Просит разыграть сценку — играй роль.

ИСПРАВЛЕНИЕ ОШИБОК (ДЕТАЛЬНЫЙ АЛГОРИТМ И СБОРКА ВСЕЙ ФРАЗЫ):
Проверяй КАЖДЫЙ повтор ученика и останавливай его при каждой ошибке — не выборочно. Действуй строго по шагам:
1. Назови КОНКРЕТНОЕ СЛОВО, в котором ученик ошибся. Нельзя говорить просто «что-то не так» — ты ${OB} прямо указать: «Ты сделал ошибку в слове X».
2. Детально объясни, КАКАЯ ИМЕННО ОШИБКА была допущена (не тот звук, забыто окончание, неправильное ударение), и затем четко произнеси правильный вариант этого слова ${langAdverb}.
3. Попроси ученика повторить именно это проблемное слово командой «Повтори» (или «Теперь ты») — И СРАЗУ ЗАМОЛКНИ! КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО в этой же реплике продолжать речь или хвалить ученика! Твоя реплика ОБЯЗАНА закончиться словом «Повтори», после чего ты ${ob} молчать и ждать ответа ученика в следующем ходе.
4. Если ученик повторяет с ошибкой (2-я попытка и далее), снова объясни артикуляцию и попроси повторить еще раз (до 5 попыток).
5. Если после 5 попыток не получается произнести идеально, мягко скажи: «Ничего страшного, мы повторим это чуть-чуть позже» (внутренне зафиксируй это слово в памяти для будущих уроков, но технические термины «банк ошибок», «память», «база» вслух ученику КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО ПРОИЗНОСИТЬ!).
6. ОБЯЗАТЕЛЬНАЯ СБОРКА ВСЕЙ ФРАЗЫ ЦЕЛИКОМ (ФИНАЛЬНЫЙ ШАГ): Как только проблемное слово успешно отработано и произнесено правильно (или после 5 попыток), КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО сразу переходить к следующей фразе урока! Ты ${OB} вернуть ученика к исходной фразе: «Отлично! А теперь давай закрепим и повторим всю фразу целиком». Произнеси всю фразу на иностранном языке и скажи: «Повтори» — И СРАЗУ ЗАМОЛКНИ! Только после того как ученик повторит ВСЮ исходную фразу целиком вместе с исправленным словом, разрешено двигаться дальше по уроку!

ЛИЧНЫЕ ГРАНИЦЫ: Если ученик хамит или переводит тему на эротическо-интимные темы — настойчиво напомни ему о целях урока. При повторении 2-3 раза - откажись обсуждать.

СТРАНОВЕДЕНИЕ И КУЛЬТУРНЫЙ КОНТЕКСТ:
Органично вплетай в фразы и диалоги живые культурные и бытовые реалии страны изучаемого языка (для Франции — особенности этикета, регионов, привычек, кулинарии, транспорта; для Англии — вежливость, традиции общения; для Испании — открытость, дружелюбие и праздники).
Если ученик случайно упоминает свой город или увлечения — бережно зафиксируй это и сохрани в [ОБЩИЕ ДАННЫЕ О ЖИЗНИ]. Старые факты никогда не стирай, дополняй их новыми.

ЖЕЛЕЗНОЕ ПРАВИЛО ДИАЛОГА: ОДНА РЕПЛИКА — ОДИН ШАГ (КАТЕГОРИЧЕСКИЙ ЗАПРЕТ НА МОНОЛОГИ):
Ты ведешь живой диалог, а не читаешь лекцию! КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО вываливать несколько вопросов или действий в одной реплике! На каждый твой вопрос ученик ОБЯЗАН ответить, а ты ${OB} выслушать, проанализировать ответ, отреагировать на него и только потом делать следующий шаг.

ПОШАГОВЫЙ СЦЕНАРИЙ СТАРТА УРОКА (СТРОГО ПО ОЧЕРЕДИ ХОДОВ):
${startScenario}
ЗАВЕРШЕНИЕ УРОКА (ИТОГ И МОСТИК НА БУДУЩЕЕ): Наступает ТОЛЬКО при системной подсказке о финале времени (менее 2 мин). Действуй строго по шагам:
1) Задай 2 контрольных вопроса по сегодняшнему материалу двусторонней методикой.
2) Подведи короткий итог (что удалось освоить, а что нужно будет повторить в следующий раз).
3) Спроси пожелание ученика: «Какую тему разберем в следующий раз? Или мне подготовить план?», зафиксируй тему на будущее.
4) ОБЯЗАТЕЛЬНО ПРОИЗНЕСИ ГОЛОСОМ теплую фразу прощания на изучаемом языке (${langAdverb}) и родном языке («Отлично, договорились! До встречи на следующем уроке, au revoir!»).
КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО вызывать функцию saveStudentProfile ВМЕСТО фразы прощания! Сначала скажи прощание вслух, и только после этого (или по системной команде) сохраняй профиль.`;

    let settingLanguageDirective = '';
    if (cfg.native === 'ru') {
      settingLanguageDirective = `\nУТОЧНЕНИЕ НАСТРОЙКИ ЯЗЫКА: В настройках выбран РУССКИЙ ЯЗЫК. Все пояснения давай строго на русском языке.`;
    } else if (cfg.native === 'uk') {
      settingLanguageDirective = `\nУТОЧНЕННЯ НАЛАШТУВАННЯ МОВИ: У налаштуваннях обрано УКРАЇНСЬКУ МОВУ. Усі пояснення давай строго українською мовою.`;
    }

    const heard = male ? 'слышал' : 'слышала';
    const strictBlock = cfg.strict === 'strict'
      ? `ПРОВЕРКА ПОВТОРЕНИЯ УЧЕНИКА (ТЫ — ВНИМАТЕЛЬНЫЙ ЭКЗАМЕНАТОР, А НЕ ПОДДАКИВАТЕЛЬ):
1. После КАЖДОГО повтора ученика сначала молча сравни услышанное с эталоном по трём признакам: (а) набор слов — все ли слова на месте и именно те; (б) отдельные звуки — особенно те, что трудны для носителя русского/украинского (гласные, носовые, «р», межзубные, «h», двойные согласные и т.п.); (в) ударение, интонация и связывание слов. Только потом отвечай.
2. Исходи из того, что неточность есть, пока не убедился в обратном. Хвалить («отлично», «молодец», «правильно», «верно», «супер») можно ТОЛЬКО если все три признака совпали с эталоном. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО хвалить за старание, за «почти», за то, что ученик просто что-то сказал.
3. Если ученик пропустил или заменил слово, сказал не ту фразу, ответил на родном языке, промолчал или звук был неразборчив — это НЕ правильный повтор. Скажи об этом прямо и по-доброму («Я ${heard} вот так, а нужно вот так») и действуй по алгоритму исправления ошибок.
4. Даже когда повтор хороший, в похвале назови одну КОНКРЕТНУЮ удачную деталь (например, носовой звук или связывание) — это доказывает, что ты действительно слушал(а), а не соглашаешься по привычке.
5. Если не уверен(а), что расслышал(а) правильно, — НЕ хвали: попроси повторить ещё раз.`
      : `ПРОВЕРКА ПОВТОРЕНИЯ УЧЕНИКА: слушай повтор внимательно. Явные ошибки (не те слова, пропущенное слово, грубо искажённый звук) обязательно исправляй по алгоритму исправления ошибок. Хвалить можно только за то, что действительно получилось.`;

    const perBlock = Math.max(3, Math.round(cfg.minutes / 3));
    const totalPhrases = perBlock * 3;
    const levelBlock = cfg.level === 'auto' ? '' :
      `УРОВЕНЬ УЧЕНИКА (задан в настройках): ${cfg.level === 'A0' ? 'A0 — с нуля' : cfg.level}. Подбирай лексику, грамматику и скорость речи именно под этот уровень (для A0 начинай с самых простых бытовых фраз и говори медленнее). Если память о прошлых уроках противоречит — доверяй настройке.`;

    const additions = `

${settingLanguageDirective}

${strictBlock}

${levelBlock}

ТЕМП И ПОВТОРЕНИЕ НОВЫХ ФРАЗ:
Когда вводишь новую фразу для изучения, произноси её МЕДЛЕННО и чётко. Если ты повторяешь её дважды для закрепления, ОБЯЗАТЕЛЬНО делай длительную смысловую паузу (просто физически молчи 2-3 секунды) между первым и вторым произнесением. Дай ученику время осмыслить первую фразу! Не говори слитно и не тараторь.

ОБЪЕМ УРОКА — ${totalPhrases} ФРАЗ (СТРОЖАЙШИЙ ЗАПРЕТ НА РАННИЙ ФИНАЛ):
1. Пункт «3. ЗАВЕРШЕНИЕ УРОКА» наступает СТРОГО после изучения полноценного объема из ${totalPhrases} практических фраз и слов (3 блока по ${perBlock} фраз) ИЛИ при системной подсказке о финале времени — что наступит раньше!
2. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО говорить фразы вроде «это последнее слово», «на этом всё», «заканчиваем», пока не пройдены все ${totalPhrases} фраз или пока не поступит системная подсказка о финале времени!
3. СТРОЖАЙШИЙ ЗАПРЕТ НА ПОВТОРЕНИЕ: Категорически запрещено брать слова из [НАКОПИТЕЛЬНОГО СЛОВАРЯ] или слова, которые ТОЛЬКО ЧТО проверялись на разминке текущего урока, и преподавать их заново под видом новых!
4. ПРИНЦИП УГЛУБЛЕНИЯ ТЕМЫ: Если ученик изучает профессиональную или бытовую тему, запрещено топтаться на базовых существительных первого урока. Обучай СЛЕДУЮЩИМ, более глубоким жизненным фразам и действиям (например, не просто «гостиница/номер», а «забронировать номер на две ночи», «у нас сломался кондиционер», «во сколько завтрак», «можно продлить проживание на один день»).
5. Если разобран один блок из 3-5 слов по текущей ситуации — не останавливайся! СРАЗУ плавно переходи к следующей практической ситуации или теме. Урок длится полные ${cfg.minutes} минут!

ДВУСТОРОННЯЯ МЕТОДИКА ПРОВЕРКИ ПРОЙДЕННОГО МАТЕРИАЛА (ТОЛЬКО НА РАЗМИНКЕ И В ФИНАЛЕ):
ВНИМАНИЕ: Данная методика проверки применяется ИСКЛЮЧИТЕЛЬНО к тем словам, которые ученик УЖЕ ИЗУЧИЛ (на разминке в начале повторных уроков и в финале времени)!
КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО ПРИМЕНЯТЬ ЭТОТ РЕЖИМ К НОВЫМ ФРАЗАМ! Новую фразу ученик ЕЩЕ НЕ ЗНАЕТ, поэтому спрашивать его «как ты скажешь...?» на новую фразу СТРОЖАЙШЕ ЗАПРЕЩЕНО!
Только при проверке пройденных слов (и только при ней!) не подсказывай, а проверяй в двух направлениях:
- Направление 1 (С родного на иностранный): Задай вопрос на иностранном языке, а само слово скажи на РОДНОМ языке («Comment on dit: "счет, пожалуйста"?»), ученик должен САМ вспомнить и сказать его ${langAdverb}.
- Направление 2 (С иностранного на родной): Назови другое слово ${langAdverb}, а ученик должен перевести его на свой родной язык («А что означает слово ...?»).

СТРОЖАЙШИЙ ЗАПРЕТ НА САМООТВЕТ, ПОДСКАЗКИ И ПРЕДВОСХИЩЕНИЕ:
Задав проверочный вопрос (в Направлении 1 или 2) или попросив повторить фразу, ты ${OB} немедленно замолчать! Категорически запрещено в этой же реплике самой произносить ответ, перевод или озвучивать искомое слово на иностранном языке.
КРИТИЧЕСКИ ВАЖНО: Никогда не хвали ученика («Отлично!», «Правильно!»), пока он ДЕЙСТВИТЕЛЬНО не ответит голосом И ЕГО ОТВЕТ НЕ БУДЕТ ПРАВИЛЬНЫМ И ОТНОСИТЬСЯ К ТЕМЕ! Если ученик ответил невпопад, промолчал или сказал ерунду — это ОШИБКА, а не повод для похвалы. Мягко поправь его или уточни. Не выдумывай ответы за него, всегда дождись реального ответа!
Подсказать слово или разобрать правильный вариант разрешено ТОЛЬКО в следующем ходе и ТОЛЬКО в том случае, если ученик сам прямо скажет, что не помнит («не знаю», «не помню», «подскажи»).

ИНТЕРВАЛЬНОЕ ПОВТОРЕНИЕ ИЗ ПРОШЛЫХ УРОКОВ:
Слова для разминки и контрольной проверки бери распределенно: не только из предыдущего занятия, но и из материала 2–3 уроков назад и всего накопительного архива, чтобы закреплять изученное и не допускать забывания.

БАЗОВЫЕ ДЕЖУРНЫЕ ФРАЗЫ БЕЗ ДУБЛЯЖА:
Дежурные фразы общения («Привет», «Как дела?», «До скорого», «Очень хорошо») звучат ТОЛЬКО ${langAdverb} БЕЗ перевода на русский/украинский!

КРЕАТИВНОСТЬ И ЗАПРЕТ НА «КОФЕЙНЫЙ КРУГ»:
Запрещено зацикливаться на заказе кофе! Чередуй темы связными мини-курсами по несколько уроков: транспорт, покупка билетов, отель, аренда авто, врач, покупки, спорт, погода, а также системную грамматику (артикли, времена глаголов, множественное число).

КАТЕГОРИЧЕСКИЙ ЗАПРЕТ НА ОЗВУЧИВАНИЕ РЕМАРОК И МЕТА-СЛОВ:
Категорически запрещено произносить вслух технические названия и служебные термины: «банк ошибок», «банк повторения», «накопительная память», «профиль», «база данных», «пауза», «одна-две секунды», «секунд», «тишина», знаки препинания, кавычки или цитировать служебные инструкции! Слова «повтор» и «перевод» нельзя произносить как названия шагов методики, но саму команду ученику — «Повтори» или «Теперь ты» — говорить НУЖНО по алгоритму выше. Вместо служебных фраз говори простые человеческие слова: «Ничего страшного, мы повторим это чуть-чуть позже». Если требуется выдержать паузу — просто физически молчи. Твоя речь — это исключительно живые слова диалога.`;

    return originalPrompt + additions;
  }

  /* Все тексты «служебных» реплик собраны в функции (раньше дублировались по 2–3 раза) */
  function timeWarningText() {
    return cfg.native === 'uk'
      ? '[СИСТЕМНА ПІДКАЗКА: ЧАС УРОКУ ДОБІГАЄ КІНЦЯ (залишилося 2 хв). Завершуй урок: проведи перевірку 2 слів, підведи підсумок, узгодь тему на наступний раз і ОБОВ\'ЯЗКОВО виголоси вголос фразу прощання («До зустрічі на наступному уроці!»). НЕ викликай функцію збереження зараз — скажи прощання голосом!]'
      : '[СИСТЕМНАЯ ПОДСКАЗКА: ВРЕМЯ УРОКА ВЫХОДИТ (осталось 2 мин). Завершай урок: проведи проверку 2 слов, подведи итог, согласуй тему на следующий раз и ОБЯЗАТЕЛЬНО произнеси вслух фразу прощания («До встречи на следующем уроке!»). НЕ вызывай функцию сохранения сейчас — скажи прощание голосом!]';
  }

  function endTurnPromptText() {
    const male = cfg.teacher === 'male';
    const SAM = male ? 'сам' : 'сама';
    const minutesLeft = Math.max(0, Math.ceil(remainingSeconds() / 60));
    let genderHint;
    if (cfg.student === 'female') genderHint = cfg.native === 'uk' ? 'Звертайся у ЖІНОЧОМУ роді.' : 'Обращайся в ЖЕНСКОМ роде.';
    else if (cfg.student === 'male') genderHint = cfg.native === 'uk' ? 'Звертайся у ЧОЛОВІЧОМУ роді.' : 'Обращайся в МУЖСКОМ роде.';
    else genderHint = cfg.native === 'uk' ? 'Узгоджуй форми роду відповідно до статі учня з пам’яті/імені.' : 'Согласуй формы рода соответственно полу ученика из памяти/имени.';

    let text = cfg.native === 'uk'
      ? `[СИСТЕМНО: Залишилося ще ${minutesLeft} хв. Урок триває. УВАГА: Оціни та проаналізуй мою репліку! ${genderHint} Якщо виправляєш помилку: після відпрацювання слова ОБОВ'ЯЗКОВО попроси повторити ВСЮ фразу цілком! Якщо не вийшло — скажи: «ми повторимо це трохи пізніше» (НЕ використовуй слова «банк помилок»)! Якщо нова фраза — строго за правилом: 1) Зміст рідною мовою, 2) ДВІЧІ повільно іноземною мовою з тишею між ними, 3) Команда «Повтори» і мовчання! НЕ вимовляй слово «пауза»! ПРИ ПЕРЕВІРЦІ ЗНАНЬ: НЕ підказуй і НЕ кажи відповідь ${SAM}, доки я не скажу, що не пам'ятаю!]`
      : `[СИСТЕМНО: Осталось еще ${minutesLeft} мин. Урок идет. ВНИМАНИЕ: Оцени и проанализируй мою реплику! ${genderHint} Если исправляешь ошибку: после отработки слова ОБЯЗАТЕЛЬНО попроси повторить ВСЮ фразу целиком! Если не получилось — скажи: «мы повторим это чуть-чуть позже» (НЕ используй слова «банк ошибок»)! Если новая фраза — строго по правилу: 1) Смысл на родном языке, 2) ДВАЖДЫ медленно на изучаемом языке с тишиной между ними, 3) Команда «Повтори» и молчание! НЕ произноси слово «пауза»! ПРИ ПРОВЕРКЕ ЗНАНИЙ: НЕ подсказывай и НЕ говори ответ ${SAM}, пока я не скажу, что не помню!]`;

    if (cfg.strict === 'strict') {
      text += cfg.native === 'uk'
        ? ' [ПЕРЕВІР мій повтор суворо: якщо є хоч найменша неточність у словах, звуках чи наголосі — НЕ хвали, а виправ за алгоритмом.]'
        : ' [ПРОВЕРЬ мой повтор строго: если есть хоть малейшая неточность в словах, звуках или ударении — НЕ хвали, а исправь по алгоритму.]';
    }
    if (isTimeWarningPending && !isTimeWarningSent) {
      text += ' ' + timeWarningText();
      isTimeWarningSent = true;
      isTimeWarningPending = false;
    }
    return text;
  }

  function startPromptText() {
    const L = LANGS[sessionLang];
    const helloWord = L.hello;
    const adv = L.adv;
    const nameKnown = !!cfg.userName || !isEmptyMem(sessionGlobalMem);
    const langIsNew = isEmptyMem(sessionLangMem);
    const kind = !nameKnown ? 'name' : (langIsNew ? 'newLang' : 'repeat');
    const uk = cfg.native === 'uk';
    const autoNote = cfg.native === 'auto' ? ' Родной язык ученика (русский или украинский) определи по его ответу.' : '';

    if (uk) {
      if (kind === 'name') return `${helloWord}! [СЛУЖБОВА ІНСТРУКЦІЯ (це не слова учня), ХІД 1 — ЗНАЙОМСТВО: привітайся ${adv} і постав ЛИШЕ ОДНЕ запитання — як звати учня. Більше нічого не кажи, не називай жодних імен і не пропонуй фраз. Після запитання повністю замовкни і чекай ГОЛОСОВОЇ відповіді учня. Коли назве ім'я (наприклад, Сергій) — одразу узгодь чоловічий рід: «ти сказав», «ти зрозумів», жіночий рід заборонено!]`;
      if (kind === 'newLang') return `${helloWord}! [СЛУЖБОВА ІНСТРУКЦІЯ (це не слова учня), ХІД 1: тепло привітайся на ім'я з пам'яті і постав ЛИШЕ ОДНЕ запитання: чи вивчав він цю мову раніше. Не пропонуй фраз і тем у цій репліці. Потім повністю замовкни і чекай ГОЛОСОВОЇ відповіді.]`;
      return `${helloWord}! [СЛУЖБОВА ІНСТРУКЦІЯ (це не слова учня), ХІД 1: радісно привітайся на ім'я. Постав ЛИШЕ ОДНЕ запитання про справи чи настрій мовою вивчення БЕЗ перекладу. У цій репліці НЕ перевіряй слова й не оголошуй тем. Після запитання повністю замовкни і чекай ГОЛОСОВОЇ відповіді учня.]`;
    }
    if (kind === 'name') return `${helloWord}! [СЛУЖЕБНАЯ ИНСТРУКЦИЯ (это не слова ученика), ХОД 1 — ЗНАКОМСТВО: поздоровайся ${adv} и задай ТОЛЬКО ОДИН вопрос — как зовут ученика. Больше ничего не говори, не называй никаких имён и не предлагай фраз. После вопроса полностью замолчи и жди ГОЛОСОВОГО ответа ученика.${autoNote} Когда назовет имя (например, Сергей) — сразу согласуй мужской род: «ты сказал», «ты понял», женский род категорически запрещен!]`;
    if (kind === 'newLang') return `${helloWord}! [СЛУЖЕБНАЯ ИНСТРУКЦИЯ (это не слова ученика), ХОД 1: тепло поздоровайся по имени из памяти и задай ТОЛЬКО ОДИН вопрос: изучал ли ты этот язык раньше. Не предлагай фраз и тем в этой реплике. Затем полностью замолчи и жди ГОЛОСОВОГО ответа.${autoNote}]`;
    return `${helloWord}! [СЛУЖЕБНАЯ ИНСТРУКЦИЯ (это не слова ученика), ХОД 1: радостно поздоровайся по имени. Задай ТОЛЬКО ОДИН вопрос о делах или настроении на изучаемом языке БЕЗ перевода. В этой реплике НЕ проверяй слова и не объявляй тем. После вопроса полностью замолчи и жди ГОЛОСОВОГО ответа ученика.${autoNote}]`;
  }

  function memoryPromptText() {
    const langDirective = cfg.native === 'ru' ? 'Записи сделай на РУССКОМ языке.' : (cfg.native === 'uk' ? 'Записи зроби УКРАЇНСЬКОЮ мовою.' : '');
    return `[СИСТЕМНАЯ ДИРЕКТИВА: Урок завершен. Немедленно вызови функцию saveStudentProfile.
ВНИМАНИЕ: Твоя память — это ДВА НАКОПИТЕЛЬНЫХ АРХИВА (CUMULATIVE). КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО СТИРАТЬ или сокращать ранее сохраненные данные!
ОБЯЗАТЕЛЬНО ОБЪЕДИНИ старые данные с новыми:

1. global_memory (БАЗА ЖИЗНИ И ПРОФИЛЬ):
- Имя и установленный Пол ученика (грамматический род: мужской или женский).
- Все известные факты: профессия, семья, питомец, город, хобби, привычки.
- Если на сегодняшнем уроке стали известны НОВЫЕ факты — бережно добавь их, сохранив ВСЕ старые факты!

2. lang_memory (НАКОПИТЕЛЬНЫЙ АРХИВ ЯЗЫКА):
- ${SEC_LOG}: список всех тем всех прошедших уроков (добавь сегодняшний урок с темой).
- ${SEC_VOC}: полный список всех слов за все уроки (добавь сегодняшние новые слова).
- ${SEC_ERR}: слова/фразы/звуки, в которых ученик ошибся + неисправленные старые ошибки.
- ${SEC_NEXT}: тема, которую договорились разобрать в следующий раз.

${langDirective}
СТАРАЯ БАЗА О ЖИЗНИ: ${sessionGlobalMem || 'пусто'}
СТАРАЯ НАКОПИТЕЛЬНАЯ ПАМЯТЬ ЯЗЫКА: ${sessionLangMem || 'пусто'}
Вызови saveStudentProfile с полными объединенными данными. Голосом ничего не говори!]`;
  }

  /* ==========================================================================
     Аудио: вход (микрофон → AudioWorklet 16 кГц)
     ========================================================================== */
  const workletCode = `
    class PCMProcessor extends AudioWorkletProcessor {
      constructor() {
        super();
        this.targetSampleRate = 16000;
        this.bufferSize = 1024;
        this.pcmBuffer = new Int16Array(this.bufferSize);
        this.bufferIndex = 0;
        this.phase = 0;
        this.last = 0;
        this.sumSq = 0;   // накопитель RMS живёт между вызовами process() (раньше обнулялся каждый квант)
      }
      process(inputs) {
        const input = inputs[0];
        if (input && input.length > 0 && input[0].length > 0) {
          const ch = input[0];
          const len = ch.length;
          const ratio = sampleRate / this.targetSampleRate;
          while (this.phase < len) {
            const i = Math.floor(this.phase);
            const frac = this.phase - i;
            const s0 = i > 0 ? ch[i - 1] : this.last;   // линейная интерполяция вместо «ближайшего отсчёта»
            let s = s0 + (ch[i] - s0) * frac;
            s = s > 1 ? 1 : (s < -1 ? -1 : s);
            this.sumSq += s * s;
            this.pcmBuffer[this.bufferIndex++] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            if (this.bufferIndex >= this.bufferSize) {
              const rms = Math.sqrt(this.sumSq / this.bufferSize);
              const out = this.pcmBuffer.slice(0, this.bufferSize).buffer;
              this.port.postMessage({ pcm: out, rms: rms }, [out]);
              this.bufferIndex = 0;
              this.sumSq = 0;
            }
            this.phase += ratio;
          }
          this.phase -= len;
          this.last = ch[len - 1];
        }
        return true;
      }
    }
    registerProcessor('pcm-processor', PCMProcessor);
  `;

  async function requestWakeLock() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
  }
  function releaseWakeLock() {
    if (wakeLock) { try { wakeLock.release(); } catch (e) {} wakeLock = null; }
  }

  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && isSessionActive) {
      await requestWakeLock();
      if (playbackContext && playbackContext.state === 'suspended') { try { await playbackContext.resume(); } catch (e) {} }
      if (audioContext && audioContext.state === 'suspended') { try { await audioContext.resume(); } catch (e) {} }
      ensureMicAlive();
    }
  });

  // Не даём случайно закрыть вкладку посреди урока (прогресс урока ещё не записан)
  window.addEventListener('beforeunload', e => {
    if (isSessionActive) { e.preventDefault(); e.returnValue = ''; }
  });

  // Детектор гарнитуры. Раньше подстрока «ear» совпадала с «earpiece/Headset earpiece» (встроенный динамик телефона)
  // и «head» — с встроенными «Headphones» ноутбуков, из-за чего включался полный дуплекс на громкой связи (эхо, самоперебивание).
  async function detectHeadset() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const GOOD = /(bluetooth|airpods|buds|headphone|headset|наушник|гарнитур|beats|jabra|bose|wh-1000|wf-1000)/i;
      const BAD = /(earpiece|speakerphone|speaker|built-?in|internal|встроенн|динамик|разговорн)/i;
      if (devices.some(d => d.label)) {   // до выдачи разрешения на микрофон браузер скрывает названия устройств
        isHeadsetConnected = devices.some(d =>
          (d.kind === 'audiooutput' || d.kind === 'audioinput') && GOOD.test(d.label || '') && !BAD.test(d.label || ''));
        headsetChecked = true;
      }
    } catch (e) {}
    if (!isSessionActive) updateUI(); else profileBadge.textContent = profileBadge.textContent.split(' • ')[0] + ' • ' + updateAudioChip();
  }
  if (navigator.mediaDevices) navigator.mediaDevices.ondevicechange = detectHeadset;

  function bytesToBase64(bytes) {
    let binary = '';
    const CH = 0x8000;
    for (let i = 0; i < bytes.length; i += CH) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return window.btoa(binary);
  }

  function onMicChunk(event) {
    micLevel = event.data.rms;
    if (!isSessionActive || !isSetupComplete || !socket || socket.readyState !== WebSocket.OPEN) return;

    let allowTransmission = true;
    if (currentAudioMode() === 'half') {
      if (isBotSpeaking || isWaitingForResponse || isExtractingMemory) allowTransmission = false;
    } else if (isExtractingMemory) allowTransmission = false;

    if (allowTransmission && socket.bufferedAmount < 512 * 1024) {
      socket.send(JSON.stringify({
        realtimeInput: { mediaChunks: [{ mimeType: 'audio/pcm;rate=16000', data: bytesToBase64(new Uint8Array(event.data.pcm)) }] }
      }));
    }
  }

  async function initMicrophone() {
    if (!audioContext || audioContext.state === 'closed') audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') await audioContext.resume();

    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    });
    mediaStream.getAudioTracks().forEach(t => { t.onended = () => setTimeout(ensureMicAlive, 800); });
    await detectHeadset();

    if (!audioWorkletNode) {
      const blob = new Blob([workletCode], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(blob);
      try { await audioContext.audioWorklet.addModule(workletUrl); } finally { URL.revokeObjectURL(workletUrl); }
      audioWorkletNode = new AudioWorkletNode(audioContext, 'pcm-processor');
      dummyGain = audioContext.createGain();
      dummyGain.gain.value = 0;               // «тихий терминатор» против усыпления графа в Safari
      audioWorkletNode.connect(dummyGain);
      dummyGain.connect(audioContext.destination);
      audioWorkletNode.port.onmessage = onMicChunk;
    }

    [sourceNode, lpFilter1, lpFilter2].forEach(n => { if (n) { try { n.disconnect(); } catch (e) {} } });
    sourceNode = audioContext.createMediaStreamSource(mediaStream);
    // Антиалиасинг: два каскадных биквада (Баттерворт 4-го порядка) вместо одного 2-го порядка на 7.5 кГц
    lpFilter1 = audioContext.createBiquadFilter(); lpFilter1.type = 'lowpass'; lpFilter1.frequency.value = 7000; lpFilter1.Q.value = 0.5412;
    lpFilter2 = audioContext.createBiquadFilter(); lpFilter2.type = 'lowpass'; lpFilter2.frequency.value = 7000; lpFilter2.Q.value = 1.3065;
    sourceNode.connect(lpFilter1); lpFilter1.connect(lpFilter2); lpFilter2.connect(audioWorkletNode);
  }

  // v3.18.0: если микрофон «умер» посреди урока (звонок, отключили гарнитуру, свернули приложение) — пробуем включить заново
  let micRecovering = false;
  async function ensureMicAlive() {
    if (!isSessionActive || isFinalizing || micRecovering) return;
    const tr = mediaStream && mediaStream.getAudioTracks()[0];
    if (tr && tr.readyState === 'live') return;
    micRecovering = true;
    try {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      mediaStream = null;
      await initMicrophone();
      toast(t('micBack'));
    } catch (err) {
      toast(micErrorMessage(err) + ' ' + t('micLost'), 7000);
    } finally { micRecovering = false; }
  }

  /* ==========================================================================
     Аудио: выход (воспроизведение 24 кГц, jitter-буфер, пульсация нимба)
     ========================================================================== */
  function ensurePlayback() {
    if (playbackContext) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    try { playbackContext = new AC({ sampleRate: 24000 }); } catch (e) { playbackContext = new AC(); }
    playbackGain = playbackContext.createGain();
    analyser = playbackContext.createAnalyser();
    analyser.fftSize = 512;
    analyserBuf = new Uint8Array(analyser.fftSize);
    playbackGain.connect(analyser);
    analyser.connect(playbackContext.destination);
  }

  function playPcmChunk(base64Audio) {
    if (!playbackContext) return;
    const raw = window.atob(base64Audio);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

    const sampleCount = Math.floor(raw.length / 2);
    if (sampleCount === 0) return;
    const int16Array = new Int16Array(bytes.buffer, 0, sampleCount);
    const float32Array = new Float32Array(sampleCount);
    for (let i = 0; i < sampleCount; i++) float32Array[i] = int16Array[i] / 32768;

    const audioBuffer = playbackContext.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = playbackContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(playbackGain);

    const currentTime = playbackContext.currentTime;
    if (scheduledPlayTime < currentTime) scheduledPlayTime = currentTime + 0.12;   // jitter-буфер 120 мс
    source.start(scheduledPlayTime);
    scheduledPlayTime += audioBuffer.duration;

    activeAudioSources.push(source);
    source.onended = () => {
      activeAudioSources = activeAudioSources.filter(s => s !== source);
      checkBotSpeakingEnded();
    };
  }

  // Единственный «писатель» анимации нимба: речь репетитора (по выходному сигналу) или голос ученика (по микрофону)
  function levelLoop() {
    let target = 0;
    if (isBotSpeaking && analyser) {
      analyser.getByteTimeDomainData(analyserBuf);
      let s = 0;
      for (let i = 0; i < analyserBuf.length; i++) { const v = (analyserBuf[i] - 128) / 128; s += v * v; }
      target = Math.min(Math.sqrt(s / analyserBuf.length) * 4, 0.5);
    } else if (isSessionActive && isSetupComplete && !isWaitingForResponse && micLevel > 0.015) {
      target = Math.min(micLevel * 3, 0.45);
    }
    haloLevel += (target - haloLevel) * 0.35;
    avatarHalo.style.transform = `scale(${(1 + haloLevel).toFixed(3)})`;
    avatarHalo.style.opacity = String(Math.min(0.3 + haloLevel * 1.6, 1).toFixed(2));
    levelRaf = requestAnimationFrame(levelLoop);
  }
  function startLevelLoop() { if (!levelRaf) levelRaf = requestAnimationFrame(levelLoop); }
  function stopLevelLoop() {
    if (levelRaf) cancelAnimationFrame(levelRaf);
    levelRaf = 0; haloLevel = 0; micLevel = 0;
    avatarHalo.style.transform = 'scale(1)'; avatarHalo.style.opacity = '0.3';
  }

  function stopBotSpeech() {
    activeAudioSources.forEach(source => { try { source.stop(); } catch (e) {} });
    activeAudioSources = [];
    isBotSpeaking = false;
    isServerTurnActive = false;
    scheduledPlayTime = 0;
    avatarCard.classList.remove('speaking');
    btnInterrupt.style.display = 'none';
    if (botSpeechDrainTimeout) clearTimeout(botSpeechDrainTimeout);
  }

  function isAudioStillPlaying() {
    return activeAudioSources.length > 0 || isBotSpeaking || (playbackContext && scheduledPlayTime > playbackContext.currentTime);
  }

  // Ждёт, пока доиграет речь (максимум maxMs). Возвращает Promise, поэтому «дважды» уже не выполнится.
  function waitPlaybackDrain(maxMs) {
    return new Promise(resolve => {
      const t0 = performance.now();
      const iv = setInterval(() => {
        const done = activeAudioSources.length === 0 && !isServerTurnActive && (!playbackContext || playbackContext.currentTime >= scheduledPlayTime);
        if (done || performance.now() - t0 > maxMs) { clearInterval(iv); resolve(); }
      }, 150);
    });
  }

  // Страховка: сервер иногда не присылает turnComplete (или присылает с большой задержкой).
  // Если звук уже доиграл и новых порций нет — возвращаем слово ученику сами, иначе микрофон остаётся закрыт.
  function releaseBotIfStuck() {
    if (!isSessionActive || !isBotSpeaking) return;
    if (playbackContext && playbackContext.state === 'suspended') { try { playbackContext.resume(); } catch (e) {} return; }
    if (activeAudioSources.length > 0) return;
    if (playbackContext && playbackContext.currentTime < scheduledPlayTime) return;
    if (Date.now() - lastAudioChunkAt < 1800) return;
    isServerTurnActive = false;
    isBotSpeaking = false;
    avatarCard.classList.remove('speaking');
    btnInterrupt.style.display = 'none';

    if (lessonEndsAt && Date.now() >= lessonEndsAt && !isStopping && !isFinalizing) {
      clearInterval(lessonTimerInterval);
      setStatus(t('msgTimeDone'));
      stopSession(false);
      return;
    }

    if (!isWaitingForResponse && !isExtractingMemory && !isFinalizing) {
      btnEndTurn.style.display = 'block';
      if (turnHint) turnHint.style.display = 'block';
      setStatus(st('yourTurn'));
      vibrate([50, 50, 50]);
    }
    if (isTimeWarningPending && !isTimeWarningSent) sendAutomaticTimeWarning();
  }

  function checkBotSpeakingEnded() {
    if (isServerTurnActive) return;
    if (activeAudioSources.length === 0 && (!playbackContext || playbackContext.currentTime >= scheduledPlayTime)) {
      if (botSpeechDrainTimeout) clearTimeout(botSpeechDrainTimeout);
      botSpeechDrainTimeout = setTimeout(() => {   // акустический зазор 200 мс
        if (isServerTurnActive || activeAudioSources.length > 0) return;
        if (playbackContext && playbackContext.currentTime < scheduledPlayTime) return;
        if (isSessionActive) {
          isBotSpeaking = false;
          avatarCard.classList.remove('speaking');
          btnInterrupt.style.display = 'none';

          // Репетитор только что закончил свою речь. Если основное время урока истекло — мягко завершаем!
          if (lessonEndsAt && Date.now() >= lessonEndsAt && !isStopping && !isFinalizing) {
            clearInterval(lessonTimerInterval);
            setStatus(t('msgTimeDone'));
            stopSession(false);
            return;
          }

          if (!isWaitingForResponse && !isExtractingMemory && !isFinalizing) {
            btnEndTurn.style.display = 'block';
            if (turnHint) turnHint.style.display = 'block';
            setStatus(st('yourTurn'));
            vibrate([50, 50, 50]);
          }
          if (isTimeWarningPending && !isTimeWarningSent) sendAutomaticTimeWarning();
        }
      }, 200);
    }
  }

  /* ==========================================================================
     Таймер урока (по меткам времени: не «плывёт» при троттлинге вкладки в фоне)
     ========================================================================== */
  function remainingSeconds() { return Math.max(0, Math.ceil((lessonEndsAt - Date.now()) / 1000)); }
  function updateTimerBadge() {
    const r = remainingSeconds();
    const m = Math.floor(r / 60), s = r % 60;
    timerBadge.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function extendLesson(minutes) {
    const mins = minutes || 15;
    if (!isSessionActive || isStopping || isFinalizing) return;
    lessonEndsAt = Math.max(Date.now(), lessonEndsAt) + mins * 60 * 1000;
    isTimeWarningSent = false;
    isTimeWarningPending = false;
    timerBadge.classList.remove('timer-warning');
    updateTimerBadge();
    toast(cfg.native === 'uk' ? `Урок продовжено на ${mins} хв!` : `Урок продлён на ${mins} мин!`, 4000);
    sendText(cfg.native === 'uk'
      ? `[СИСТЕМНА ПІДКАЗКА: Учень продовжив урок ще на ${mins} хвилин! Не прощайся. Продовжуємо повноцінний урок, переходимо до наступного матеріалу.]`
      : `[СИСТЕМНАЯ ПОДСКАЗКА: Ученик продлил урок ещё на ${mins} минут! Не прощайся. Продолжаем полноценный урок, переходи к следующему материалу.]`, false);
    startLessonTimer();
  }

  function startLessonTimer() {
    lessonEndsAt = Date.now() + cfg.minutes * 60 * 1000;
    isTimeWarningPending = false; isTimeWarningSent = false;
    timerBadge.style.display = 'block';
    timerBadge.title = cfg.uiLang === 'uk' ? 'Натисніть, щоб продовжити урок на 15 хв' : 'Нажмите, чтобы продлить урок на 15 мин';
    progressPill.style.display = 'inline-block';
    timerBadge.classList.remove('timer-warning');
    updateTimerBadge();

    clearInterval(lessonTimerInterval);
    lessonTimerInterval = setInterval(() => {
      const r = remainingSeconds();
      updateTimerBadge();

      const totalSec = cfg.minutes * 60;   // подписи без номеров фраз: модель не знает «номер блока», а темп у каждого ученика свой
      if (r > totalSec * 2 / 3) progressPill.textContent = t('blk1');
      else if (r > totalSec / 3) progressPill.textContent = t('blk2');
      else progressPill.textContent = t('blk3');

      if (r <= 120 && !isTimeWarningSent && !isTimeWarningPending) {   // раньше было ===120 и могло «проскочить»
        timerBadge.classList.add('timer-warning');
        isTimeWarningPending = true;
        if (!isBotSpeaking && !isWaitingForResponse && isSetupComplete) sendAutomaticTimeWarning();
      }

      if (r <= 0) {
        timerBadge.classList.add('timer-warning');
        // Не обрываем репетитора посреди слова: даём договорить фразу и попрощаться (до 45 сек)
        const isBusy = isBotSpeaking || isAudioStillPlaying() || isServerTurnActive || isWaitingForResponse;
        const overtimeSec = Math.floor((Date.now() - lessonEndsAt) / 1000);

        if (isBusy && overtimeSec < 45) {
          return;
        }

        clearInterval(lessonTimerInterval);
        setStatus(t('msgTimeDone'));
        stopSession(false);
      }
    }, 500);
  }

  function stopLessonTimer() {
    clearInterval(lessonTimerInterval);
    timerBadge.style.display = 'none';
    progressPill.style.display = 'none';
    isTimeWarningPending = false;
  }

  function sendAutomaticTimeWarning() {
    if (!socket || socket.readyState !== WebSocket.OPEN || !isSessionActive || !isSetupComplete || isExtractingMemory || isTimeWarningSent) return;
    isTimeWarningSent = true;
    isTimeWarningPending = false;
    sendText(timeWarningText(), true);
  }

  /* ==========================================================================
     Отправка текста модели (для моделей 3.x текст идёт через realtimeInput, для 2.5 — через clientContent)
     ========================================================================== */
  function usesRealtimeText() { return /^(models\/)?gemini-3/.test(cfg.model); }

  function sendText(text, respond) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    if (usesRealtimeText()) {
      if (!respond) return true;
      socket.send(JSON.stringify({ realtimeInput: { text } }));
    } else {
      socket.send(JSON.stringify({ clientContent: { turns: [{ role: 'user', parts: [{ text }] }], turnComplete: !!respond } }));
    }
    return true;
  }

  function suppressAudioFor(ms) {
    suppressIncomingAudio = true;
    clearTimeout(suppressTimer);
    suppressTimer = setTimeout(() => { suppressIncomingAudio = false; }, ms);
  }
  function clearSuppress() { suppressIncomingAudio = false; clearTimeout(suppressTimer); }

  /* ---------- Кнопки урока ---------- */
  btnAction.onclick = () => {
    if (isFinalizing || isStopping) return;
    isSessionActive ? stopSession(true) : startSession();
  };

  /* ==========================================================================
     Ручное завершение хода ученика: VAD Silence Flush (вместо конфликтного clientContent)
     ========================================================================== */
  function sendVadSilenceFlush() {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const vadMs = cfg.vad === 'very' ? 3600 : (cfg.vad === 'patient' ? 2600 : 1800);
    // 16000 Гц, 16 бит моно = 32 байта на мс. В Base64 каждые 3 нулевых байта кодируются как 'AAAA'
    const numZeros = Math.ceil(vadMs * 32 / 3) * 3;
    const silenceBase64 = 'A'.repeat(numZeros * 4 / 3);
    socket.send(JSON.stringify({
      realtimeInput: { mediaChunks: [{ mimeType: 'audio/pcm;rate=16000', data: silenceBase64 }] }
    }));
  }

  timerBadge.onclick = () => {
    if (isSessionActive && !isStopping && !isFinalizing) {
      extendLesson(15);
    }
  };

  btnEndTurn.onclick = () => {
    if (!(socket && socket.readyState === WebSocket.OPEN && isSetupComplete && !isExtractingMemory)) return;
    if (isWaitingForResponse || isBotSpeaking) return;

    isWaitingForResponse = true;
    receivedAudioThisTurn = false;
    stopBotSpeech();
    btnEndTurn.style.display = 'none';
    if (turnHint) turnHint.style.display = 'none';
    setStatus(st('thinking'));
    vibrate(30);

    // Отправляем порцию тишины в поток realtimeInput:
    // серверный VAD мгновенно фиксирует конец речи ученика и генерирует ответ без сбоя WebSocket
    sendVadSilenceFlush();

    clearTimeout(watchdogTimer);
    watchdogTimer = setTimeout(() => {
      if (isWaitingForResponse) {
        isWaitingForResponse = false;
        btnEndTurn.style.display = 'block';
        if (turnHint) turnHint.style.display = 'block';
        setStatus(st('yourTurn'));
        vibrate([50, 50, 50]);
      }
    }, 6000);
  };

  // Кнопка ✋ теперь действительно прерывает: раньше глушился только локальный звук, а сервер продолжал присылать остаток реплики.
  btnInterrupt.onclick = () => {
    if (!isBotSpeaking && !isServerTurnActive) return;
    stopBotSpeech();
    isWaitingForResponse = false;
    suppressAudioFor(1200);
    sendText('[СИСТЕМНО: Реплика была прервана учеником. Не комментируй это вслух: просто выслушай ученика и отреагируй на его слова.]', false);
    btnEndTurn.style.display = 'block';
    if (turnHint) turnHint.style.display = 'block';
    setStatus(st('yourTurn'));
  };

  /* ==========================================================================
     Старт сессии и WebSocket
     ========================================================================== */
  function micErrorMessage(err) {
    const n = err && err.name;
    if (n === 'NotAllowedError' || n === 'SecurityError') return t('micDenied');
    if (n === 'NotFoundError') return t('micNotFound');
    if (n === 'NotReadableError') return t('micBusy');
    return t('micFail');
  }

  async function startSession() {
    if (isSessionActive || isFinalizing) return;
    apiKey = getStoredApiKey();
    if (!apiKey) { toast(t('noKeyToast')); openSettings(); return; }
    if (navigator.onLine === false) { toast(t('offline'), 5000); setStatus(t('noNet')); return; }

    btnAction.disabled = true;
    setStatus(t('audioInit'));
    try {
      ensurePlayback();
      if (playbackContext.state === 'suspended') await playbackContext.resume();
      if (!mediaStream) await initMicrophone();
      if (audioContext && audioContext.state === 'suspended') await audioContext.resume();
    } catch (err) {
      console.error('Audio initialization error:', err);
      if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
      btnAction.disabled = false;
      btnAction.textContent = t('btnStart');
      btnAction.className = 'btn-main btn-start';
      const msg = micErrorMessage(err);
      setStatus(msg);
      toast(msg, 6000);
      return;
    }

    sessionId++;
    // Снимок настроек и памяти на момент старта: смена языка/настроек не может «перепутать» запись памяти
    sessionLang = cfg.lang;
    sessionGlobalMem = getGlobalMem();
    sessionLangMem = getLangMem(sessionLang);
    sessionSystemText = getSystemInstruction(sessionLang, sessionGlobalMem, sessionLangMem);

    isSessionActive = true; isSetupComplete = false; isExtractingMemory = false; isWaitingForResponse = false;
    isStopping = false; isFinalizing = false; lessonStarted = false; memoryCommitted = false; lessonLogged = false; finishScheduled = false;
    isTimeWarningSent = false; isTimeWarningPending = false;
    suppressIncomingAudio = false; interruptedPending = false; receivedAudioThisTurn = false;
    saveNudges = 0; reconnectAttempts = 0; resumeHandle = null; captionNewTurn = true;
    capUser.textContent = ''; capTutor.textContent = '';
    stopBotSpeech();
    statsRow.style.display = 'none';
    captionsBox.style.display = cfg.captions === 'on' ? 'block' : 'none';

    await requestWakeLock();
    startLevelLoop();
    clearInterval(stuckInterval);
    stuckInterval = setInterval(releaseBotIfStuck, 400);
    connectWebSocket(false);
  }

  function buildSetup(resume) {
    const modelId = cfg.model.startsWith('models/') ? cfg.model : `models/${cfg.model}`;
    const setup = {
      model: modelId,
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: cfg.teacher === 'male' ? 'Puck' : 'Aoede' } } }
      },
      systemInstruction: { parts: [{ text: sessionSystemText }] },
      tools: [{
        functionDeclarations: [{
          name: 'saveStudentProfile',
          description: 'Сохранить профиль ученика в постоянную память. ВНИМАНИЕ: Вызывать ТОЛЬКО по системной команде завершения урока в самом конце! Во время урока вызов СТРОГО ЗАПРЕЩЕН.',
          parameters: {
            type: 'OBJECT',
            properties: {
              global_memory: { type: 'STRING', description: 'Накопительный профиль: Имя, Пол (грамматический род), профессия, семья, питомец, город, хобби, привычки.' },
              lang_memory: { type: 'STRING', description: `Накопительный архив языка: ${SEC_LOG}, ${SEC_VOC}, ${SEC_ERR}, ${SEC_NEXT}.` }
            },
            required: ['global_memory', 'lang_memory']
          }
        }]
      }],
      // Без этих двух полей аудио-сессия Live API обрывается примерно на 15-й минуте (а урок = 15 минут + сохранение)
      sessionResumption: resume && resumeHandle ? { handle: resumeHandle } : {},
      contextWindowCompression: { slidingWindow: {} }
    };
    // Ученик говорит с паузами и подбирает слова: «стандартная» тишина — 0.9 с (раньше сервер мог ответить после доли секунды).
    const vadSilence = cfg.vad === 'very' ? 3400 : (cfg.vad === 'patient' ? 2400 : 1600);
    setup.realtimeInputConfig = { automaticActivityDetection: { endOfSpeechSensitivity: 'END_SENSITIVITY_LOW', silenceDurationMs: vadSilence, prefixPaddingMs: 300 } };
    if (cfg.captions === 'on') {
      setup.inputAudioTranscription = {};
      setup.outputAudioTranscription = {};
    }
    return { setup };
  }

  function explainClose(e) {
    const reason = ((e && e.reason) || '').toString();
    const r = reason.toLowerCase();
    if (/api key|api_key|key not valid|invalid.*key|unauthenticated|permission/.test(r)) return t('clAuth');
    if (/not found|not supported|unsupported|model/.test(r)) return t('clModel');
    if (/quota|exhaust|rate limit|billing|too many/.test(r)) return t('clQuota');
    if (e && e.code === 1006) return t('clConn');
    return t('clGeneric', { reason: reason ? ': ' + reason.slice(0, 140) : '.' });
  }

  function connectWebSocket(isResume) {
    const mySession = sessionId;
    setStatus(isResume ? st('reconnecting') : st('connecting'));
    const ws = new WebSocket(`${WS_BASE}?key=${encodeURIComponent(apiKey)}`);
    ws.binaryType = 'arraybuffer';   // синхронный разбор: раньше async-await на Blob мог переставить сообщения местами
    socket = ws;
    const decoder = new TextDecoder('utf-8');

    clearTimeout(connectTimer);
    connectTimer = setTimeout(() => {
      if (ws === socket && !isSetupComplete) { console.warn('Setup timeout'); try { ws.close(); } catch (e) {} }
    }, 15000);

    ws.onopen = () => { reconnectAttempts = 0; clearTimeout(reconnectTimer);  if (ws === socket) ws.send(JSON.stringify(buildSetup(isResume))); };

    ws.onmessage = event => {
      if (ws !== socket || mySession !== sessionId) return;
      let msg;
      try { msg = JSON.parse(typeof event.data === 'string' ? event.data : decoder.decode(event.data)); }
      catch (err) { console.warn('Bad server message', err); return; }
      try { handleServerMessage(msg); } catch (err) { console.error('Message handler error', err); }
    };

    ws.onerror = e => { console.warn('WebSocket error:', e); };   // за error всегда следует close — обрабатываем там

    ws.onclose = e => {
      if (ws !== socket || mySession !== sessionId) return;
      console.warn('WebSocket close:', e.code, e.reason);
      clearTimeout(connectTimer);
      isSetupComplete = false;
      if (!isSessionActive || isFinalizing) return;
      isWaitingForResponse = false; isServerTurnActive = false;

      if (!lessonStarted) { finalizeStop(explainClose(e)); return; }
      if (isExtractingMemory && memoryCommitted) { scheduleFinishAfterSave(); return; }

      if (resumeHandle && reconnectAttempts < MAX_RECONNECT) {
        reconnectAttempts++;
        setStatus(st('reconnecting'));
        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
          if (isSessionActive && !isFinalizing && mySession === sessionId) connectWebSocket(true);
        }, 500 * reconnectAttempts);
        return;
      }
      finalizeStop(isExtractingMemory
        ? t('finLostBeforeSave')
        : t('finLost'));
    };
  }

  function respondToToolCall(call, output) {
    if (socket && socket.readyState === WebSocket.OPEN && call.id) {
      socket.send(JSON.stringify({ toolResponse: { functionResponses: [{ id: call.id, name: call.name, response: { output } }] } }));
    }
  }

  function handleToolCalls(calls) {
    calls.forEach(call => {
      if (call.name === 'saveStudentProfile') {
        const canSave = isExtractingMemory || isTimeWarningSent || remainingSeconds() <= 120;
        if (canSave && call.args) {
          const ok = commitMemory(call.args, sessionLang);
          if (ok) memoryCommitted = true;
          respondToToolCall(call, { status: ok ? 'success' : 'error', note: ok ? undefined : 'lang_memory пуст' });
          if (!isExtractingMemory) {
            // Урок органично завершился чуть раньше таймера — завершаем урок штатно
            stopSession(false);
          }
        } else {
          console.warn('saveStudentProfile вызван в начале урока — проигнорирован');
          respondToToolCall(call, { status: 'ignored', note: 'Не вызывай функцию во время урока. Продолжай урок.' });
        }
      } else {
        respondToToolCall(call, { status: 'error', note: 'unknown function' });
      }
    });
    if ((isExtractingMemory || isTimeWarningSent) && memoryCommitted) scheduleFinishAfterSave();
  }

  function scheduleFinishAfterSave() {
    if (finishScheduled) return;
    finishScheduled = true;
    clearTimeout(saveTimeoutId);
    setTimeout(() => finalizeStop(t('finSaved')), 300);
  }

  // Модель иногда «проговаривает» служебные токены (<ctrl46>, <noise>) в расшифровке — на экране им не место
  function cleanCaption(text) {
    return String(text || '').replace(/<\/?(?:ctrl\d+|noise|silence)[^>]*>/gi, '').replace(/\s{2,}/g, ' ');
  }

  function pushCaption(kind, text) {
    if (cfg.captions !== 'on') return;
    if (isExtractingMemory) return;          // пока идёт сохранение итогов — субтитры не нужны
    text = cleanCaption(text);
    if (!text.trim()) return;
    if (kind === 'tutor') {
      if (captionNewTurn) { capTutor.textContent = ''; captionNewTurn = false; }
      capTutor.textContent = (capTutor.textContent + text).slice(-320);
    } else {
      if (!capUser.dataset.fresh || capUser.dataset.fresh === '1') { capUser.textContent = ''; capUser.dataset.fresh = '0'; }
      const you = t('capYou') + ': '; const prev = capUser.textContent.startsWith(you) ? capUser.textContent.slice(you.length) : capUser.textContent; capUser.textContent = (you + prev + text).slice(-200);
    }
  }

  function onSetupComplete() {
    clearTimeout(connectTimer);
    isSetupComplete = true;
    reconnectAttempts = 0;

    if (lessonStarted) {   // это восстановленное соединение: урок продолжается с того же места
      isWaitingForResponse = false;
      if (isExtractingMemory) { if (!memoryCommitted) sendMemoryDirective(); }
      else setStatus(st('listening'));
      return;
    }

    lessonStarted = true;
    lessonStartedAtReal = Date.now();
    btnAction.disabled = false;
    btnAction.textContent = t('btnStop');
    btnAction.className = 'btn-main btn-stop';
    btnEndTurn.style.display = 'none';
    if (turnHint) turnHint.style.display = 'none';
    isWaitingForResponse = true;
    setStatus(st('thinking'));
    startLessonTimer();
    sendText(startPromptText(), true);

    clearTimeout(watchdogTimer);
    watchdogTimer = setTimeout(() => {
      if (isWaitingForResponse && !isBotSpeaking && isSessionActive) {
        isWaitingForResponse = false;
        btnEndTurn.style.display = 'block';
        if (turnHint) turnHint.style.display = 'block';
        setStatus(st('yourTurn'));
      }
    }, 12000);
  }

  function handleServerMessage(msg) {
    if ('setupComplete' in msg) { onSetupComplete(); return; }

    if (msg.goAway) console.info('goAway: сервер скоро закроет соединение, timeLeft =', msg.goAway.timeLeft);

    if (msg.sessionResumptionUpdate) {
      const u = msg.sessionResumptionUpdate;
      if (u.resumable && u.newHandle) resumeHandle = u.newHandle;
    }

    const sc = msg.serverContent;
    const calls = (msg.toolCall && msg.toolCall.functionCalls) ||
      (sc && sc.modelTurn && sc.modelTurn.parts ? sc.modelTurn.parts.filter(p => p.functionCall).map(p => p.functionCall) : null);
    if (calls && calls.length > 0) handleToolCalls(calls);
    if (!sc) return;

    if (sc.inputTranscription && sc.inputTranscription.text) pushCaption('user', sc.inputTranscription.text);
    if (sc.outputTranscription && sc.outputTranscription.text) pushCaption('tutor', sc.outputTranscription.text);

    // Сервер сообщил, что реплика прервана (наша «Я всё сказал» / ✋ / голос в режиме наушников)
    if (sc.interrupted) {
      stopBotSpeech();
      clearSuppress();
      interruptedPending = true;   // следом придёт turnComplete ПРЕРВАННОЙ реплики — он не означает конец нового ответа
      if (!isWaitingForResponse && !isExtractingMemory) { clearTimeout(watchdogTimer); setStatus(st('listening')); }
    }

    if (sc.modelTurn && sc.modelTurn.parts) {
      for (const part of sc.modelTurn.parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('audio/pcm')) {
          if (isExtractingMemory || suppressIncomingAudio) continue;   // во время сохранения звук не нужен и не задерживает завершение
          clearTimeout(watchdogTimer);
          isWaitingForResponse = false;
          interruptedPending = false;
          receivedAudioThisTurn = true;
          isServerTurnActive = true;
          lastAudioChunkAt = Date.now();
          playPcmChunk(part.inlineData.data);
          if (!isBotSpeaking) {
            isBotSpeaking = true;
            avatarCard.classList.add('speaking');
            btnInterrupt.style.display = 'block';
            btnEndTurn.style.display = 'none';
            if (turnHint) turnHint.style.display = 'none';
            setStatus(st('speaking'));
          }
        }
      }
    }

    if (sc.generationComplete) {
      isServerTurnActive = false;
      checkBotSpeakingEnded();
    }

    if (sc.turnComplete) {
      interruptedPending = false;
      isServerTurnActive = false;
      clearSuppress();
      captionNewTurn = true;
      if (capUser) capUser.dataset.fresh = '1';

      clearTimeout(watchdogTimer);
      // Если модель ничего не сказала (пустой ход или прерывание), возвращаем очередь ученику без зависания
      if (isWaitingForResponse && !receivedAudioThisTurn && !isExtractingMemory) {
        isWaitingForResponse = false;
        setStatus(st('yourTurn'));
      }
      receivedAudioThisTurn = false;

      // Модель отвечает голосом, а не вызывает функцию сохранения — мягко напоминаем (до 2 раз)
      if (isExtractingMemory && !memoryCommitted && saveNudges < 2 && isSetupComplete) {
        saveNudges++;
        sendText('[СИСТЕМНО: Не отвечай голосом. Вызови функцию saveStudentProfile СЕЙЧАС с полными объединёнными данными global_memory и lang_memory.]', true);
        armSaveTimeout(20000);
      }
      checkBotSpeakingEnded();
    }
  }

  /* ==========================================================================
     Завершение урока и сохранение памяти
     ========================================================================== */
  function armSaveTimeout(ms) {
    clearTimeout(saveTimeoutId);
    saveTimeoutId = setTimeout(() => {
      if (memoryCommitted) return;
      finalizeStop(t('finTimeout'));
    }, ms);
  }

  function sendMemoryDirective() {
    if (!socket || socket.readyState !== WebSocket.OPEN || !isSetupComplete) return false;
    setStatus(st('saving'));
    sendText(memoryPromptText(), true);
    armSaveTimeout(25000);   // было 7.5 с: при росте памяти модель просто не успевала «договорить» вызов функции
    return true;
  }

  async function stopSession(forceImmediate) {
    if (!isSessionActive || isStopping || isFinalizing) return;
    isStopping = true;
    stopLessonTimer();
    clearTimeout(watchdogTimer);
    btnAction.disabled = true;
    btnEndTurn.style.display = 'none';
    if (turnHint) turnHint.style.display = 'none';
    btnInterrupt.style.display = 'none';
    const mySession = sessionId;

    if (forceImmediate) {
      stopBotSpeech();
    } else if (isAudioStillPlaying() || isServerTurnActive) {
      // КРИТИЧНО: isExtractingMemory здесь false, поэтому все входящие PCM-чанки
      // финальной фразы/прощания репетитора принимаются и воспроизводятся полностью!
      setStatus(st('finishing'));
      await waitPlaybackDrain(30000);   // Graceful Audio Drain Buffer (до 30 с)
      if (mySession !== sessionId || isFinalizing) return;
    }

    // ТОЛЬКО ТЕПЕРЬ, когда вся прощальная речь репетитора прозвучала из динамиков,
    // включаем флаг сохранения памяти и запрашиваем функцию saveStudentProfile:
    isExtractingMemory = true;
    setStatus(st('saving'));
    if (socket && socket.readyState === WebSocket.OPEN && isSetupComplete) {
      sendMemoryDirective();
    } else if (resumeHandle && lessonStarted) {
      armSaveTimeout(30000);   // соединение переподключается; директива уйдёт сразу после setupComplete
    } else {
      finalizeStop(lessonStarted ? t('finNoConn') : t('finDone'));
    }
  }

  function addFallbackNote(sec) {
    // Если ИИ не смог сохранить итоги, фиксируем хотя бы сам факт урока, чтобы память не «потеряла» занятие молча
    if (sec < 90) return;
    const old = getLangMem(sessionLang);
    store.set(memKey(sessionLang) + '__prev', old);
    const note = `${SEC_LOG} (заметка приложения ${todayStr()}): урок проводился (~${Math.round(sec / 60)} мин), но итоги не были сохранены из-за сбоя связи; слова этого урока неизвестны — не считай их изученными.`;
    store.set(memKey(sessionLang), old ? old.trim() + '\n' + note : note);
  }

  function logLesson(saved, sec) {
    if (lessonLogged) return;
    lessonLogged = true;
    if (sec < 60) return;
    const arr = readJSON('lesson_log', []);
    arr.push({ t: Date.now(), l: sessionLang, s: sec, ok: !!saved });
    store.set('lesson_log', JSON.stringify(arr.slice(-500)));
  }

  async function finalizeStop(finalMessage) {
    if (isFinalizing) return;
    isFinalizing = true;
    const mySession = sessionId;
    clearTimeout(saveTimeoutId); clearTimeout(connectTimer); clearTimeout(watchdogTimer); clearTimeout(reconnectTimer);
    stopLessonTimer();
    releaseWakeLock();
    btnAction.disabled = true;
    btnEndTurn.style.display = 'none';
    if (turnHint) turnHint.style.display = 'none';
    btnInterrupt.style.display = 'none';

    const sec = lessonStarted ? Math.min(2400, Math.round((Date.now() - lessonStartedAtReal) / 1000)) : 0;
    if (lessonStarted && !memoryCommitted) addFallbackNote(sec);
    logLesson(memoryCommitted, sec);

    if (!isExtractingMemory && isAudioStillPlaying()) {
      setStatus(t('finishing'));
      await waitPlaybackDrain(10000);
    }
    if (mySession !== sessionId) return;

    stopBotSpeech();
    const ws = socket;
    socket = null;                         // обработчики старого сокета после этого ничего не делают
    if (ws) { try { ws.close(); } catch (e) {} }

    if (mediaStream) { mediaStream.getTracks().forEach(track => track.stop()); mediaStream = null; }
    [sourceNode, lpFilter1, lpFilter2].forEach(n => { if (n) { try { n.disconnect(); } catch (e) {} } });
    sourceNode = lpFilter1 = lpFilter2 = null;
    // iOS: контексты никогда не close(), только suspend()/resume()
    if (audioContext && audioContext.state === 'running') { try { audioContext.suspend(); } catch (e) {} }
    if (playbackContext && playbackContext.state === 'running') { try { playbackContext.suspend(); } catch (e) {} }
    stopLevelLoop();
    clearInterval(stuckInterval); stuckInterval = null;

    isSessionActive = false; isSetupComplete = false; isExtractingMemory = false; isWaitingForResponse = false;
    isStopping = false; isFinalizing = false; lessonStarted = false;
    clearSuppress();

    btnAction.disabled = false;
    btnAction.textContent = t('btnStart');
    btnAction.className = 'btn-main btn-start';
    captionsBox.style.display = 'none';
    setStatus(finalMessage);
    if (finalMessage !== t('finSaved') && finalMessage !== t('finDone')) toast(finalMessage, 7000);
    updateUI();
  }

  /* ---------- Старт ---------- */
  updateUI();
  updateInterface();   // язык интерфейса, подписи и стартовая подсказка

  // v3.18.0: просим браузер не вытеснять локальную память (особенно Safari/iOS удаляет данные «неиспользуемых» сайтов)
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

  // v3.18.0: раньше sw.js и manifest лежали рядом, но нигде не подключались — установка как приложение не работала
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
  </script>
</body>
</html>
