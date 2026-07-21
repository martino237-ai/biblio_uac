import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
 
import logo     from '../assets/images/logo.jpeg';
import fondsImg from '../assets/images/fonds_acceuil.jpeg';
 
/* ═══════════════════════════════════════════════════════════
   STYLES INJECTÉS
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
 
/* ── RESET LOCAL ── */
.home-root *, .home-root *::before, .home-root *::after {
  box-sizing: border-box;
}
.home-root {
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}
 
/* ══════════════════════════════
   NAV
══════════════════════════════ */
.home-nav {
  position: fixed; top: 0; left: 0; width: 100%;
  z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px;
  height: 68px;
  background: rgba(7,22,60,.64);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,.16);
  transition: background .3s;
}
.home-nav.scrolled {
  background: rgba(7,22,60,.80);
}
.home-nav-brand {
  display: flex; align-items: center; gap: 12px;
}
.home-nav-logo {
  width: 38px; height: 38px; border-radius: 10px;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,.25);
}
.home-nav-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem; font-weight: 700; color: #fff;
  letter-spacing: -.2px;
}
.home-nav-title span { color: #fbbf24; }
.home-nav-actions { display: flex; gap: 10px; }
 
.btn-login {
  padding: 9px 22px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1e3a8a;
  font-family: 'Inter', sans-serif;
  font-size: .88rem; font-weight: 700;
  border: none; border-radius: 10px; cursor: pointer;
  transition: all .3s;
  box-shadow: 0 4px 12px rgba(251,191,36,.3);
}
.btn-login:hover {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(251,191,36,.4);
}
.btn-signup {
  padding: 9px 22px;
  background: rgba(255,255,255,.12); color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: .88rem; font-weight: 600;
  border: 1px solid rgba(255,255,255,.25); border-radius: 10px;
  cursor: pointer; transition: all .3s;
  backdrop-filter: blur(6px);
}
.btn-signup:hover {
  background: rgba(255,255,255,.22); 
  transform: translateY(-2px);
  border-color: rgba(255,255,255,.4);
}
 
/* ══════════════════════════════
   HERO
══════════════════════════════ */
.home-hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  text-align: center;
  overflow: hidden;
}
.home-hero-bg {
  position: absolute; inset: 0;
  background-image: var(--hero-bg);
  background-size: cover; background-position: center;
  transform: scale(1.05);
  animation: heroZoom 20s ease-in-out infinite alternate;
}
@keyframes heroZoom {
  from { transform: scale(1.05); }
  to   { transform: scale(1.12); }
}
.home-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(7,22,60,.52) 0%,
    rgba(7,22,60,.32) 50%,
    rgba(7,22,60,.62) 100%
  );
}
.home-hero-content {
  position: relative; z-index: 2;
  padding: 60px 20px 80px;
  max-width: 780px; margin: 0 auto;
}
.home-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 18px; border-radius: 40px;
  background: rgba(251,191,36,.15); border: 1px solid rgba(251,191,36,.4);
  color: #fbbf24; font-size: .78rem; font-weight: 600;
  letter-spacing: .08em; text-transform: uppercase;
  margin-bottom: 24px;
  animation: fadeDown .6s ease both;
}
.home-hero-h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 700; line-height: 1.15; color: #fff;
  margin: 0 0 20px;
  animation: fadeDown .7s .1s ease both;
}
.home-hero-h1 em {
  font-style: italic; color: #fbbf24;
}
.home-hero-sub {
  font-size: 1.05rem; color: rgba(255,255,255,.78);
  line-height: 1.75; max-width: 560px; margin: 0 auto 36px;
  font-weight: 300;
  animation: fadeDown .7s .2s ease both;
}
.home-hero-cta {
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  animation: fadeDown .7s .3s ease both;
}
.btn-cta-primary {
  padding: 14px 32px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1e3a8a; font-family: 'Inter', sans-serif;
  font-size: .95rem; font-weight: 800;
  border: none; border-radius: 12px; cursor: pointer;
  box-shadow: 0 6px 20px rgba(251,191,36,.4);
  transition: all .3s;
}
.btn-cta-primary:hover { 
  transform: translateY(-3px); 
  box-shadow: 0 10px 30px rgba(251,191,36,.5);
  background: linear-gradient(135deg, #f59e0b, #f97316);
}
.btn-cta-secondary {
  padding: 14px 32px;
  background: rgba(255,255,255,.12); color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: .95rem; font-weight: 600;
  border: 1px solid rgba(255,255,255,.3); border-radius: 12px;
  cursor: pointer; backdrop-filter: blur(8px);
  transition: all .3s;
}
.btn-cta-secondary:hover { 
  background: rgba(255,255,255,.2); 
  transform: translateY(-3px);
  border-color: rgba(255,255,255,.4);
}
 
/* mini stats dans le hero */
.home-hero-stats {
  display: flex; gap: 32px; justify-content: center;
  margin-top: 48px; flex-wrap: wrap;
  animation: fadeDown .7s .4s ease both;
}
.hero-stat { text-align: center; }
.hero-stat-n {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem; font-weight: 700; color: #fbbf24; line-height: 1;
}
.hero-stat-l {
  font-size: .73rem; color: rgba(255,255,255,.6);
  font-weight: 500; text-transform: uppercase; letter-spacing: .07em;
  margin-top: 3px;
}
.hero-stat-divider {
  width: 1px; height: 50px; background: rgba(255,255,255,.18);
  align-self: center;
}
 
/* ── scroll indicator ── */
.scroll-indicator {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  color: rgba(255,255,255,.45); font-size: .7rem;
  animation: bounce 2s infinite;
}
.scroll-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,.4);
}
@keyframes bounce {
  0%,100% { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(-8px); }
}
 
