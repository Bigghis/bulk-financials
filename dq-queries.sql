-- create stocks table:
CREATE TABLE "stocks" (
    "stock" TEXT,
    "name" TEXT,
    "exchange" TEXT,
    "exchangeName" TEXT,
    "industry" TEXT,
    "sector" TEXT,
    "marketCap" NUMERIC,
    "priceToBook" NUMERIC,
    "bookValue" NUMERIC,
    "beta" NUMERIC,
    "pegRatio" NUMERIC,
    "pegRatioCalculated" NUMERIC,
    "epsGrowthRate" NUMERIC,
    "revenueGrowth" NUMERIC,
    "grossProfitGrowth" NUMERIC,
    "ebitGrowth" NUMERIC,
    "netIncomeGrowth" NUMERIC,
    "cogsGrowth" NUMERIC,
    "debtToEquity" NUMERIC,
    "trailingEps" NUMERIC,
    "forwardEps" NUMERIC,
    "trailingPe" NUMERIC,
    "forwardPe" NUMERIC,
    "price" NUMERIC,
    "currency" TEXT,
    "roeAverage" NUMERIC,
    "roaAverage" NUMERIC,
	PRIMARY KEY("stock")
);


-- some screeners...
-- PEG RATIO
select * from stocks WHERE pegRatio > 0 AND pegRatio <= 1
AND debtToEquity <= 30
-- and exchangeName = 'HKSE'
order by pegRatio;

-- ROE
SELECT * FROM stocks WHERE
roeAverage >= 0.30
and roaAverage >= 0.15
and debtToEquity <= 30
