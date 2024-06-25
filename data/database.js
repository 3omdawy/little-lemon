import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
  //return;
  //return db.execAsync(`drop table menuitems`);
  return db.execAsync(`create table if not exists menuitems (id integer primary key not null, name text, description text, price number, category text, imageFileName text);`);
}

export async function getMenuItems() {
  //return [];
  return db.getAllAsync('select * from menuitems');
}

export async function saveMenuItems(menuItems) {
  //return;
  menuItems.forEach(function (item) {
    db.runAsync('insert into menuitems (id, name, description, price, category, imageFileName) values (?,?,?,?,?,?)', item.id, item.name, item.description, item.price, item.category, item.imageFileName);
  });
  return;
  /*return db.runAsync(`insert into menuitems (id, name, description, price, category, imageFileName) values ${
    menuItems.map((item) => `(${item.id}, '${item.name}', '${item.description}', ${item.price}, '${item.category}', '${item.imageFileName}')`).join(', ')}`);
    */
}

export async function filterByQueryAndCategories(query, activeCategories) {
  let str = activeCategories.map((item) => "'" + item + "'").join(',');
  str = "(" + str + ")";
  return db.getAllAsync("select * from menuitems where LOWER(name) like '%" + query.toLowerCase() + "%' and LOWER(category) in " + str.toLowerCase());
}
