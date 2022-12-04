import { getYear } from "../utils/utils.js";

// https://www.investopedia.com/ask/answers/06/pegratioearningsgrowthrate.asp#:~:text=Calculating%20PEG%20in%20an%20Example&text=Suppose%20the%20company's%20earnings%20per,ratio%20is%20calculated%20as%201.07.


export const getGrowthRate = (beginValue,  endValue) => {
    // growth rate between two numbers
    if (beginValue && endValue) {
       const res =  ( (endValue - beginValue) / beginValue ) //* 100;
        return isNaN(res) ? null : res;
    }
    return null;
}

export const getEpsGrowthRate = (data) => {
    if (data) {
        let count = 0;
        let epsSum = 0;
        for (let i = 0; i < (data.length - 1); i++) {
            epsSum += getGrowthRate(data[i].epsActual, data[i + 1].epsActual);
            count ++;
        }
        return (epsSum / count) * 100;
    }
    return null;
};

export const getIncomesGrowthRates = (data) => {
    const dataByYear = [];
    if (data && data.incomeStatementHistory) {
        for (let i = data.incomeStatementHistory.length - 1; i>=0; i--) {
            const element = data.incomeStatementHistory[i];
            const year = getYear(element.endDate);
            dataByYear[year] = element;
        }
    
        // get min year
        const years = Object.keys(dataByYear).map(y => parseInt(y));
        const maxYear = Math.max(...years);
        const minYear = Math.min(...years);
        let revenuesSum = 0;
        let ebitSum = 0;
        let grossProfitSum = 0;
        let netIncomeSum = 0;
        let cogsSum = 0;
        let count = 0;
            for (let i = minYear; i < maxYear; i++) {
                try {
                        revenuesSum += getGrowthRate(dataByYear[i].totalRevenue, dataByYear[i + 1].totalRevenue);
                        ebitSum += getGrowthRate(dataByYear[i].ebit, dataByYear[i + 1].ebit);
                        grossProfitSum += getGrowthRate(dataByYear[i].grossProfit, dataByYear[i + 1].grossProfit);
                        netIncomeSum += getGrowthRate(dataByYear[i].netIncome, dataByYear[i + 1].netIncome);
                        cogsSum += getGrowthRate( // incremento del costo del venduto
                            (dataByYear[i].totalRevenue - dataByYear[i].grossProfit), 
                            (dataByYear[i + 1].totalRevenue - dataByYear[i + 1].grossProfit)
                        )
                        count ++;
                    } catch (err) {
                        console.err("getGrowthRate ERROR: ", err)
                        count = 0;
                    }
        }

        if (count >0) {
            const growths = {
                revenue: parseFloat(((revenuesSum / count) * 100).toFixed(2)), // percentage 
                ebit: parseFloat(((ebitSum / count) * 100).toFixed(2)),
                grossProfit: parseFloat(((grossProfitSum / count) * 100).toFixed(2)),
                netIncome: parseFloat(((netIncomeSum / count) * 100).toFixed(2)),
                cogs: parseFloat(((cogsSum / count) * 100).toFixed(2))
            }
            return growths;
        } else {
            return null;
        }
    }
    return null;
}

export const pegRatioCalculated = (data) => {
    // pegRatio = (price / EPS) / epsGrowthRate 
    let pegRatio = null;
    const _data = data.earningsHistory && data.earningsHistory.history || null;
    let epsGrowthRate = getEpsGrowthRate(_data);
    if (epsGrowthRate) {
        const trailingPe = data.summaryDetail && data.summaryDetail.trailingPE || null;
        if (trailingPe ) {
            pegRatio =  parseFloat(((trailingPe) / (epsGrowthRate) ).toFixed(2));
        }
        return { pegRatio, epsGrowthRate: parseFloat(epsGrowthRate.toFixed(2)) };
    }

    return { pegRatio, epsGrowthRate: null}
}

export const getAverageReturns = (data) => {
    if (
        data && data.balanceSheetHistory && data.balanceSheetHistory.balanceSheetStatements
        && data.cashflowStatementHistory && data.cashflowStatementHistory.cashflowStatements
    ) 
    {
        let roeAverage  = 0;
        let roaAverage = 0;
        const len = data.balanceSheetHistory.balanceSheetStatements.length
        for (let i=0; i<len; i++) {
            const element = data.balanceSheetHistory.balanceSheetStatements[i];
            const cashFlowElement = data.cashflowStatementHistory.cashflowStatements[i];

            roaAverage += cashFlowElement.netIncome / element.totalAssets
            roeAverage += cashFlowElement.netIncome / (element.totalAssets - element.totalLiab)
        }
        return {
            roa: parseFloat((roaAverage / len).toFixed(2)),
            roe: parseFloat((roeAverage / len).toFixed(2))
        };
    }

    return {
        roa: null,
        roe: null
    }
}
