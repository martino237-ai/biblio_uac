(async()=>{
  try{
    const base = 'http://localhost:3333/api';
    // login
    let r = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username:'admin', password:'password'})
    });
    const loginRes = await r.json();
    const token = loginRes.token;
    console.log('token obtained', token ? 'yes' : 'no');
    const start='2026-03-05';
    const end='2026-03-08';
    console.log('requesting consultations', start, end);
    r = await fetch(base + `/consultations?start=${start}&end=${end}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await r.json();
    console.log('status', r.status, 'data length', Array.isArray(data) ? data.length : '');
    if(r.status !== 200) console.log('body', data);
  }catch(err){
    console.error('fetch error', err);
  }
})();