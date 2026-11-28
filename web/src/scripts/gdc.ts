import { regions, makeExercise, type Pattern } from "./gdc-exercises";
function element<T extends HTMLElement = HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}
const input = (id: string) => element<HTMLInputElement>(id);
const select = (id: string) => element<HTMLSelectElement>(id);
const number = (id: string) => Number(input(id).value);
const write = (id: string, value: string) => {
  element(id).textContent = value;
};
function bounded(id: string) {
  const field = input(id);
  const value =
    field.value === "" ? Number(field.defaultValue) : Math.round(number(id));
  return Math.min(Number(field.max), Math.max(Number(field.min), value));
}
const scales: Record<string, number[]> = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  "Natural minor": [0, 2, 3, 5, 7, 8, 10],
  "Harmonic minor": [0, 2, 3, 5, 7, 8, 11],
  "Phrygian dominant": [0, 1, 4, 5, 7, 8, 10],
};
const accents: Record<string, number[]> = {
  "4/4": [2, 1, 1, 1],
  "3/4": [2, 1, 1],
  "6/8": [2, 1, 1, 3, 1, 1],
  "5/4": [2, 1, 1, 3, 1],
  "7/8": [2, 1, 3, 1, 3, 1, 1],
};
const states = ["Mute", "Base", "Accent", "Secondary"];
let pattern: number[] = [];
let sequence: { midi: number; string: number; fret: number }[] = [];
let cursor = 0;
let iteration = 0;
let chordNames: string[] = [];
let triads: number[][] = [];
let barNumber = 0;
let displayedBar = 0;
let displayedNote = -1;
let gearStep = 0;
function progression() {
  return [0, 1, 2, 3].map((i) => number("chord" + i)).filter((i) => i >= 0);
}
function showChords(active = -1) {
  const strip = element("changes");
  const degree = progression()[Math.max(0, active)];
  const pitches = triads[degree]?.map((n) => n % 12) ?? [];
  element("keyboard")
    .querySelectorAll<HTMLElement>("i")
    .forEach((key) => {
      key.classList.toggle(
        "in-chord",
        pitches.includes(Number(key.dataset.pitch)),
      );
    });
  strip.replaceChildren(
    ...progression().map((degree, i) => {
      const chip = document.createElement("span");
      chip.textContent = chordNames[degree];
      if (i === active) chip.className = "current";
      return chip;
    }),
  );
}
function rhythm() {
  write(
    "rhythm",
    select("meter").value +
      " · " +
      bounded("bpm") +
      " BPM · " +
      pattern.length * number("division") +
      " notes/bar",
  );
}
function arrange() {
  const key = number("key");
  select("theory-key").value = String(key);
  const name = select("key").selectedOptions[0].text;
  const mode = select("scale").value;
  const degrees = scales[mode];
  element("keyboard")
    .querySelectorAll<HTMLElement>("i")
    .forEach((k) =>
      k.classList.toggle(
        "in-scale",
        degrees.includes((Number(k.dataset.pitch) - key + 12) % 12),
      ),
    );
  select("theory-mode").value = mode;
  const letters = "CDEFGAB";
  const natural = [0, 2, 4, 5, 7, 9, 11];
  const notes = degrees.map((interval, i) => {
    const letter = (letters.indexOf(name[0]) + i) % 7;
    const offset = ((key + interval - natural[letter] + 18) % 12) - 6;
    return letters[letter] + (offset >= 0 ? "♯" : "♭").repeat(Math.abs(offset));
  });
  write("tonic", notes.join(" · "));
  const body = element("harmony");
  body.replaceChildren();
  write("keyname", name + " " + mode);
  const relatives: Record<string, string> = {
    Major: "Relative: " + notes[5] + " minor",
    "Natural minor": "Relative: " + notes[2] + " major",
    "Harmonic minor": "Related mode: " + notes[4] + " Phrygian dominant",
    "Phrygian dominant": "Parent scale: " + notes[3] + " harmonic minor",
  };
  write("relative", relatives[mode]);
  chordNames = [];
  triads = [];
  degrees.forEach((root, i) => {
    const third = (degrees[(i + 2) % 7] - root + 12) % 12;
    const fifth = (degrees[(i + 4) % 7] - root + 12) % 12;
    const quality =
      fifth === 6 ? "dim" : fifth === 8 ? "aug" : third === 3 ? "m" : "";
    chordNames.push(notes[i] + quality);
    const midiRoot = 48 + key + root;
    triads.push([midiRoot, midiRoot + third, midiRoot + fifth]);
    const numeral = ["I", "II", "III", "IV", "V", "VI", "VII"][i];
    const symbol =
      (third === 3 ? numeral.toLowerCase() : numeral) +
      (fifth === 6 ? "°" : fifth === 8 ? "+" : "");
    for (let slot = 0; slot < 4; slot++) {
      const option = select("chord" + slot).querySelector<HTMLOptionElement>(
        'option[value="' + i + '"]',
      )!;
      option.text = symbol + " · " + chordNames[i];
    }
    const row = document.createElement("tr");
    for (const value of [symbol, chordNames[i]]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    body.append(row);
  });
  const region =
    regions.find((r) => r.id === select("position").value) ?? regions[0];
  const high = Math.min(region.high, number("last-fret"));
  sequence = makeExercise(
    key,
    degrees,
    region.low,
    high,
    select("direction").value,
    select("phrase").value as Pattern,
  );
  write("choose-neck", region.label + " · " + region.low + "–" + high);
  write("neck-range", region.label + " · frets " + region.low + "–" + high);
  const highlight = element("neck-highlight");
  highlight.setAttribute("y", String(44 + region.low * 8.9));
  highlight.setAttribute(
    "height",
    String(Math.max(8, (high - region.low) * 8.9)),
  );
  document
    .querySelectorAll<HTMLButtonElement>("[data-region]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.region === region.id)),
    );
  write("exercise", name + " " + mode);
  cursor = 0;
  iteration = 0;
  barNumber = 0;
  element("tab").replaceChildren();
  drawTab(-1);
  showChords();
  rhythm();
}
function drawTab(active: number, bar = 0) {
  displayedBar = bar;
  displayedNote = active;
  const grid = element("tab");
  const division = number("division");
  const columns = pattern.length * division;
  const slots = grid.closest("section")!.classList.contains("large") ? 6 : 3;
  if (grid.children.length !== slots) grid.replaceChildren();
  const currentSlot = bar % slots;
  for (let slot = 0; slot < slots; slot++) {
    let measure = grid.children[slot] as HTMLElement | undefined;
    if (!measure) {
      measure = document.createElement("div");
      measure.className = "measure";
      grid.append(measure);
    }
    // Once the cursor reaches the last slot, prepare the first slot for the turn.
    const absoluteBar =
      bar -
      currentSlot +
      slot +
      (currentSlot === slots - 1 && slot === 0 ? slots : 0);
    if (measure.dataset.bar !== String(absoluteBar)) {
      measure.dataset.bar = String(absoluteBar);
      measure.replaceChildren();
      const heading = document.createElement("small");
      heading.textContent = "Bar " + (absoluteBar + 1);
      measure.append(heading);
      ["e", "B", "G", "D", "A", "E"].forEach((label, row) => {
        const line = document.createElement("div");
        line.className = "tab-line";
        line.style.gridTemplateColumns =
          "1ch repeat(" + columns + ", minmax(1.3ch,1fr))";
        line.append(label);
        for (let i = 0; i < columns; i++) {
          const col = slot * columns + i;
          const note = sequence[(absoluteBar * columns + i) % sequence.length];
          const cell = document.createElement("span");
          cell.textContent = note.string === 5 - row ? String(note.fret) : "";
          cell.dataset.col = String(col);
          if (i % division === 0) cell.className = "pulse-edge";
          line.append(cell);
        }
        measure.append(line);
      });
    }
  }
  grid
    .querySelectorAll(".current")
    .forEach((node) => node.classList.remove("current"));
  grid
    .querySelectorAll(
      '[data-col="' + (active < 0 ? -1 : currentSlot * columns + active) + '"]',
    )
    .forEach((node) => node.classList.add("current"));
}
function resetAccents() {
  pattern = [...accents[select("meter").value]];
  const group = element("pulses");
  group.replaceChildren();
  pattern.forEach((_, i) => {
    const button = document.createElement("button");
    function label() {
      button.dataset.accent = states[pattern[i]];
      button.title = "Pulse " + (i + 1) + " · " + states[pattern[i]];
      button.ariaLabel =
        "Pulse " + (i + 1) + ", " + states[pattern[i]] + ". Change accent";
    }
    label();
    button.onclick = () => {
      pattern[i] = (pattern[i] + 1) % 4;
      label();
    };
    group.append(button);
  });
}
const rack = element("rack");
const phonePortrait = matchMedia(
  "(max-width: 700px) and (orientation: portrait)",
);
function focus(name: string) {
  rack.dataset.focus = name;
  rack.querySelectorAll<HTMLElement>("section").forEach((panel) => {
    const active = panel.dataset.panel === name;
    const compact = !active && name !== "Balanced";
    const timingRow = panel.querySelector<HTMLElement>(".row");
    const panelTray = panel.querySelector<HTMLElement>(".tray");
    if (timingRow && panelTray) {
      if (compact) panelTray.querySelector("header")!.after(timingRow);
      else panelTray.before(timingRow);
    }
    panel.classList.toggle("large", active);
    panel.classList.toggle("compact", !active && name !== "Balanced");
    const tray = panel.querySelector<HTMLElement>(".tray");
    if (tray) {
      if (tray.matches(":popover-open")) tray.hidePopover();
      if (
        panel.dataset.panel === "EXP" ||
        compact ||
        (phonePortrait.matches && panel.dataset.panel === "Timing")
      )
        tray.setAttribute("popover", "auto");
      else tray.removeAttribute("popover");
    }
    const button = panel.querySelector<HTMLButtonElement>("button.focus")!;
    button.setAttribute("aria-pressed", String(active));
    button.title = (active ? "Restore " : "Enlarge ") + panel.dataset.panel;
    button.setAttribute(
      "aria-label",
      (active ? "Restore " : "Enlarge ") + panel.dataset.panel,
    );
  });
  try {
    if (sequence.length) drawTab(displayedNote, displayedBar);
    localStorage.setItem("gdc.layout", name);
  } catch {}
}
rack.querySelectorAll<HTMLElement>("section").forEach((panel) => {
  panel.querySelector<HTMLButtonElement>("button.focus")!.onclick = () =>
    focus(
      panel.classList.contains("large") ? "Balanced" : panel.dataset.panel!,
    );
});
element("balance").onclick = () => focus("Balanced");
try {
  const saved = localStorage.getItem("gdc.layout");
  if (saved && ["Timing", "Technique", "Theory", "EXP"].includes(saved))
    focus(saved);
} catch {}

phonePortrait.addEventListener("change", () =>
  focus(rack.dataset.focus || "Balanced"),
);
if (phonePortrait.matches) focus(rack.dataset.focus || "Balanced");

type Exercise = {
  scale: string;
  region: string;
  lastFret: number;
  pattern: string;
  direction: string;
  bpm: number;
  meter: string;
  notesPerPulse: number;
  notesPerBar: number;
};
type Segment = { start: number; exercise: Exercise };
type Session = {
  date: string;
  seconds: number;
  segments?: Segment[];
  began?: string;
};
function exerciseSettings(): Exercise {
  return {
    scale: element("keyname").textContent || "",
    region: select("position").selectedOptions[0].text,
    lastFret: number("last-fret"),
    pattern: select("phrase").value,
    direction: select("direction").value,
    bpm: bounded("bpm"),
    meter: select("meter").value,
    notesPerPulse: number("division"),
    notesPerBar: number("division") * pattern.length,
  };
}
function duration(seconds: number) {
  const whole = Math.round(seconds);
  return Math.floor(whole / 60) + "m " + (whole % 60) + "s";
}
element("open-journal").onclick = () => {
  updateTime();
  const totals = new Map<string, number>();
  const list = element("session-list");
  list.replaceChildren();
  const sessions = session ? [...history, session] : [...history];
  sessions.sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      (b.began || "").localeCompare(a.began || ""),
  );
  for (const entry of sessions) {
    const group = document.createElement("details");
    const heading = document.createElement("summary");
    heading.textContent =
      (entry.began ? new Date(entry.began).toLocaleString() : entry.date) +
      " · " +
      duration(entry.seconds);
    group.append(heading);
    const segments = entry.segments || [];
    if (!segments.length || segments[0].start > 0.05) {
      const info = document.createElement("p");
      info.textContent = entry.segments
        ? "Count-in · " + duration(segments[0]?.start ?? entry.seconds)
        : "Earlier session · exercise unknown";
      group.append(info);
    }
    segments.forEach(({ start, exercise: e }, i) => {
      const seconds = Math.max(
        0,
        (segments[i + 1]?.start ?? entry.seconds) - start,
      );
      totals.set(e.scale, (totals.get(e.scale) || 0) + seconds);
      const line = document.createElement("p");
      line.textContent = [
        duration(seconds),
        e.scale,
        e.region,
        "neck limit " + e.lastFret,
        e.pattern,
        e.direction,
        e.bpm + " BPM",
        e.meter,
        e.notesPerPulse + " notes/pulse",
        e.notesPerBar + " notes/bar",
      ].join(" · ");
      group.append(line);
    });
    list.append(group);
  }
  if (!sessions.length)
    list.textContent = "Start a practice session to record your first entry.";
  const ranking = element("scale-totals");
  ranking.replaceChildren();
  for (const [scale, seconds] of [...totals].sort((a, b) => b[1] - a[1])) {
    const line = document.createElement("div");
    line.textContent = scale + " · " + duration(seconds);
    ranking.append(line);
  }
  if (!totals.size) ranking.textContent = "No timed scales recorded yet.";
  element<HTMLDialogElement>("journal").showModal();
};
let session: Session | null = null;
let storageKey = "";
let started = 0;
let storedAt = 0;
let priorSeconds = 0;
let history: Session[] = [];
const savedScaleTimes = new Map<string, number>();
function addScaleTimes(totals: Map<string, number>, entry: Session) {
  const segments = entry.segments || [];
  segments.forEach((segment, i) => {
    const seconds = (segments[i + 1]?.start ?? entry.seconds) - segment.start;
    const scale = segment.exercise.scale;
    if (seconds > 0) totals.set(scale, (totals.get(scale) || 0) + seconds);
  });
}
let storageOK = true;
function loadHistory() {
  history = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      if (!key.startsWith("gdc.session.") || key === storageKey) continue;
      const item = JSON.parse(localStorage.getItem(key)!);
      if (
        typeof item?.date === "string" &&
        Number.isFinite(item.seconds) &&
        item.seconds > 0
      )
        history.push(item);
    }
  } catch {
    storageOK = false;
  }
  savedScaleTimes.clear();
  for (const entry of history) addScaleTimes(savedScaleTimes, entry);
  priorSeconds = history.reduce((sum, s) => sum + s.seconds, 0);
  displaySecond = -1;
}
let displaySecond = -1;
function chart() {
  const totals = new Map<string, number>();
  for (const entry of session ? [...history, session] : history) {
    totals.set(entry.date, (totals.get(entry.date) || 0) + entry.seconds);
  }
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    return {
      key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      seconds: totals.get(key) || 0,
    };
  });
  const today = week[6].seconds;
  const daily = element<HTMLProgressElement>("daily-progress");
  daily.max = number("daily-goal") * 60;
  daily.value = today;
  write(
    "daily-time",
    Math.floor(today / 60) +
      ":" +
      String(Math.floor(today % 60)).padStart(2, "0"),
  );
  write(
    "goal-label",
    today >= daily.max
      ? "Target reached"
      : "of " + number("daily-goal") + " min",
  );
  const chartArea = element("history");
  const showScales = select("exp-chart").value === "scales";
  chartArea.classList.toggle("scale-bars", showScales);
  chartArea.classList.toggle(
    "empty-week",
    !showScales && week.every((day) => day.seconds === 0),
  );
  if (showScales) {
    const times = new Map(savedScaleTimes);
    if (session) addScaleTimes(times, session);
    const top = [...times].sort((a, b) => b[1] - a[1]).slice(0, 3);
    write("week-summary", "Most practiced scales · all time");
    chartArea.replaceChildren();
    for (const [name, seconds] of top) {
      const row = document.createElement("div");
      const label = document.createElement("span");
      label.textContent = name + " · " + duration(seconds);
      const bar = document.createElement("i");
      bar.style.width = (100 * seconds) / top[0][1] + "%";
      row.append(label, bar);
      chartArea.append(row);
    }
    if (!top.length)
      chartArea.textContent = "Play a scale to see its time here.";
    return;
  }
  write(
    "week-summary",
    "Last 7 days · " +
      Math.floor(week.reduce((sum, d) => sum + d.seconds, 0) / 60) +
      " min · " +
      week.filter((d) => d.seconds > 0).length +
      " active days",
  );
  const max = Math.max(1, ...week.map((day) => day.seconds));
  element("history").replaceChildren(
    ...week.map((day) => {
      const column = document.createElement("div");
      column.className = "day";
      column.title =
        day.key +
        " · " +
        Math.floor(day.seconds / 60) +
        "m " +
        Math.floor(day.seconds % 60) +
        "s";
      column.setAttribute("aria-label", column.title);
      column.setAttribute("role", "img");
      const bar = document.createElement("i");
      bar.className = "bar";
      bar.style.height = String((75 * day.seconds) / max) + "%";
      const value = document.createElement("small");
      value.textContent =
        day.seconds >= 60
          ? Math.floor(day.seconds / 60) + "m"
          : day.seconds >= 1
            ? "<1m"
            : "0";
      column.append(value, bar, day.label);
      return column;
    }),
  );
}
function updateTime(force = false) {
  if (session && context) {
    session.seconds = Math.max(0, context.currentTime - started);
    if (force || session.seconds - storedAt >= 5) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(session));
      } catch {
        storageOK = false;
      }
      storedAt = session.seconds;
    }
  }
  const seconds = Math.floor(priorSeconds + (session?.seconds || 0));
  if (seconds === displaySecond && !force) return;
  displaySecond = seconds;
  chart();
  const points = Math.floor(seconds / 60);
  write("points", String(points));
  const days = new Set(history.map((s) => s.date));
  if (session) days.add(session.date);
  write(
    "practice",
    Math.floor(seconds / 60) +
      "m " +
      (seconds % 60) +
      "s active · " +
      days.size +
      (days.size === 1 ? " practice day" : " practice days") +
      (storageOK ? "" : " · Browser storage unavailable"),
  );
}
let context: AudioContext | null = null;
let master: GainNode | null = null;
const channelGains = new Map<string, GainNode>();
for (const id of ["click-audio", "guide", "chords"]) {
  input(id).addEventListener("change", () => {
    if (context)
      channelGains
        .get(id)
        ?.gain.setTargetAtTime(
          input(id).checked ? 1 : 0,
          context.currentTime,
          0.004,
        );
  });
}
let running = false;
let starting = false;
let generation = 0;
let timer = 0;
let nextTime = 0;
let pulse = 0;
let lead = 0;
const timers = new Set<number>();
function at(time: number, fn: () => void) {
  const token = window.setTimeout(
    () => {
      timers.delete(token);
      if (running) fn();
    },
    Math.max(0, (time - context!.currentTime) * 1000),
  );
  timers.add(token);
}
function tone(
  channel: string,
  time: number,
  hz: number,
  length: number,
  type: OscillatorType,
  gain: number,
  endHz = hz,
) {
  const ctx = context!,
    oscillator = ctx.createOscillator(),
    envelope = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(hz, time);
  oscillator.frequency.exponentialRampToValueAtTime(endHz, time + length);
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(gain, time + 0.002);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + length);
  oscillator.connect(envelope).connect(channelGains.get(channel)!);
  oscillator.start(time);
  oscillator.stop(time + length + 0.002);
  oscillator.onended = () => {
    oscillator.disconnect();
    envelope.disconnect();
  };
}
const voices: [number, number, OscillatorType, number][] = [
  [1460, 580, "sine", 0.045],
  [1700, 220, "sawtooth", 0.019],
  [840, 840, "sine", 0.065],
  [2400, 1200, "triangle", 0.022],
  [580, 350, "square", 0.035],
  [810, 810, "square", 0.075],
];
function click(time: number, level: number) {
  if (!level || !input("click-audio").checked) return;
  const index = select(level > 1 ? "accent" : "base").selectedIndex;
  const [hz, end, type, len] = voices[index];
  const gain = level === 2 ? 0.27 : level === 3 ? 0.21 : 0.16;
  tone("click-audio", time, hz, len, type, gain, end);
  if (index === 5) tone("click-audio", time, 540, 0.06, "square", gain * 0.48);
}
function setTempo(value: number) {
  input("bpm").value = String(Math.min(300, Math.max(30, value)));
  write("tempo", input("bpm").value);
  rhythm();
}
function schedule() {
  const ctx = context!;
  if (nextTime < ctx.currentTime - 0.05) {
    stop("Playback interrupted · restart");
    return;
  }
  while (nextTime < ctx.currentTime + 0.1) {
    const beat = 60 / bounded("bpm");
    const groove = number("groove") / 200;
    const index = pulse % pattern.length;
    const following = (index + 1) % pattern.length;
    const span = beat * (1 + ((following % 2) - (index % 2)) * groove);
    const time = nextTime;
    click(time, lead ? 1 : pattern[index]);
    at(time, () => {
      element("tempo").parentElement!.style.setProperty(
        "--swing",
        ++gearStep * 30 + "deg",
      );
      [...element("pulses").children].forEach((node, i) =>
        node.classList.toggle("lit", i === index),
      );
    });
    if (lead) {
      const remaining = lead--;
      at(time, () => write("status", "Count-in · " + remaining));
      if (!lead) pulse = -1;
    } else {
      const exercise = exerciseSettings();
      at(time, () => {
        const segments = session?.segments;
        if (
          segments &&
          JSON.stringify(segments.at(-1)?.exercise) !== JSON.stringify(exercise)
        )
          segments.push({ start: Math.max(0, time - started), exercise });
      });
      const divisions = number("division");
      const chords = progression();
      const slot = barNumber % chords.length;
      if (input("chords").checked) {
        for (const midi of triads[chords[slot]])
          tone(
            "chords",
            time,
            440 * 2 ** ((midi - 69) / 12),
            span * 0.92,
            "sine",
            0.105,
          );
      }
      if (index === 0) at(time, () => showChords(slot));
      const playingBar = barNumber;
      if (index === pattern.length - 1) barNumber++;
      for (let i = 0; i < divisions; i++) {
        const pos = cursor,
          note = sequence[pos],
          onset = time + (span * i) / divisions;
        if (input("guide").checked)
          tone(
            "guide",
            onset,
            440 * 2 ** ((note.midi - 69) / 12),
            Math.min(0.42, (span / divisions) * 0.78),
            "triangle",
            0.23,
          );
        const loop = iteration + 1;
        at(onset, () => {
          drawTab(index * divisions + i, playingBar);
          write("status", "Playing · loop " + loop);
        });
        if (++cursor === sequence.length) {
          cursor = 0;
          iteration++;
          if (
            input("ramp").checked &&
            iteration % bounded("loops") === 0 &&
            bounded("bpm") < bounded("target")
          )
            setTempo(
              Math.min(
                bounded("target"),
                bounded("bpm") + bounded("increment"),
              ),
            );
        }
      }
    }
    nextTime += span;
    pulse++;
  }
  updateTime();
}
function stop(message = "Stopped") {
  generation++;
  starting = false;
  if (!running) return;
  updateTime(true);
  running = false;
  window.clearInterval(timer);
  timers.forEach(clearTimeout);
  timers.clear();
  for (const bus of channelGains.values()) bus.disconnect();
  channelGains.clear();
  master?.disconnect();
  session = null;
  storageKey = "";
  loadHistory();
  updateTime();
  write("play", "▶ Start");
  write("status", message);
  element("tempo").parentElement!.style.setProperty("--swing", "0deg");
  drawTab(-1);
  showChords();
  element("pulses").querySelector(".lit")?.classList.remove("lit");
}
async function toggle() {
  if (running) {
    stop();
    return;
  }
  if (starting) return;
  starting = true;
  const attempt = ++generation;
  try {
    context ??= new AudioContext();
    await context.resume();
    if (attempt !== generation || document.hidden) return;
    master = context.createGain();
    master.gain.value = number("vol") / 100;
    master.connect(context.destination);
    for (const id of ["click-audio", "guide", "chords"]) {
      const bus = context.createGain();
      bus.gain.value = input(id).checked ? 1 : 0;
      bus.connect(master);
      channelGains.set(id, bus);
    }
    running = true;
    cursor = 0;
    iteration = 0;
    barNumber = 0;
    pulse = 0;
    lead = number("count");
    started = context.currentTime + 0.06;
    storedAt = 0;
    nextTime = started;
    const now = new Date();
    storageKey = "gdc.session." + crypto.randomUUID();
    session = {
      date: [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-"),
      seconds: 0,
      began: now.toISOString(),
      segments: [],
    };
    write("play", "■ Stop");
    schedule();
    timer = window.setInterval(schedule, 25);
  } catch {
    stop();
    write("status", "Audio unavailable · try Start again");
  } finally {
    starting = false;
  }
}
element("play").onclick = toggle;
let taps: number[] = [];
element("tap").onclick = () => {
  const now = performance.now();
  if (now - (taps.at(-1) || 0) > 2200) taps = [];
  taps = [...taps.slice(-5), now];
  if (taps.length > 1)
    setTempo(Math.round((60000 * (taps.length - 1)) / (now - taps[0])));
};
input("bpm").onchange = () => setTempo(bounded("bpm"));
input("vol").oninput = () => {
  if (master && context)
    master.gain.setTargetAtTime(number("vol") / 100, context.currentTime, 0.01);
};
select("theory-key").onchange = () => {
  select("key").value = select("theory-key").value;
  select("key").dispatchEvent(new Event("change", { bubbles: true }));
};
select("theory-mode").onchange = () => {
  select("scale").value = select("theory-mode").value;
  select("scale").dispatchEvent(new Event("change", { bubbles: true }));
};
select("exp-chart").onchange = () => chart();
select("daily-goal").onchange = () => chart();
for (const id of [
  "key",
  "scale",
  "position",
  "phrase",
  "last-fret",
  "direction",
  "division",
  "meter",
]) {
  select(id).onchange = () => {
    timers.forEach(clearTimeout);
    timers.clear();
    pulse = 0;
    if (id === "meter") resetAccents();
    arrange();
  };
}
select("preset").onchange = () => {
  if (select("preset").value === "custom") return;
  select("preset")
    .value.split(",")
    .forEach((v, i) => (select("chord" + i).value = v));
  showChords();
};
for (let i = 0; i < 4; i++)
  select("chord" + i).onchange = () => {
    select("preset").value = "custom";
    showChords();
  };
for (const id of ["target", "loops", "increment"])
  input(id).onchange = () => {
    input(id).value = String(bounded(id));
  };
document.addEventListener("keydown", (event) => {
  if (
    event.code === "Space" &&
    !event.repeat &&
    (event.target === document.body ||
      event.target === document.documentElement)
  ) {
    event.preventDefault();
    void toggle();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stop("Paused · return to start");
});
window.addEventListener("pagehide", () => stop());
window.addEventListener("storage", () => {
  loadHistory();
  updateTime();
});
const neckDialog = element<HTMLDialogElement>("neck-dialog");
element("choose-neck").onclick = () => {
  neckDialog.showModal();
  neckDialog.querySelector<HTMLButtonElement>("[aria-pressed=true]")?.focus();
};
neckDialog
  .querySelectorAll<HTMLButtonElement>("[data-region]")
  .forEach((button) => {
    button.onclick = () => {
      select("position").value = button.dataset.region!;
      select("position").dispatchEvent(new Event("change", { bubbles: true }));
    };
  });
const preferences = Array.from(
  document
    .querySelector(".gdc")!
    .querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      "input[id], select[id]",
    ),
);
function savePreferences() {
  try {
    const values = Object.fromEntries(
      preferences.map((field) => [
        field.id,
        field instanceof HTMLInputElement && field.type === "checkbox"
          ? field.checked
          : field.value,
      ]),
    );
    localStorage.setItem("gdc.settings.v1", JSON.stringify(values));
  } catch {
    storageOK = false;
  }
}
try {
  const values = JSON.parse(localStorage.getItem("gdc.settings.v1") || "{}");
  // Import the old five-fret preference into the nearest overlapping region.
  if (typeof values.position === "string" && /^\d+$/.test(values.position)) {
    const center = Number(values.position) + 2;
    values.position = center <= 7 ? "upper" : center <= 15 ? "middle" : "lower";
  }
  for (const field of preferences) {
    const value = values[field.id];
    if (field instanceof HTMLSelectElement) {
      if (Array.from(field.options).some((option) => option.value === value))
        field.value = value;
    } else if (field.type === "checkbox") {
      if (typeof value === "boolean") field.checked = value;
    } else if (
      typeof value === "string" &&
      value !== "" &&
      Number.isFinite(Number(value))
    ) {
      field.value = String(
        Math.min(
          Number(field.max),
          Math.max(Number(field.min), Math.round(Number(value))),
        ),
      );
    }
  }
} catch {
  storageOK = false;
}
document.querySelector(".gdc")!.addEventListener("change", savePreferences);
window.addEventListener("pagehide", savePreferences);
setTempo(bounded("bpm"));
resetAccents();
arrange();
loadHistory();
updateTime();
