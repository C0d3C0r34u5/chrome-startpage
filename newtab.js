"use strict";

const DEFAULT_PROFILE = { name: "Brett", emoji: "👋" };
const DEFAULT_LOCATION = {
  name: "Hobart",
  latitude: -42.8821,
  longitude: 147.3272,
};

const LS_KEYS = {
  shortcuts: "brett.shortcuts",
  unit: "brett.unit",
  location: "brett.location",
  profile: "brett.profile",
  engine: "brett.engine",
  notes: "brett.notes",
};

const ENGINES = [
  { id: "google", label: "Google", icon: "G", search: (q) => "https://www.google.com/search?q=" + encodeURIComponent(q) },
  { id: "duckduckgo", label: "DuckDuckGo", icon: "D", search: (q) => "https://duckduckgo.com/?q=" + encodeURIComponent(q) },
  { id: "youtube", label: "YouTube", icon: "▶", search: (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q) },
  { id: "brave", label: "Brave", icon: "B", search: (q) => "https://search.brave.com/search?q=" + encodeURIComponent(q) },
];

const QUOTES = [
  "Make it simple, but significant.",
  "Do what you can, with what you have, where you are.",
  "The secret of getting ahead is getting started.",
  "Small steps every day.",
  "Be so good they can't ignore you.",
  "Focus on progress, not perfection.",
  "Stay curious, stay kind.",
  "You don't have to be great to start, but you have to start to be great.",
  "Discipline is choosing between what you want now and what you want most.",
  "Well begun is half done.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Energy and persistence conquer all things.",
];

// WMO weather code -> { icon, label }
const WEATHER_CODES = {
  0: { icon: "☀️", label: "Clear sky" },
  1: { icon: "🌤️", label: "Mainly clear" },
  2: { icon: "⛅", label: "Partly cloudy" },
  3: { icon: "☁️", label: "Overcast" },
  45: { icon: "🌫️", label: "Fog" },
  48: { icon: "🌫️", label: "Rime fog" },
  51: { icon: "🌦️", label: "Light drizzle" },
  53: { icon: "🌦️", label: "Drizzle" },
  55: { icon: "🌧️", label: "Heavy drizzle" },
  56: { icon: "🌧️", label: "Freezing drizzle" },
  57: { icon: "🌧️", label: "Freezing drizzle" },
  61: { icon: "🌧️", label: "Light rain" },
  63: { icon: "🌧️", label: "Rain" },
  65: { icon: "🌧️", label: "Heavy rain" },
  66: { icon: "🌧️", label: "Freezing rain" },
  67: { icon: "🌧️", label: "Freezing rain" },
  71: { icon: "🌨️", label: "Light snow" },
  73: { icon: "🌨️", label: "Snow" },
  75: { icon: "❄️", label: "Heavy snow" },
  77: { icon: "❄️", label: "Snow grains" },
  80: { icon: "🌦️", label: "Light showers" },
  81: { icon: "🌧️", label: "Showers" },
  82: { icon: "⛈️", label: "Heavy showers" },
  85: { icon: "🌨️", label: "Snow showers" },
  86: { icon: "❄️", label: "Snow showers" },
  95: { icon: "⛈️", label: "Thunderstorm" },
  96: { icon: "⛈️", label: "Thunderstorm + hail" },
  99: { icon: "⛈️", label: "Thunderstorm + hail" },
};

const $ = (id) => document.getElementById(id);

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return fallback;
}

function getLocation() {
  const parsed = readJSON(LS_KEYS.location, null);
  if (parsed && typeof parsed.latitude === "number" && typeof parsed.longitude === "number") {
    return parsed;
  }
  return DEFAULT_LOCATION;
}

function setLocation(loc) {
  localStorage.setItem(LS_KEYS.location, JSON.stringify(loc));
}

function getUnit() {
  return localStorage.getItem(LS_KEYS.unit) || "c";
}

function setUnit(unit) {
  localStorage.setItem(LS_KEYS.unit, unit);
}

function getShortcuts() {
  const parsed = readJSON(LS_KEYS.shortcuts, []);
  return Array.isArray(parsed) ? parsed : [];
}

function setShortcuts(list) {
  localStorage.setItem(LS_KEYS.shortcuts, JSON.stringify(list));
}

function getProfile() {
  const parsed = readJSON(LS_KEYS.profile, null);
  if (parsed && typeof parsed.name === "string") {
    return { name: parsed.name, emoji: parsed.emoji || "" };
  }
  return DEFAULT_PROFILE;
}

function setProfile(profile) {
  localStorage.setItem(LS_KEYS.profile, JSON.stringify(profile));
}

function getEngineId() {
  return localStorage.getItem(LS_KEYS.engine) || "google";
}

