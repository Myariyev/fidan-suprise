import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  Heart,
  Sparkles,
  Crown,
  RotateCcw,
  Mail,
} from "lucide-react";
import "./styles.css";

const titles = [
  "Знакомство",
  "Один вопрос",
  "Так и знал",
  "Сила любви",
  "До звёзд",
  "Тебе письмо",
];
const teasing = [
  "Ты уверена? 🥺",
  "Подумай ещё раз! 💗",
  "Неправильный ответ! 😤",
  "Мехди расстроится! 😭",
  "Ха-ха, не поймаешь! 😈",
  "Кнопка сдаётся! 💕",
];
function Button({ children, onClick, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.96 }}
      className="primary"
      onClick={onClick}
      {...props}
    >
      {children}
      <ArrowRight size={18} />
    </motion.button>
  );
}
function Burst({ kisses = false }) {
  const reduced = useReducedMotion();
  return (
    <div className="burst" aria-hidden="true">
      {Array.from({ length: reduced ? 6 : 32 }, (_, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.3 }}
          animate={{
            x: Math.cos(i * 2.4) * (100 + i * 9),
            y: kisses ? -200 - i * 12 : Math.sin(i * 2.4) * (100 + i * 9),
            opacity: 0,
            scale: 1.2,
            rotate: i * 23,
          }}
          transition={{
            duration: 2.8,
            delay: i * 0.035,
            repeat: kisses ? Infinity : 0,
            repeatDelay: 1,
          }}
        >
          {kisses && i % 3 === 0 ? "💋" : i % 2 ? "♥" : "✦"}
        </motion.span>
      ))}
    </div>
  );
}
function TypeLine({ text, delay = 0, className = "" }) {
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    let interval;
    const timeout = setTimeout(() => {
      if (reduced) setCount(text.length);
      else
        interval = setInterval(
          () => setCount((c) => Math.min(c + 1, text.length)),
          45,
        );
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, reduced]);
  return (
    <p className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
    </p>
  );
}
function LoveQuestion({ onYes }) {
  const [tries, setTries] = useState(0);
  const [position, setPosition] = useState({ left: 58, top: 160 });
  const arena = useRef(null);
  const yes = useRef(null);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const width = arena.current?.clientWidth || 300;
      setPosition((p) => ({
        left: Math.max(8, Math.min(p.left, width - 108)),
        top: Math.max(100, Math.min(p.top, 179)),
      }));
    });
    observer.observe(arena.current);
    return () => observer.disconnect();
  }, []);
  function escape() {
    const next = tries + 1;
    setTries(next);
    if (next >= 10) return;
    const area = arena.current.getBoundingClientRect();
    const target = yes.current.getBoundingClientRect();
    const w = 100,
      h = 48;
    let candidates = [];
    for (let x = 8; x <= area.width - w - 8; x += 24)
      for (let y = 100; y <= area.height - h - 8; y += 24) {
        const overlap =
          x < target.right - area.left + 14 &&
          x + w > target.left - area.left - 14 &&
          y < target.bottom - area.top + 14 &&
          y + h > target.top - area.top - 14;
        if (!overlap && Math.hypot(x - position.left, y - position.top) > 55)
          candidates.push({ left: x, top: y });
      }
    if (candidates.length)
      setPosition(candidates[Math.floor(Math.random() * candidates.length)]);
  }
  return (
    <>
      <div className="illustration question-heart">💘</div>
      <span className="eyebrow">Вопрос государственной важности</span>
      <h1>
        Фидан, ты любишь
        <br />
        <em>Мехди?</em>
      </h1>
      <p className="subtext">Отвечай сердцем. Оно точно знает 💕</p>
      <div className="answer-arena" ref={arena}>
        <div className="yes-zone" ref={yes}>
          <Button onClick={onYes}>ДААА, КОНЕЧНО! 😍</Button>
        </div>
        <AnimatePresence>
          {tries < 10 && (
            <motion.button
              className="no-button"
              initial={false}
              animate={{
                ...position,
                scale: tries <= 5 ? 1 : 1 - (tries - 5) * 0.12,
              }}
              exit={{ scale: 0, opacity: 0, rotate: 30 }}
              transition={{ type: "spring", stiffness: 360, damping: 24 }}
              onClick={escape}
            >
              Нет 🙄
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="reaction" aria-live="polite">
        {tries >= 10
          ? "Кажется, остался только один правильный ответ 😌💗"
          : tries
            ? teasing[Math.min(5, Math.floor(((tries - 1) * 6) / 9))]
            : "Подсказка: большая розовая кнопка — отличный выбор"}
      </p>
    </>
  );
}
function App() {
  const [scene, setScene] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [dramatic, setDramatic] = useState(false);
  const [answer, setAnswer] = useState("");
  const [love, setLove] = useState(20);
  const [breaking, setBreaking] = useState(false);
  const [ready, setReady] = useState(false);
  const [opened, setOpened] = useState(false);
  const heading = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), scene === 4 ? 6500 : 2000);
    heading.current?.focus();
    return () => clearTimeout(t);
  }, [scene]);
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => setDramatic(true), 1000);
    return () => clearTimeout(t);
  }, [submitted]);
  useEffect(() => {
    if (!breaking) return;
    const t = setTimeout(
      () => {
        setScene(4);
        setBreaking(false);
      },
      reduced ? 500 : 1900,
    );
    return () => clearTimeout(t);
  }, [breaking, reduced]);
  const next = () => setScene((s) => s + 1);
  const restart = () => {
    setScene(0);
    setSubmitted(false);
    setDramatic(false);
    setAnswer("");
    setLove(20);
    setBreaking(false);
    setOpened(false);
  };
  const reaction =
    love <= 20
      ? "Так мало?! 😭"
      : love <= 40
        ? "Ну, уже лучше... 🥺"
        : love <= 60
          ? "Хмм, неплохо! 💗"
          : love <= 80
            ? "Ого, вот это любовь! 😍"
            : love < 100
              ? "Ещё чуть-чуть! 💕"
              : "Любовь не помещается в эту карточку! 💥";
  return (
    <MotionConfig reducedMotion="user">
      <div className={`app ${scene === 4 ? "cosmic" : ""}`}>
        <div className="ambient" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 37 + 7) % 100}%`,
                top: `${(i * 19 + 8) % 100}%`,
                animationDelay: `${-i * 0.7}s`,
                fontSize: 12 + (i % 4) * 9,
              }}
            >
              {scene === 4 ? "✦" : i % 4 === 0 ? "✧" : "♡"}
            </span>
          ))}
        </div>
        <header>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              restart();
            }}
            className="brand"
          >
            <span className="brand-icon">
              <Heart size={19} fill="currentColor" />
            </span>
            для Фидан<span className="brand-dot">.</span>
          </a>
          <span className="header-note">
            кое-что только для тебя <Heart size={12} />
          </span>
        </header>
        <main ref={heading} tabIndex={-1}>
          <div className="chapter">
            <span /> МАЛЕНЬКОЕ ПРИКЛЮЧЕНИЕ О БОЛЬШОЙ ЛЮБВИ
          </div>
          <div className="card-wrap">
            <span className="outside-spark spark-one" aria-hidden="true">
              ✧
            </span>
            <span className="outside-spark spark-two" aria-hidden="true">
              ✦
            </span>
            <span className="margin-note" aria-hidden="true">
              сделано с любовью ♡
            </span>
            <AnimatePresence mode="wait">
              <motion.section
                key={scene}
                className={`card scene-${scene} ${breaking ? "breaking" : ""}`}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.97 }}
                transition={{ duration: reduced ? 0.1 : 0.45 }}
                aria-label={titles[scene]}
              >
                {scene === 0 && (
                  <>
                    <div className="corner-label">
                      <Sparkles size={13} /> ОСОБЕННОЙ ДЕВОЧКЕ
                    </div>
                    <div
                      className="illustration envelope-art"
                      aria-hidden="true"
                    >
                      <div className="envelope-paper">
                        <Heart fill="currentColor" size={38} />
                      </div>
                      <div className="envelope-body" />
                      <span className="envelope-heart">♥</span>
                      <span className="bow">🎀</span>
                    </div>
                    <span className="eyebrow">
                      У меня для тебя кое-что есть…
                    </span>
                    <h1>
                      Привет, <em>Фидан!</em>
                      <span className="title-heart">♡</span>
                    </h1>
                    <AnimatePresence mode="wait">
                      {!submitted ? (
                        <motion.form
                          key="form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            setSubmitted(true);
                          }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <p className="subtext">
                            Как ты сегодня, моя принцесса? 🎀
                          </p>
                          <label className="sr-only" htmlFor="mood">
                            Как ты себя чувствуешь?
                          </label>
                          <input
                            id="mood"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Напиши, как ты себя чувствуешь…"
                            maxLength={500}
                          />
                          <Button type="submit">Отправить 💌</Button>
                          <p className="tiny">
                            Здесь нет неправильных ответов. Ну… почти 😌
                          </p>
                        </motion.form>
                      ) : (
                        <motion.div
                          key="reply"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          aria-live="polite"
                        >
                          <p className="subtext">
                            Неважно, что ты ответила! 😌
                          </p>
                          {dramatic && (
                            <motion.div
                              initial={{ scale: 0.7, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                            >
                              <Crown className="crown" size={36} />
                              <p className="reply">
                                Ты должна быть благодарна судьбе,
                                <br />
                                ведь ты девушка самого Мехди! 😎💗
                              </p>
                              <Button onClick={next}>Ладно, дальше 💕</Button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
                {scene === 1 && <LoveQuestion onYes={next} />}
                {scene === 2 && (
                  <>
                    <Burst />
                    <div className="illustration celebration">💖</div>
                    <span className="eyebrow">
                      Ответ принят. Сердце довольно.
                    </span>
                    <h1>
                      Умница, <em>Фидан!</em>
                    </h1>
                    <p className="subtext">Я знал, что ты меня любишь! 😌💕</p>
                    {ready && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="reply">
                          Но у меня есть ещё один вопрос... 👀
                        </p>
                        <Button onClick={next}>Какой? 💌</Button>
                      </motion.div>
                    )}
                  </>
                )}
                {scene === 3 && (
                  <>
                    <div className="illustration">💗</div>
                    <span className="eyebrow">
                      Осторожно: очень чувствительный прибор
                    </span>
                    <h1>
                      Насколько сильно
                      <br />
                      ты любишь <em>Мехди?</em>
                    </h1>
                    <p className="subtext">
                      Передвинь сердечко. Только честно 💕
                    </p>
                    <div className="love-meter">
                      <motion.output
                        key={love}
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        htmlFor="love"
                      >
                        {love}
                        <span>%</span>
                      </motion.output>
                      <div
                        className="range-wrap"
                        style={{ "--value": `${love}%` }}
                      >
                        <input
                          id="love"
                          type="range"
                          min="0"
                          max="100"
                          value={love}
                          disabled={breaking}
                          aria-label="Сила любви к Мехди"
                          aria-valuetext={`${love} процентов. ${reaction}`}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            setLove(v);
                            if (v === 100 && !breaking) setBreaking(true);
                          }}
                        />
                        <span
                          className="slider-heart"
                          aria-hidden="true"
                          style={{
                            left: `calc(${love}% + ${14 - love * 0.28}px)`,
                          }}
                        >
                          ♥
                        </span>
                      </div>
                      <div className="range-labels">
                        <span>Чуть-чуть</span>
                        <span>До бесконечности</span>
                      </div>
                    </div>
                    <p className="reaction" aria-live="polite">
                      {reaction}
                    </p>
                    {breaking && (
                      <>
                        <svg
                          className="cracks"
                          viewBox="0 0 600 600"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          <path d="M300 310L195 190 210 85 170 0M300 310L410 230 600 180M300 310L380 430 340 600M300 310L150 420 0 390M195 190L80 160 0 70" />
                        </svg>
                        <div className="shards" aria-hidden="true">
                          {Array.from({ length: 8 }, (_, i) => (
                            <span
                              key={i}
                              style={{
                                "--angle": `${i * 45}deg`,
                                "--x": `${Math.cos((i * Math.PI) / 4) * 650}px`,
                                "--y": `${Math.sin((i * Math.PI) / 4) * 650}px`,
                              }}
                            />
                          ))}
                        </div>
                        <Burst />
                      </>
                    )}
                  </>
                )}
                {scene === 4 && (
                  <>
                    <div className="moon" aria-hidden="true" />
                    <div className="cosmic-heart" aria-hidden="true">
                      ♥
                    </div>
                    <span className="eyebrow">У этой любви нет границ</span>
                    <h1 className="cosmic-title">
                      Больше, чем <em>бесконечность.</em>
                    </h1>
                    <TypeLine
                      text="Я люблю тебя до самых звёзд... ✨"
                      className="cosmic-line"
                    />
                    <TypeLine
                      text="И дальше — до края всей Вселенной! 🌌💗"
                      delay={1900}
                      className="cosmic-line"
                    />
                    <TypeLine
                      text="Ты моя любимая Фидан. 💕"
                      delay={4200}
                      className="cosmic-line last-line"
                    />
                    {ready && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Button onClick={next}>Последний сюрприз 💌</Button>
                      </motion.div>
                    )}
                  </>
                )}
                {scene === 5 && (
                  <>
                    <Burst kisses />
                    <span className="eyebrow">Доставлено прямо в сердечко</span>
                    <button
                      className={`letter-toggle ${opened ? "opened" : ""}`}
                      aria-label={
                        opened ? "Письмо открыто" : "Открыть письмо от Мехди"
                      }
                      aria-expanded={opened}
                      onClick={() => setOpened((v) => !v)}
                    >
                      <Mail size={90} strokeWidth={1} />
                      <span>♥</span>
                    </button>
                    <h1>
                      Ну всё,
                      <br />
                      <em>моя принцесса…</em> 🎀
                    </h1>
                    <p className="subtext">Целую тебя миллион раз! 💋💋💋</p>
                    <AnimatePresence>
                      {opened && (
                        <motion.p
                          className="secret-note"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          Если вдруг загрустишь — возвращайся сюда.
                          <br />
                          Ты всегда моя самая любимая. ♡
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <p className="signature">Твой Мехди 💗</p>
                    <button className="restart" onClick={restart}>
                      <RotateCcw size={15} /> Начать сначала 💕
                    </button>
                  </>
                )}
              </motion.section>
            </AnimatePresence>
          </div>
          <nav className="progress" aria-label="Этапы приключения">
            {titles.map((title, i) => (
              <span
                key={title}
                className={i === scene ? "active" : i < scene ? "complete" : ""}
                aria-current={i === scene ? "step" : undefined}
                aria-label={`${i + 1}. ${title}`}
              >
                {i < scene ? "♥" : ""}
              </span>
            ))}
          </nav>
          <p className="stage-label">
            {String(scene + 1).padStart(2, "0")} / 06 <span>·</span>{" "}
            {titles[scene]}
          </p>
        </main>
        <footer>
          <span>
            От Мехди <Heart size={11} fill="currentColor" /> с нежностью
          </span>
          <span>Один сайт. Одна особенная девушка.</span>
        </footer>
      </div>
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
