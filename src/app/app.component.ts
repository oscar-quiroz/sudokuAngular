import { Component } from '@angular/core';
import { Sudoku } from './models/sudoku';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sudokuSolver';
  ok = '';
  file: any; // archivo obtenido con el input

  matrix: any; // aca se carga el sudoku para enviarlo al componente sudoku
  resultFile: any;
  sudoku: Sudoku = new Sudoku();

  constructor() {}

  ngOnInit(): void {}

  /**
   *
   * Obtiene el archivo justo cuando se cambia en el input
   */
  onSelectFile(e: any) {
    this.ok = 'active';
    console.log('Sudoku : ', e.target.files[0]);
    this.file = e.target.files[0];

    this.uploadDocument();
  }

  /**
   * lee el archivo y lo asigna a al variable matrix
   */
  uploadDocument() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.resultFile = e.target?.result;

      let varValidation = this.resultFile.split(' ').join('').split('\r\n');

      if (
        this.validatePipe(
          this.verifyLenSudoku(varValidation),
          'El sudoku no es 9x9'
        ) &&
        this.validatePipe(
          this.verifyNumericSudoku(varValidation),
          'El sudoku no es numérico'
        ) &&
        this.validatePipe(
          this.validateRowNoRepeat(varValidation),
          'Hay filas con valores repetidos'
        ) &&
        this.validatePipe(
          this.validateRowNoRepeat(this.getColumnsAsArray(varValidation)),
          'Hay columnas con valores repetidos'
        )
      ) {
        this.resultFile = this.resultFile.split('\n').join(' ');
        let response = this.sudoku.search(
          this.sudoku.parse_grid(this.resultFile.split(' ').join(''))
        );
        console.log(Object.values(response));
        this.matrix = Object.values(response);
      }
    };
    this.resultFile = fileReader.readAsText(this.file);
  }

  //Validaciones
  //Verifica que todas las filas tengan 9 dígitos
  verifyLenRow(arraySudoku: any) {
    for (const i of arraySudoku) {
      if (i.length != 9) return false;
    }
    return true;
  }

  //Verifica que el sudoku sea 9x9
  verifyLenSudoku(arraySudoku: any) {
    return arraySudoku.length == 9 && this.verifyLenRow(arraySudoku);
  }

  //Verifica si los elementos del sudoku son numéricos
  verifyNumericSudoku(arraySudoku: any) {
    for (const i of arraySudoku) {
      if (isNaN(i)) {
        console.log(i);
        return false;
      }
    }
    return true;
  }

  // Verifica que en una fila no existan dígitos repetidos
  validateRowNoRepeat(arraySudoku: any) {
    for (const i of arraySudoku)
      if (!this.findRepeat(i.split('0').join(''))) return false;
    return true;
  }

  // Convierte las columnas del sudoku a un array (traspone la matriz)
  getColumnsAsArray(arraySudoku: any) {
    let columns = [];
    for (let i = 0; i < 9; i++) {
      let col = '';
      for (const row of arraySudoku) {
        col += row.charAt(i);
      }
      console.log(col);
      columns.push(col);
    }
    return columns;
  }

  // Valida condiciones y de acuerdo a esto emite un mensaje
  validatePipe(b: Boolean, msg: string) {
    if (!b) console.log(msg);
    return b;
  }

  //Encuentra si, dada una cadena, existen valores repetidos
  findRepeat(str: string) {
    const arr = str.split('');
    const hash = new Map();
    const result: any[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (hash.get(arr[i]) === undefined) {
        hash.set(arr[i], true);
      } else {
        return false;
      }
    }
    return true;
  }
}
