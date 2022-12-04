# Bulk Financials

Grabs stocks data from yahoo-finance and store it in a SQLite3 DB.

## Getting Started

* can only run in Node.js.
* for personal use only.

It uses stocks list in data/stocks file.

### Executing program

```
npm run start -d
```

## Options 
* -d, --dbsave   save generated data to the DB (in data/buld.db)
* -h, --help     Output usage information
* -v, --version  Output the version number


## Stock Screeners

Can create some stock screeners with queries..

* examples: 
```
-- PEG RATIO
select * from stocks WHERE pegRatio > 0 AND pegRatio <= 1
AND debtToEquity <= 30
--AND stock='MLI'
--and exchangeName = 'MCE'
and exchangeName = 'HKSE'
order by pegRatio;

-- ROE
SELECT * FROM stocks WHERE
roeAverage >= 0.30
and roaAverage >= 0.15
and debtToEquity <= 30
-- and pegRatio > 0 AND pegRatio <= 2

```
...and so on


## Help

```
npm run help
```

## Authors

Contributors names and contact info

* Bigghis 
[@Bigghis](https://github.com/Bigghis)

## Version History

* 0.1
    * Initial Release

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

it uses..
* [yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2)
* [node-worker-threads-pool](https://github.com/SUCHMOKUO/node-worker-threads-pool)
