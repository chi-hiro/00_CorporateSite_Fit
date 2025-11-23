/* ===== Reveal（交差観測） ===== */
var io = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                // 上方向フェードアップ
                if (e.target.classList.contains("reveal-up")) {
                    e.target.classList.add("is-in");
                }

                // 左からスライドイン
                if (e.target.classList.contains("reveal-left-in")) {
                    e.target.classList.add("is-left-in");
                }

                // 右からスライドイン
                if (e.target.classList.contains("reveal-right-in")) {
                    e.target.classList.add("is-right-in");
                }

                io.unobserve(e.target); // 一度発火したら監視解除
            }
        });
    },
    { threshold: 0.15 }
);

// ▼監視対象を両方にする
document
    .querySelectorAll(".reveal-up, .reveal-left-in, .reveal-right-in")
    .forEach(function (el) {
        io.observe(el);
    });

/* ===== 木漏れ日（複数フィールド対応版） ===== */
const fields = Array.from(document.querySelectorAll(".apple-field"));

function spawnApplesIn(field){
  if (!field) return;
  field.innerHTML = "";

  const vw = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
  const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  // 画面サイズ基準の粒数（重ければ係数を上げる/下げる）
  const density = parseFloat(field.dataset.density || "1");
  const count = Math.round((vw * vh) / 175000 * density);

  for (let i = 0; i < count; i++) {
    const a = document.createElement("div");
    a.className = "apple";

    a.style.setProperty("--x", (5 + Math.random() * 90).toFixed(2));
    a.style.setProperty("--y", (5 + Math.random() * 90).toFixed(2));

    a.style.setProperty("--delay", `${Math.random() * 4}s`);
    a.style.setProperty("--dur",   `${6 + Math.random() * 5}s`);
    a.style.setProperty("--move",  `${12 + Math.random() * 6}s`);

    a.addEventListener("animationiteration", (e) => {
      if (e.animationName !== "apple-pop") return;
      a.style.setProperty("--x", (5 + Math.random() * 90).toFixed(2));
      a.style.setProperty("--y", (5 + Math.random() * 90).toFixed(2));
      // a.style.setProperty("--dur", `${6 + Math.random() * 5}s`); // 速度も揺らしたいなら
    });

    field.appendChild(a);
  }
}

function spawnAllApples(){
  fields.forEach(spawnApplesIn);
}

// 初回
spawnAllApples();

// リサイズで再配置（デバウンス）
window.addEventListener("resize", () => {
  clearTimeout(window.__appleTimer);
  window.__appleTimer = setTimeout(spawnAllApples, 200);
});

const hills = document.querySelector(".layer.hills");
const speed = -0.4;

window.addEventListener("scroll", () => {
    const y = window.scrollY || 0;
    hills.style.transform = `translateY(${-y * speed}px)`;
});

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");
const navOverlay = document.getElementById("nav-overlay");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileNav.classList.toggle("active");
  navOverlay.classList.toggle("active");

  // body全体に「nav-open」クラス付与（スクロール防止などに使える）
  document.body.classList.toggle("nav-open");
});

// 背景タップで閉じる
navOverlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  mobileNav.classList.remove("active");
  navOverlay.classList.remove("active");
  document.body.classList.remove("nav-open");
});

// ▼ ここに追記！（リンククリック時に閉じる）
const navLinks = document.querySelectorAll("#mobile-nav a");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    // スムーススクロール時間に合わせて遅延（ここでは800ms）
    setTimeout(() => {
      hamburger.classList.remove("active");
      mobileNav.classList.remove("active");
      navOverlay.classList.remove("active");
      document.body.classList.remove("nav-open");
    }, 900);
  });
});

/* ===== 葉っぱ出す ===== */
const leaf = document.querySelector(".right-edge");
const trigger = document.querySelector("#section-service"); // トリガーにしたいセクション

window.addEventListener("scroll", () => {
    const triggerTop = trigger.offsetTop;      // セクションのY位置（ページ先頭から）
    const scrollY = window.scrollY;           // 今のスクロール位置

    // どの位置から出すかのしきい値（少し早めに出したければ -200 とかにする）
    const showPoint = triggerTop - 200;

    if (scrollY >= showPoint) {
        // セクションより下にいるあいだは ずっと表示
        leaf.classList.add("is-active");
    } else {
        // セクションより上（まだ届いてない）なら非表示
        leaf.classList.remove("is-active");
    }
});

