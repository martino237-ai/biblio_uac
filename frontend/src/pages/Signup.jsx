import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
 
import { FACULTY_OPTIONS, getFiliereOptions } from '../utils/faculties';
import fond1 from '../assets/images/fond1.jpeg';
import logo  from '../assets/images/logo.jpeg';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
 
.su-root *, .su-root *::before, .su-root *::after { box-sizing: border-box; }
 
/* ══ NAVBAR ══ */
.su-navbar {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 68px;
  background: rgba(7,22,60,.80);
  backdrop-filter: blur(14px);
}
.su-navbar-brand {
  display: flex; align-items: center; gap: 12px; cursor: pointer;
}
.su-navbar-logo {
  width: 38px; height: 38px; border-radius: 10px;
  object-fit: cover; border: 2px solid rgba(255,255,255,.25);
}
.su-navbar-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; font-weight: 700; color: #fff;
}
.su-navbar-title span { color: #fbbf24; }
.su-navbar-link {
  color: rgba(255,255,255,.8); font-size: .88rem; font-weight: 500;
  background: none; border: none; cursor: pointer;
  font-family: 'Inter', sans-serif; padding: 8px 16px;
  border-radius: 8px; border: 1px solid rgba(255,255,255,.2);
  transition: all .18s;
}
.su-navbar-link:hover { background: rgba(255,255,255,.1); color: #fbbf24; }
 
/* ══ LAYOUT PRINCIPAL ══ */
.su-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: 'Inter', sans-serif;
  padding-top: 68px;
}
 
/* ══════════════════════════════
   PANNEAU GAUCHE — image centrée
══════════════════════════════ */
.su-left {
  position: sticky;
  top: 68px;
  height: calc(100vh - 68px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.su-left-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  animation: suZoom 22s ease-in-out infinite alternate;
}
@keyframes suZoom {
  from { transform: scale(1.04); }
  to   { transform: scale(1.12); }
}
.su-left-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    135deg,
    rgba(7,22,60,.70) 0%,
    rgba(15,40,100,.48) 50%,
    rgba(7,22,60,.76) 100%
  );
}
.su-left-inner {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 40px 44px; max-width: 440px;
}
.su-left-eyebrow {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 16px; border-radius: 40px;
  background: rgba(251,191,36,.15); border: 1px solid rgba(251,191,36,.4);
  color: #fbbf24; font-size: .72rem; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase; margin-bottom: 20px;
}
.su-left-h {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3vw, 2.8rem); font-weight: 700;
  color: #fff; line-height: 1.2; margin: 0 0 16px;
}
.su-left-h em { font-style: italic; color: #fbbf24; }
.su-left-sub {
  font-size: .88rem; color: rgba(255,255,255,.72);
  line-height: 1.8; font-weight: 300; margin: 0 0 28px;
}
.su-divider {
  width: 50px; height: 2px; margin: 0 auto 28px;
  background: linear-gradient(90deg, transparent, rgba(251,191,36,.6), transparent);
}
.su-left-stats {
  display: flex; gap: 24px; justify-content: center;
  flex-wrap: wrap; margin-bottom: 28px;
}
.su-stat { text-align: center; }
.su-stat-n {
  font-family: 'Playfair Display', serif;
  font-size: 1.7rem; font-weight: 700; color: #fbbf24; line-height: 1;
}
.su-stat-l {
  font-size: .68rem; color: rgba(255,255,255,.5);
  text-transform: uppercase; letter-spacing: .06em; margin-top: 2px;
}
.su-stat-sep { width:1px; background:rgba(255,255,255,.15); align-self:stretch; }
 
.su-perks { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.su-perk {
  display: flex; align-items: center; gap: 12px; text-align: left;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
  border-radius: 12px; padding: 12px 14px;
  transition: background .2s;
}
.su-perk:hover { background: rgba(255,255,255,.12); }
.su-perk-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: rgba(251,191,36,.18); border: 1px solid rgba(251,191,36,.35);
  display: flex; align-items: center; justify-content: center; font-size: 1rem;
}
.su-perk-title { font-size: .82rem; font-weight: 600; color: #fff; }
.su-perk-desc  { font-size: .72rem; color: rgba(255,255,255,.5); }
 
/* ══════════════════════════════
   PANNEAU DROIT — scrollable
══════════════════════════════ */
.su-right {
  background: linear-gradient(160deg, #1a5c94 0%, #2c75b0 50%, #152940 100%);
  overflow-y: auto;
  min-height: calc(100vh - 68px);
}
.su-right-inner {
  padding: 40px 48px;
  max-width: 540px; width: 100%; margin: 0 auto;
}
 
/* ══ STEPS ══ */
.su-steps {
  display: flex; align-items: center; margin-bottom: 32px;
}
.su-step { display: flex; align-items: center; gap: 8px; flex: 1; }
.su-step-num {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: .78rem; font-weight: 700; transition: all .3s;
}
.su-step-num.active { background: #fbbf24; color: #1e3a8a; box-shadow: 0 0 0 4px rgba(251,191,36,.2); }
.su-step-num.done   { background: #16a34a; color: #fff; }
.su-step-num.todo   { background: rgba(255,255,255,.12); color: rgba(255,255,255,.4); }
.su-step-lbl { font-size: .73rem; font-weight: 600; white-space: nowrap; }
.su-step.active .su-step-lbl { color: #fbbf24; }
.su-step.done   .su-step-lbl { color: #16a34a; }
.su-step.todo   .su-step-lbl { color: rgba(255,255,255,.35); }
.su-step-bar {
  flex: 1; height: 2px; margin: 0 8px; border-radius: 2px;
  background: rgba(255,255,255,.1); transition: background .3s;
}
.su-step-bar.done { background: #16a34a; }
 
/* ══ SECTION HEADER ══ */
.su-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0 0 4px;
}
.su-section-sub {
  font-size: .83rem; color: rgba(255,255,255,.5); margin: 0 0 24px; line-height: 1.6;
}
 
/* ══ BLOC DE GROUPE ══ */
.su-group {
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 14px; padding: 18px; margin-bottom: 14px;
}
.su-group-title {
  font-size: .68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: #fbbf24; margin-bottom: 14px;
  display: flex; align-items: center; gap: 6px;
}
.su-group-title::after {
  content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.08);
}
.su-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.su-grid-2 .s2 { grid-column: 1 / -1; }
 
/* ══ CHAMP ══ */
.su-field { display: flex; flex-direction: column; gap: 5px; }
.su-field label {
  font-size: .68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .08em; color: rgba(255,255,255,.45);
}
.su-field input,
.su-field select {
  width: 100%; padding: 10px 13px;
  border: 1.5px solid rgba(255,255,255,.16); border-radius: 10px;
  font-family: 'Inter', sans-serif; font-size: .875rem;
  color: #fff; background: rgba(255,255,255,.12); outline: none;
  transition: border-color .18s, box-shadow .18s, background .18s;
}
.su-field input::placeholder { color: rgba(255,255,255,.35); }
.su-field select option { background: #0f1f55; color: #fff; }
.su-field input:focus,
.su-field select:focus {
  border-color: #fbbf24;
  box-shadow: 0 0 0 3px rgba(251,191,36,.12);
  background: rgba(255,255,255,.10);
}
.su-field input:disabled,
.su-field select:disabled { opacity: .35; cursor: not-allowed; }
 
/* champ désactivé style spécial */
.su-field select:disabled {
  border-color: rgba(255,255,255,.05);
  color: rgba(255,255,255,.25);
}
 
/* ══ NOTE TYPE ══ */
.su-type-note {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 12px; border-radius: 9px;
  background: rgba(251,191,36,.08); border: 1px solid rgba(251,191,36,.2);
  color: rgba(251,191,36,.8); font-size: .75rem;
  margin-top: 10px;
}
 
/* ══ ERREUR ══ */
.su-error {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 11px 14px; border-radius: 10px;
  background: rgba(220,38,38,.15); border: 1px solid rgba(220,38,38,.3);
  color: #fca5a5; font-size: .82rem; margin-bottom: 18px;
  animation: suShake .4s ease;
}
@keyframes suShake {
  0%,100%{transform:translateX(0)}
  25%{transform:translateX(-5px)}
  75%{transform:translateX(5px)}
}
 
/* ══ BOUTONS ══ */
.su-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px;
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 700;
  border: none; border-radius: 12px; cursor: pointer;
  transition: all .2s; margin-top: 14px;
}
.su-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }
.su-btn-yellow {
  background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1e3a8a;
  box-shadow: 0 4px 16px rgba(251,191,36,.35);
}
.su-btn-yellow:hover:not(:disabled) {
  transform: translateY(-2px); box-shadow: 0 8px 24px rgba(251,191,36,.5);
}
.su-btn-green {
  background: linear-gradient(135deg, #16a34a, #15803d); color: #fff;
  box-shadow: 0 4px 16px rgba(22,163,74,.35);
}
.su-btn-green:hover:not(:disabled) {
  transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,.5);
}
.su-btn-back {
  display: flex; align-items: center; gap: 6px; width: 100%;
  background: none; border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px; padding: 9px 14px; margin-top: 8px;
  color: rgba(255,255,255,.45); font-family: 'Inter', sans-serif;
  font-size: .82rem; font-weight: 500; cursor: pointer; transition: all .18s;
}
.su-btn-back:hover { color: rgba(255,255,255,.8); border-color: rgba(255,255,255,.25); }
 
.su-login-link {
  text-align: center; margin-top: 20px;
  font-size: .82rem; color: rgba(255,255,255,.35);
}
.su-login-link a {
  color: #fbbf24; font-weight: 600; text-decoration: none; cursor: pointer;
}
.su-login-link a:hover { text-decoration: underline; }

/* ══ BASCULE "DÉJÀ INSCRIT" ══ */
.su-mode-toggle {
  display: flex; align-items: center; gap: 6px;
  background: rgba(251,191,36,.08); border: 1px solid rgba(251,191,36,.25);
  border-radius: 10px; padding: 10px 14px; margin-bottom: 20px;
  color: #fbbf24; font-size: .8rem; font-weight: 600;
  cursor: pointer; width: 100%; font-family: 'Inter', sans-serif;
  transition: background .18s;
}
.su-mode-toggle:hover { background: rgba(251,191,36,.15); }
 
/* ══ PASSWORD STRENGTH ══ */
.su-pw-bar-wrap {
  height: 3px; border-radius: 2px; background: rgba(255,255,255,.08);
  overflow: hidden; margin: 6px 0 3px;
}
.su-pw-bar-fill { height: 100%; border-radius: 2px; transition: width .3s, background .3s; }
.su-pw-lbl { font-size: .68rem; }
 
/* ══ LOADER ══ */
.su-loader {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(7,22,60,.92); backdrop-filter: blur(10px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
}
.su-spinner {
  width: 52px; height: 52px;
  border: 3px solid rgba(255,255,255,.15); border-top-color: #fbbf24;
  border-radius: 50%; animation: suSpin .7s linear infinite;
}
@keyframes suSpin { to { transform: rotate(360deg); } }
.su-loader p { color: rgba(255,255,255,.85); font-size: .95rem; font-weight: 500; }
.su-loader small { font-size: .78rem; color: rgba(255,255,255,.35); }
 
/* ══ RESPONSIVE ══ */
@media (max-width: 900px) {
  .su-page { grid-template-columns: 1fr; }
  .su-left  { display: none; }
  .su-right-inner { padding: 32px 20px; }
  .su-grid-2 { grid-template-columns: 1fr; }
  .su-grid-2 .s2 { grid-column: 1; }
  .su-navbar { padding: 0 20px; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Force mot de passe ── */
function pwStrength(pw) {
  if (!pw) return { width:'0%', color:'transparent', label:'' };
  let s = 0;
  if (pw.length >= 6)        s++;
  if (pw.length >= 10)       s++;
  if (/[A-Z]/.test(pw))     s++;
  if (/[0-9]/.test(pw))     s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { width:'20%',  color:'#f87171', label:'Trop faible' };
  if (s === 2) return { width:'40%',  color:'#fb923c', label:'Faible'     };
  if (s === 3) return { width:'60%',  color:'#facc15', label:'Moyen'      };
  if (s === 4) return { width:'80%',  color:'#4ade80', label:'Fort'       };
  return               { width:'100%', color:'#34d399', label:'Très fort' };
}
 
/* ── Spinner inline ── */
const Spin = () => (
  <span style={{
    width:15, height:15, border:'2px solid rgba(255,255,255,.3)',
    borderTopColor:'currentColor', borderRadius:'50%',
    animation:'suSpin .7s linear infinite', display:'inline-block', flexShrink:0
  }}/>
);
 
/* ── Champ ── */
function F({ label, s2, children }) {
  return (
    <div className={`su-field${s2 ? ' s2' : ''}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL — logique 100 % intacte
═══════════════════════════════════════════ */
export default function Signup() {
  const { t }    = useTranslation();
  const navigate = useNavigate();
 
  const [step,            setStep]            = useState(1);
  const [mode,            setMode]            = useState('create'); // 'create' | 'lookup'
  const [loading,         setLoading]         = useState(false);
  const [lookupLoading,   setLookupLoading]   = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);
  const [error,           setError]           = useState('');
  const [readerCreated,   setReaderCreated]   = useState(null);
  const [lookupMatricule, setLookupMatricule] = useState('');

  const [reader, setReader] = useState({
    nom:'', prenom:'', type:'etudiant', faculte:'', filiere:'',
    niveau:'', telephone:'', matricule:'', email:''
  });
  const [creds, setCreds] = useState({ username:'', password:'', confirm:'' });
 
  injectCSS('su-css', CSS);
 
  const filiereOptions = getFiliereOptions(reader.faculte);
 
  useEffect(() => {
    setReader(r => ({ ...r, filiere:'' }));
  }, [reader.faculte]);
 
  function handleReaderChange(e) {
    const { name, value } = e.target;
    setReader(r => ({ ...r, [name]: value, ...(name==='faculte' ? { filiere:'' } : {}) }));
  }
  function handleCredsChange(e) {
    const { name, value } = e.target;
    setCreds(c => ({ ...c, [name]: value }));
  }
 
  /* ── API calls identiques à l'original ── */
  async function goNext(e) {
    e.preventDefault();
    if (!reader.nom || !reader.prenom) { setError(t('Nom et prénom requis')); return; }
    if (reader.type === 'etudiant' && (!reader.matricule || !reader.faculte || !reader.filiere || !reader.niveau)) {
      setError(t('Pour un étudiant : matricule, faculté, filière et niveau sont obligatoires'));
      return;
    }
    if (!reader.email) { setError(t('Email requis')); return; }
    setError(''); setLoading(true);
    try {
      const res = await api.post('/readers', reader);
      setReaderCreated(res.data);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || t('Erreur lors de la création du lecteur'));
    } finally { setLoading(false); }
  }
 
  async function lookupReader(e) {
    e.preventDefault();
    if (!lookupMatricule.trim()) { setError(t('Matricule requis')); return; }
    setError(''); setLookupLoading(true);
    try {
      const res = await api.get(`/readers/lookup/${encodeURIComponent(lookupMatricule.trim())}`);
      const found = res.data;
      setReader(r => ({
        ...r,
        nom: found.nom || '', prenom: found.prenom || '', type: found.type || 'etudiant',
        faculte: found.faculte || '', filiere: found.filiere || '', niveau: found.niveau || '',
        telephone: found.telephone || '', matricule: found.matricule || '', email: found.email || ''
      }));
      setReaderCreated(found);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || t('Aucun lecteur trouvé avec ce matricule'));
    } finally { setLookupLoading(false); }
  }

  async function submit(e) {
    e.preventDefault();
    if (!creds.username) { setError(t("Nom d'utilisateur requis")); return; }
    if (creds.password !== creds.confirm) { setError(t('Les mots de passe ne correspondent pas')); return; }
    setError(''); setLoading(true);
    try {
      const payload = {
        readerId: readerCreated?.id,
        username: creds.username, password: creds.password,
        nom: reader.nom, prenom: reader.prenom, type: reader.type,
        faculte: reader.faculte, filiere: reader.filiere,
        niveau: reader.niveau, telephone: reader.telephone,
        matricule: reader.matricule, email: reader.email
      };
      const res = await api.post('/auth/register-reader', payload);
      const { token, user, reader: returnedReader } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (returnedReader) setReaderCreated(returnedReader);
      setRedirectLoading(true);
      setTimeout(() => { window.location = '/books'; }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || t("Erreur lors de l'inscription"));
    } finally { setLoading(false); }
  }
 
  const pw = pwStrength(creds.password);
 
  /* ════ RENDER ════ */
  return (
    <>
      {/* ── Loader redirect ── */}
      {redirectLoading && (
        <div className="su-loader">
          <div className="su-spinner"/>
          <p>{t('Inscription réussie')} 🎉</p>
          <small>{t('Redirection vers votre espace lecteur...')}</small>
        </div>
      )}
 
      {/* ══ NAVBAR ══ */}
      <nav className="su-navbar">
        <div className="su-navbar-brand" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="su-navbar-logo"/>
          <span className="su-navbar-title">Biblio<span>UAC</span></span>
        </div>
        <button className="su-navbar-link" onClick={() => navigate('/login')}>
          {t('Connexion')}
        </button>
      </nav>
 
      <div className="su-page">
 
        {/* ══ PANNEAU GAUCHE — centré et sticky ══ */}
        <div className="su-left">
          <div className="su-left-bg" style={{ backgroundImage:`url(${fond1})` }}/>
          <div className="su-left-overlay"/>
 
          <div className="su-left-inner">
            <div className="su-left-eyebrow">✦ {t('Espace Lecteur')}</div>
 
            <h2 className="su-left-h">
              {t('Rejoignez la')}<br/>
              <em>{t('Bibliothèque UAC')}</em>
            </h2>
 
            <p className="su-left-sub">
              {t("Créez votre compte pour accéder au catalogue, emprunter des livres et découvrir des milliers de ressources numériques gratuites.")}
            </p>
 
            {/* Stats */}
            <div className="su-left-stats">
              <div className="su-stat">
                <div className="su-stat-n">500+</div>
                <div className="su-stat-l">{t('Ouvrages')}</div>
              </div>
              <div className="su-stat-sep"/>
              <div className="su-stat">
                <div className="su-stat-n">12k+</div>
                <div className="su-stat-l">{t('Livres en ligne')}</div>
              </div>
              <div className="su-stat-sep"/>
              <div className="su-stat">
                <div className="su-stat-n">248</div>
                <div className="su-stat-l">{t('Lecteurs')}</div>
              </div>
            </div>
 
            <div className="su-divider"/>
 
            {/* Perks */}
            <div className="su-perks">
              <div className="su-perk">
                <div className="su-perk-icon">📚</div>
                <div>
                  <div className="su-perk-title">{t('Catalogue complet')}</div>
                  <div className="su-perk-desc">{t('Accédez à tous les ouvrages')}</div>
                </div>
              </div>
              <div className="su-perk">
                <div className="su-perk-icon">🌐</div>
                <div>
                  <div className="su-perk-title">{t('Livres gratuits en ligne')}</div>
                  <div className="su-perk-desc">{t('Milliers de ressources numériques')}</div>
                </div>
              </div>
              <div className="su-perk">
                <div className="su-perk-icon">📊</div>
                <div>
                  <div className="su-perk-title">{t('Historique complet')}</div>
                  <div className="su-perk-desc">{t('Emprunts, consultations, retards')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* ══ PANNEAU DROIT — scrollable ══ */}
        <div className="su-right">
          <div className="su-right-inner">
 
            {/* Steps */}
            <div className="su-steps">
              <div className={`su-step ${step > 1 ? 'done' : 'active'}`}>
                <div className={`su-step-num ${step > 1 ? 'done' : 'active'}`}>
                  {step > 1 ? '✓' : '1'}
                </div>
                <span className="su-step-lbl">{t('Informations')}</span>
              </div>
              <div className={`su-step-bar ${step > 1 ? 'done' : ''}`}/>
              <div className={`su-step ${step === 2 ? 'active' : 'todo'}`}>
                <div className={`su-step-num ${step === 2 ? 'active' : 'todo'}`}>2</div>
                <span className="su-step-lbl">{t('Compte')}</span>
              </div>
            </div>
 
            {/* Erreur */}
            {error && (
              <div className="su-error">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}
 
            {/* ══════════════════
               ÉTAPE 1
            ══════════════════ */}
            {step === 1 && (
              <>
                <button
                  type="button"
                  className="su-mode-toggle"
                  onClick={() => { setMode(m => m === 'create' ? 'lookup' : 'create'); setError(''); }}
                >
                  {mode === 'create'
                    ? <>👤 {t('Déjà inscrit en tant que lecteur ? Cliquez ici')}</>
                    : <>← {t('Nouveau lecteur ? Créer un profil complet')}</>}
                </button>

                {mode === 'lookup' ? (
                  <>
                    <p className="su-section-title">{t('Retrouver votre profil lecteur')}</p>
                    <p className="su-section-sub">
                      {t("Votre profil lecteur a déjà été créé par le bibliothécaire, ou lors d'une inscription précédente. Saisissez votre matricule pour créer uniquement votre compte de connexion.")}
                    </p>

                    <form onSubmit={lookupReader}>
                      <div className="su-group">
                        <div className="su-group-title">🔎 {t('Identification')}</div>
                        <div className="su-grid-2">
                          <F label={`${t('Matricule')} *`} s2>
                            <input
                              value={lookupMatricule}
                              onChange={(e) => setLookupMatricule(e.target.value)}
                              required disabled={lookupLoading}
                              placeholder="Ex: UAC2024001"
                            />
                          </F>
                        </div>
                      </div>

                      <button type="submit" className="su-btn su-btn-yellow" disabled={lookupLoading}>
                        {lookupLoading ? <><Spin/> {t('Vérification...')}</> : <>{t('Vérifier mon matricule')} →</>}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                <p className="su-section-title">{t('Informations personnelles')}</p>
                <p className="su-section-sub">
                  {t('Renseignez toutes vos informations pour créer votre profil lecteur.')}
                </p>

                <form onSubmit={goNext}>
 
                  {/* Bloc 1 — Identité */}
                  <div className="su-group">
                    <div className="su-group-title">👤 {t('Identité')}</div>
                    <div className="su-grid-2">
                      <F label="Type de lecteur">
                        <select name="type" value={reader.type}
                          onChange={handleReaderChange} disabled={loading}>
                          <option value="etudiant">🎓 Étudiant</option>
                          <option value="enseignant">👨‍🏫 {t('Enseignant')}</option>
                          <option value="personnel">🏢 {t('Personnel')}</option>
                          <option value="autre">👤 {t('Autre')}</option>
                        </select>
                      </F>
 
                      {reader.type === 'etudiant' && (
                        <F label={`${t('Matricule')} *`}>
                          <input name="matricule" value={reader.matricule}
                            onChange={handleReaderChange} required disabled={loading}
                            placeholder="Ex: L2024-0312"/>
                        </F>
                      )}
 
                      <F label={`${t('Nom')} *`}>
                        <input name="nom" value={reader.nom}
                          onChange={handleReaderChange} required disabled={loading}
                          placeholder="Ex: Koné"/>
                      </F>
 
                      <F label={`${t('Prénom')} *`}>
                        <input name="prenom" value={reader.prenom}
                          onChange={handleReaderChange} required disabled={loading}
                          placeholder="Ex: Amara"/>
                      </F>
                    </div>
 
                    {reader.type !== 'etudiant' && (
                      <div className="su-type-note">
                        ℹ️ {t('Les champs faculté, filière et niveau s\'appliquent aux étudiants uniquement.')}
                      </div>
                    )}
                  </div>
 
                  {/* Bloc 2 — Académique (toujours affiché, désactivé si pas étudiant) */}
                  <div className="su-group">
                    <div className="su-group-title">🎓 {t('Informations académiques')}</div>
                    <div className="su-grid-2">
 
                      <F label={`${t('Faculté')}${reader.type === 'etudiant' ? ' *' : ''}`} s2>
                        <select name="faculte" value={reader.faculte}
                          onChange={handleReaderChange}
                          required={reader.type === 'etudiant'}
                          disabled={loading || reader.type !== 'etudiant'}>
                          <option value="">{t('Sélectionner une faculté')}</option>
                          {FACULTY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </F>
 
                      <F label={`${t('Filière')}${reader.type === 'etudiant' ? ' *' : ''}`} s2>
                        <select name="filiere" value={reader.filiere}
                          onChange={handleReaderChange}
                          required={reader.type === 'etudiant'}
                          disabled={loading || reader.type !== 'etudiant' || filiereOptions.length === 0}>
                          <option value="">
                            {reader.type !== 'etudiant'
                              ? t('Non applicable')
                              : filiereOptions.length === 0
                                ? t('Sélectionnez d\'abord une faculté')
                                : t('Sélectionner une filière')}
                          </option>
                          {filiereOptions.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </F>
 
                      <F label={`${t('Niveau')}${reader.type === 'etudiant' ? ' *' : ''}`}>
                        <input name="niveau" value={reader.niveau}
                          onChange={handleReaderChange}
                          required={reader.type === 'etudiant'}
                          disabled={loading || reader.type !== 'etudiant'}
                          placeholder={reader.type === 'etudiant' ? 'Ex: L3, M1, M2...' : t('Non applicable')}
                        />
                      </F>
 
                      {/* matricule visible ici aussi pour non-étudiants */}
                      {reader.type !== 'etudiant' && (
                        <F label={t('Identifiant interne')}>
                          <input name="matricule" value={reader.matricule}
                            onChange={handleReaderChange} disabled={loading}
                            placeholder="Ex: PERS-001 (optionnel)"/>
                        </F>
                      )}
                    </div>
                  </div>
 
                  {/* Bloc 3 — Contact */}
                  <div className="su-group">
                    <div className="su-group-title">📞 {t('Contact')}</div>
                    <div className="su-grid-2">
                      <F label={`${t('Email')} *`}>
                        <input type="email" name="email" value={reader.email}
                          onChange={handleReaderChange} required disabled={loading}
                          placeholder="exemple@univ.cm"/>
                      </F>
 
                      <F label={t('Téléphone')}>
                        <input name="telephone" value={reader.telephone}
                          onChange={handleReaderChange} disabled={loading}
                          placeholder="+237 6xx xxx xxx"/>
                      </F>
                    </div>
                  </div>
 
                  <button type="submit" className="su-btn su-btn-yellow" disabled={loading}>
                    {loading ? <><Spin/> {t('Création...')}</> : <>{t('Suivant')} →</>}
                  </button>
                </form>
                  </>
                )}

                <div className="su-login-link">
                  {t('Déjà un compte ?')}{' '}
                  <a onClick={() => navigate('/login')}>{t('Se connecter')}</a>
                </div>
              </>
            )}
 
            {/* ══════════════════
               ÉTAPE 2
            ══════════════════ */}
            {step === 2 && (
              <>
                <p className="su-section-title">{t('Créer votre compte')}</p>
                <p className="su-section-sub">
                  {t('Bienvenue')}{' '}
                  <strong style={{color:'#fbbf24'}}>{reader.prenom} {reader.nom}</strong>
                  {' — '}{t('choisissez vos identifiants de connexion.')}
                </p>
 
                <form onSubmit={submit}>
                  <div className="su-group">
                    <div className="su-group-title">🔐 {t('Identifiants')}</div>
                    <div className="su-grid-2">
 
                      <F label={`${t("Nom d'utilisateur")} *`} s2>
                        <input name="username" value={creds.username}
                          onChange={handleCredsChange} required disabled={loading}
                          placeholder="Ex: amara.kone"/>
                      </F>
 
                      <F label={`${t('Mot de passe')} *`} s2>
                        <input type="password" name="password" value={creds.password}
                          onChange={handleCredsChange} required disabled={loading}
                          placeholder="Minimum 6 caractères"/>
                        {creds.password && (
                          <>
                            <div className="su-pw-bar-wrap">
                              <div className="su-pw-bar-fill"
                                style={{ width:pw.width, background:pw.color }}/>
                            </div>
                            <span className="su-pw-lbl" style={{color:pw.color}}>
                              {pw.label}
                            </span>
                          </>
                        )}
                      </F>
 
                      <F label={`${t('Confirmer le mot de passe')} *`} s2>
                        <input type="password" name="confirm" value={creds.confirm}
                          onChange={handleCredsChange} required disabled={loading}
                          placeholder="Répétez le mot de passe"
                          style={{
                            borderColor: creds.confirm && creds.confirm !== creds.password
                              ? 'rgba(248,113,113,.5)' : undefined
                          }}
                        />
                        {creds.confirm && creds.confirm !== creds.password && (
                          <span style={{fontSize:'.7rem', color:'#f87171'}}>
                            ⚠ {t('Les mots de passe ne correspondent pas')}
                          </span>
                        )}
                      </F>
 
                    </div>
                  </div>
 
                  <button type="submit"
                    className="su-btn su-btn-green" disabled={loading}>
                    {loading
                      ? <><Spin/> {t('Inscription...')}</>
                      : <>🎉 {t("S'inscrire")}</>}
                  </button>
 
                  <button type="button" className="su-btn-back"
                    onClick={() => { setStep(1); setError(''); }} disabled={loading}>
                    ← {t('Retour aux informations')}
                  </button>
                </form>
              </>
            )}
 
          </div>
        </div>
 
      </div>
    </>
  );
}