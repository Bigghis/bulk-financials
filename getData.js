import { parentPort } from "worker_threads";
import yahooFinance from "yahoo-finance2";
import { getAverageReturns, pegRatioCalculated, getIncomesGrowthRates } from "./logics/calcs.js";
// import { insertStock } from "./logics/db.js";

const QUERY_OPTIONS = {  
  price: ['price'],
  summaryProfile: ['summaryProfile'],
   summaryDetail: ['summaryDetail'],
  defaultKeyStatistics: ['defaultKeyStatistics'],
  balanceSheetHistory: ['balanceSheetHistory', 'balanceSheetStatements' ],
  cashflowStatementHistory: ['cashflowStatementHistory', 'cashflowStatements'],
  incomeStatementHistory: ['incomeStatementHistory', 'incomeStatementHistory'],
 // cashflowStatementHistory: ['cashflowStatementHistory', 'cashflowStatements'],
  financialData: ['financialData'],
  earningsHistory: ['earningsHistory', 'history']
};

parentPort.on("message", async (param) => {
  const result = await getData(param);
  parentPort.postMessage({ data: result });
});

const getData  = async (stock) => {
  try {
    console.log("stock=", stock);
    const data  = await yahooFinance.quoteSummary(stock, { modules: Object.keys(QUERY_OPTIONS)});
    const _pegRatioCalculated = pegRatioCalculated(data);
    const growths = getIncomesGrowthRates(data.incomeStatementHistory)
    const averageReturns = getAverageReturns(data)
    const row =  {
      stock,
      name: data.price && data.price.shortName || null,
      exchange: data.price && data.price.exchange || null,
      exchangeName: data.price && data.price.exchangeName || null,
      industry: data.summaryProfile && data.summaryProfile.industry || null,
      sector: data.summaryProfile && data.summaryProfile.sector || null,
      marketCap:  data.price && data.price.marketCap || null,
      priceToBook: data.defaultKeyStatistics && data.defaultKeyStatistics.priceToBook || null,
      bookValue: data.defaultKeyStatistics && data.defaultKeyStatistics.bookValue || null,
      beta: data.defaultKeyStatistics && data.defaultKeyStatistics.beta || null,
      pegRatio: data.defaultKeyStatistics && data.defaultKeyStatistics.pegRatio || null,
      pegRatioCalculated: _pegRatioCalculated.pegRatio,
      epsGrowthRate: _pegRatioCalculated.epsGrowthRate,
      revenueGrowth: growths && growths.revenue || null,
      grossProfitGrowth: growths && growths.grossProfit || null,
      ebitGrowth: growths && growths.ebit || null,
      netIncomeGrowth: growths && growths.netIncome || null,
      cogsGrowth: growths && growths.cogs || null,
      debtToEquity: data.financialData && data.financialData.debtToEquity ? parseFloat( data.financialData.debtToEquity.toFixed(2) ) : null,
      trailingEps:  data.defaultKeyStatistics && data.defaultKeyStatistics.trailingEps || null,
      forwardEps:  data.defaultKeyStatistics && data.defaultKeyStatistics.forwardEps || null, // trailing = based on actual earnings
      trailingPe: data.summaryDetail && data.summaryDetail.trailingPE || null, // trailing = based on actual earnings
      forwardPe: data.summaryDetail && data.summaryDetail.forwardPE || null,
      price: data.price && data.price.regularMarketPrice || null,
      currency:  data.summaryDetail && data.summaryDetail.currency || null,
      roeAverage: averageReturns.roe,
      roaAverage: averageReturns.roa,
    };
    return row;
  } catch (error) {
      console.log(error)
      return ({
        stock
      });
  }
}
