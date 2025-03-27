import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

export class ExcelService {
  exportToExcel() {
    const data = [
      {
        nroEntrega: 2,
        fecha: "2025-01-06T00:00:00",
        unidad: "Metropolitana",
        renglonesEntregas: [
          {
            id: 2,
            nroRenglon: 0,
            tipoFormulario: "Transferencia de Motos",
            desde: 1,
            hasta: 100,
            cantidad: 5
          }
        ]
      }
    ];

    // Transformar los datos al formato requerido
    const transformedData = data.flatMap(entrega =>
      entrega.renglonesEntregas.map(renglon => ({
        id: renglon.id,
        nroEntrega: entrega.nroEntrega,
        fecha: entrega.fecha,
        unidad: entrega.unidad,
        nroRenglon: renglon.nroRenglon,
        tipoFormulario: renglon.tipoFormulario,
        desde: renglon.desde,
        hasta: renglon.hasta,
        cantidad: renglon.cantidad
      }))
    );

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Entregas');

    // Definir encabezados
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nro Entrega', key: 'nroEntrega', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Unidad', key: 'unidad', width: 20 },
      { header: 'Nro Renglón', key: 'nroRenglon', width: 15 },
      { header: 'Tipo de Formulario', key: 'tipoFormulario', width: 25 },
      { header: 'Desde', key: 'desde', width: 10 },
      { header: 'Hasta', key: 'hasta', width: 10 },
      { header: 'Cantidad', key: 'cantidad', width: 10 }
    ];

    // Agregar los datos
    worksheet.addRows(transformedData);

    // Crear archivo Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Entregas.xlsx');
    });
  }
}
