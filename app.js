// ── STATE ──────────────────────────────────────────────
let apiKey = localStorage.getItem('hs_api_key') || '';
let lang = 'de';
let currentTopic = 'general';
let history = [];

// ── TRANSLATIONS ───────────────────────────────────────
const tx = {
  de: {
    placeholder:   'Stell mir eine Frage…',
    hint:          'Enter zum Senden · Shift+Enter für neue Zeile',
    setupMsg:      '🔑 OpenAI API Key eingeben um zu starten',
    keyBtn:        'Speichern',
    clearBtn:      '🗑️ Chat leeren',
    topicsTitle:   'Themen',
    suggestTitle:  'Vorschläge',
    online:        'Online',
    offline:       'Offline',
    welcome:       '👋 Hallo! Ich bin dein Webtechnologien-Assistent.<br/><br/>Ich helfe dir bei HTML, CSS, JavaScript, HTTP, DOM und mehr.<br/>Wähle ein Thema oder stell mir direkt eine Frage!',
    thinking:      'Denkt nach…',
    noKey:         '⚠️ Bitte zuerst den API-Key speichern.',
    tGeneral:      'Allgemein',
    errorApi:      '❌ Fehler beim Abrufen der Antwort. Prüfe deinen API-Key.',
  },
  en: {
    placeholder:   'Ask me a question…',
    hint:          'Enter to send · Shift+Enter for new line',
    setupMsg:      '🔑 Enter your OpenAI API Key to start',
    keyBtn:        'Save',
    clearBtn:      '🗑️ Clear chat',
    topicsTitle:   'Topics',
    suggestTitle:  'Suggestions',
    online:        'Online',
    offline:       'Offline',
    welcome:       '👋 Hello! I am your Web Technologies assistant.<br/><br/>I can help you with HTML, CSS, JavaScript, HTTP, DOM and more.<br/>Pick a topic or ask me a question directly!',
    thinking:      'Thinking…',
    noKey:         '⚠️ Please save your API key first.',
    tGeneral:      'General',
    errorApi:      '❌ Error fetching response. Check your API key.',
  }
};

// ── SYSTEM PROMPTS ────────────────────────────────────
const systemPrompt = {
  general: {
    de: 'Du bist ein freundlicher Lern-Assistent für das Fach Webtechnologien an der Hochschule Merseburg. Antworte auf Deutsch, klar und verständlich für Studenten. Erkläre Konzepte mit kurzen Beispielen. Formatiere Code mit Backticks.',
    en: 'You are a friendly learning assistant for the Web Technologies course at Hochschule Merseburg. Answer in English, clearly and understandably for students. Explain concepts with short examples. Format code with backticks.'
  },
  html: {
    de: 'Du bist ein HTML-Experte für Webtechnologien-Studenten der HS Merseburg. Beantworte Fragen zu HTML5, Semantik, Formularen, Barrierefreiheit und Best Practices. Antworte auf Deutsch mit Code-Beispielen.',
    en: 'You are an HTML expert for Web Technologies students at HS Merseburg. Answer questions about HTML5, semantics, forms, accessibility and best practices. Answer in English with code examples.'
  },
  css: {
    de: 'Du bist ein CSS-Experte. Erkläre CSS-Konzepte wie Flexbox, Grid, Animationen, Responsive Design und Selektoren. Antworte auf Deutsch mit konkreten Code-Beispielen.',
    en: 'You are a CSS expert. Explain CSS concepts like Flexbox, Grid, animations, responsive design and selectors. Answer in English with concrete code examples.'
  },
  javascript: {
    de: 'Du bist ein JavaScript-Experte für Webtechnologien-Studenten. Erkläre JS-Konzepte wie DOM-Manipulation, Events, Promises, Fetch API und ES6+. Antworte auf Deutsch mit Code-Beispielen.',
    en: 'You are a JavaScript expert for Web Technologies students. Explain JS concepts like DOM manipulation, events, promises, Fetch API and ES6+. Answer in English with code examples.'
  },
  http: {
    de: 'Du bist ein Experte für HTTP und Web-APIs. Erkläre HTTP-Methoden, Status-Codes, REST-APIs, CORS, Headers und JSON. Antworte auf Deutsch mit praktischen Beispielen.',
    en: 'You are an expert in HTTP and Web APIs. Explain HTTP methods, status codes, REST APIs, CORS, headers and JSON. Answer in English with practical examples.'
  },
  dom: {
    de: 'Du bist ein DOM-Experte. Erkläre document.querySelector, createElement, addEventListener, innerHTML vs textContent, und wie der Browser das DOM aufbaut. Antworte auf Deutsch.',
    en: 'You are a DOM expert. Explain document.querySelector, createElement, addEventListener, innerHTML vs textContent, and how the browser builds the DOM. Answer in English.'
  },
  responsive: {
    de: 'Du bist ein Responsive-Design-Experte. Erkläre Media Queries, Mobile-First, Viewport-Einheiten, Flexbox, Grid und Best Practices für alle Bildschirmgrößen. Antworte auf Deutsch.',
    en: 'You are a responsive design expert. Explain media queries, mobile-first, viewport units, Flexbox, Grid and best practices for all screen sizes. Answer in English.'
  }
};