function setEngineId(id) {
  localStorage.setItem(LS_KEYS.engine, id);
}

function getEngine() {
  const id = getEngineId();
  return ENGINES.find((e) => e.id === id) || ENGINES[0];
}

function getNotes() {
  return localStorage.getItem(LS_KEYS.notes) || "";
}

function setNotes(text) {
  localStorage.setItem(LS_KEYS.notes, text);
}

// ---- Clock, greeting & quote ----

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  $("clock").textContent = pad(hours12) + ":" + pad(now.getMinutes());
  $("ampm").textContent = ampm;

  $("date").textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const profile = getProfile();
  const emoji = profile.emoji ? profile.emoji + " " : "";
  $("greeting").textContent = emoji + greetingFor(hours) + ", " + profile.name;
}

function greetingFor(hours) {
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
}

function updateQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  $("quote").textContent = "“" + QUOTES[dayOfYear % QUOTES.length] + "”";
}

// ---- Weather ----

function cToF(c) {
  return c * 1.8 + 32;
}

function conv(c) {
  return getUnit() === "c" ? c : cToF(c);
}

function degLabel(c) {
  return Math.round(conv(c)) + "°";
}

let weatherData = null;

async function fetchWeather() {
  const loc = getLocation();

  try {
    const now = new Date();
    const daysSinceMonday = (now.getDay() + 6) % 7;
    const params = new URLSearchParams({
      latitude: String(loc.latitude),
      longitude: String(loc.longitude),
      current: "temperature_2m,apparent_temperature,weather_code",
      daily: "temperature_2m_max,temperature_2m_min,weather_code",
      past_days: String(daysSinceMonday),
      forecast_days: String(7 - daysSinceMonday),
      timezone: "auto",
    });
    const res = await fetch("https://api.open-meteo.com/v1/forecast?" + params.toString());
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    weatherData = { current: data.current, daily: data.daily, location: loc };
    renderCurrentWeather();
    renderForecast();
  } catch (e) {
    weatherData = null;
    $("weather-icon").textContent = "⚠️";
    $("weather-desc").textContent = "Unavailable";
    $("weather-temp").textContent = "--°";
    $("weather-city").textContent = loc.name || "—";
    $("forecast").innerHTML = "";
  }
}

function weatherInfo(code) {
  return WEATHER_CODES[code] || { icon: "🌡️", label: "—" };
}

function renderCurrentWeather() {
  if (!weatherData) return;
  const { current, location } = weatherData;
  const info = weatherInfo(current.weather_code);

  $("weather-icon").textContent = info.icon;
  $("weather-desc").textContent = info.label;
  $("weather-temp").textContent = degLabel(current.temperature_2m);
  $("weather-city").textContent =
    (location.name || "") + " · feels " + degLabel(current.apparent_temperature);
  $("weather").title =
    "Feels like " + degLabel(current.apparent_temperature) + " · " + info.label;
}

function weekdayShort(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString(undefined, { weekday: "short" });
}

function weekdayLong(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString(undefined, { weekday: "long" });
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function renderForecast() {
  const el = $("forecast");
  el.innerHTML = "";
  if (!weatherData || !weatherData.daily) return;
  const d = weatherData.daily;
  const days = d.time.length;
  const today = todayStr();

  for (let i = 0; i < days; i++) {
    const info = weatherInfo(d.weather_code[i]);
    const div = document.createElement("div");
    div.className = "fday";

    const name = document.createElement("span");
    name.className = "fday-name";
    name.textContent = d.time[i] === today ? "Today" : weekdayShort(d.time[i]);

    const icon = document.createElement("span");
    icon.className = "fday-icon";
    icon.textContent = info.icon;

    const temps = document.createElement("span");
    temps.className = "fday-temps";
    temps.innerHTML =
      degLabel(d.temperature_2m_max[i]) +
      ' <span class="lo">' +
      degLabel(d.temperature_2m_min[i]) +
      "</span>";

    div.appendChild(name);
    div.appendChild(icon);
    div.appendChild(temps);
    el.appendChild(div);
  }
}

function toggleUnit() {
  setUnit(getUnit() === "c" ? "f" : "c");
  updateUnitButton();
  renderCurrentWeather();
  renderForecast();
}

function updateUnitButton() {
  $("unit-toggle").textContent = getUnit() === "c" ? "°F" : "°C";
}

// ---- Forecast dialog ----

function openForecastDialog() {
  if (!weatherData || !weatherData.daily) return;
  $("forecast-title").textContent = "7-day forecast · " + (weatherData.location.name || "");
  const list = $("forecast-list");
  list.innerHTML = "";
  const d = weatherData.daily;
  const days = d.time.length;
  const today = todayStr();

  for (let i = 0; i < days; i++) {
    const info = weatherInfo(d.weather_code[i]);
    const li = document.createElement("li");

    const icon = document.createElement("span");
    icon.className = "frow-icon";
    icon.textContent = info.icon;

    const body = document.createElement("span");
    body.className = "frow-body";
    const day = document.createElement("span");
    day.className = "frow-day";
    day.textContent = d.time[i] === today ? "Today" : weekdayLong(d.time[i]);
    const desc = document.createElement("span");
    desc.className = "frow-desc";
    desc.textContent = info.label;
    body.appendChild(day);
    body.appendChild(desc);

    const temps = document.createElement("span");
    temps.className = "frow-temps";
    temps.innerHTML =
      degLabel(d.temperature_2m_max[i]) +
      ' <span class="lo">' +
      degLabel(d.temperature_2m_min[i]) +
      "</span>";

    li.appendChild(icon);
    li.appendChild(body);
    li.appendChild(temps);
    list.appendChild(li);
  }

  $("forecast-dialog").showModal();
}

// ---- Shortcuts ----

function domainOf(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return "";
  }
}