/* ══════════════════════════════
   FEATURES
══════════════════════════════ */
.home-features {
  background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(37,99,235,0.02) 100%);
  padding: 100px 40px;
  position: relative;
}
.home-section-header {
  text-align: center; margin-bottom: 56px;
}
.home-section-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 16px; border-radius: 40px;
  background: rgba(37,99,235,0.08); border: 1px solid rgba(37,99,235,0.2);
  color: #1e40af; font-size: .73rem; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase; margin-bottom: 14px;
}
.home-section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700;
  color: #0f172a; margin: 0 0 14px; line-height: 1.2;
}
.home-section-title em { font-style: italic; color: #1e40af; }
.home-section-sub {
  font-size: .95rem; color: #475569; max-width: 520px;
  margin: 0 auto; line-height: 1.75; font-weight: 300;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px; max-width: 1100px; margin: 0 auto;
}

.feat-card {
  background: rgba(255,255,255,0.6); 
  border: 1px solid rgba(37,99,235,0.1);
  border-radius: 16px; padding: 28px;
  transition: transform .3s, box-shadow .3s, border-color .3s, background .3s;
  position: relative; overflow: hidden;
  backdrop-filter: blur(8px);
}
.feat-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--feat-color, linear-gradient(90deg,#2563eb,#0ea5e9));
  border-radius: 16px 16px 0 0;
  opacity: 0; transition: opacity .3s;
}
.feat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(37,99,235,0.12);
  border-color: rgba(37,99,235,0.25);
  background: rgba(255,255,255,0.8);
}
 
