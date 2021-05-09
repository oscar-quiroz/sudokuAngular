import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Sudoku } from './models/sudoku';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {


  inputFile: any;
  matrixError = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  auxInputFile: string = "";
  isErrors: boolean = false;
  arrayErrors: any = []
  showButton: boolean = false;
  title = 'sudokuSolver';
  ok = '';
  file: any; // archivo obtenido con el input

  initialMatrix: any;
  matrix: any; // aca se carga el sudoku para enviarlo al componente sudoku
  resultFile: any;
  sudoku: Sudoku = new Sudoku();

  constructor() { }

  ngOnInit(): void { }


  /**
   *
   * Obtiene el archivo justo cuando se cambia en el input
   */
  onSelectFile(e: any) {
    this.ok = 'active';
    console.log('Sudoku : ', e.target.files[0]);
    this.file = e.target.files[0];
    this.auxInputFile = this.inputFile


    this.uploadDocument();
    this.inputFile = '';

  }

  /**
   * lee el archivo y lo asigna a al variable matrix
   */
  uploadDocument() {
    this.arrayErrors = []
    this.isErrors = false;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.resultFile = e.target?.result;

      this.initialMatrix = this.resultFile.split(' ').join('').split('\r\n').join('').split('');
      let varValidation = this.resultFile.split(' ').join('').split('\r\n');
      let isLen:boolean
      let isNumeric:boolean
      let isRowNoRepeat:boolean
      let isColNoRepeat:boolean
      let isBox:boolean

      if (!(isLen=this.verifyLenSudoku(varValidation))) {
  
        this.arrayErrors.push('El sudoku no es 9x9')
      }
      if (!(isNumeric= this.verifyNumericSudoku(varValidation))) {
        this.arrayErrors.push('El sudoku no es numérico.')
      }

      if (!(isRowNoRepeat= this.validateRowNoRepeat(varValidation))) {
        this.arrayErrors.push('Hay filas con valores repetido.')
      }

      if (!(isColNoRepeat=this.validateRowNoRepeat(this.getColumnsAsArray(varValidation)))) {
        this.arrayErrors.push('Hay columnas con valores repetido.')
      }

      if(!(isBox=this.validateBox(varValidation))){
        this.arrayErrors.push('Hay números repetidos en las regiones 3x3')

      }

      if (isLen && isNumeric &&
        isRowNoRepeat && isColNoRepeat
        && isBox) {
        this.resultFile = this.resultFile.split('\n').join(' ');
        let response = this.sudoku.search(
          this.sudoku.parse_grid(this.resultFile.split(' ').join(''))
        );
        this.matrix = Object.values(response);
        console.log(Object.values(response));
        if(!response){
            this.matrix= this.matrixError.split("")
            this.arrayErrors.push("EL sudoku no tiene Solución")
            alert("El sudoku no tiene solución")
        }
      }
      if (this.arrayErrors.length === 0) {
        this.isErrors = false;
      } else {
        this.isErrors = true;
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

  transformToBox(rows:string[]) {
    let arr = [];
    let s;

    for (let a = 0; a < 9; a += 3) {
      for (let b = 0; b < 9; b += 3) {
        s = ""
        for (let i = a; i < a + 3; i++) {
          for (let j = b; j < b + 3; j++) {
            s += rows[i].charAt(j);

          }
        }
        arr.push(s)
      }
    }
    return arr;
  }

  validateBox(array:string[]){
    return this.validateRowNoRepeat( this.transformToBox(array))
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
