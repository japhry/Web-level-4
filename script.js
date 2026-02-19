/**
 * Japhařy System - Project Management Dashboard
 * Coded by japhary from Pixellinx (https://pixellinx.co.tz/)
 * Functional enhancements: search, add project, notifications, menus, persistence.
 */

(function () {
  'use strict';

  // --- Theme (persist) ---
  function initTheme() {
    var saved = localStorage.getItem('japhary-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      document.querySelector('.mode-switch')?.classList.add('active');
    }
  }

  function setTheme(dark) {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.querySelector('.mode-switch')?.classList.add('active');
      localStorage.setItem('japhary-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.querySelector('.mode-switch')?.classList.remove('active');
      localStorage.setItem('japhary-theme', 'light');
    }
  }

  // --- Live date in header ---
  function updateHeaderDate() {
    var timeEl = document.querySelector('.projects-section-header .time');
    if (timeEl) {
      var now = new Date();
      timeEl.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  }

  // --- Project card colors (match existing look) ---
  var CARD_BG = ['#fee4cb', '#e9e7fd', '#dbf6fd', '#ffd3e2', '#c8f7dc', '#d5deff'];
  var ACCENT = ['#ff942e', '#4f3ff0', '#096c86', '#df3670', '#34c471', '#4067f9'];

  // --- Stats: derive from DOM and update display ---
  function updateStats() {
    var boxes = document.querySelectorAll('.project-boxes .project-box');
    var inProgress = 0, upcoming = 0;
    boxes.forEach(function (box) {
      var pct = parseInt(box.querySelector('.box-progress-percentage')?.textContent || '0', 10);
      if (pct > 0 && pct < 100) inProgress++;
      else if (pct === 0) upcoming++;
    });
    var total = boxes.length;
    var statusNumbers = document.querySelectorAll('.status-number');
    if (statusNumbers.length >= 3) {
      statusNumbers[0].textContent = inProgress;
      statusNumbers[1].textContent = upcoming;
      statusNumbers[2].textContent = total;
    }
  }

  // --- Create one project card DOM (same structure as existing) ---
  function createProjectCard(data) {
    var id = data.id || 'p-' + Date.now();
    var bg = data.bg || CARD_BG[Math.floor(Math.random() * CARD_BG.length)];
    var accent = data.accent || ACCENT[Math.floor(Math.random() * ACCENT.length)];
    var date = data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    var title = data.title || 'New Project';
    var sub = data.subtitle || 'Prototyping';
    var progress = Math.min(100, Math.max(0, parseInt(data.progress, 10) || 0));
    var daysLeft = data.daysLeft != null ? data.daysLeft : Math.max(0, Math.floor(Math.random() * 14) + 1);

    var wrapper = document.createElement('div');
    wrapper.className = 'project-box-wrapper';
    wrapper.setAttribute('data-project-id', id);

    wrapper.innerHTML =
      '<div class="project-box" style="background-color:' + bg + '">' +
        '<div class="project-box-header">' +
          '<span>' + escapeHtml(date) + '</span>' +
          '<div class="more-wrapper">' +
            '<button class="project-btn-more" type="button" aria-label="More options">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical">' +
                '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="project-box-content-header">' +
          '<p class="box-content-header">' + escapeHtml(title) + '</p>' +
          '<p class="box-content-subheader">' + escapeHtml(sub) + '</p>' +
        '</div>' +
        '<div class="box-progress-wrapper">' +
          '<p class="box-progress-header">Progress</p>' +
          '<div class="box-progress-bar">' +
            '<span class="box-progress" style="width:' + progress + '%; background-color:' + accent + '"></span>' +
          '</div>' +
          '<p class="box-progress-percentage">' + progress + '%</p>' +
        '</div>' +
        '<div class="project-box-footer">' +
          '<div class="participants">' +
            '<span class="avatar-initials avatar-sm" title="Team">A</span>' +
            '<span class="avatar-initials avatar-sm" title="Team">B</span>' +
            '<button class="add-participant" style="color:' + accent + ';" type="button" aria-label="Add participant">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="days-left" style="color:' + accent + ';">' + daysLeft + ' Day' + (daysLeft !== 1 ? 's' : '') + ' Left</div>' +
        '</div>' +
      '</div>';

    return wrapper;
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // --- Add Project modal ---
  var modalEl = null;

  function getModal() {
    if (modalEl) return modalEl;
    var overlay = document.createElement('div');
    overlay.className = 'japhary-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Add new project');

    var content = document.createElement('div');
    content.className = 'japhary-modal-content';
    content.innerHTML =
      '<div class="japhary-modal-header">' +
        '<h2 class="japhary-modal-title">Add New Project</h2>' +
        '<button type="button" class="japhary-modal-close" aria-label="Close">&times;</button>' +
      '</div>' +
      '<form class="japhary-modal-form">' +
        '<label><span>Project name</span><input type="text" name="title" required placeholder="e.g. Web Designing"></label>' +
        '<label><span>Subtitle</span><input type="text" name="subtitle" placeholder="e.g. Prototyping"></label>' +
        '<label><span>Progress (%)</span><input type="number" name="progress" min="0" max="100" value="0"></label>' +
        '<label><span>Days left</span><input type="number" name="daysLeft" min="0" value="7"></label>' +
        '<div class="japhary-modal-actions">' +
          '<button type="button" class="japhary-btn-secondary japhary-modal-cancel">Cancel</button>' +
          '<button type="submit" class="japhary-btn-primary">Add Project</button>' +
        '</div>' +
      '</form>';
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    modalEl = overlay;

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    content.querySelector('.japhary-modal-close').addEventListener('click', closeModal);
    content.querySelector('.japhary-modal-cancel').addEventListener('click', closeModal);
    content.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      addProject({
        title: fd.get('title') || 'New Project',
        subtitle: fd.get('subtitle') || 'Prototyping',
        progress: parseInt(fd.get('progress'), 10) || 0,
        daysLeft: parseInt(fd.get('daysLeft'), 10) || 7
      });
      closeModal();
      e.target.reset();
      showToast('Project added');
    });
    return overlay;
  }

  function openModal() {
    getModal().classList.add('japhary-modal-open');
    document.body.style.overflow = 'hidden';
    getModal().querySelector('input[name="title"]').focus();
  }

  function closeModal() {
    if (modalEl) {
      modalEl.classList.remove('japhary-modal-open');
      document.body.style.overflow = '';
    }
  }

  function addProject(data) {
    var container = document.querySelector('.project-boxes');
    if (!container) return;
    var card = createProjectCard(data);
    container.appendChild(card);
    bindProjectCard(card);
    updateStats();
  }

  // --- Project card: more menu, bind events ---
  function bindProjectCard(wrapper) {
    var box = wrapper.querySelector('.project-box');
    var moreBtn = wrapper.querySelector('.project-btn-more');
    var moreWrapper = wrapper.querySelector('.more-wrapper');
    if (!moreBtn || !moreWrapper) return;

    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllDropdowns();
      var list = moreWrapper.querySelector('.japhary-dropdown');
      if (list) {
        list.classList.remove('japhary-dropdown-open');
        list.remove();
        return;
      }
      var dropdown = document.createElement('div');
      dropdown.className = 'japhary-dropdown japhary-dropdown-open';
      dropdown.innerHTML =
        '<button type="button" class="japhary-dropdown-item" data-action="progress">Update progress</button>' +
        '<button type="button" class="japhary-dropdown-item" data-action="delete">Delete project</button>';
      moreWrapper.appendChild(dropdown);

      dropdown.querySelector('[data-action="progress"]').addEventListener('click', function () {
        var pct = prompt('Progress (0–100):', wrapper.querySelector('.box-progress-percentage')?.textContent?.replace('%', '') || '0');
        if (pct == null) return;
        var n = Math.min(100, Math.max(0, parseInt(pct, 10)));
        if (!isNaN(n)) {
          wrapper.querySelector('.box-progress').style.width = n + '%';
          wrapper.querySelector('.box-progress-percentage').textContent = n + '%';
          updateStats();
          showToast('Progress updated to ' + n + '%');
        }
        dropdown.remove();
      });
      dropdown.querySelector('[data-action="delete"]').addEventListener('click', function () {
        wrapper.remove();
        updateStats();
        showToast('Project removed');
        dropdown.remove();
      });
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.japhary-dropdown').forEach(function (el) { el.remove(); });
  }

  document.addEventListener('click', closeAllDropdowns);

  // --- Notifications dropdown ---
  var notifList = null;

  function getNotifDropdown() {
    if (notifList) return notifList;
    notifList = document.createElement('div');
    notifList.className = 'japhary-notif-dropdown';
    notifList.setAttribute('aria-label', 'Notifications');
    notifList.innerHTML =
      '<div class="japhary-notif-header">Notifications</div>' +
      '<div class="japhary-notif-items">' +
        '<div class="japhary-notif-item">Sister Konso commented on Web Designing</div>' +
        '<div class="japhary-notif-item">Jonathan requested an update on Testing</div>' +
        '<div class="japhary-notif-item">New assignment available</div>' +
      '</div>';
    document.body.appendChild(notifList);
    return notifList;
  }

  function toggleNotif(e) {
    e.stopPropagation();
    var btn = document.querySelector('.notification-btn');
    var dd = getNotifDropdown();
    var open = dd.classList.toggle('japhary-notif-open');
    if (open) {
      var r = btn.getBoundingClientRect();
      dd.style.top = (r.bottom + 6) + 'px';
      dd.style.left = (r.left) + 'px';
    }
  }

  document.addEventListener('click', function () {
    getNotifDropdown().classList.remove('japhary-notif-open');
  });

  // --- Search: filter projects and messages ---
  function onSearchInput() {
    var q = (document.querySelector('.search-input')?.value || '').trim().toLowerCase();
    var projectWrappers = document.querySelectorAll('.project-boxes .project-box-wrapper');
    var messageBoxes = document.querySelectorAll('.message-box');
    var matchProject = function (wrapper) {
      var text = (wrapper.querySelector('.box-content-header')?.textContent || '') +
                 (wrapper.querySelector('.box-content-subheader')?.textContent || '');
      return !q || text.toLowerCase().includes(q);
    };
    var matchMessage = function (box) {
      var text = (box.querySelector('.name')?.textContent || '') +
                 (box.querySelector('.message-line:not(.time)')?.textContent || '');
      return !q || text.toLowerCase().includes(q);
    };
    projectWrappers.forEach(function (w) {
      w.style.display = matchProject(w) ? '' : 'none';
    });
    messageBoxes.forEach(function (m) {
      m.style.display = matchMessage(m) ? '' : 'none';
    });
  }

  // --- Messages: star persistence (reorder starred to top) ---
  function initStarredMessages() {
    var starred = [];
    try {
      var s = localStorage.getItem('japhary-starred');
      if (s) starred = JSON.parse(s);
    } catch (_) {}
    document.querySelectorAll('.star-checkbox input').forEach(function (cb) {
      var id = cb.id;
      if (!id) return;
      if (starred.indexOf(id) !== -1) cb.checked = true;
      cb.addEventListener('change', function () {
        if (cb.checked) {
          if (starred.indexOf(id) === -1) starred.push(id);
        } else {
          starred = starred.filter(function (x) { return x !== id; });
        }
        localStorage.setItem('japhary-starred', JSON.stringify(starred));
        reorderMessages();
      });
    });
    reorderMessages();
  }

  function reorderMessages() {
    var container = document.querySelector('.messages');
    if (!container) return;
    var boxes = Array.from(container.querySelectorAll('.message-box'));
    var starred = [];
    try {
      starred = JSON.parse(localStorage.getItem('japhary-starred') || '[]');
    } catch (_) {}
    boxes.sort(function (a, b) {
      var aId = a.querySelector('.star-checkbox input')?.id;
      var bId = b.querySelector('.star-checkbox input')?.id;
      var aStar = aId && starred.indexOf(aId) !== -1 ? 1 : 0;
      var bStar = bId && starred.indexOf(bId) !== -1 ? 1 : 0;
      return bStar - aStar;
    });
    boxes.forEach(function (b) { container.appendChild(b); });
  }

  // --- Toast ---
  function showToast(message) {
    var t = document.createElement('div');
    t.className = 'japhary-toast';
    t.textContent = message;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('japhary-toast-show'); });
    setTimeout(function () {
      t.classList.remove('japhary-toast-show');
      setTimeout(function () { t.remove(); }, 300);
    }, 2500);
  }

  // --- Page routing (hash-based, so links work when hosted) ---
  var currentCalendarDate = new Date();

  function getPageFromHash() {
    var hash = (window.location.hash || '#home').replace('#', '') || 'home';
    return ['home', 'analytics', 'calendar', 'settings'].indexOf(hash) !== -1 ? hash : 'home';
  }

  function showPage(pageId) {
    var pages = document.querySelectorAll('.page');
    var links = document.querySelectorAll('.app-sidebar-link[data-page]');
    pages.forEach(function (p) {
      var isActive = p.classList.contains('page-' + pageId);
      p.classList.toggle('active', isActive);
      p.setAttribute('aria-hidden', !isActive);
    });
    links.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('data-page') === pageId);
    });
    window.location.hash = pageId;
    if (pageId === 'calendar') renderCalendar();
    if (pageId === 'analytics') {
      updateAnalyticsTime();
      updateAnalyticsHero();
    }
    if (pageId === 'settings') updateSettingsTime();
  }

  function updateAnalyticsTime() {
    var el = document.querySelector('.analytics-time');
    if (el) el.textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  var CHART_COLORS = ['#4f3ff0', '#34c471', '#ff942e', '#096c86', '#df3670', '#4067f9'];

  function updateAnalyticsHero() {
    var boxes = document.querySelectorAll('.project-boxes .project-box');
    var inProgress = 0;
    boxes.forEach(function (box) {
      var pct = parseInt(box.querySelector('.box-progress-percentage')?.textContent || '0', 10);
      if (pct > 0 && pct < 100) inProgress++;
    });
    var totalEl = document.getElementById('analytics-total');
    var wipEl = document.getElementById('analytics-inprogress');
    if (totalEl) totalEl.textContent = boxes.length;
    if (wipEl) wipEl.textContent = inProgress;
    renderAnalyticsChart();
  }

  function renderAnalyticsChart() {
    var container = document.getElementById('analytics-chart-bars');
    if (!container) return;
    var boxes = document.querySelectorAll('.project-boxes .project-box');
    var items = [];
    boxes.forEach(function (box, i) {
      var titleEl = box.querySelector('.box-content-header');
      var pctEl = box.querySelector('.box-progress-percentage');
      var barEl = box.querySelector('.box-progress');
      var title = (titleEl && titleEl.textContent) ? titleEl.textContent.trim() : 'Project ' + (i + 1);
      var pct = 0;
      if (pctEl) {
        var match = (pctEl.textContent || '').match(/\d+/);
        if (match) pct = Math.min(100, Math.max(0, parseInt(match[0], 10)));
      }
      var color = CHART_COLORS[i % CHART_COLORS.length];
      if (barEl && barEl.style && barEl.style.backgroundColor) color = barEl.style.backgroundColor;
      items.push({ title: title, pct: pct, color: color });
    });
    if (items.length === 0) {
      container.innerHTML = '<div class="analytics-chart-empty">Add projects on Home — their progress will show here as bars</div>';
      container.classList.add('analytics-chart--empty');
      container.removeAttribute('data-bar-count');
      return;
    }
    container.classList.remove('analytics-chart--empty');
    container.setAttribute('data-bar-count', String(items.length));
    container.innerHTML = items.map(function (item) {
      var short = item.title.length > 12 ? item.title.slice(0, 10) + '…' : item.title;
      return '<div class="analytics-bar-wrap">' +
        '<span class="analytics-bar-label" title="' + escapeAttr(item.title) + '">' + escapeHtml(short) + '</span>' +
        '<span class="analytics-bar-pct">' + item.pct + '%</span>' +
        '<div class="analytics-bar" style="--h:' + item.pct + '%; --c:' + item.color + ';" title="' + escapeAttr(item.title) + ' · ' + item.pct + '%"></div>' +
        '</div>';
    }).join('');
  }

  function escapeAttr(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML.replace(/"/g, '&quot;');
  }

  function updateSettingsTime() {
    var el = document.querySelector('.settings-time');
    if (el) el.textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function renderCalendar() {
    var container = document.getElementById('calendar-days');
    var titleEl = document.querySelector('.calendar-month-year');
    var timeEl = document.querySelector('.calendar-time');
    if (!container) return;
    var y = currentCalendarDate.getFullYear();
    var m = currentCalendarDate.getMonth();
    if (titleEl) titleEl.textContent = currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (timeEl) timeEl.textContent = currentCalendarDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    var first = new Date(y, m, 1);
    var last = new Date(y, m + 1, 0);
    var startPad = first.getDay();
    var daysInMonth = last.getDate();
    var prevMonth = new Date(y, m, 0);
    var prevDays = prevMonth.getDate();
    container.innerHTML = '';
    for (var i = 0; i < startPad; i++) {
      var d = document.createElement('div');
      d.className = 'calendar-day other-month';
      d.textContent = prevDays - startPad + i + 1;
      container.appendChild(d);
    }
    var today = new Date();
    for (var j = 1; j <= daysInMonth; j++) {
      var day = document.createElement('div');
      day.className = 'calendar-day';
      day.textContent = j;
      if (today.getFullYear() === y && today.getMonth() === m && today.getDate() === j) day.classList.add('today');
      container.appendChild(day);
    }
    var total = startPad + daysInMonth;
    var remainder = total % 7;
    var nextCount = remainder ? 7 - remainder : 0;
    for (var k = 1; k <= nextCount; k++) {
      var nd = document.createElement('div');
      nd.className = 'calendar-day other-month';
      nd.textContent = k;
      container.appendChild(nd);
    }
  }

  function initSidebar() {
    document.querySelectorAll('.app-sidebar-link[data-page]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showPage(link.getAttribute('data-page'));
      });
    });
    window.addEventListener('hashchange', function () { showPage(getPageFromHash()); });
    var prevBtn = document.querySelector('.calendar-prev');
    var nextBtn = document.querySelector('.calendar-next');
    if (prevBtn) prevBtn.addEventListener('click', function () {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
      renderCalendar();
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // --- Grid / List view (existing) ---
  function initViewSwitch() {
    var listView = document.querySelector('.list-view');
    var gridView = document.querySelector('.grid-view');
    var projectsList = document.querySelector('.project-boxes');
    if (!listView || !gridView || !projectsList) return;
    listView.addEventListener('click', function () {
      gridView.classList.remove('active');
      listView.classList.add('active');
      projectsList.classList.remove('jsGridView');
      projectsList.classList.add('jsListView');
    });
    gridView.addEventListener('click', function () {
      gridView.classList.add('active');
      listView.classList.remove('active');
      projectsList.classList.remove('jsListView');
      projectsList.classList.add('jsGridView');
    });
  }

  // --- Messages panel open/close ---
  function initMessagesPanel() {
    document.querySelector('.messages-btn')?.addEventListener('click', function () {
      document.querySelector('.messages-section')?.classList.add('show');
    });
    document.querySelector('.messages-close')?.addEventListener('click', function () {
      document.querySelector('.messages-section')?.classList.remove('show');
    });
  }

  // --- Keyboard shortcuts ---
  function initKeyboard() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
        getNotifDropdown().classList.remove('japhary-notif-open');
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
      }
    });
  }

  // --- Init all ---
  function init() {
    initTheme();
    updateHeaderDate();
    setInterval(updateHeaderDate, 60000);
    showPage(getPageFromHash());

    document.querySelector('.mode-switch')?.addEventListener('click', function () {
      var dark = document.documentElement.classList.toggle('dark');
      this.classList.toggle('active');
      setTheme(dark);
    });

    document.querySelector('.add-btn')?.addEventListener('click', openModal);
    document.querySelector('.notification-btn')?.addEventListener('click', toggleNotif);
    document.querySelector('.search-input')?.addEventListener('input', onSearchInput);

    initSidebar();
    initViewSwitch();
    initMessagesPanel();
    initStarredMessages();
    initKeyboard();

    document.querySelectorAll('.project-boxes .project-box-wrapper').forEach(bindProjectCard);
    updateStats();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
