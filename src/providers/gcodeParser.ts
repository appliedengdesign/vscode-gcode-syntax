
export class GCodeParser {

    constructor( readonly text: string) {
        
    }


        // Comments
        private stripComments(line: string): string {
            const re1 = new RegExp(/\s*\([^\)]*\)/g);   // Remove anything inside the parentheses
            const re2 = new RegExp(/\s*;.*/g);          // Remove anything after a semi-colon to the end of the line, including preceding spaces
            const re3 = new RegExp(/\s+/g);
            
            return (line.replace(re1, '').replace(re2, '').replace(re3, ''));
        }




}