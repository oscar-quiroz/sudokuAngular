import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent implements OnInit {


  array:any= [];
  constructor() { }

  ngOnInit(): void {
    this.array = this.generateMatrix(); 
    console.log("matriz :" , this.array)
  }


  generateMatrix(){
    let str = '003020600900305001001806400008102900700000008006708200002609500800203009005010300'
    let matrix = str.split('');
    return matrix;
  }
}
