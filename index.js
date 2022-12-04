import fs from "fs"
import sqlite3 from 'sqlite3';
import * as path from 'path';
import args from "args";
import { StaticPool } from "node-worker-threads-pool"
import { exportData } from "./utils/csv.js";

const pathDb = path.resolve("data", "bulk.db");
const db = new sqlite3.Database(pathDb);

const THREAD_COUNT = 4;
const STOCKS_LENGTH = 35500;

// usage:
// node index.js --help

args.option('dbsave', 'save generated data to the DB')

const flags = args.parse(process.argv)


const insertStock = (row) => {
  const cols = Object.keys(row);
  const values = [];
  for (let i = 0; i < cols.length; i++) {
      let v = row[cols[i]];
      if (typeof v === 'string') {
          v = `'${v.replaceAll("'", "''")}'`;
      }
      else if ( v=== null) {
          v = "''";
      }
      values.push(v);
  }

  const sqlQuery = `INSERT INTO stocks(${cols.join(",")}) VALUES (${values.join(',')})`;
  db.run(sqlQuery, function(err) {
      if (err) {
        return console.log(err.message + " " + sqlQuery);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}; 

let stocks = [];
const allFileContents = fs.readFileSync('data/stocks', 'utf-8');
allFileContents.split(/\r?\n/).forEach(line => stocks.push(line));

 // stocks = stocks.slice(0,  100)

//Create a static worker pool with THREAD_COUNT workers
const pool = new StaticPool({
  size: THREAD_COUNT,
  task: "./getData.js"
});

const dataResults = [];
for (let i = 0; i < stocks.length; i++) {
 (async () => {
    // This will choose one idle worker in the pool
    // to execute your heavy task without blocking
    // the main thread!
    const res = await pool.exec(stocks[i]);
  
    dataResults.push(res.data)
    if (dataResults.length === STOCKS_LENGTH /*stocks.length*/) {
      if (flags.dbsave) {
        //save data to db
        db.serialize(()=> {
          for (let i = 0; i < dataResults.length; i++) {
            const row = dataResults[i];
            insertStock(row);
          }
          db.close();
          console.log("DB SAVE!")
        });
      }
      
      exportData(dataResults);
   //   process.exit(0)
    }
  })();
} 
