export class Sudoku {
    /**
     * Nombre de las filas, A-I
     */
    rows:string[] = [];

    /**
     * Nombre de las columnas, !-9
     */
    cols:string[] = [];
    /**
     * Nombre de los cuadros, A1-I9
     */
    squares:string[] = [];

    /**
     * Contiene cada grupo posible del sudoku, filas, colunas o cuadros 3x3
     */
    unitlist:string[][] = [];

    /**
     * Contiene agrupaciones de filas de a 3. ABC, DEF, GHI
     */
    rrows:string[][] = [];

    /**
     * Contiene agrupaciones de columnas de a 3. 123, 456, 789
     */
    ccols:string[][] = [];

    /**
     * Es el objeto sudoku con sus grupos. {A1:[row,col,sq3x3], ... I9:...}
     */
    units:any = {};

    /**
     * Es el objeto sudoku con 
     */
    peers:any = {};

    /**
     * Son los digitos posibles en el sudoku. 1-9
     */
    digits:string;

    /**
     * Contador de asignaciones
     */
    nassigns:number;

    /**
     * Contador de eliminaciones
     */
    neliminations:number;

    /**
     * Contador de busquedas
     */
    nsearches:number;

    constructor(){
        this.rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        this.cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.digits = "123456789";
        this.squares = this.cross(this.rows, this.cols);
        this.nassigns = 0;
        this.neliminations = 0;
        this.nsearches = 0;
       
        this.rrows = [
            ['A', 'B', 'C'],
            ['D', 'E', 'F'],
            ['G', 'H', 'I']
        ];
        
        this.ccols = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9']
        ];

