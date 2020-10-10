//with out any
var SequelizeAuto = require('sequelize-auto');
var auto = new SequelizeAuto('logyNode', 'root', '',{
  host: 'localhost',
  port:'3306',
  //skiptables:['admins'],
  //output:"",
  tables:['emails_emails']
});

auto.run(function (err) {
  if (err) throw err;
  console.log(auto.tables); // table list
  //console.log(auto.foreignKeys); // foreign key list
});

//url to enhance
//https://medium.com/@saikrishna.d/get-create-database-models-for-existing-database-tables-with-nodejs-python-51dc0856abd7