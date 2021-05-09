import { Component, Input, OnInit } from '@angular/core';

declare function devolverMatriz():any;

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent implements OnInit {

  test_grid1 = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";

  @Input() array:any; // se debe transformar en una cadena de strings para dibujarla en el sudoku. 
  // array:any= [];
  constructor() { }

  ngOnInit(): void {
    this.array = this.generateMatrix( this.test_grid1 );
    console.log("matriz :" , this.array)
  }

  generateMatrix(cadena:any){
    let str = cadena
    let matrix = str.split('');
    return matrix;
  }
}