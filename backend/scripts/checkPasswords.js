const bcrypt = require('bcrypt');
(async()=>{
  const { User } = require('../src/models');
  await User.sequelize.authenticate();
  const users = await User.findAll({ attributes: ['id','username','password_hash'] });
  // Do not print full user records or plaintext passwords to logs.
  const candidates=['admin','password','123456','biblio','bibliotheque','secret'];
  for(const u of users){
    for(const p of candidates){
      const ok = await bcrypt.compare(p, u.password_hash);
      if(ok) console.log(`Weak password candidate matched for user id ${u.id}`);
    }
  }
  process.exit(0);
})();