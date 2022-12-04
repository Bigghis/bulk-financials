import sqlite3 from 'sqlite3';
import * as path from 'path';

const pathDb = path.resolve("data", "bulk.db");
const db = new sqlite3.Database(pathDb);

class DB {
    constructor() {
        this.db = db;
    }

    insertStock(row) {
        const cols = Object.keys(row);
        const values = [];
        for (let i = 0; i < cols.length; i++) {
            let v = row[cols[i]];
            if (typeof v === 'string') {
                v = `'${v}'`;
            }
            else if ( v=== null) {
                v = "''";
            }
            values.push(v);
        }
       // console.log(`INSERT INTO stocks(${cols.join(",")}) VALUES (${values.join(',')})`)
        this.db.run(`INSERT INTO stocks(${cols.join(",")}) VALUES (${values.join(',')})`, function(err) {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
          });
    };

    closeDb () {
        this.db.close();
    }
}