.feat-icon-wrap {
  width: 52px; height: 52px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; margin-bottom: 16px;
  transition: transform .3s;
  background: rgba(37,99,235,0.08) !important;
}
.feat-card:hover .feat-icon-wrap { transform: scale(1.08) rotate(-2deg); }
.feat-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; font-weight: 600; color: #0f172a;
  margin: 0 0 8px;
}
.feat-desc { font-size: .85rem; color: #475569; line-height: 1.7; margin: 0; }
 
/* ══════════════════════════════
   BENEFITS
══════════════════════════════ */
.home-benefits {
  background: linear-gradient(135deg, #112a56 0%, #2054a8 50%, #2563eb 100%);
  padding: 100px 40px; position: relative; overflow: hidden;
}
.home-benefits::before {
  content: '';
  position: absolute; top: -100px; right: -100px;
  width: 400px; height: 400px; border-radius: 50%;
  background: rgba(251,191,36,.06);
  pointer-events: none;
}
.home-benefits .home-section-title { color: #fff; }
.home-benefits .home-section-sub   { color: rgba(255,255,255,.65); }
.home-benefits .home-section-eyebrow {
  background: rgba(251,191,36,.15); border-color: rgba(251,191,36,.4);
  color: #fbbf24;
}
 
.benefits-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 18px; max-width: 820px; margin: 0 auto;
}
.benefit-item {
  display: flex; gap: 16px; align-items: flex-start;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 14px; padding: 20px;
  transition: background .3s, border-color .3s, transform .3s;
  backdrop-filter: blur(8px);
}
.benefit-item:hover {
  background: rgba(255,255,255,.12);
  border-color: rgba(255,255,255,.25);
  transform: translateY(-2px);
}
.benefit-check {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: rgba(251,191,36,.18); border: 1px solid rgba(251,191,36,.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: #fbbf24;
}
.benefit-title {
  font-size: .9rem; font-weight: 700; color: #fff; margin: 0 0 4px;
}
.benefit-desc { font-size: .8rem; color: rgba(255,255,255,.65); line-height: 1.6; margin: 0; }
 
/* ══════════════════════════════
   CTA FINAL
══════════════════════════════ */
.home-cta-section {
  background: linear-gradient(180deg, rgba(37,99,235,0.03) 0%, rgba(15,23,42,0.02) 100%);
  padding: 100px 40px; text-align: center;
  position: relative;
}
.cta-card {
  max-width: 700px; margin: 0 auto;
  background: linear-gradient(135deg, rgba(30,58,138,0.5), rgba(37,99,235,0.5));
  border-radius: 24px; padding: 60px 40px;
  box-shadow: 0 12px 48px rgba(37,99,235,0.15);
  position: relative; overflow: hidden;
  border: 1px solid rgba(37,99,235,0.2);
  backdrop-filter: blur(10px);
}
.cta-card::before {
  content: '';
  position: absolute; top: -60px; right: -60px;
  width: 220px; height: 220px; border-radius: 50%;
  background: rgba(251,191,36,0.04);
}
.cta-card::after {
  content: '';
  position: absolute; bottom: -60px; left: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(37,99,235,0.06);
}
.cta-card h3 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700; color: #fff; margin: 0 0 14px; position: relative; z-index: 1;
}
.cta-card p {
  font-size: .95rem; color: rgba(255,255,255,.8);
  margin: 0 0 32px; line-height: 1.75; position: relative; z-index: 1;
}
.cta-card .btn-cta-primary { position: relative; z-index: 1; }
 
/* ══════════════════════════════
   FOOTER
══════════════════════════════ */
.home-footer {
  background: linear-gradient(135deg, #0f172a 0%, rgba(15,23,42,0.95) 100%); 
  color: rgba(255,255,255,.45);
  padding: 32px 40px; text-align: center;
  border-top: 1px solid rgba(255,255,255,.08);
}
.home-footer-brand {
  font-family: 'Playfair Display', serif;
  font-size: 1rem; color: rgba(255,255,255,.75); margin-bottom: 6px;
}
.home-footer-sub { font-size: .78rem; }
 
/* ── LOADER ── */
.home-loader {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(7,22,60,.85); backdrop-filter: blur(8px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 16px;
}
.home-loader-spinner {
  width: 48px; height: 48px;
  border: 3px solid rgba(255,255,255,.2);
  border-top-color: #fbbf24;
  border-radius: 50%; animation: loaderSpin .7s linear infinite;
}
@keyframes loaderSpin { to { transform: rotate(360deg); } }
.home-loader p { color: rgba(255,255,255,.8); font-size: .9rem; }
 
/* ── ANIMATIONS ── */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-18px); }
  to   { opacity: 1; transform: translateY(0); }
}
 
/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .home-nav { padding: 0 20px; }
  .home-nav-title { font-size: .95rem; }
  .home-hero-stats { gap: 18px; }
  .hero-stat-divider { display: none; }
  .benefits-grid { grid-template-columns: 1fr; }
  .home-features, .home-benefits, .home-cta-section { padding: 70px 20px; }
  .cta-card { padding: 40px 24px; }
  .home-footer { padding: 24px 20px; }
  .feat-icon-wrap { width: 46px; height: 46px; font-size: 1.3rem; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Features data ── */
const FEATURES = [
  {
    icon:'📚', title:'Gestion des livres',
    desc:'Cataloguez et organisez vos livres par thème, auteur et emplacement avec un système de suivi des exemplaires.',
    bg:'#eff6ff', color:'linear-gradient(90deg,#2563eb,#0ea5e9)',
  },
  {
    icon:'👥', title:'Gestion des lecteurs',
    desc:'Gérez facilement votre base de lecteurs avec le suivi de leurs emprunts et consultations.',
    bg:'#f0fdf4', color:'linear-gradient(90deg,#16a34a,#22c55e)',
  },
  {
    icon:'📊', title:'Statistiques',
    desc:'Accédez à des statistiques détaillées sur vos emprunts, consultations et activités.',
    bg:'#fef3c7', color:'linear-gradient(90deg,#d97706,#f59e0b)',
  },
  {
    icon:'📜', title:"Journal d'activités",
    desc:"Suivez toutes les actions (emprunts, connexions) avec filtres, recherche et export CSV/PDF.",
    bg:'#fce7f3', color:'linear-gradient(90deg,#db2777,#ec4899)',
  },
  {
    icon:'🔄', title:'Gestion des emprunts',
    desc:"Suivez les emprunts et retours avec des alertes pour les retards et disponibilité.",
    bg:'#ede9fe', color:'linear-gradient(90deg,#7c3aed,#8b5cf6)',
  },
  {
    icon:'🌐', title:'Livres en ligne gratuits',
    desc:"Recherchez et lisez des livres numériques gratuits classés par catégorie (informatique, santé, droit…).",
    bg:'#ecfdf5', color:'linear-gradient(90deg,#0f766e,#14b8a6)',
  },
  {
    icon:'🔐', title:'Sécurité',
    desc:"Système d'authentification sécurisé avec des rôles (Administrateur, Bibliothécaire, Lecteur).",
    bg:'#fef2f2', color:'linear-gradient(90deg,#dc2626,#ef4444)',
  },
  {
    icon:'📤', title:'Exports',
    desc:"Exportez vos données et rapports en formats divers pour une meilleure analyse.",
    bg:'#f0f9ff', color:'linear-gradient(90deg,#0284c7,#38bdf8)',
  },
];
 
const BENEFITS = [
  { icon:'✦', title:'Interface intuitive', desc:"Facile à utiliser pour tous les niveaux d'utilisateurs" },
  { icon:'⚡', title:'Rapide et fiable',   desc:'Performance optimisée pour gérer de grandes bibliothèques' },
  { icon:'🌍', title:'Support multilingue', desc:'Interface disponible en français, anglais et espagnol' },
  { icon:'🛡', title:'Données sécurisées', desc:'Protégées avec des standards de sécurité élevés' },
];
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════ */
export default function Home() {
  const navigate     = useNavigate();
  const { t }        = useTranslation();
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
 
  injectCSS('home-css', CSS);
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
 
  function go(path) {
    setLoading(true);
    setTimeout(() => navigate(path), 900);
  }
 
  return (
    <div className="home-root">
 
      {/* ── LOADER ── */}
      {loading && (
        <div className="home-loader">
          <div className="home-loader-spinner"/>
          <p>{t('Chargement en cours...')}</p>
        </div>
      )}
 
      {/* ══ NAV ══ */}
      <nav className={`home-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="home-nav-brand">
          <img src={logo} alt="Logo Bibliothèque UAC" className="home-nav-logo"/>
          <span className="home-nav-title">
            Biblio<span>UAC</span>
          </span>
        </div>
        <div className="home-nav-actions">
          <button className="btn-login"  onClick={() => go('/login')}>
            {t('Connexion')}
          </button>
          <button className="btn-signup" onClick={() => go('/signup')}>
            {t("S'inscrire")}
          </button>
        </div>
      </nav>
 
      {/* ══ HERO ══ */}
      <section className="home-hero">
        <div
          className="home-hero-bg"
          style={{ '--hero-bg': `url(${fondsImg})`, backgroundImage: `url(${fondsImg})` }}
        />
        <div className="home-hero-overlay"/>
 
        <div className="home-hero-content">
          <div className="home-hero-eyebrow">
            ✦ {t('Système de gestion bibliothécaire')}
          </div>
 
          <h1 className="home-hero-h1">
            {t('Bienvenue à la')}<br/>
            <em>{t('Bibliothèque UAC')}</em>
          </h1>
 
          <p className="home-hero-sub">
            {t("Gérez efficacement vos livres, lecteurs et emprunts avec notre système de gestion de bibliothèque moderne et intuitif.")}
          </p>
 
          <div className="home-hero-cta">
            <button className="btn-cta-primary" onClick={() => go('/login')}>
              {t('Commencer')} →
            </button>
            <button className="btn-cta-secondary" onClick={() => go('/signup')}>
              {t("Créer un compte")}
            </button>
          </div>
 
          <div className="home-hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-n">500+</div>
              <div className="hero-stat-l">{t('Ouvrages')}</div>
            </div>
            <div className="hero-stat-divider"/>
            <div className="hero-stat">
              <div className="hero-stat-n">248</div>
              <div className="hero-stat-l">{t('Lecteurs')}</div>
            </div>
            <div className="hero-stat-divider"/>
            <div className="hero-stat">
              <div className="hero-stat-n">12k+</div>
              <div className="hero-stat-l">{t('Livres en ligne')}</div>
            </div>
          </div>
        </div>
 
        <div className="scroll-indicator" aria-hidden="true">
          <span style={{fontSize:'.65rem',letterSpacing:'.1em',textTransform:'uppercase'}}>Défiler</span>
          <div className="scroll-dot"/>
          <div className="scroll-dot"/>
        </div>
      </section>
 
      {/* ══ FEATURES ══ */}
      <section className="home-features">
        <div className="home-section-header">
          <div className="home-section-eyebrow">✦ {t('Ce que nous offrons')}</div>
          <h2 className="home-section-title">
            {t('Fonctionnalités')}<br/>
            <em>{t('Principales')}</em>
          </h2>
          <p className="home-section-sub">
            {t("Tout ce dont vous avez besoin pour gérer votre bibliothèque universitaire de façon moderne et efficace.")}
          </p>
        </div>
 
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feat-card"
              style={{ '--feat-color': f.color }}
            >
              <div
                className="feat-icon-wrap"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3 className="feat-title">{t(f.title)}</h3>
              <p className="feat-desc">{t(f.desc)}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ══ BENEFITS ══ */}
      <section className="home-benefits">
        <div className="home-section-header">
          <div className="home-section-eyebrow">✦ {t('Nos avantages')}</div>
          <h2 className="home-section-title">
            {t('Pourquoi nous')} <em>{t('choisir ?')}</em>
          </h2>
          <p className="home-section-sub">
            {t("Une solution pensée pour les bibliothèques universitaires modernes.")}
          </p>
        </div>
 
        <div className="benefits-grid">
          {BENEFITS.map((b, i) => (
            <div key={i} className="benefit-item">
              <div className="benefit-check">{b.icon}</div>
              <div>
                <p className="benefit-title">{t(b.title)}</p>
                <p className="benefit-desc">{t(b.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
 
      {/* ══ CTA FINAL ══ */}
      <section className="home-cta-section">
        <div className="cta-card">
          <h3>{t('Prêt à commencer ?')}</h3>
          <p>
            {t("Connectez-vous maintenant pour accéder à toutes les fonctionnalités de la bibliothèque UAC.")}
          </p>
          <button className="btn-cta-primary" onClick={() => go('/login')}>
            {t('Se connecter maintenant')} →
          </button>
        </div>
      </section>
 
      {/* ══ FOOTER ══ */}
      <footer className="home-footer">
        <div className="home-footer-brand">Bibliothèque UAC</div>
        <div className="home-footer-sub">
          {t('© 2026 Bibliothèque UAC. Tous droits réservés.')} &nbsp;·&nbsp;
          {t('Gestion Intelligente des Bibliothèques')}
        </div>
      </footer>
 
    </div>
  );
}
 