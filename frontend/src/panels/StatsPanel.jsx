import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Legend, LineChart, 
  Line, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  DownloadCloud, FileText, Filter, RefreshCw, 
  Activity 
} from 'lucide-react';
import { generateStatsPDF, addPDFFooter } from '../utils/pdfGenerator';

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6'];

export default function StatsDashboard() {
  const { t } = useTranslation();

  const [summary, setSummary] = useState({
    books: 0,
    readers: 0,
    loans: 0,
    consultations: 0,
    consultation_hours: 0,
    late: 0,
    prolonged_loans: 0,
    active_readers: 0,
    active_books: 0
  });

  const [topBooks, setTopBooks] = useState([]);
  const [topReaders, setTopReaders] = useState([]);
  const [byFaculty, setByFaculty] = useState([]);
  const [byFiliere, setByFiliere] = useState([]);
  const [consultsByFiliere, setConsultsByFiliere] = useState([]);
  const [loansByFiliere, setLoansByFiliere] = useState([]);
  const [consultsByFaculte, setConsultsByFaculte] = useState([]);
  const [loansByFaculte, setLoansByFaculte] = useState([]);
  const [trendLoans, setTrendLoans] = useState([]);
  const [trendConsults, setTrendConsults] = useState([]);
  const [hourlyConsults, setHourlyConsults] = useState([]);
  const [monthlyConsults, setMonthlyConsults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // FILTRE
  const [filterPeriod, setFilterPeriod] = useState('jour'); // jour / mois
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAll();
  }, [filterPeriod, dateRange]);

  async function loadAll() {
    setLoading(true);
    try {
      const requests = [
        { key: 'summary', promise: api.get('/stats/summary', { params: { period: filterPeriod, start: dateRange.start, end: dateRange.end } }) },
        { key: 'topBooks', promise: api.get('/stats/top-books', { params: { period: filterPeriod, start: dateRange.start, end: dateRange.end } }) },
        { key: 'topReaders', promise: api.get('/stats/top-readers', { params: { period: filterPeriod, start: dateRange.start, end: dateRange.end } }) },
        { key: 'faculties', promise: api.get('/stats/faculties', { params: { start: dateRange.start, end: dateRange.end } }) },
        { key: 'filieresFacultes', promise: api.get('/stats/filieres-facultes', { params: { start: dateRange.start, end: dateRange.end } }) },
        { key: 'loanTrends', promise: api.get('/stats/trends', { params: { type: 'loans', period: filterPeriod, start: dateRange.start, end: dateRange.end } }) },
        { key: 'consultTrends', promise: api.get('/stats/trends', { params: { type: 'consultations', period: filterPeriod, start: dateRange.start, end: dateRange.end } }) },
        { key: 'hourlyConsults', promise: api.get('/stats/hourly-consults', { params: { start: dateRange.start, end: dateRange.end } }) },
        { key: 'monthlyConsults', promise: api.get('/stats/monthly-consults', { params: { start: dateRange.start, end: dateRange.end } }) }
      ];

      const results = await Promise.allSettled(requests.map(r => r.promise));
      const resolved = {};
      let firstError = null;

      results.forEach((result, index) => {
        const key = requests[index].key;
        if (result.status === 'fulfilled') {
          resolved[key] = result.value;
        } else {
          console.error(`❌ stats request failed for ${key}:`, result.reason);
          if (!firstError) firstError = result.reason;
        }
      });

      if (resolved.summary) {
        console.log('✅ stats response', resolved.summary.data);
        setSummary(resolved.summary.data || {});
      }
      if (resolved.topBooks) {
        setTopBooks(resolved.topBooks.data?.topCombined || []);
      }
      if (resolved.topReaders) {
        setTopReaders(resolved.topReaders.data?.topReaders || []);
      }
      if (resolved.faculties) {
        setByFaculty(resolved.faculties.data?.byFaculty || []);
      }
      if (resolved.filieresFacultes) {
        setByFiliere(resolved.filieresFacultes.data?.byFiliere || []);
        if (resolved.filieresFacultes.data && resolved.filieresFacultes.data.data) {
          setConsultsByFiliere(resolved.filieresFacultes.data.data.consultationsParFiliere || []);
          setLoansByFiliere(resolved.filieresFacultes.data.data.empruntsParFiliere || []);
          setConsultsByFaculte(resolved.filieresFacultes.data.data.consultationsParFaculte || []);
          setLoansByFaculte(resolved.filieresFacultes.data.data.empruntsParFaculte || []);
        }
      }

      if (firstError) {
        const msg = firstError?.response?.data?.error || firstError?.response?.data?.message || firstError.message;
        setErrorMsg(msg || 'Erreur de chargement');
        alert('Erreur chargement statistiques, consultez la console');
      } else {
        setErrorMsg('');
      }
    } catch (err) {
      console.error("❌ ERREUR CHARGEMENT STATS :", err);
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message;
      setErrorMsg(msg || 'Erreur de chargement');
      alert('Erreur chargement statistiques, consultez la console');
    } finally {
      setLoading(false);
    }
  }

  // export Excel séparé (appelé depuis le bouton)
  const exportToExcel = () => {
    setExporting(true);
    const workbook = XLSX.utils.book_new();

    const summaryData = [
      ['Métrique','Valeur'],
      ['Livres total', summary.books],
      ['Lecteurs total', summary.readers],
      ['Lecteurs actifs', summary.active_readers],
      ['Livres utilisés', summary.active_books],
      ['Emprunts', summary.loans],
      ['Consultations', summary.consultations],
      ['Heures Consultation', summary.consultation_hours],
      ['Retards', summary.late],
      ['Emprunts prolonges', summary.prolonged_loans]
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryData), "Résumé");

    const booksData = [['Rang','Titre','Auteur','Utilisations']];
    topBooks.forEach((b,i)=> booksData.push([i+1,b.titre,b.auteur,b.total]));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(booksData), "Top Livres");

    const loansData = [['Période','Emprunts']];
    trendLoans.forEach(t => loansData.push([t.period, t.cnt]));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(loansData), "Tendance Emprunts");

    // ajouter répartitions faculté / filière
    if(byFaculty.length){
      const facData = [['Faculté','Nombre lecteurs']];
      byFaculty.forEach(f=>facData.push([f.faculte||'-', f.cnt]));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(facData), "Facultés lecteurs");
    }
    if(byFiliere.length){
      const filData = [['Filière','Nombre lecteurs']];
      byFiliere.forEach(f=>filData.push([f.filiere||'-', f.cnt]));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(filData), "Filières lecteurs");
    }
    if(consultsByFiliere.length){
      const cf = [['Filière','Consultations']];
      consultsByFiliere.forEach(f=>cf.push([f.filiere||'-', f.count]));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(cf), "Consults par filière");
    }
    if(loansByFiliere.length){
      const lf = [['Filière','Emprunts']];
      loansByFiliere.forEach(f=>lf.push([f.filiere||'-', f.count]));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(lf), "Emprunts par filière");
    }
    if(consultsByFaculte.length){
      const cf2 = [['Faculté','Consultations']];
      consultsByFaculte.forEach(f=>cf2.push([f.faculte||'-', f.count]));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(cf2), "Consults par faculté");
    }
    if(loansByFaculte.length){
      const lf2 = [['Faculté','Emprunts']];
      loansByFaculte.forEach(f=>lf2.push([f.faculte||'-', f.count]));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(lf2), "Emprunts par faculté");
    }

    const rangeDesc = dateRange.start && dateRange.end ? `${dateRange.start}_${dateRange.end}` : filterPeriod;
    XLSX.writeFile(workbook, `stats_bibliotheque_${rangeDesc}_${new Date().toISOString().split('T')[0]}.xlsx`);
    setExporting(false);
  };

  // EXPORT PDF PROFESSIONNEL
  const exportToPDF = () => {
    console.log('🔵 DEBUG: exportToPDF called');
    setExporting(true);
    
    const subtitle = dateRange.start && dateRange.end
      ? `Du ${dateRange.start} au ${dateRange.end}`
      : `Periode: ${filterPeriod}`;
    
    const sections = [
      {
        sectionTitle: '[RESUME] Resume General',
        data: [
          { 'Metrique': 'Livres total', 'Valeur': summary.books },
          { 'Metrique': 'Lecteurs total', 'Valeur': summary.readers },
          { 'Metrique': 'Lecteurs actifs', 'Valeur': summary.active_readers },
          { 'Metrique': 'Livres utilises', 'Valeur': summary.active_books },
          { 'Metrique': 'Emprunts', 'Valeur': summary.loans },
          { 'Metrique': 'Consultations', 'Valeur': summary.consultations },
          { 'Metrique': 'Heures Consultation', 'Valeur': summary.consultation_hours },
          { 'Metrique': 'Retards', 'Valeur': summary.late },
          { 'Metrique': 'Emprunts prolonges', 'Valeur': summary.prolonged_loans }
        ],
        columns: ['Metrique', 'Valeur']
      },
      ...(topBooks.length > 0 ? [{
        sectionTitle: '[LIVRES] Top 10 Livres',
        data: topBooks.slice(0, 10).map((b, i) => ({ 'Rang': i + 1, 'Titre': b.titre, 'Auteur': b.auteur, 'Utilisations': b.total })),
        columns: ['Rang', 'Titre', 'Auteur', 'Utilisations']
      }] : []),
      ...(topReaders.length > 0 ? [{
        sectionTitle: '[LECTEURS] Top 10 Lecteurs',
        data: topReaders.slice(0, 10).map((r, i) => ({ 'Rang': i + 1, 'Nom': r.nom, 'Emprunts': r.total })),
        columns: ['Rang', 'Nom', 'Emprunts']
      }] : []),
      ...(trendLoans.length > 0 ? [{
        sectionTitle: '[EMPRUNTS] Tendance Emprunts',
        data: trendLoans.map(t => ({ 'Periode': t.period, 'Emprunts': t.cnt })),
        columns: ['Periode', 'Emprunts'],
        startNewPage: true
      }] : []),
      ...(trendConsults.length > 0 ? [{
        sectionTitle: '[CONSULTS] Tendance Consultations',
        data: trendConsults.map(t => ({ 'Periode': t.period, 'Consultations': t.cnt })),
        columns: ['Periode', 'Consultations']
      }] : []),
      ...(consultsByFiliere.length > 0 ? [{
        sectionTitle: '[FILIERE] Consultations par Filiere',
        data: consultsByFiliere.map(f => ({ 'Filiere': f.filiere || '-', 'Consultations': f.count })),
        columns: ['Filiere', 'Consultations']
      }] : []),
      ...(loansByFiliere.length > 0 ? [{
        sectionTitle: '[FILIERE] Emprunts par Filiere',
        data: loansByFiliere.map(f => ({ 'Filiere': f.filiere || '-', 'Emprunts': f.count })),
        columns: ['Filiere', 'Emprunts']
      }] : []),
      ...(consultsByFaculte.length > 0 ? [{
        sectionTitle: '[FACULTE] Consultations par Faculte',
        data: consultsByFaculte.map(f => ({ 'Faculte': f.faculte || '-', 'Consultations': f.count })),
        columns: ['Faculte', 'Consultations'],
        startNewPage: true
      }] : []),
      ...(loansByFaculte.length > 0 ? [{
        sectionTitle: '[FACULTE] Emprunts par Faculte',
        data: loansByFaculte.map(f => ({ 'Faculte': f.faculte || '-', 'Emprunts': f.count })),
        columns: ['Faculte', 'Emprunts']
      }] : [])
    ];

    const filename = `stats_bibliotheque_${dateRange.start||'all'}_${dateRange.end||'all'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    const success = generateStatsPDF(sections, {
      filename,
      title: 'STATISTIQUES Bibliotheque',
      subtitle,
      org: 'Bibliotheque UAC',
      address: 'Universite Adventiste Cosendai'
    });

    if (success) {
      alert('PDF généré avec succès!');
    }
    setExporting(false);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-8 py-8">

      {/* HEADER */}
      <div className="panel-header">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <Activity className="text-blue-600"/> {t('Tableau de Bord Statistiques')}
          </h2>
        </div>

        <div className="flex gap-3">
          <button onClick={()=>setShowFilters(!showFilters)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-lg transition duration-300 btn-enhanced"><Filter size={18}/> {t('Filtres')}</button>
          <button onClick={loadAll} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 dark:hover:bg-blue-800 rounded-lg transition duration-300 btn-enhanced"><RefreshCw size={18}/> {t('Actualiser')}</button>
          <button onClick={exportToExcel} className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 text-white dark:hover:bg-green-600 rounded-lg transition duration-300 btn-enhanced"><DownloadCloud size={18}/> {t('Excel')}</button>
          <button onClick={exportToPDF} className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 text-white dark:hover:bg-red-600 rounded-lg transition duration-300 btn-enhanced"><FileText size={18}/> {t('PDF')}</button>
        </div>
      </div>

      {/* FILTRE JOUR / MOIS */}
      {errorMsg && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
          ⚠️ {errorMsg}
        </div>
      )}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4 items-center dark:bg-gray-800 dark:text-white p-4 rounded">
          <button
            onClick={()=>{
               setFilterPeriod('jour');
               setDateRange({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] });
            }}
            className={`px-3 py-1 rounded transition duration-300 btn-enhanced ${filterPeriod==='jour' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}
          >{t('Aujourd\'hui')}</button>

          <button
            onClick={()=>{
               setFilterPeriod('mois');
               const now = new Date();
               setDateRange({
                 start: now.toISOString().slice(0,7) + '-01',
                 end: now.toISOString().split('T')[0]
               });
            }}
            className={`px-3 py-1 rounded transition duration-300 btn-enhanced ${filterPeriod==='mois' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}
          >{t('Ce mois')}</button>

          {/* date range inputs */}
          <label className="text-sm dark:text-gray-300">{t('Du :')}</label>
          <input type="date" className="border px-2 py-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={dateRange.start} onChange={e=>setDateRange({...dateRange,start:e.target.value})} />
          <label className="text-sm dark:text-gray-300">{t('Au :')}</label>
          <input type="date" className="border px-2 py-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={dateRange.end} onChange={e=>setDateRange({...dateRange,end:e.target.value})} />
        </div>
      )}

      {/* CARTES RÉSUMÉ */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* ensure we have numbers, if summary missing show dash */}
        <div className="bg-blue-50 dark:bg-blue-900 dark:text-white p-6 rounded-xl"><p className="dark:text-gray-300">{t('Total livres')}</p><h3 className="text-2xl font-bold dark:text-white">{summary.books ?? '-'}</h3></div>
        <div className="bg-green-50 dark:bg-green-900 dark:text-white p-6 rounded-xl"><p className="dark:text-gray-300">{t('Total lecteurs')}</p><h3 className="text-2xl font-bold dark:text-white">{summary.readers ?? '-'}</h3></div>
        <div className="bg-yellow-50 dark:bg-yellow-900 dark:text-white p-6 rounded-xl"><p className="dark:text-gray-300">{t('Lecteurs actifs')}</p><h3 className="text-2xl font-bold dark:text-white">{summary.active_readers ?? '-'}</h3></div>
        <div className="bg-teal-50 dark:bg-teal-900 dark:text-white p-6 rounded-xl"><p className="dark:text-gray-300">{t('Livres actifs')}</p><h3 className="text-2xl font-bold dark:text-white">{summary.active_books ?? '-'}</h3></div>
        <div className="bg-purple-50 dark:bg-purple-900 dark:text-white p-6 rounded-xl"><p className="dark:text-gray-300">{t('Emprunts')}</p><h3 className="text-2xl font-bold dark:text-white">{summary.loans ?? '-'}</h3></div>
        <div className="bg-indigo-50 dark:bg-indigo-900 dark:text-white p-6 rounded-xl"><p className="dark:text-gray-300">{t('Consultations')}</p><h3 className="text-2xl font-bold dark:text-white">{summary.consultations ?? '-'}</h3></div>
        <div className="bg-orange-50 dark:bg-orange-900 dark:text-white p-6 rounded-xl"><p className="dark:text-gray-300">{t('Heures consultées')}</p><h3 className="text-2xl font-bold dark:text-white">{summary.consultation_hours ?? '-'}</h3></div>
        <div className="bg-red-50 dark:bg-red-900 dark:text-white p-6 rounded-xl"><p className="dark:text-gray-300">{t('Retards')}</p><h3 className="text-2xl font-bold dark:text-white">{summary.late ?? '-'}</h3></div>
        <div className="bg-pink-50 dark:bg-pink-900 dark:text-white p-6 rounded-xl"><p className="dark:text-gray-300">{t('Prolongations')}</p><h3 className="text-2xl font-bold dark:text-white">{summary.prolonged_loans ?? '-'}</h3></div>
      </div>

      {/* TOP LIVRES */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow dark:shadow-lg dark:text-white">
        <h3 className="text-xl font-bold mb-4 dark:text-white">{t('Top 10 Livres')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topBooks.slice(0,10)}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="titre" angle={-45}/>
            <YAxis/>
            <Tooltip/>
            <Bar dataKey="total" name="Utilisations">
              {topBooks.slice(0,10).map((_,i)=>(<Cell key={i} fill={COLORS[i % COLORS.length]}/>))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RÉPARTITION FACULTÉ */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow dark:shadow-lg dark:text-white">
        <h3 className="text-xl font-bold mb-4 dark:text-white">{t('Répartition par faculté')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={byFaculty.map(f=>({name:f.faculte||'-', value:Number(f.cnt)||0}))}
                 dataKey="value" nameKey="name" outerRadius={80} label>
              {byFaculty.map((_,i)=>(<Cell key={i} fill={COLORS[i % COLORS.length]}/>))}
            </Pie>
            <Tooltip/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RÉPARTITION FILIÈRE */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow dark:shadow-lg dark:text-white">
        <h3 className="text-xl font-bold mb-4 dark:text-white">{t('Répartition par filière')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={byFiliere.map(f=>({name:f.filiere||'-', value:Number(f.cnt)||0}))}
                 dataKey="value" nameKey="name" outerRadius={80} label>
              {byFiliere.map((_,i)=>(<Cell key={i} fill={COLORS[i % COLORS.length]}/>))}
            </Pie>
            <Tooltip/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* TENDANCE EMPRUNTS */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow dark:shadow-lg dark:text-white">
        <h3 className="text-xl font-bold mb-4 dark:text-white">{t('Tendance Emprunts')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendLoans}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="period"/>
            <YAxis/>
            <Tooltip/>
            <Area dataKey="cnt" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
