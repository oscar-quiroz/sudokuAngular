import { Component, Input, OnInit } from '@angular/core';




@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent implements OnInit {


  test_grid1 = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  @Input() showButton: boolean = true;
  @Input() array: any; // se debe transformar en una cadena de strings para dibujarla en el sudoku. 
  // array:any= [];
  constructor() { }

  ngOnInit(): void {
    this.array = this.generateMatrix(this.test_grid1);
    console.log("matriz :", this.array)
  }

  generateMatrix(cadena: any) {
    let str = cadena
    let matrix = str.split('');
    return matrix;
  }

  writeMatrix() {
    let auxArray = '';
    let auxString = this.array.join('');
    console.log(typeof this.array)
    for (let i = 0; i < this.array.length; i += 9) {
      auxArray += auxString.substring(i, i + 9).split('').join(' ') + '\r\n'
    }


    let res =  auxArray.slice(0,-2)
    const blob = new Blob([res], { type: 'text/txt' });
    let aux = document.createElement("a")
   
    const fileURL = URL.createObjectURL(blob);
    aux.href = fileURL;
    aux.download = "sudokuResolve.txt";
    aux.click();
  }

}