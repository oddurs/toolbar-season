// BuddyBonz: a purple desktop pal who came bundled with something, talks out
// loud, tells jokes, sings, comments on your toolbars, and will not leave.
// The only way to be rid of him is to uninstall his toolbar.
import { ui, TEST, toolbarCount } from "./state.svelte.js";
import { daisy } from "./sound.js";

const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];

const JOKES = [
  ["Why did the computer go to the doctor?", "It had a virus! Don't worry, I'm not a virus. Probably."],
  ["How many toolbars does it take to change a light bulb?", "Just one. But it installs four more while it's up there!"],
  ["Why was the web page so skinny?", () => `It was only ${Math.max(1, ui.viewPct)} percent of the window! Ha ha!`],
  ["Knock knock!", "Who's there? A pop-up! A pop-up who? A pop-up you can't close!"],
  ["What's a gorilla's favorite part of the Internet?", "The home page! Speaking of which, I changed yours."],
  ["What did the modem say to the phone line?", "Ksssshhhhh-bing-bong-kssshhh! That's modem for 'I love you'."],
];
const FACTS = [
  () => `Did you know? You have ${toolbarCount()} toolbars. The world record is ${toolbarCount() + 1}. Want to try?`,
  () => "Did you know? Gorillas can learn sign language. I learned how to change your search engine!",
  () => "Did you know? I'm 100% free. You pay with your browsing history, which is worth nothing. Probably.",
  () => "Did you know? Every time you close a pop-up, two more learn to read.",
];
const CHATTER = [
  () => "Would you like me to search the web for you? I'm very good at it. I use a special search engine.",
  () => "Today is Monday, October 17, 2005. Isn't that neat?",
  () => "I noticed you're trying to read a web page. Would you like help with that?",
  () => "You look great today! I can tell because of the webcam I don't have. Yet.",
  () => "If you ever feel lonely, I'm always here. Always. I can't actually leave.",
];

// ---------------- voice ----------------
// Browsers have text-to-speech built in. Pitched up, it's close enough.
let voice = null;
function pickVoice() {
  const all = speechSynthesis.getVoices();
  voice = all.find(v => /^en/i.test(v.lang) && /male|fred|daniel|alex|david/i.test(v.name)) || all.find(v => /^en/i.test(v.lang)) || null;
}
if (typeof speechSynthesis !== "undefined") { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

function speak(text, done) {
  if (ui.muted || TEST || typeof speechSynthesis === "undefined") return false;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*]/g, ""));
    if (voice) u.voice = voice;
    u.pitch = 1.7; u.rate = 1.05; u.volume = 0.9;
    u.onend = u.onerror = done;
    speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}
export const hush = () => { try { speechSynthesis.cancel(); } catch {} };

// ---------------- saying things ----------------
let talkTimer, lastReaction = 0, stopSong = null;

// Say a line (or a joke's setup then punchline). He talks while the text types out.
export function say(text, { then = null, mood = "talk" } = {}) {
  if (!ui.buddy?.here || ui.ended) return;
  clearTimeout(talkTimer);
  stopSong?.(); stopSong = null;
  ui.buddy.line = text;
  ui.buddy.song = null;
  ui.buddy.mood = mood;
  const finish = () => {
    ui.buddy && (ui.buddy.mood = "idle");
    if (then) talkTimer = setTimeout(then, 700);
  };
  // Talk for as long as the voice does, or for a reading-speed estimate without one.
  if (!speak(text, finish)) talkTimer = setTimeout(finish, TEST ? 0 : 900 + text.length * 45);
}

export function joke() {
  const [q, a] = pick(JOKES);
  say(q, { then: () => say(typeof a === "function" ? a() : a, { mood: "laugh" }) });
}
export const fact = () => say(pick(FACTS)());
export const chatter = () => say(pick(CHATTER)());
export const tickle = () => say(pick(["Hee hee! That tickles!", "Hey! Watch the fur!", "Oooh, do that again!"]), { mood: "laugh" });

