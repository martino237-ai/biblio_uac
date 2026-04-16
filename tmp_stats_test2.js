const axios = require('axios');
(async()=>{
  try{
    const login = await axios.post('http://localhost:3333/api/auth/login',{username:'admin', password:'password'});
    const token = login.data.token;
    console.log('token length', token && token.length);
    const r = await axios.get('http://localhost:3333/api/stats/summary',{
      params:{start:'2026-03-04',end:'2026-03-10'},
      headers:{Authorization:`Bearer ${token}`}
    });
    console.log('fetched summary', r.data);
  } catch(e){ console.error('error', e.response ? e.response.data : e.message); }
})();
