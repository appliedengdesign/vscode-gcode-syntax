/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { v4 as uuidv4 } from 'uuid';

export class GCode {
    public title: string = '';
    public viewBoxMinX: number = 99999;
    public viewBoxMaxX: number = 0;
    public viewBoxMinY: number = 99999;
    public viewBoxMaxY: number = 0;
    private path: string[] = [];
    private misc: string[] = [];

    public toSvg() {
        const vbMinX = Math.round(this.viewBoxMinX - 30);
        const vbMaxX = Math.round(this.viewBoxMaxX + 30);
        const vbMinY = Math.round(this.viewBoxMinY - 30);
        const vbMaxY = Math.round(this.viewBoxMaxY + 30);
        const id = uuidv4();
        return `<svg
    id="${id}"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    width="1000"
    height="1000"
    viewBox="${vbMinX} ${vbMinY} ${vbMaxX} ${vbMaxY}"
  >
    ${this.getTitle()}
    ${this.getPath()}
    ${this.getMisc()}
    </svg>`;
    }

    private getTitle() {
        if (this.title && this.title.trim() !== '') {
            return `<title>${this.title}</title>`;
        }
        return '';
    }

    private getPath() {
        return `<path d="${this.path.join('\n')}" />`;
    }
    private getMisc() {
        return this.misc.join('\n');
    }

    public addLine(x1: number, y1: number, x2: number, y2: number, setViewBox: boolean = true) {
        if (setViewBox) {
            this.checkViewBoxMax(x1, y1);
            this.checkViewBoxMax(x2, y2);
        }
        this.path.push(`M ${x1},${y1} L ${x2},${y2}`);
    }
    public addAPath(x1: number, y1: number, x2: number, y2: number, rx: number, clockwise: boolean = true) {
        this.checkViewBoxMax(x1, y1);
        this.checkViewBoxMax(x2, y2);
        const digits = 1;
        this.path.push(
            `M ${x1.toFixed(digits)},${y1.toFixed(digits)} A ${rx.toFixed(digits)} ${rx.toFixed(digits)} 1 0,${
                clockwise ? 0 : 1
            } ${x2.toFixed(digits)},${y2.toFixed(digits)}`,
        );
    }
    public addCircle(x: number, y: number, r: number) {
        this.misc.push(`<circle cx="${x}" cy="${y}" r="${r}" />`);
    }

    public addText(x: number, y: number, text: string) {
        this.misc.push(`<text x="${x}" y="${y}">${text}</text>`);
    }

    private checkViewBoxMax(x: number, y: number) {
        if (x < this.viewBoxMinX) {
            this.viewBoxMinX = x;
        }
        if (x > this.viewBoxMaxX) {
            this.viewBoxMaxX = x;
        }
        if (x < this.viewBoxMinY) {
            this.viewBoxMinY = y;
        }
        if (y > this.viewBoxMaxY) {
            this.viewBoxMaxY = y;
        }
    }
}
