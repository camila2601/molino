import * as XLSX from 'xlsx';
export function exportContractsXlsx(employee, contracts){
  const ws = XLSX.utils.json_to_sheet(contracts);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Contratos');
  XLSX.writeFile(wb, `contratos_${employee.NRO_DOCUMENTO}.xlsx`);
}