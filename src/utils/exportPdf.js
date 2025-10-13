import jsPDF from 'jspdf';
export function exportEmployeeContractsPdf(employee, contracts){
  const doc = new jsPDF();
  doc.text(`Contratos de: ${employee.NOMBRE} ${employee.APELLIDO}`, 10, 10);
  let y = 20;
  contracts.forEach((c, i)=>{
    doc.text(`${i+1}. ${c.FECHA_INICIO} - ${c.FECHA_FIN} : ${c.VALOR_CONTRATO}`, 10, y);
    y+=8;
  });
  doc.save('contratos.pdf');
}