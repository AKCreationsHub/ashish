const PLATFORMS = ['YouTube','Google Trends','Google News','Reddit','Twitter/X','Facebook','Instagram','TikTok','Pinterest','LinkedIn','Quora','Medium'];
const STORAGE_KEY = 'content_empire_demo_state_v2';
const API_CATALOG = [
  { name: 'YouTube Data API v3', status: 'active', scope: 'youtube.upload,youtube.readonly' },
  { name: 'Facebook Graph API', status: 'active', scope: 'pages_manage_posts,pages_read_engagement' },
  { name: 'Instagram Graph API', status: 'active', scope: 'instagram_content_publish' },
  { name: 'Twitter/X API v2', status: 'active', scope: 'tweet.read,tweet.write' },
  { name: 'TikTok API', status: 'reauth_soon', scope: 'video.upload,video.publish' },
  { name: 'LinkedIn API', status: 'active', scope: 'w_member_social' },
  { name: 'Pinterest API', status: 'inactive', scope: 'pins:write' },
  { name: 'Reddit API', status: 'active', scope: 'submit,read' },
];

const defaultState = {
  view: 'dashboard',
  topicSortDescending: true,
  settings: { niche: 'AI tools', timezone: 'UTC', theme: 'light' },
  accounts: [
    { name: 'YouTube', status: 'connected', handle: '@yourchannel', followers: 1200000, rate: 80 },
    { name: 'Facebook', status: 'connected', handle: '@yourpage', followers: 45000, rate: 42 },
    { name: 'Instagram', status: 'connected', handle: '@yourhandle', followers: 89000, rate: 55 },
    { name: 'TikTok', status: 'offline', handle: '@yourtok', followers: 0, rate: 0 },
    { name: 'Twitter/X', status: 'connected', handle: '@yourusername', followers: 12000, rate: 30 },
    { name: 'LinkedIn', status: 'connected', handle: 'Your Name', followers: 8000, rate: 28 },
    { name: 'Pinterest', status: 'offline', handle: '@pins', followers: 0, rate: 0 },
    { name: 'Reddit', status: 'connected', handle: 'u/yourusername', followers: 5000, rate: 25 },
    { name: 'Telegram', status: 'connected', handle: '@yourchannel', followers: 3500, rate: 20 },
    { name: 'Medium', status: 'connected', handle: '@yourname', followers: 2000, rate: 12 },
    { name: 'WordPress', status: 'connected', handle: 'myblog.com', followers: 0, rate: 10 },
    { name: 'Discord', status: 'connected', handle: 'Creator Server', followers: 8700, rate: 19 },
    { name: 'Threads', status: 'offline', handle: '@threadshandle', followers: 0, rate: 0 },
    { name: 'WhatsApp', status: 'offline', handle: 'Business API', followers: 0, rate: 0 },
    { name: 'Snapchat', status: 'offline', handle: '@snapbrand', followers: 0, rate: 0 },
  ],
  topics: [
    { id: 1, title: 'AI Shorts Hook Formula 2026', source: 'YouTube', score: 92, trend: 'up', competition: 'High', selected: false },
    { id: 2, title: 'Faceless Channel Monetization Strategy', source: 'Google News', score: 86, trend: 'up', competition: 'Medium', selected: false },
    { id: 3, title: 'Reddit AMA Content Repurposing', source: 'Reddit', score: 78, trend: 'flat', competition: 'Low', selected: false },
    { id: 4, title: 'Zero-Budget UGC Workflow', source: 'Twitter/X', score: 83, trend: 'up', competition: 'Medium', selected: false },
    { id: 5, title: 'AI Presenter vs Human Creator Debate', source: 'TikTok', score: 74, trend: 'down', competition: 'High', selected: false },
  ],
  competitors: ['@GrowthLab: +3.1% followers this week', '@CreatorOps: 5 posts/day cadence', '@ScaleMedia: viral short hit 1.2M views'],
};

const state = loadState();

