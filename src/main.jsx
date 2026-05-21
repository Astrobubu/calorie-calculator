import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowUpRight,
  BookOpenText,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Facebook,
  Gauge,
  HeartPulse,
  Info,
  Instagram,
  Linkedin,
  Scale,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  Twitter,
  Utensils,
  Zap,
} from "lucide-react";
import "./styles.css";

const activityLevels = [
  { value: 1, label: "معدل الأيض فقط", note: "راحة تامة" },
  { value: 1.2, label: "خامل", note: "قليل أو بدون تمرين" },
  { value: 1.375, label: "نشاط خفيف", note: "تمرين ١-٣ مرات أسبوعياً" },
  { value: 1.465, label: "نشاط متوسط", note: "تمرين ٤-٥ مرات أسبوعياً" },
  { value: 1.55, label: "نشط", note: "تمرين شديد ٣-٤ مرات" },
  { value: 1.725, label: "نشط جداً", note: "تمرين شديد ٦-٧ مرات" },
  { value: 1.9, label: "نشاط إضافي", note: "عمل بدني أو تمرين يومي" },
];

const formulas = [
  {
    id: "mifflin",
    label: "Mifflin-St Jeor",
    note: "الأدق للبالغين",
    desc: "المعادلة الأحدث (1990) وتعتبر الأدق علمياً لمعظم البالغين الأصحاء.",
  },
  {
    id: "harris",
    label: "Harris-Benedict",
    note: "صيغة مقارنة",
    desc: "صيغة كلاسيكية معدلة (1984). أعلى قليلاً في التقدير من Mifflin.",
  },
  {
    id: "katch",
    label: "Katch-McArdle",
    note: "مع نسبة الدهون",
    desc: "تعتمد على الكتلة بدون دهون. الأدق إذا تعرف نسبة دهونك بدقة.",
  },
];

const sources = [
  ["Calculator.net Calorie Calculator", "https://www.calculator.net/calorie-calculator.html"],
  ["WHO: Obesity and overweight", "https://www.who.int/en/news-room/fact-sheets/detail/obesity-and-overweight"],
  ["Mifflin-St Jeor equation, PubMed 2305711", "https://pubmed.ncbi.nlm.nih.gov/2305711/"],
  ["Frankenfield et al. 2005 systematic review", "https://korr.com/wp-content/uploads/faq-1-1-1.pdf"],
  ["BMI and mortality meta-analysis, PubMed 27423262", "https://pubmed.ncbi.nlm.nih.gov/27423262/"],
  ["Hall et al. 2011 energy imbalance, PubMed 21872751", "https://pubmed.ncbi.nlm.nih.gov/21872751/"],
];

const footerLinks = [
  { title: "الحاسبة", items: ["السعرات", "الثبات", "العجز", "BMI"] },
  { title: "تعلّم", items: ["السمنة", "الأيض", "النشاط", "التغذية"] },
  { title: "الموقع", items: ["من نحن", "تواصل", "الأسئلة", "المدونة"] },
  { title: "قانوني", items: ["الخصوصية", "الاستخدام", "إخلاء طبي", "الكوكيز"] },
];

const heroFeatures = [
  { icon: Zap, label: "حساب فوري" },
  { icon: CheckCircle2, label: "بدون تسجيل" },
  { icon: Sparkles, label: "3 معادلات علمية" },
  { icon: BookOpenText, label: "مصادر طبية" },
];

const formatter = new Intl.NumberFormat("ar-AE", { maximumFractionDigits: 0 });

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function rounded(value) {
  return Math.round(Number.isFinite(value) ? value : 0);
}

function formatNumber(value) {
  return formatter.format(rounded(value));
}