        this.fillInitSudoku();
    }

    /**
     * Genera un nuevo string con el cruce entre el grupo A y el grupo B
     * @param A grupo A a cruzar
     * @param B grupo B a cruzar
     * @returns grupos cruzados
     */
    cross(A:string[], B:string[]):string[] {
        var C = [];

        for (var a in A)
            for (var b in B)
                C.push(A[a] + B[b]);

        return C;
    }

    /**
     * Evalúa si un cuadro pertenece a un grupo como fila, columna o cuadro 3x3
     * @param item cuadro a evaluar A1-I9
     * @param list grupo a evaluar. Fila columna o cuadro 3x3
     * @returns boolean
     */
    member(item:string, list:string[]) {
        for (var i in list)
            if (item == list[i]) return true;

        return false;
    }

    /**
     * Inicializa el sudoku
     */
    fillInitSudoku(){
        //Cada fila del sudoku tiene un array
        for (var c in this.cols)
            this.unitlist.push(this.cross(this.rows, [this.cols[c]]));
        
        //Cada columna del sudoku tiene un array
        for (var r in this.rows)
            this.unitlist.push(this.cross([this.rows[r]], this.cols));
        
        //Cada cuadro 3x3 del sudoku tiene un array
        for (var rs in this.rrows)
            for (var cs in this.ccols)
                this.unitlist.push(this.cross(this.rrows[rs], this.ccols[cs]));
        
        //Recorre el sudoku y recorre las filas columnas y cuadros 3x3. Si un cuadro del sudoku
        //pertenece a una fuila, columna o cuadro, se asigna con el nombre del cuadro cada grupo.
        for (var s in this.squares) {
            this.units[this.squares[s]] = [];//this.units.A1 = []

            for (var u in this.unitlist)
                if (this.member(this.squares[s], this.unitlist[u]))
                    this.units[this.squares[s]].push(this.unitlist[u]);//this.units.A1:[row, col, sq3x3]
        }

        //Recorre el sudoku y recorre
        for (var s in this.squares) {
            this.peers[this.squares[s]] = {}; //this.peers.A1 = {}

            //Recorre las listas de la unidad. (this.units.A1:[row, col, sq3x3])
            for (var u in this.units[this.squares[s]]) {
                var ul = this.units[this.squares[s]][u];//ul:row
                
                //Recorre cada lista (row) (col) (sq3x3)
                for (var s2 in ul)
                    //Si no es la casilla actual, le asigna true if row[s2] != A1
                    if (ul[s2] != this.squares[s])
                        this.peers[this.squares[s]][ul[s2]] = true;
            }
        }
    }

    /**
     * COnvierte el sudoku entrante a un objeto sudoku
     * @param grid string con el sudoku codificado
     * @returns sudoku decodificado
     */
    parse_grid(grid:string) { 
        // Given a string of 81 digits (or . or 0 or -), return an object os {cell:values}
        this.nassigns = 0;
        this.neliminations = 0;
        this.nsearches = 0;
        var grid2 = "";

        //recorre el string grid y evalua que solo estén cacracteres .-0123456789
        for (var c = 0; c < grid.length; c++)
            if ("0.-123456789".indexOf(grid.charAt(c)) >= 0)
                grid2 += grid.charAt(c);

        var values:any = {};
        
        //En un nuevo objeto se le asigna a cada cuadrado un string del 1 al 9.
        for (var s in this.squares)
            values[this.squares[s]] = this.digits;

        //Se evalua cada cuadro, si contiene digitos del 1-9 y no se asigna al cuadro retorna false
        for (var s in this.squares)
            if (this.digits.indexOf(grid2.charAt(parseInt(s))) >= 0 
            && !this.assign(values, this.squares[s], grid2.charAt(parseInt(s))))
                return false;
        //si lo asigna correctamente, retorna el sudoku como objeto
        return values;
    }

    /**
     * Elimina los demás valores (exceptuando dig) de values[sq] y lo propaga.
     * @param values 
     * @param sq 
     * @param dig 
     * @returns 
     */
    assign(values:any, sq:string, dig:string) { 
        ++this.nassigns;
        var result = true;
        var vals = values[sq];

        for (var d = 0; d < vals.length; d++)
            if (vals.charAt(d) != dig)
                result = result && (this.eliminate(values, sq, vals.charAt(d)) ? true : false);

        return (result ? values : false);
    }

    /**
     * 
     * @param values 
     * @param sq 
     * @param dig 
     * @returns 
     */
    eliminate(values:any, sq:string, dig:string) {
        ++this.neliminations;
        
        if (values[sq].indexOf(dig) == -1) // ya fue elimnado
            return values;
       
        values[sq] = values[sq].replace(dig, "");
       
        if (values[sq].length == 0) // valor invalido
            return false;

        else if (values[sq].length == 1) { // SI hay solo un valor en el cuadr, lo remueve de peers
            var result = true;

            for (var s in this.peers[sq])
                result = result && (this.eliminate(values, s, values[sq]) ? true : false);
            
            if (!result) return false;
        }

        for (var u in this.units[sq]) {
            var dplaces = [];

            for (var s in this.units[sq][u]) {
                var sq2 = this.units[sq][u][s];

                if (values[sq2].indexOf(dig) != -1)
                    dplaces.push(sq2);
            }

            if (dplaces.length == 0)
                return false;
            else if (dplaces.length == 1)
                if (!this.assign(values, dplaces[0], dig))
                    return false;
        }
        
        return values;
    }

    /**Duplica un objeto
     * 
     * @param obj objeto a duplicar
     * @returns objeto replica
     */
    dup(obj:any):any {
        var d:any = {};

        for (var f in obj)
            d[f] = obj[f];

        return d;
    }

    /**
     * 
     * @param values 
     * @returns 
     */
    search(values:any) {
        ++this.nsearches;

        if (!values)
            return false;

        var min = 10, max = 1,  sq:string = '';

        for (var s in this.squares) {
            if (values[this.squares[s]].length > max)
                max = values[this.squares[s]].length;
            
            if (values[this.squares[s]].length > 1 && values[this.squares[s]].length < min) {
                min = values[this.squares[s]].length;
                sq = this.squares[s];
            }
        }
    
        if (max == 1)
            return values;

        for (var d = 0; d < values[sq].length; d++) {
            var res:any = this.search(this.assign(this.dup(values), sq, values[sq].charAt(d)));

            if (res)
                return res;
        }

        return false;
    }

    /**
     * 
     * @param s 
     * @param w 
     * @returns 
     */
    center(s:string, w:number) {
        var excess = w - s.length;

        while (excess > 0) {
            if (excess % 2) s += " ";
            else s = " " + s;

            excess -= 1;
        }

        return s;
    }

    /**
     * 
     * @param values 
     * @returns 
     */
    board_string(values:any) { // Used for debugging
        var width = 0;

        for (var s in this.squares)
            if (values[this.squares[s]].length > width)
                width = values[this.squares[s]].length;

        width += 1;
        var seg = "";

        for (var i = 0; i < width; i++) seg += "---";

        var line = "\n" + [seg, seg, seg].join("+");
        var board = "";

        for (var r in this.rows) {
            for (var c in this.cols) {
                board += this.center(values[this.rows[r] + this.cols[c]], width);
                if (parseInt(c) == 2 || parseInt(c) == 5) board += "|";
            }

            if (parseInt(r) == 2 || parseInt(r) == 5) board += line;
            board += "\n";
        }

        board += "\n";
        return board;
    }

    devolverMatriz() {
       // return test_grid1
    }
}