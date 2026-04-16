const bcrypt = require('bcrypt');
(async()=>{
  const { User } = require('../src/models');
  await User.sequelize.authenticate();
  const users = await User.findAll({ attributes: ['id','username','password_hash'] });
  console.log(users.map(u=>u.toJSON()));
  const candidates=['admin','password','123456','biblio','bibliotheque','secret'];
  for(const u of users){
    for(const p of candidates){
      const ok = await bcrypt.compare(p, u.password_hash);
      if(ok) console.log(`login ok for ${u.username} with '${p}'`);
    }
  }
  process.exit(0);
})();