function useAnimatedNumber(value, duration = 650) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    let frameId;
    const start = display;
    const diff = value - start;
    const startTime = performance.now();

    const tick = (time) => {
      const progress = clamp((time - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return display;
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tight grid of dots with randomized brightness, dimmer overall.
function buildDotPattern(seed = 7, gridSize = 20, tile = 160) {
  const rand = mulberry32(seed);
  const step = tile / gridSize;
  const dots = [];
  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      const cx = gx * step + step / 2;
      const cy = gy * step + step / 2;
      const r = 0.62 + rand() * 0.32;
      const o = 0.08 + rand() * 0.52;
      dots.push(`<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" opacity="${o.toFixed(2)}"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile} ${tile}" width="${tile}" height="${tile}"><g fill="white">${dots.join("")}</g></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function RedSurface({ className = "", seed = 7, children, ...rest }) {
  const pattern = useMemo(() => buildDotPattern(seed), [seed]);
  return (
    <div className={`red-surface ${className}`} {...rest}>
      <span className="red-surface-dots" style={{ backgroundImage: pattern }} aria-hidden="true" />
      <span className="red-surface-glow" aria-hidden="true" />
      {children}
    </div>
  );
}

function BrandMark({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="brand-mark" aria-hidden="true">
      <defs>
        <linearGradient id="bm-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        d="M16 3.5c.4 2.6 2.2 4.4 4.4 6.4 2.2 2 4.1 4.2 4.1 7.7 0 5-3.9 9.2-8.5 9.2S7.5 22.6 7.5 17.6c0-2.6 1-4.5 2.4-6.1.1 1.6.9 2.8 2.2 2.8 1.4 0 2.2-1 2.2-2.6 0-2.6-1-4-1-6.6 0-.7.3-1.2.6-1.6.7-.8 1.7-.7 2.1 0z"
        fill="url(#bm-g)"
      />
      <circle cx="16" cy="20" r="2.2" fill="#9d0404" opacity="0.55" />
    </svg>
  );
}

function calculateBmr({ formula, gender, weight, height, age, bodyFat }) {
  if (formula === "harris") {
    return gender === "male"
      ? 13.397 * weight + 4.799 * height - 5.677 * age + 88.362
      : 9.247 * weight + 3.098 * height - 4.33 * age + 447.593;
  }

  if (formula === "katch" && bodyFat > 0) {
    return 370 + 21.6 * (weight * (1 - bodyFat / 100));
  }

  return gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

function getBmiStatus(bmi) {
  if (bmi < 18.5) return { label: "نحافة", className: "under" };
  if (bmi < 25) return { label: "طبيعي", className: "normal" };
  if (bmi < 30) return { label: "زيادة وزن", className: "over" };
  return { label: "سمنة", className: "obese" };
}

function NumberField({ label, value, placeholder, min, max, unit, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-line">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            const v = event.target.value;
            onChange(v === "" ? "" : Number(v));
          }}
        />
        <small>{unit}</small>
      </span>
    </label>
  );
}

function AnimatedValue({ value, suffix = "" }) {
  const animated = useAnimatedNumber(value);
  return (
    <strong>
      {formatNumber(animated)}
      {suffix && <span>{suffix}</span>}
    </strong>
  );
}

function BmiGauge({ bmi }) {
  const status = getBmiStatus(bmi);
  const position = clamp(((bmi - 14) / 26) * 100, 0, 100);

  return (
    <div className="bmi-panel">
      <div className="bmi-topline">
        <span>مؤشر كتلة الجسم</span>
        <b>{bmi.toFixed(1)}</b>
      </div>
      <div className="bmi-track">
        <i className="zone under-zone" />
        <i className="zone normal-zone" />
        <i className="zone over-zone" />
        <i className="zone obese-zone" />
        <span className={`bmi-pin ${status.className}`} style={{ insetInlineStart: `${position}%` }} />
      </div>
      <div className="bmi-labels">
        <span>نحافة</span>
        <span>طبيعي</span>
        <span>زيادة وزن</span>
        <span>سمنة</span>
      </div>
      <p>
        التصنيف الحالي: <b>{status.label}</b>.
      </p>
    </div>
  );
}

function FlowStep({ icon: Icon, label, value }) {
  return (
    <div className="flow-step">
      <Icon size={18} />
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function ActivitySlider({ index, onChange }) {
  const current = activityLevels[index];
  return (
    <div className="activity-slider">
      <div className="activity-head">
        <span>النشاط اليومي</span>
        <b>× {current.value}</b>
      </div>
      <input
        className="range"
        type="range"
        min="0"
        max={activityLevels.length - 1}
        step="1"
        value={index}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--p": `${(index / (activityLevels.length - 1)) * 100}%` }}
      />
      <div className="activity-meta">
        <strong>{current.label}</strong>
        <small>{current.note}</small>
      </div>
      <div className="activity-ticks" aria-hidden="true">
        {activityLevels.map((_, i) => (
          <i key={i} className={i <= index ? "on" : ""} />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityIdx, setActivityIdx] = useState(3);
  const [formula, setFormula] = useState("mifflin");
  const [bodyFat, setBodyFat] = useState("");
  const [email, setEmail] = useState("");

  const activity = activityLevels[activityIdx].value;

  const result = useMemo(() => {
    const safeAge = clamp(Number(age) || 25, 15, 80);
    const safeHeight = clamp(Number(height) || 180, 100, 230);
    const safeWeight = clamp(Number(weight) || 75, 35, 250);
    const safeBodyFat = clamp(Number(bodyFat) || 20, 3, 70);
    const effectiveFormula = formula === "katch" && !safeBodyFat ? "mifflin" : formula;
    const bmr = calculateBmr({
      formula: effectiveFormula,
      gender,
      weight: safeWeight,
      height: safeHeight,
      age: safeAge,
      bodyFat: safeBodyFat,
    });
    const maintenance = bmr * activity;
    const bmi = safeWeight / Math.pow(safeHeight / 100, 2);

    const proteinG = Math.round(safeWeight * 1.8);
    const fatG = Math.round((maintenance * 0.27) / 9);
    const carbG = Math.round((maintenance - proteinG * 4 - fatG * 9) / 4);

    return {
      bmr,
      maintenance,
      mild: maintenance - 250,
      moderate: maintenance - 500,
      upper: maintenance - 1000,
      gain: maintenance + 300,
      bmi,
      effectiveFormula,
      proteinG,
      fatG,
      carbG,
    };
  }, [age, gender, height, weight, activity, formula, bodyFat]);

  const activityLabel = activityLevels[activityIdx].label;
  const activeFormula = formulas.find((item) => item.id === result.effectiveFormula)?.label;

  return (
    <main className="site-shell">
      <header className="topbar">
        <a href="#" className="topbar-brand">
          <span className="topbar-mark"><BrandMark size={20} /></span>
          <b>سعرات</b>
        </a>
        <nav className="topbar-nav">
          <a href="#calculator">الحاسبة</a>
          <a href="#learn">تعلّم</a>
          <a href="#method">الطريقة</a>
          <a href="#sources">المصادر</a>
        </nav>
        <a href="#calculator" className="topbar-cta">
          ابدأ الآن
          <ArrowUpRight size={14} />
        </a>
      </header>

      <section className="hero-section">
        <h1>
          <span className="hero-line">احسب سعراتك</span>
          <span className="hero-line">وافهم وزنك بدون فوضى</span>
        </h1>
        <p>
          صفحة هادئة لحساب سعرات الثبات وعجز السعرات ومؤشر كتلة الجسم،
          مع شرح علمي مبسّط ومصادر موثوقة.
        </p>
        <div className="hero-actions">
          <a href="#calculator" className="btn-primary">ابدأ الحساب <ArrowUpRight size={16} /></a>
          <a href="#learn" className="btn-ghost">اقرأ الشرح</a>
        </div>
        <ul className="hero-features">
          {heroFeatures.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={14} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <a href="#calculator" className="hero-scroll" aria-label="انزل للحاسبة">
          <ChevronDown size={18} />
        </a>
      </section>

      <section className="section-block" id="calculator">
        <div className="section-heading">
          <h2>الحاسبة</h2>
          <p>أدخل بياناتك، اختر النشاط والمعادلة، وستحدّث النتيجة مباشرة.</p>
        </div>

        <div className="calculator-layout">
          <section className="app-card input-card" aria-label="مدخلات الحاسبة">
            <div className="card-heading">
              <span className="card-icon"><Calculator size={20} /></span>
              <div>
                <h3>بياناتك</h3>
                <p>BMR ← TDEE ← أهداف العجز.</p>
              </div>
            </div>

            <div className="gender-row">
              <span className="gender-label">الجنس</span>
              <div className="segmented-control" role="group" aria-label="الجنس">
                <button type="button" className={gender === "male" ? "active" : ""} onClick={() => setGender("male")}>
                  ذكر
                </button>
                <button type="button" className={gender === "female" ? "active" : ""} onClick={() => setGender("female")}>
                  أنثى
                </button>
              </div>
            </div>

            <div className="field-grid">
              <NumberField label="العمر" value={age} placeholder="25" min={15} max={80} unit="سنة" onChange={setAge} />
              <NumberField label="الطول" value={height} placeholder="180" min={100} max={230} unit="سم" onChange={setHeight} />
              <NumberField label="الوزن" value={weight} placeholder="75" min={35} max={250} unit="كجم" onChange={setWeight} />
              <NumberField label="دهون الجسم" value={bodyFat} placeholder="20" min={3} max={70} unit="%" onChange={setBodyFat} />
            </div>

            <ActivitySlider index={activityIdx} onChange={setActivityIdx} />

            <div className="formula-block">
              <div className="formula-block-head">
                <b>المعادلة</b>
                <small>مرّر فوق أي معادلة للشرح.</small>
              </div>
              <div className="formula-list" aria-label="اختيار المعادلة">
                {formulas.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={formula === item.id ? "formula-btn active" : "formula-btn"}
                    onClick={() => setFormula(item.id)}
                  >
                    <span className="formula-btn-top">
                      <b>{item.label}</b>
                      <Info size={13} className="formula-info" />
                    </span>
                    <span className="formula-btn-note">{item.note}</span>
                    <span className="formula-tooltip" role="tooltip">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-foot">
              <CheckCircle2 size={14} />
              <span>الحساب يعمل محلياً على جهازك. لا بيانات تُرسل.</span>
            </div>
          </section>

          <RedSurface className="result-card" seed={21} aria-label="نتائج الحاسبة">
            <div className="result-hero">
              <span>احتياجك اليومي</span>
              <AnimatedValue value={result.maintenance} suffix=" سعرة" />
              <p>{activityLabel}، باستخدام {activeFormula}.</p>
            </div>

            <div className="result-table">
              <div>
                <span>BMR <small>معدل الأيض الأساسي</small></span>
                <b>{formatNumber(result.bmr)}</b>
              </div>
              <div>
                <span>عجز خفيف <small>~0.25 كجم/أسبوع</small></span>
                <b>{formatNumber(result.mild)}</b>
              </div>
              <div>
                <span>عجز متوسط <small>~0.5 كجم/أسبوع</small></span>
                <b>{formatNumber(result.moderate)}</b>
              </div>
              <div>
                <span>حد أعلى <small>~1 كجم/أسبوع</small></span>
                <b>{formatNumber(result.upper)}</b>
              </div>
            </div>

            <div className="macro-row">
              <div>
                <span>بروتين</span>
                <b>{result.proteinG}<i>غ</i></b>
              </div>
              <div>
                <span>دهون</span>
                <b>{result.fatG}<i>غ</i></b>
              </div>
              <div>
                <span>كربوهيدرات</span>
                <b>{result.carbG}<i>غ</i></b>
              </div>
            </div>

            <BmiGauge bmi={result.bmi} />
          </RedSurface>
        </div>
      </section>

      <section className="section-block" id="learn">
        <div className="section-heading">
          <h2>السمنة، BMI، وعجز السعرات</h2>
          <p>الأساسيات في أربع بطاقات قصيرة.</p>
        </div>

        <div className="learn-grid">
          <article className="app-card learn-card">
            <span className="card-icon"><BookOpenText size={20} /></span>
            <h3>ما هي السمنة؟</h3>
            <p>
              تراكم زائد للدهون قد يؤثر في الصحة. BMI أداة فرز للنطاق العام،
              لكنها لا تصف كل تفاصيل الجسم.
            </p>
          </article>
          <article className="app-card learn-card">
            <span className="card-icon"><HeartPulse size={20} /></span>
            <h3>لماذا هي خطيرة؟</h3>
            <p>
              ترتبط بالسكري من النوع الثاني، أمراض القلب، ارتفاع الضغط،
              ومشكلات التنفس والمفاصل.
            </p>
          </article>
          <article className="app-card learn-card">
            <span className="card-icon"><ShieldAlert size={20} /></span>
            <h3>زيادة الوزن</h3>
            <p>
              ليست حكماً نهائياً على الصحة، لكنها علامة تستحق خطة غذاء
              ونشاط قابلة للاستمرار.
            </p>
          </article>
          <article className="app-card learn-card">
            <span className="card-icon"><Gauge size={20} /></span>
            <h3>مؤشر BMI</h3>
            <p>
              الوزن بالكيلوجرام على مربع الطول بالمتر. طبيعي 18.5–24.9،
              زيادة من 25، سمنة من 30.
            </p>
          </article>
        </div>
      </section>

      <section className="method-section" id="method">
        <RedSurface className="deficit-panel" seed={42}>
          <div className="deficit-top">
            <Target size={28} />
            <span>قاعدة العجز</span>
          </div>
          <div className="deficit-bottom">
            <h2>كيف تخسر الوزن؟</h2>
            <p>
              عجز 250–500 سعرة يومياً، بروتين كافٍ، وألياف.
              لا تجعل العجز الكبير خطتك الأساسية.
            </p>
            <ul className="deficit-list">
              <li><TrendingDown size={14} /> 7700 سعرة ≈ كيلو دهون</li>
              <li><Activity size={14} /> النشاط أهم من الحساب الدقيق</li>
              <li><Utensils size={14} /> راقب الوزن أسبوعياً، لا يومياً</li>
            </ul>
          </div>
        </RedSurface>

        <div className="app-card flow-card">
          <div className="card-heading">
            <span className="card-icon"><Activity size={20} /></span>
            <div>
              <h3>كيف يتم الحساب؟</h3>
              <p>من بياناتك إلى معدل الأيض ثم معامل النشاط.</p>
            </div>
          </div>
          <div className="calculation-flow">
            <FlowStep icon={Scale} label="البيانات" value={`${height || 180} / ${weight || 75}`} />
            <FlowStep icon={Calculator} label="BMR" value={formatNumber(result.bmr)} />
            <FlowStep icon={Activity} label="النشاط" value={`× ${activity}`} />
            <FlowStep icon={Utensils} label="الثبات" value={formatNumber(result.maintenance)} />
            <FlowStep icon={Target} label="العجز" value={formatNumber(result.moderate)} />
          </div>
        </div>
      </section>

      <section className="sources-section" id="sources">
        <div className="section-heading">
          <h2>المصادر العلمية</h2>
          <p>الصيغ والتعريفات من مراجع منشورة.</p>
        </div>
        <div className="sources-card">
          <div className="source-list">
            {sources.map(([title, href], index) => (
              <a key={href} href={href} target="_blank" rel="noreferrer">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{title}</b>
                <ArrowUpRight size={14} className="source-arrow" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-shell">
          <div className="footer-heading">
            <h2>ابدأ رحلتك نحو وزن أكثر صحة</h2>
            <p>
              انضم لآلاف يحسبون سعراتهم بشكل صحيح. أقل من دقيقتين،
              بدون حسابات معقدة وبدون بيانات.
            </p>
          </div>

          <div className="footer-grid">
            <RedSurface className="subscribe-card" seed={11}>
              <div className="subscribe-top">
                <span className="brand">
                  <BrandMark size={24} />
                  <b>سعرات</b>
                </span>
              </div>
              <div className="subscribe-bottom">
                <label htmlFor="footer-email">اشترك ليصلك الجديد :</label>
                <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <button type="submit">اشترك</button>
                </form>
              </div>
            </RedSurface>

            <div className="footer-links-card">
              <div className="footer-links">
                {footerLinks.map((col) => (
                  <div className="link-col" key={col.title}>
                    <b>{col.title}</b>
                    {col.items.map((item) => (
                      <a href="#" key={item}>{item}</a>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <RedSurface className="app-tile" seed={5}>
              <div className="app-tile-inner">
                <BrandMark size={92} />
              </div>
            </RedSurface>

            <div className="footer-support-card">
              <div className="footer-support">
                <p>
                  <span>فريق الدعم جاهز لمساعدتك </span>
                  <b>في أي وقت. تواصل معنا.</b>
                </p>
                <div className="socials">
                  <span>تابعنا</span>
                  <a href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
                  <a href="#" aria-label="Facebook"><Facebook size={16} /></a>
                  <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
                  <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
                </div>
              </div>
              <div className="footer-meta">
                <span>© 2026 سعرات. جميع الحقوق محفوظة.</span>
                <span className="footer-meta-links">
                  <a href="#">الخصوصية</a>
                  <a href="#">الشروط</a>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-watermark" aria-hidden="true">
          <span>سعرات</span>
        </div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
