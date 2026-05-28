import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
 
import fond1 from '../assets/images/fond1.jpeg';
import logo  from '../assets/images/logo.jpeg';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
 
.lg-root *, .lg-root *::before, .lg-root *::after { box-sizing: border-box; }
 
/* ══ NAVBAR ══ */
.lg-nav {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 68px;
  background: rgba(7,22,60,.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.lg-nav-brand {
  display: flex; align-items: center; gap: 12px; cursor: pointer;
}
.lg-nav-logo {
  width: 38px; height: 38px; border-radius: 10px;
  object-fit: cover; border: 2px solid rgba(255,255,255,.25);
}
.lg-nav-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; font-weight: 700; color: #fff;
}
.lg-nav-name span { color: #fbbf24; }
.lg-nav-btn {
  padding: 8px 18px; border-radius: 9px;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
  color: rgba(255,255,255,.85); font-family: 'Inter', sans-serif;
  font-size: .85rem; font-weight: 500; cursor: pointer; transition: all .18s;
}
.lg-nav-btn:hover { background: rgba(255,255,255,.18); color: #fbbf24; }
 
/* ══ PAGE LAYOUT ══ */
.lg-root {
  min-height: 100vh; padding-top: 68px;
  display: grid; grid-template-columns: 1fr 1fr;
  font-family: 'Inter', sans-serif;
}
 
/* ══ PANNEAU GAUCHE ══ */
.lg-left {
  position: sticky; top: 68px;
  height: calc(100vh - 68px);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.lg-left-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  animation: lgZoom 20s ease-in-out infinite alternate;
}
@keyframes lgZoom {
  from { transform: scale(1.04); }
  to   { transform: scale(1.12); }
}
.lg-left-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    135deg,
    rgba(7,22,60,.88) 0%,
    rgba(15,40,100,.68) 55%,
    rgba(7,22,60,.90) 100%
  );
}
.lg-left-inner {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 40px 44px; max-width: 440px;
}
 
.lg-eyebrow {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 16px; border-radius: 40px;
  background: rgba(251,191,36,.15); border: 1px solid rgba(251,191,36,.4);
  color: #fbbf24; font-size: .72rem; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase; margin-bottom: 20px;
}
.lg-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3vw, 2.9rem); font-weight: 700;
  color: #fff; line-height: 1.2; margin: 0 0 16px;
}
.lg-hero-title em { font-style: italic; color: #fbbf24; }
.lg-hero-sub {
  font-size: .88rem; color: rgba(255,255,255,.65);
  line-height: 1.8; font-weight: 300; margin: 0 0 28px;
}
 
/* Stats */
.lg-stats {
  display: flex; gap: 22px; justify-content: center; margin-bottom: 28px;
}
.lg-stat { text-align: center; }
.lg-stat-n {
  font-family: 'Playfair Display', serif;
  font-size: 1.7rem; font-weight: 700; color: #fbbf24; line-height: 1;
}
.lg-stat-l {
  font-size: .65rem; color: rgba(255,255,255,.45);
  text-transform: uppercase; letter-spacing: .07em; margin-top: 2px;
}
.lg-stat-sep { width:1px; background:rgba(255,255,255,.15); align-self:stretch; }
.lg-divider {
  width: 50px; height: 2px; margin: 0 auto 28px;
  background: linear-gradient(90deg, transparent, rgba(251,191,36,.6), transparent);
}
 
/* Roles */
.lg-roles { display: flex; flex-direction: column; gap: 9px; width: 100%; }
.lg-role {
  display: flex; align-items: center; gap: 12px; text-align: left;
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
  border-radius: 12px; padding: 11px 14px; transition: background .2s;
}
.lg-role:hover { background: rgba(255,255,255,.10); }
.lg-role-icon {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: .95rem;
}
.lg-role-icon.blue   { background: rgba(37,99,235,.25);  border: 1px solid rgba(37,99,235,.4);  }
.lg-role-icon.green  { background: rgba(22,163,74,.25);  border: 1px solid rgba(22,163,74,.4);  }
.lg-role-icon.amber  { background: rgba(251,191,36,.2);  border: 1px solid rgba(251,191,36,.4); }
.lg-role-title { font-size: .8rem; font-weight: 600; color: #fff; }
.lg-role-desc  { font-size: .7rem; color: rgba(255,255,255,.45); }
 
/* ══ PANNEAU DROIT ══ */
.lg-right {
  background: linear-gradient(160deg, #0c1a45 0%, #0f1f55 55%, #091230 100%);
  display: flex; align-items: center; justify-content: center;
  min-height: calc(100vh - 68px); overflow-y: auto;
}
.lg-form-wrap {
  width: 100%; max-width: 440px; padding: 48px 48px;
}
 
/* ── Titre formulaire ── */
.lg-form-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem; font-weight: 700; color: #fff; margin: 0 0 6px;
}
.lg-form-sub {
  font-size: .84rem; color: rgba(255,255,255,.45); margin: 0 0 30px; line-height: 1.6;
}
 
/* ── Erreur ── */
.lg-error {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 11px 14px; border-radius: 10px;
  background: rgba(220,38,38,.15); border: 1px solid rgba(220,38,38,.3);
  color: #fca5a5; font-size: .82rem; margin-bottom: 20px;
  animation: lgShake .4s ease;
}
@keyframes lgShake {
  0%,100%{transform:translateX(0)}
  25%{transform:translateX(-5px)}
  75%{transform:translateX(5px)}
}
 
/* ── Champs ── */
.lg-field { margin-bottom: 16px; }
.lg-field label {
  display: block; font-size: .68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .08em;
  color: rgba(255,255,255,.45); margin-bottom: 6px;
}
.lg-field input {
  width: 100%; padding: 12px 14px;
  border: 1.5px solid rgba(255,255,255,.1); border-radius: 11px;
  font-family: 'Inter', sans-serif; font-size: .9rem;
  color: #fff; background: rgba(255,255,255,.07); outline: none;
  transition: border-color .18s, box-shadow .18s, background .18s;
}
.lg-field input::placeholder { color: rgba(255,255,255,.2); }
.lg-field input:focus {
  border-color: #fbbf24;
  box-shadow: 0 0 0 3px rgba(251,191,36,.12);
  background: rgba(255,255,255,.10);
}
.lg-field input:disabled { opacity: .4; cursor: not-allowed; }
 
/* ── Boutons ── */
.lg-btn-login {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px; margin-bottom: 10px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1e3a8a;
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 800;
  border: none; border-radius: 12px; cursor: pointer;
  box-shadow: 0 4px 16px rgba(251,191,36,.35);
  transition: all .2s;
}
.lg-btn-login:hover:not(:disabled) {
  transform: translateY(-2px); box-shadow: 0 8px 24px rgba(251,191,36,.5);
}
.lg-btn-login:disabled { opacity: .5; cursor: not-allowed; transform: none; }
 
.lg-btn-signup {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px; margin-bottom: 16px;
  background: rgba(255,255,255,.07); color: rgba(255,255,255,.8);
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 600;
  border: 1.5px solid rgba(255,255,255,.15); border-radius: 12px;
  cursor: pointer; transition: all .2s;
}
.lg-btn-signup:hover:not(:disabled) {
  background: rgba(255,255,255,.13); border-color: rgba(255,255,255,.28);
  color: #fff;
}
.lg-btn-signup:disabled { opacity: .4; cursor: not-allowed; }
 
.lg-btn-back {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%; padding: 8px;
  background: none; border: none; color: rgba(255,255,255,.35);
  font-family: 'Inter', sans-serif; font-size: .82rem; cursor: pointer;
  transition: color .18s;
}
.lg-btn-back:hover { color: rgba(255,255,255,.7); }
 
.lg-divider-hr {
  display: flex; align-items: center; gap: 10px; margin: 4px 0 16px;
}
.lg-divider-hr::before, .lg-divider-hr::after {
  content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.08);
}
.lg-divider-hr span {
  font-size: .7rem; color: rgba(255,255,255,.25); white-space: nowrap;
}
 
/* ── Carte identifiants de test ── */
.lg-test-card {
  margin-top: 24px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 13px; padding: 16px 18px;
}
.lg-test-title {
  font-size: .7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .09em; color: #fbbf24; margin-bottom: 12px;
  display: flex; align-items: center; gap: 6px;
}
.lg-test-rows { display: flex; flex-direction: column; gap: 7px; }
.lg-test-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 7px 10px; border-radius: 8px;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06);
}
.lg-test-role {
  display: flex; align-items: center; gap: 7px;
}
.lg-test-badge {
  font-size: .65rem; font-weight: 700; padding: 2px 8px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: .05em;
}
.lg-test-badge.admin  { background: rgba(239,68,68,.2);  color: #fca5a5; border: 1px solid rgba(239,68,68,.3);  }
.lg-test-badge.biblio { background: rgba(37,99,235,.2);  color: #93c5fd; border: 1px solid rgba(37,99,235,.3);  }
.lg-test-badge.reader { background: rgba(22,163,74,.2);  color: #86efac; border: 1px solid rgba(22,163,74,.3);  }
.lg-test-creds {
  font-family: 'Courier New', monospace;
  font-size: .72rem; color: rgba(255,255,255,.45); text-align: right;
}
 
/* ── Loader ── */
.lg-loader {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(7,22,60,.92); backdrop-filter: blur(10px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
}
.lg-spinner {
  width: 52px; height: 52px;
  border: 3px solid rgba(255,255,255,.15); border-top-color: #fbbf24;
  border-radius: 50%; animation: lgSpin .7s linear infinite;
}
@keyframes lgSpin { to { transform: rotate(360deg); } }
.lg-loader p { color: rgba(255,255,255,.85); font-size: .95rem; font-weight: 500; }
 
/* ── Responsive ── */
@media (max-width: 900px) {
  .lg-root  { grid-template-columns: 1fr; }
  .lg-left  { display: none; }
  .lg-right { min-height: calc(100vh - 68px); }
  .lg-form-wrap { padding: 36px 24px; }
  .lg-nav   { padding: 0 20px; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Spinner inline ── */
const Spin = () => (
  <span style={{
    width:15, height:15, border:'2px solid rgba(255,255,255,.3)',
    borderTopColor:'currentColor', borderRadius:'50%',
    animation:'lgSpin .7s linear infinite', display:'inline-block', flexShrink:0
  }}/>
);
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL — logique 100 % intacte
═══════════════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const { t }    = useTranslation();
 
  const [username,        setUsername]        = useState('');
  const [password,        setPassword]        = useState('');
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [redirectLoading, setRedirectLoading] = useState(false);
 
  injectCSS('lg-css', CSS);
 
  /* ── Submit — logique 100 % identique à l'original ── */
  async function submit(e) {
    e.preventDefault();
 
    // 🔥 TRÈS IMPORTANT : nettoyer l'ancienne session AVANT connexion
    localStorage.removeItem('token');
    localStorage.removeItem('user');
 
    setError('');
    setLoading(true);
 
    try {
      const r = await api.post('/auth/login', { username, password });
 
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(r.data.user));
 
      const role = r.data.user?.role;
 
      // 🔥 Afficher le chargement avant redirection
      setRedirectLoading(true);
 
      let redirectPath = '/dashboard';
      if (role === 'directeur') {
        redirectPath = '/admin';
      } else if (role === 'bibliothecaire' || role === 'biblio') {
        redirectPath = '/librarian';
      }
 
      // Attendre 1 seconde puis rediriger
      setTimeout(() => {
        window.location = redirectPath;
      }, 1000);
 
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Erreur de connexion'
      );
    } finally {
      setLoading(false);
    }
  }
 
  /* ════ RENDER ════ */
  return (
    <>
      {/* ── Loader redirect ── */}
      {redirectLoading && (
        <div className="lg-loader">
          <div className="lg-spinner"/>
          <p>{t('Redirection en cours...')}</p>
        </div>
      )}
 
      {/* ══ NAVBAR ══ */}
      <nav className="lg-nav">
        <div className="lg-nav-brand" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="lg-nav-logo"/>
          <span className="lg-nav-name">Biblio<span>UAC</span></span>
        </div>
        <button className="lg-nav-btn" onClick={() => navigate('/')}>
          ← {t('Accueil')}
        </button>
      </nav>
 
      <div className="lg-root">
 
        {/* ══ PANNEAU GAUCHE ══ */}
        <div className="lg-left">
          <div className="lg-left-bg" style={{ backgroundImage:`url(${fond1})` }}/>
          <div className="lg-left-overlay"/>
 
          <div className="lg-left-inner">
            <div className="lg-eyebrow">✦ {t('Système de Gestion')}</div>
 
            <h2 className="lg-hero-title">
              {t('Bienvenue à la')}<br/>
              <em>{t('Bibliothèque UAC')}</em>
            </h2>
 
            <p className="lg-hero-sub">
              {t("Gérez efficacement vos livres, lecteurs et emprunts avec notre système moderne et intuitif.")}
            </p>
 
            {/* Stats */}
            <div className="lg-stats">
              <div className="lg-stat">
                <div className="lg-stat-n">500+</div>
                <div className="lg-stat-l">{t('Ouvrages')}</div>
              </div>
              <div className="lg-stat-sep"/>
              <div className="lg-stat">
                <div className="lg-stat-n">248</div>
                <div className="lg-stat-l">{t('Lecteurs')}</div>
              </div>
              <div className="lg-stat-sep"/>
              <div className="lg-stat">
                <div className="lg-stat-n">12k+</div>
                <div className="lg-stat-l">{t('En ligne')}</div>
              </div>
            </div>
 
            <div className="lg-divider"/>
 
            {/* Rôles */}
            <div className="lg-roles">
              <div className="lg-role">
                <div className="lg-role-icon blue">🔐</div>
                <div>
                  <div className="lg-role-title">{t('Administrateur / Directeur')}</div>
                  <div className="lg-role-desc">{t('Gestion complète & statistiques')}</div>
                </div>
              </div>
              <div className="lg-role">
                <div className="lg-role-icon green">📚</div>
                <div>
                  <div className="lg-role-title">{t('Bibliothécaire')}</div>
                  <div className="lg-role-desc">{t('Emprunts, consultations, catalogue')}</div>
                </div>
              </div>
              <div className="lg-role">
                <div className="lg-role-icon amber">🎓</div>
                <div>
                  <div className="lg-role-title">{t('Lecteur')}</div>
                  <div className="lg-role-desc">{t('Catalogue & livres en ligne gratuits')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* ══ PANNEAU DROIT ══ */}
        <div className="lg-right">
          <div className="lg-form-wrap">
 
            <p className="lg-form-title">{t('Connexion')}</p>
            <p className="lg-form-sub">
              {t('Entrez vos identifiants pour accéder à votre espace.')}
            </p>
 
            {/* Erreur */}
            {error && (
              <div className="lg-error">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}
 
            <form onSubmit={submit}>
              <div className="lg-field">
                <label>{t("Nom d'utilisateur")}</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required disabled={loading}
                  placeholder="Ex: admin, biblio, MART..."
                  autoComplete="username"
                />
              </div>
 
              <div className="lg-field">
                <label>{t('Mot de passe')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required disabled={loading}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
 
              <button
                type="submit"
                className="lg-btn-login"
                disabled={loading}
              >
                {loading
                  ? <><Spin/> {t('Connexion en cours...')}</>
                  : <>🔑 {t('Se connecter')}</>}
              </button>
 
              <div className="lg-divider-hr">
                <span>{t('Pas encore de compte ?')}</span>
              </div>
 
              <button
                type="button"
                className="lg-btn-signup"
                disabled={loading}
                onClick={() => navigate('/signup')}
              >
                ✨ {t('Créer un compte')}
              </button>
            </form>
 
            <button
              className="lg-btn-back"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              ← {t("Retour à l'accueil")}
            </button>
 
            {/* ── Identifiants de test (contenu original préservé) ── */}
            <div className="lg-test-card">
              <div className="lg-test-title">
                🔑 {t('Identifiants de test')}
              </div>
              <div className="lg-test-rows">
                <div className="lg-test-row">
                  <div className="lg-test-role">
                    <span className="lg-test-badge admin">Admin</span>
                  </div>
                  <span className="lg-test-creds">admin / password</span>
                </div>
                <div className="lg-test-row">
                  <div className="lg-test-role">
                    <span className="lg-test-badge biblio">Biblio</span>
                  </div>
                  <span className="lg-test-creds">biblio / password</span>
                </div>
                <div className="lg-test-row">
                  <div className="lg-test-role">
                    <span className="lg-test-badge reader">Lecteur</span>
                  </div>
                  <span className="lg-test-creds">MART / password</span>
                </div>
                <div className="lg-test-row">
                  <div className="lg-test-role">
                    <span className="lg-test-badge reader">Lecteur 2</span>
                  </div>
                  <span className="lg-test-creds">test.lecteur@uac.edu / password</span>
                </div>
              </div>
            </div>
 
          </div>
        </div>
 
      </div>
    </>
  );
}