const $ = (id) => document.getElementById(id);
const compact = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 100) / 10}K` : `${n}`);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyTheme() {
  document.body.classList.toggle('theme-dark', state.settings.theme === 'dark');
}

function renderKPIs() {
  const connected = state.accounts.filter((a) => a.status === 'connected').length;
  const totalFollowers = state.accounts.reduce((sum, a) => sum + a.followers, 0);
  const cards = [
    ['Total Reach', compact(totalFollowers), '↑ 23%'],
    ['Engagement', '45,678', '↑ 15%'],
    ['Revenue', '$1,247.50', '↑ 18%'],
    ['Connected Platforms', `${connected}/${state.accounts.length}`, connected >= 10 ? 'Healthy' : 'Needs attention'],
  ];
  $('kpis').innerHTML = cards.map(([label, value, sub]) => `<article class="card"><p>${label}</p><h3>${value}</h3><span>${sub}</span></article>`).join('');
}

function renderDashboard() {
  const connected = state.accounts.filter((a) => a.status === 'connected').length;
  const yt = state.accounts.find((a) => a.name === 'YouTube');
  $('dashboard-health').innerHTML = [
    `✅ ${connected} APIs active and healthy`,
    `⚠️ YouTube quota usage ${yt.rate}%`,
    `ℹ️ ${state.settings.timezone} timezone active for scheduling`,
  ].map((x) => `<div class="list-item">${x}</div>`).join('');

  const upcoming = [
    ['2026-02-15 09:00', 'YouTube', 'AI automation myths', 'Scheduled'],
    ['2026-02-15 12:00', 'Instagram', 'Behind the workflow reel', 'Scheduled'],
    ['2026-02-16 11:30', 'LinkedIn', 'Case study post', 'Draft'],
    ['2026-02-16 20:00', 'TikTok', 'Fast growth clip', 'Queued'],
  ];
  $('upcoming-body').innerHTML = upcoming.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('');
}

function renderAccounts() {
  const query = $('account-search').value.toLowerCase().trim();
  const status = $('status-filter').value;
  const filtered = state.accounts.filter((a) => {
    const okQ = a.name.toLowerCase().includes(query) || a.handle.toLowerCase().includes(query);
    const okS = status === 'all' || a.status === status;
    return okQ && okS;
  });

  $('accounts-grid').innerHTML = filtered.map((a) => `
    <article class="account">
      <h4>${a.name}</h4>
      <p class="status ${a.status}">${a.status === 'connected' ? '● Connected' : '⚪ Not Connected'}</p>
      <p class="meta">${a.handle}</p>
      <p class="meta">${a.followers ? `${compact(a.followers)} followers/subscribers` : 'No linked profile feed'}</p>
      <p class="meta">Rate limit usage: ${a.rate}%</p>
      <div class="account-actions">
        <button data-action="toggle" data-name="${a.name}">${a.status === 'connected' ? 'Disconnect' : 'Connect Now'}</button>
        <button>Settings</button>
      </div>
    </article>
  `).join('');

  const connected = state.accounts.filter((a) => a.status === 'connected').length;
  const disconnected = state.accounts.length - connected;
  $('health-list').innerHTML = `
    <div class="health-good">✅ ${connected} active account connections</div>
    <div class="health-warn">⚠️ ${disconnected} platform(s) need OAuth</div>
    <div class="health-info">ℹ️ Auto token refresh simulation enabled</div>
  `;
}

function renderSources() {
  $('source-picks').innerHTML = PLATFORMS.map((s) => `<label><input type="checkbox" checked value="${s}" /> ${s}</label>`).join('');
}

function renderTopicSourceOptions() {
  const uniq = [...new Set(state.topics.map((t) => t.source))];
  $('topic-source').innerHTML = '<option value="all">All sources</option>' + uniq.map((s) => `<option value="${s}">${s}</option>`).join('');
}

function renderTopics() {
  const src = $('topic-source').value;
  const sorted = [...state.topics].sort((a, b) => state.topicSortDescending ? b.score - a.score : a.score - b.score);
  const rows = sorted.filter((t) => src === 'all' || t.source === src);

  $('topics-body').innerHTML = rows.map((t) => {
    const trendClass = t.trend === 'up' ? 'trend-up' : t.trend === 'flat' ? 'trend-flat' : 'trend-down';
    const trendLabel = t.trend === 'up' ? '↑ Rising' : t.trend === 'flat' ? '→ Stable' : '↓ Declining';
    return `<tr>
      <td><input type="checkbox" data-topic-id="${t.id}" ${t.selected ? 'checked' : ''} /></td>
      <td>${t.title}</td><td>${t.source}</td>
      <td><span class="badge">🔥 ${t.score}</span></td>
      <td class="${trendClass}">${trendLabel}</td>
      <td>${t.competition}</td>
    </tr>`;
  }).join('');
}

function renderEditor() {
  $('editor-list').innerHTML = [
    'Timeline Auto-generation: Intro + hook + body scenes + CTA',
    'Scene transitions: Fade, slide, zoom',
    'Audio layers: Voiceover + BGM + SFX',
    'Lower thirds + caption overlays',
    'Export: MP4 1080p / 4K',
  ].map((x) => `<div class="list-item">${x}</div>`).join('');
}

function renderCalendar() {
  const cells = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const tags = ['YouTube', 'Instagram', 'TikTok', 'LinkedIn'];
    return `<div class="calendar-cell"><span class="day">Day ${day}</span><span class="tag">${tags[i % tags.length]}</span></div>`;
  });
  $('calendar-grid').innerHTML = cells.join('');
}

function renderScheduler() {
  $('scheduler-list').innerHTML = [
    'YouTube: max 6/day',
    'Instagram: 10/day recommended',
    'Twitter/X: 2-3 posts/hour optimal',
    'TikTok: 1-4/day optimal',
    'Auto-spacing + conflict detection enabled',
  ].map((x) => `<div class="list-item">${x}</div>`).join('');

  $('queue-list').innerHTML = [
    'Queued: YouTube · 2026-02-15 09:00',
    'Queued: Instagram Reel · 2026-02-15 12:00',
    'Queued: LinkedIn Post · 2026-02-16 11:30',
    'Retry pending: TikTok Upload',
  ].map((x) => `<div class="list-item">${x}</div>`).join('');

  renderCalendar();
}

function renderAnalytics() {
  const cards = [['YouTube', '741K', '60%'], ['Instagram', '247K', '20%'], ['TikTok', '185K', '15%'], ['Facebook', '61K', '5%']];
  $('analytics-cards').innerHTML = cards.map(([p, v, share]) => `<article class="card"><p>${p} Views</p><h3>${v}</h3><span>Share: ${share}</span></article>`).join('');
  $('platform-chart').innerHTML = cards.map(([p, _, share]) => `<div class="bar-row"><span>${p}</span><div class="bar" style="width:${share}"></div><span>${share}</span></div>`).join('');
}

function renderRevenue() {
  $('revenue-list').innerHTML = ['YouTube AdSense: $540', 'Affiliate Marketing: $320', 'Sponsored Content: $210', 'Memberships: $177.50', 'Projected monthly total: $2,900']
    .map((x) => `<div class="list-item">${x}</div>`).join('');
  $('api-usage-list').innerHTML = ['Gemini API: 32% monthly quota', 'YouTube Data API: 80% quota', 'ElevenLabs: 18% character budget', 'Estimated API spend: $18.40 month-to-date']
    .map((x) => `<div class="list-item">${x}</div>`).join('');
}

function renderCompetitors() {
  $('competitor-list').innerHTML = state.competitors.map((x) => `<div class="list-item">${x}</div>`).join('');
}

function renderNotifications() {
  $('notification-list').innerHTML = [
    '✅ Content published on YouTube',
    '🔥 Viral topic discovered: AI workflow automation',
    '⏰ Scheduled Instagram reel goes live in 1 hour',
    '💰 Revenue milestone reached: $1,200',
    '⚠️ API error: TikTok publish failed, retry queued',
  ].map((x) => `<div class="list-item">${x}</div>`).join('');
}


function renderOnboarding() {
  const checks = [
    ['Account created', true],
    ['Connected at least 3 platforms', state.accounts.filter((a) => a.status === 'connected').length >= 3],
    ['Generated first topic batch', state.topics.length > 0],
    ['Generated script draft', !!$('script-output')?.value],
    ['Queued first post', true],
  ];
  $('onboarding-list').innerHTML = checks.map(([label, done]) => `<div class="list-item">${done ? '✅' : '⬜'} ${label}</div>`).join('');
}

function renderApiSettings() {
  $('api-settings-grid').innerHTML = API_CATALOG.map((api) => {
    const status = api.status === 'active' ? '✅ Active' : api.status === 'reauth_soon' ? '⚠️ Reauth soon' : '⚪ Not configured';
    return `<div class="list-item"><strong>${api.name}</strong><br><span class="subtle">Scopes: ${api.scope}</span><br>${status}</div>`;
  }).join('');
}

function renderSettings() {
  $('setting-niche').value = state.settings.niche;
  $('setting-timezone').value = state.settings.timezone;
  $('setting-theme').value = state.settings.theme;
  applyTheme();
}

function switchView(view) {
  state.view = view;
  document.querySelectorAll('#main-nav button').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('[data-panel]').forEach((p) => p.classList.toggle('active', p.dataset.panel === view));

  const titles = {
    dashboard: ['Command Center', 'Control research → generation → scheduling → publishing → analytics.'],
    accounts: ['Connected Accounts', 'Manage OAuth links, account health, and follower synchronization.'],
    research: ['Research Engine', 'Discover and score trends from 10+ sources with viral ranking.'],
    studio: ['AI Content Studio', 'Generate scripts, voices, visuals, presenter assets, and previews.'],
    editor: ['Video Editor', 'Assemble scenes, overlays, music, and transitions for export.'],
    blog: ['Blog & Web Stories', 'Convert scripts to SEO blog posts and AMP stories.'],
    scheduler: ['Scheduler', 'Plan, optimize, and queue posts with rule compliance.'],
    analytics: ['Analytics', 'Track reach, engagement, and growth across channels.'],
    monetization: ['Monetization', 'Monitor revenue streams, API costs, and projections.'],
    competitors: ['Competitors', 'Benchmark channels and detect strategy shifts.'],
    notifications: ['Notifications', 'Control alerts across channels.'],
    assistant: ['Developer Assistant', 'Use natural language to request integrations and upgrades.'],
    settings: ['Settings', 'Configure preferences, theme, timezone, and backup actions.'],
  };
  $('view-title').textContent = titles[view][0];
  $('view-subtitle').textContent = titles[view][1];
  saveState();
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  document.querySelectorAll('#main-nav button').forEach((btn) => btn.addEventListener('click', () => switchView(btn.dataset.view)));

  $('refresh-all').addEventListener('click', () => {
    state.accounts.forEach((a) => { if (a.status === 'connected') { a.followers += Math.floor(Math.random() * 500); a.rate = Math.min(95, a.rate + Math.floor(Math.random() * 3)); } });
    renderKPIs(); renderDashboard(); renderAccounts(); renderOnboarding(); saveState();
  });

  $('status-filter').addEventListener('change', renderAccounts);
  $('account-search').addEventListener('input', renderAccounts);

  $('accounts-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="toggle"]');
    if (!btn) return;
    const account = state.accounts.find((a) => a.name === btn.dataset.name);
    if (!account) return;
    if (account.status === 'connected') { account.status = 'offline'; account.followers = 0; account.rate = 0; }
    else { account.status = 'connected'; account.followers = 1200; account.rate = 20; }
    renderKPIs(); renderDashboard(); renderAccounts(); saveState();
  });

  $('disconnect-all').addEventListener('click', () => { state.accounts.forEach((a) => { a.status = 'offline'; a.followers = 0; a.rate = 0; }); renderKPIs(); renderDashboard(); renderAccounts(); saveState(); });
  $('reconnect-all').addEventListener('click', () => { state.accounts.forEach((a, i) => { a.status = 'connected'; a.followers = 1000 + i * 300; a.rate = 10 + i; }); renderKPIs(); renderDashboard(); renderAccounts(); saveState(); });
  $('refresh-followers').addEventListener('click', () => { state.accounts.forEach((a) => { if (a.status === 'connected') a.followers += Math.floor(Math.random() * 300); }); renderKPIs(); renderAccounts(); saveState(); });
  $('test-connections').addEventListener('click', () => alert(`Connection test completed: ${state.accounts.filter((a) => a.status === 'connected').length}/${state.accounts.length} connected.`));

  $('export-json').addEventListener('click', () => downloadFile('connected-accounts.json', JSON.stringify(state.accounts, null, 2), 'application/json'));
  $('export-csv').addEventListener('click', () => {
    const rows = ['platform,status,handle,followers,rate_limit', ...state.accounts.map((a) => `${a.name},${a.status},${a.handle},${a.followers},${a.rate}`)];
    downloadFile('connected-accounts.csv', rows.join('\n'), 'text/csv');
  });

  $('sort-score').addEventListener('click', () => { state.topicSortDescending = !state.topicSortDescending; $('sort-score').textContent = `Sort Viral Score ${state.topicSortDescending ? '↓' : '↑'}`; renderTopics(); saveState(); });
  $('topic-source').addEventListener('change', renderTopics);
  $('topics-body').addEventListener('change', (e) => {
    if (!e.target.matches('input[data-topic-id]')) return;
    const topic = state.topics.find((t) => t.id === Number(e.target.dataset.topicId));
    if (topic) topic.selected = e.target.checked;
    saveState();
  });

  $('run-research').addEventListener('click', () => {
    const niche = $('niche').value.trim() || state.settings.niche || 'AI content';
    const audience = $('audience').value;
    const depth = Number($('depth').value);
    const selectedSources = [...document.querySelectorAll('#source-picks input:checked')].map((x) => x.value);
    state.topics = Array.from({ length: Math.min(12, Math.ceil(depth / 8)) }, (_, i) => ({
      id: i + 1,
      title: `${niche} trend idea #${i + 1} (${audience})`,
      source: selectedSources[i % selectedSources.length] || 'YouTube',
      score: 60 + Math.floor(Math.random() * 40),
      trend: ['up', 'flat', 'down'][i % 3],
      competition: ['Low', 'Medium', 'High'][i % 3],
      selected: false,
    }));
    renderTopicSourceOptions(); renderTopics(); renderOnboarding(); saveState();
  });

  $('save-favorites').addEventListener('click', () => alert(`${state.topics.filter((t) => t.selected).length} topic(s) saved to favorites.`));

  $('generate-script').addEventListener('click', () => {
    const topic = $('script-topic').value.trim() || 'Untitled topic';
    const tone = $('tone').value;
    $('script-output').value = `Hook (0-8s): Stop scrolling, this ${tone.toLowerCase()} breakdown of ${topic} will save you hours.\n\nBody:\n1) Problem audience faces today\n2) High-retention framework\n3) Scene-by-scene production recipe\n4) Platform-specific CTA stack\n\nCTA: Follow for daily automation blueprints.`;
    $('script-score').textContent = `Overall: ${78 + Math.floor(Math.random() * 20)}/100`;
    $('seo-score').textContent = `SEO: ${75 + Math.floor(Math.random() * 20)}/100`;
    $('retention-score').textContent = `Retention: ${72 + Math.floor(Math.random() * 20)}/100`;
    renderOnboarding();
  });

  document.querySelectorAll('#studio-tabs button').forEach((btn) => btn.addEventListener('click', () => {
    document.querySelectorAll('#studio-tabs button').forEach((b) => b.classList.toggle('active', b === btn));
    document.querySelectorAll('[data-tab-panel]').forEach((p) => p.classList.toggle('active', p.dataset.tabPanel === btn.dataset.tab));
  }));

  $('convert-blog').addEventListener('click', () => {
    const script = $('script-output').value.trim() || 'No script available yet.';
    $('blog-output').value = `# SEO Blog Draft\n\n## Intro\n${script.slice(0, 240)}...\n\n## Key Points\n- Actionable workflow\n- Platform optimization\n- Retention hooks\n\n## FAQ\nQ: How often should I post?\nA: Follow platform-specific limits and track analytics weekly.`;
  });
  $('generate-web-story').addEventListener('click', () => { $('blog-output').value += '\n\n[AMP Web Story Generated]\n- Slide 1: Hook\n- Slide 2: Framework\n- Slide 3: CTA'; });

  $('assistant-send').addEventListener('click', () => {
    const input = $('assistant-input');
    const text = input.value.trim();
    if (!text) return;
    $('assistant-log').insertAdjacentHTML('afterbegin', `<div class="list-item"><strong>You:</strong> ${text}<br><strong>Assistant:</strong> Request logged. Suggested plan: API adapter → queue worker → UI status update → integration test.</div>`);
    input.value = '';
  });

  $('add-competitor').addEventListener('click', () => {
    const handle = $('competitor-input').value.trim();
    if (!handle) return;
    state.competitors.unshift(`${handle}: newly added competitor tracking enabled`);
    $('competitor-input').value = '';
    renderCompetitors(); saveState();
  });

  $('test-api-health').addEventListener('click', () => {
    const active = API_CATALOG.filter((a) => a.status === 'active').length;
    alert(`API health check complete: ${active}/${API_CATALOG.length} active integrations.`);
  });

  $('save-settings').addEventListener('click', () => {
    state.settings = { niche: $('setting-niche').value.trim() || 'AI tools', timezone: $('setting-timezone').value, theme: $('setting-theme').value };
    applyTheme(); renderDashboard(); saveState();
    alert('Preferences saved locally.');
  });

  $('export-state').addEventListener('click', () => downloadFile('workspace-backup.json', JSON.stringify(state, null, 2), 'application/json'));
  $('reset-demo').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
  $('install-pwa').addEventListener('click', async () => {
    if (!deferredPrompt) return alert('PWA install prompt not available in this environment.');
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });
}

function init() {
  renderKPIs();
  renderDashboard();
  renderAccounts();
  renderSources();
  renderTopicSourceOptions();
  renderTopics();
  renderEditor();
  renderScheduler();
  renderAnalytics();
  renderRevenue();
  renderCompetitors();
  renderNotifications();
  renderOnboarding();
  renderApiSettings();
  renderSettings();
  bindEvents();
  switchView(state.view || 'dashboard');

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}

init();
