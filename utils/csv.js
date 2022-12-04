
import fs from 'fs';
import { ExportToCsv } from 'export-to-csv';

const csvOptions = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true
  };


export const exportData = (data) => {
    const csvExporter = new ExportToCsv(csvOptions);
    const _res = csvExporter.generateCsv(data, true);
    fs.writeFileSync("pegRatios.csv", _res)
}