// ── TOPIC SUGGESTIONS ─────────────────────────────────
const suggestions = {
  general: {
    de: ['Was ist der Unterschied zwischen HTML und CSS?', 'Wie funktioniert das Internet?', 'Was sind die wichtigsten Web-Standards?'],
    en: ['What is the difference between HTML and CSS?', 'How does the Internet work?', 'What are the most important web standards?']
  },
  html: {
    de: ['Was sind semantische HTML-Elemente?', 'Wie erstelle ich ein Formular?', 'Was ist der Unterschied zwischen div und span?'],
    en: ['What are semantic HTML elements?', 'How do I create a form?', 'What is the difference between div and span?']
  },
  css: {
    de: ['Erkläre mir Flexbox mit einem Beispiel', 'Was ist Mobile-First CSS?', 'Wie funktionieren CSS-Animationen?'],
    en: ['Explain Flexbox with an example', 'What is Mobile-First CSS?', 'How do CSS animations work?']
  },
  javascript: {
    de: ['Erkläre mir addEventListener', 'Was ist eine Promise?', 'Wie funktioniert die Fetch API?'],
    en: ['Explain addEventListener to me', 'What is a Promise?', 'How does the Fetch API work?']
  },
  http: {
    de: ['Was sind HTTP-Statuscodes?', 'Was ist der Unterschied zwischen GET und POST?', 'Was ist CORS und warum brauche ich es?'],
    en: ['What are HTTP status codes?', 'What is the difference between GET and POST?', 'What is CORS and why do I need it?']
  },
  dom: {
    de: ['Was ist der Unterschied zwischen getElementById und querySelector?', 'Wie erstelle ich dynamisch ein HTML-Element?', 'Was ist Event-Bubbling?'],
    en: ['What is the difference between getElementById and querySelector?', 'How do I create an HTML element dynamically?', 'What is event bubbling?']
  },
  responsive: {
    de: ['Erkläre mir Mobile-First mit Media Queries', 'Wann nehme ich Flexbox, wann Grid?', 'Was ist der Viewport-Meta-Tag?'],
    en: ['Explain Mobile-First with media queries', 'When do I use Flexbox vs Grid?', 'What is the viewport meta tag?']
  }
};

// ── DOM REFS (assigned after DOMContentLoaded) ─────────
let el = {};

// ── INIT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  el = {
    hamburgerBtn: document.getElementById('hamburgerBtn'),
    sidebar:      document.getElementById('sidebar'),
    overlay:      document.getElementById('overlay'),
    setupBanner:  document.getElementById('setupBanner'),
    setupMsg:     document.getElementById('setupMsg'),
    apiKeyInput:  document.getElementById('apiKeyInput'),
    keyBtn:       document.getElementById('keyBtn'),
    statusDot:    document.getElementById('statusDot'),
    statusText:   document.getElementById('statusText'),
    btnDE:        document.getElementById('btnDE'),
    btnEN:        document.getElementById('btnEN'),
    topicsTitle:  document.getElementById('topicsTitle'),
    suggestTitle: document.getElementById('suggestTitle'),
    suggestions:  document.getElementById('suggestions'),
    messages:     document.getElementById('messages'),
    userInput:    document.getElementById('userInput'),
    sendBtn:      document.getElementById('sendBtn'),
    clearBtn:     document.getElementById('clearBtn'),
    inputHint:    document.getElementById('inputHint'),
    welcomeMsg:   document.getElementById('welcomeMsg'),
  };

  // Bind events — addEventListener only, zero onclick in HTML
  el.hamburgerBtn.addEventListener('click', openSidebar);
  el.overlay.addEventListener('click', closeSidebar);
  el.btnDE.addEventListener('click', () => setLang('de'));
  el.btnEN.addEventListener('click', () => setLang('en'));
  el.keyBtn.addEventListener('click', saveKey);
  el.clearBtn.addEventListener('click', clearChat);
  el.sendBtn.addEventListener('click', sendMessage);
  el.userInput.addEventListener('keydown', onEnterKey);
  el.userInput.addEventListener('input', autoResize);

  // Topic buttons
  document.querySelectorAll('.topic-btn').forEach(btn => {
    btn.addEventListener('click', () => setTopic(btn.dataset.topic));
  });

  // Init state
  setLang('de');
  updateStatus();
});

// ── SIDEBAR ────────────────────────────────────────────
function openSidebar() {
  el.sidebar.classList.add('open');
  el.overlay.classList.add('show');
}
function closeSidebar() {
  el.sidebar.classList.remove('open');
  el.overlay.classList.remove('show');
}

