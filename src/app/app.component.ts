import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sudokuSolver';
  ok="";
  file:any;// archivo obtenido con el input

  matrix:any; // aca se carga el sudoku para enviarlo al componente sudoku

  constructor(){

  }

  ngOnInit(): void {
 
    
  }

  
/**
 * 
 * Obtiene el archivo justo cuando se cambia en el input
 */
onSelectFile(e:any){
  this.ok="active";
  console.log("Sudoku : ",e.target.files[0])
  this.file= e.target.files[0];

 this.uploadDocument()
  

}

/**
 * lee el archivo y lo asigna a al variable matrix
 */
uploadDocument(){
  let fileReader = new FileReader();
  fileReader.onload = (e) => {
    console.log(fileReader.result)
  }
  this.matrix=fileReader.readAsText(this.file)
  console.log( "tipo",typeof this.matrix)
}

 
}
