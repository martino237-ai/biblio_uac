const fetch = require('node-fetch');
(async()=>{
  try{
    const login = await fetch('http://localhost:3333/api/auth/login',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username:'admin', password:'password'})
    });
    const j = await login.json();
    const token = j.token;
    console.log('token', token && token.slice(0,20));
    const r = await fetch('http://localhost:3333/api/stats/summary?start=2026-03-04&end=2026-03-10',{
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await r.json();
    console.log('summary', data);
  } catch(e) {
    console.error(e);
  }
})();