function faviconUrl(url) {
  const host = domainOf(url);
  if (!host) return "";
  return "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(host) + "&sz=64";
}

function renderShortcuts() {
  const grid = $("shortcut-grid");
  grid.innerHTML = "";
  const shortcuts = getShortcuts();

  shortcuts.forEach((s, i) => {
    const a = document.createElement("a");
    a.className = "tile";
    a.href = s.url;
    a.title = s.name;

    const icon = document.createElement("span");
    icon.className = "tile-icon";
    const letter = document.createElement("span");
    letter.className = "tile-letter";
    letter.textContent = (s.name || "?").charAt(0).toUpperCase();
    icon.appendChild(letter);

    if (s.url) {
      const img = document.createElement("img");
      img.src = faviconUrl(s.url);
      img.alt = "";
      img.onload = () => {
        letter.style.display = "none";
      };
      img.onerror = () => {
        img.remove();
      };
      icon.appendChild(img);
    }

    const name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = s.name;

    const del = document.createElement("button");
    del.className = "tile-delete";
    del.textContent = "×";
    del.type = "button";
    del.title = "Remove";
    del.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeShortcut(i);
    });

    a.appendChild(icon);
    a.appendChild(name);
    a.appendChild(del);

    a.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      editShortcut(i);
    });

    grid.appendChild(a);
  });

  updateEditingHint();
}

function addShortcut() {
  openEditDialog(-1);
}

function editShortcut(index) {
  openEditDialog(index);
}

function removeShortcut(index) {
  const list = getShortcuts();
  list.splice(index, 1);
  setShortcuts(list);
  renderShortcuts();
}

// ---- Edit dialog ----

function openEditDialog(index) {
  const list = getShortcuts();
  if (index >= 0 && index < list.length) {
    $("edit-title").textContent = "Edit shortcut";
    $("edit-name").value = list[index].name;
    $("edit-url").value = list[index].url;
    $("edit-index").value = String(index);
  } else {
    $("edit-title").textContent = "Add shortcut";
    $("edit-name").value = "";
    $("edit-url").value = "";
    $("edit-index").value = "-1";
  }
  $("edit-dialog").showModal();
  $("edit-name").focus();
}

function saveEdit(event) {
  event.preventDefault();
  const name = $("edit-name").value.trim();
  let url = $("edit-url").value.trim();
  const index = parseInt($("edit-index").value, 10);

  if (!name || !url) return;

  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  const list = getShortcuts();
  const entry = { name, url };
  if (index >= 0 && index < list.length) {
    list[index] = entry;
  } else {
    list.push(entry);
  }
  setShortcuts(list);
  renderShortcuts();
  $("edit-dialog").close();
}

// ---- Location dialog ----

let locationResults = [];

function openLocationDialog() {
  $("location-search").value = "";
  $("location-results").innerHTML = "";
  locationResults = [];
  $("location-dialog").showModal();
  $("location-search").focus();
}

async function searchLocation(query) {
  if (!query.trim()) {
    $("location-results").innerHTML = "";
    locationResults = [];
    return;
  }
  try {
    const params = new URLSearchParams({
      name: query.trim(),
      count: "8",
      language: "en",
      format: "json",
    });
    const res = await fetch("https://geocoding-api.open-meteo.com/v1/search?" + params.toString());
    if (!res.ok) return;
    const data = await res.json();
    locationResults = (data.results || []).map((r) => ({
      name: r.name,
      admin1: r.admin1,
      country: r.country,
      latitude: r.latitude,
      longitude: r.longitude,
    }));
    renderLocationResults();
  } catch (e) {}
}