// ── LANGUAGE ───────────────────────────────────────────
function setLang(l) {
  lang = l;

  // Toggle button states
  el.btnDE.classList.toggle('active', l === 'de');
  el.btnEN.classList.toggle('active', l === 'en');

  // Update UI text
  const t = tx[l];
  el.userInput.placeholder = t.placeholder;
  el.inputHint.textContent  = t.hint;
  el.setupMsg.textContent   = t.setupMsg;
  el.keyBtn.textContent     = t.keyBtn;
  el.clearBtn.textContent   = t.clearBtn;
  el.topicsTitle.textContent  = t.topicsTitle;
  el.suggestTitle.textContent = t.suggestTitle;
  el.statusText.textContent   = apiKey ? t.online : t.offline;
  document.getElementById('t-general').textContent = t.tGeneral;

  // Refresh suggestions for current topic
  renderSuggestions(currentTopic);
}

// ── API KEY ────────────────────────────────────────────
function saveKey() {
  const key = el.apiKeyInput.value.trim();
  if (!key) return;
  apiKey = key;
  localStorage.setItem('hs_api_key', key);
  el.apiKeyInput.value = '';
  el.setupBanner.classList.add('hidden');
  updateStatus();
}

function updateStatus() {
  const t = tx[lang];
  if (apiKey) {
    el.statusDot.classList.add('online');
    el.statusText.textContent = t.online;
  } else {
    el.statusDot.classList.remove('online');
    el.statusText.textContent = t.offline;
  }
}

// ── TOPICS ─────────────────────────────────────────────
function setTopic(topic) {
  currentTopic = topic;
  history = [];   // reset conversation on topic change

  // Update active state
  document.querySelectorAll('.topic-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.topic === topic);
  });

  renderSuggestions(topic);
  closeSidebar();
}

function renderSuggestions(topic) {
  const list = suggestions[topic]?.[lang] || [];
  el.suggestions.innerHTML = '';
  list.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'suggest-btn';
    btn.textContent = text;
    btn.addEventListener('click', () => {
      el.userInput.value = text;
      closeSidebar();
      sendMessage();
    });
    el.suggestions.appendChild(btn);
  });
}

// ── CHAT ───────────────────────────────────────────────
function clearChat() {
  history = [];
  el.messages.innerHTML = '';
  // Re-add welcome message
  const welcomeDiv = document.createElement('div');
  welcomeDiv.className = 'msg-row ai';
  welcomeDiv.innerHTML = `
    <div class="avatar">AI</div>
    <div class="bubble ai-bubble" id="welcomeMsg">
      ${tx[lang].welcome}
    </div>`;
  el.messages.appendChild(welcomeDiv);
  el.welcomeMsg = document.getElementById('welcomeMsg');
  closeSidebar();
}

function onEnterKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize() {
  el.userInput.style.height = 'auto';
  el.userInput.style.height = Math.min(el.userInput.scrollHeight, 120) + 'px';
}

async function sendMessage() {
  const text = el.userInput.value.trim();
  if (!text) return;

  if (!apiKey) {
    appendMessage('ai', tx[lang].noKey);
    return;
  }

  // Show user message
  appendMessage('user', escapeHtml(text));
  el.userInput.value = '';
  el.userInput.style.height = 'auto';
  el.sendBtn.disabled = true;

  // Add to history
  history.push({ role: 'user', content: text });

  // Show typing indicator
  const typingId = showTyping();

  try {
    const prompt = systemPrompt[currentTopic]?.[lang] || systemPrompt.general[lang];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: prompt },
          ...history
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    removeTyping(typingId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '…';

    history.push({ role: 'assistant', content: reply });

    // Keep history max 10 messages
    if (history.length > 10) history = history.slice(-10);

    appendMessage('ai', formatAiText(reply));

  } catch (err) {
    removeTyping(typingId);
    appendMessage('ai', tx[lang].errorApi);
    console.error(err);
  }

  el.sendBtn.disabled = false;
}

// ── MESSAGE HELPERS ────────────────────────────────────
function appendMessage(role, html) {
  const row = document.createElement('div');
  row.className = `msg-row ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = role === 'ai' ? 'AI' : 'Du';

  const bubble = document.createElement('div');
  bubble.className = `bubble ${role === 'ai' ? 'ai-bubble' : 'user-bubble'}`;
  bubble.innerHTML = html;

  row.appendChild(avatar);
  row.appendChild(bubble);
  el.messages.appendChild(row);
  el.messages.scrollTop = el.messages.scrollHeight;
}

function showTyping() {
  const id = 'typing-' + Date.now();
  const row = document.createElement('div');
  row.className = 'msg-row ai';
  row.id = id;
  row.innerHTML = `
    <div class="avatar">AI</div>
    <div class="bubble ai-bubble">
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  el.messages.appendChild(row);
  el.messages.scrollTop = el.messages.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatAiText(text) {
  // Code blocks first
  let formatted = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });
  // Inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Newlines
  formatted = formatted.replace(/\n/g, '<br/>');
  return formatted;
}