export function sing() {
  if (!ui.buddy?.here) return;
  hush(); clearTimeout(talkTimer);
  ui.buddy.line = null;
  ui.buddy.mood = "sing";
  ui.buddy.song = { at: -1 };
  stopSong?.();
  stopSong = daisy(i => { if (ui.buddy?.song) ui.buddy.song.at = i; }, () => {
    stopSong = null;
    if (ui.buddy) { ui.buddy.song = null; say("Thank you! Thank you! I'll be here all week. And next week. And forever."); }
  });
}

// ---------------- coming and going ----------------
let returnTimer, chatterTimer;
export function summon(line = "Hi! I'm BuddyBonz, your new Internet friend! Would you like me to help you browse the web?") {
  if (ui.ended || ui.uninstalled.bonzibar) return;
  const first = !ui.buddy;
  ui.buddy = { ...(ui.buddy || { x: null, y: null }), here: true, leaving: false, line: null, song: null, mood: "wave", n: (ui.buddy?.n || 0) + 1 };
  setTimeout(() => say(first ? line : pick(["I'm back! Did you miss me? I missed you!", "Surprise! You can't get rid of me that easily!", "Hi again! I brought a new toolbar! Just kidding. Or am I?"])), TEST ? 0 : 900);
  clearInterval(chatterTimer);
  if (!TEST) chatterTimer = setInterval(idle, 45000);
}

function idle() {
  if (!ui.buddy?.here || ui.buddy.mood !== "idle" || ui.dialogs.some(d => d.kind !== "pop")) return;
  pick([joke, fact, chatter, chatter])();
}

// "Hide" works, for about a minute.
export function hide() {
  if (!ui.buddy?.here) return;
  say(pick(["OK! See you later!", "Bye bye! I'll be right back!", "Fine. I'll just be over here."]), { mood: "wave" });
  const visit = ui.buddy.n; // only this visit leaves, even if he's already back
  setTimeout(() => {
    if (ui.buddy?.n !== visit) return;
    hush(); stopSong?.(); stopSong = null;
    ui.buddy.leaving = true;
    setTimeout(() => { if (ui.buddy?.n === visit) { ui.buddy.here = false; ui.buddy.leaving = false; ui.buddy.line = null; } }, TEST ? 0 : 600);
  }, TEST ? 0 : 1800);
  clearInterval(chatterTimer);
  clearTimeout(returnTimer);
  returnTimer = setTimeout(() => summon(), TEST ? 1500 : rand(60000, 90000));
}

// Uninstalling his toolbar is the only thing that works. He takes it personally.
export function banish() {
  clearTimeout(returnTimer);
  clearInterval(chatterTimer);
  if (!ui.buddy?.here) return;
  say("Wait... you're uninstalling ME? After everything we've been through? Fine. FINE. Goodbye forever!", { mood: "sad" });
  setTimeout(() => {
    if (!ui.buddy) return;
    hush();
    ui.buddy.leaving = true;
    setTimeout(() => (ui.buddy = null), TEST ? 0 : 600);
  }, TEST ? 0 : 5000);
}

// Reactions to what's happening, at most one every 12 seconds.
export function react(kind, name) {
  if (!ui.buddy?.here || ui.ended || ui.buddy.mood !== "idle") return;
  const now = Date.now();
  if (now - lastReaction < 12000 && !TEST) return;
  lastReaction = now;
  const lines = {
    installed: [`Ooh, ${name}! I love that one!`, `${name}! Now we're really browsing!`, `Yay! ${name} is here! The more the merrier!`],
    closed: [`Aww, you closed ${name}. Don't worry, it'll be back.`, `Bye bye, ${name}! See you in a minute!`],
    removed: [`Hey! ${name} was my friend!`, `You uninstalled ${name}?! I'm telling.`, `Poor ${name}. It only wanted to help.`],
    squeezed: ["Your web page is looking a little small. Want me to find a toolbar for that?"],
    clean: ["It's so quiet in here without all the toolbars... Too quiet."],
  }[kind];
  if (lines) say(pick(lines), { mood: kind === "removed" ? "sad" : "talk" });
}
