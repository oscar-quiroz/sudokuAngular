import { Component, OnInit } from '@angular/core';

declare function devolverMatriz():any;

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent implements OnInit {


  array:any= [];
  constructor() { }

  ngOnInit(): void {
  this.array = this.generateMatrix( devolverMatriz());  
   console.log("matriz :" , this.array)
  }


  generateMatrix(cadena:any){
    let str = cadena
    let matrix = str.split('');
    return matrix;
  }
}