function renderLocationResults() {
  const ul = $("location-results");
  ul.innerHTML = "";
  locationResults.forEach((r) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = r.name;
    const sub = document.createElement("span");
    sub.className = "sub";
    sub.textContent = [r.admin1, r.country].filter(Boolean).join(", ");
    li.appendChild(label);
    li.appendChild(sub);
    li.addEventListener("click", () => chooseLocation(r));
    ul.appendChild(li);
  });
}

function chooseLocation(r) {
  setLocation({ name: r.name, latitude: r.latitude, longitude: r.longitude });
  $("location-dialog").close();
  fetchWeather();
}

function useCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not available.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setLocation({
        name: "My location",
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      $("location-dialog").close();
      fetchWeather();
    },
    () => {
      alert("Could not get your location.");
    }
  );
}

function updateEditingHint() {
  const grid = $("shortcut-grid");
  if (getShortcuts().length === 0) {
    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "Right-click a tile to edit, or use the + button to add one.";
    hint.style.cssText =
      "grid-column: 1 / -1; text-align: center; color: var(--muted); font-size: 0.85rem;";
    grid.appendChild(hint);
  }
}

// ---- Search engines ----

function renderEngines() {
  const container = $("engines");
  container.innerHTML = "";
  const activeId = getEngineId();

  ENGINES.forEach((engine) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "engine" + (engine.id === activeId ? " active" : "");
    btn.textContent = engine.icon;
    btn.title = "Search with " + engine.label;
    btn.addEventListener("click", () => {
      setEngineId(engine.id);
      renderEngines();
      $("search-input").focus();
    });
    container.appendChild(btn);
  });
}

function doSearch() {
  const query = $("search-input").value.trim();
  if (!query) return;
  window.location.href = getEngine().search(query);
}

// ---- Notes ----

function openNotes() {
  $("notes-panel").classList.add("open");
  $("notes-panel").setAttribute("aria-hidden", "false");
  $("notes-textarea").focus();
}

function closeNotes() {
  $("notes-panel").classList.remove("open");
  $("notes-panel").setAttribute("aria-hidden", "true");
}

function toggleNotes() {
  if ($("notes-panel").classList.contains("open")) {
    closeNotes();
  } else {
    openNotes();
  }
}

// ---- Settings dialog ----

function openSettings() {
  const profile = getProfile();
  $("settings-name").value = profile.name;
  $("settings-emoji").value = profile.emoji;
  $("settings-dialog").showModal();
  $("settings-name").focus();
}

function saveSettings(event) {
  event.preventDefault();
  const name = $("settings-name").value.trim() || "Brett";
  const emoji = $("settings-emoji").value.trim();
  setProfile({ name, emoji });
  updateClock();
  $("settings-dialog").close();
}

// ---- Keyboard shortcuts ----

function handleKeydown(e) {
  const target = e.target;
  const typing =
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable);

  if (document.querySelector("dialog[open]")) return;

  if (e.key === "/" && !typing) {
    e.preventDefault();
    $("search-input").focus();
    return;
  }

  if (!typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) {
      const s = getShortcuts()[n - 1];
      if (s) window.location.href = s.url;
    }
  }
}

// ---- Init ----

function init() {
  updateClock();
  setInterval(updateClock, 1000);

  updateQuote();

  renderEngines();
  updateUnitButton();
  fetchWeather();
  setInterval(fetchWeather, 10 * 60 * 1000);

  renderShortcuts();

  $("notes-textarea").value = getNotes();

  $("unit-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleUnit();
  });
  $("location-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openLocationDialog();
  });
  $("weather").addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    openForecastDialog();
  });

  $("add-tile").addEventListener("click", addShortcut);
  $("edit-form").addEventListener("submit", saveEdit);
  $("edit-cancel").addEventListener("click", () => $("edit-dialog").close());
  $("location-cancel").addEventListener("click", () => $("location-dialog").close());
  $("location-use-current").addEventListener("click", useCurrentLocation);
  $("forecast-close").addEventListener("click", () => $("forecast-dialog").close());

  $("notes-btn").addEventListener("click", toggleNotes);
  $("notes-close").addEventListener("click", closeNotes);
  $("notes-textarea").addEventListener("input", (e) => setNotes(e.target.value));

  $("settings-btn").addEventListener("click", openSettings);
  $("settings-form").addEventListener("submit", saveSettings);
  $("settings-cancel").addEventListener("click", () => $("settings-dialog").close());

  let searchTimer;
  $("location-search").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchLocation(e.target.value), 250);
  });

  $("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    doSearch();
  });

  document.addEventListener("keydown", handleKeydown);
}

document.addEventListener("DOMContentLoaded", init);
