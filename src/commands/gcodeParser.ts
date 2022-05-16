/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */

const interpreter = require('gcode-interpreter');
import * as fs from 'fs';
import { GCode, SpindleState } from '../model';

export class GCodeParser {
    private prevX: number = 0;
    private prevY: number = 0;
    private spindleState: SpindleState = SpindleState.off;

    public parseFile(filename: string): GCode {
        const gCode = new GCode();
        const runner = this.createRunner(gCode);
        const content = fs.readFileSync(filename, 'utf8');
        runner.loadFromStringSync(content);
        // TODO: Dots only for debugging. Remove before deploying extension.
        for (let x = (gCode.viewBoxMinX - 30) / 10; x < (gCode.viewBoxMaxX + 30) / 10; x++) {
            gCode.addText(x * 10 - 3, gCode.viewBoxMinY - 23, Math.round(x * 10).toString());
            for (let y = (gCode.viewBoxMinY - 30) / 10; y < (gCode.viewBoxMaxY + 30) / 10; y++) {
                if (x % 10 === 0) {
                    gCode.addText(gCode.viewBoxMinX - 23, y * 10, Math.round(y * 10).toString());
                }
                gCode.addCircle(x * 10, y * 10, 1);
            }
        }
        this.end(gCode);
        return gCode;
    }
    private end(gCode: GCode): void {
        // console.log(`Viewbox max: x:${gCode.viewBoxWidth()}, y:${gCode.viewBoxHeight()}`);
    }

    private createRunner(gCode: GCode) {
        // https://en.wikipedia.org/wiki/G-code
        const handlers = {
            G0: (params: any) => {
                // console.log('G00', params); // 	Rapid positioning
            },
            G1: (params: any) => {
                this.g1(gCode, params);
            },
            G2: (params: any) => {
                this.g2or3(gCode, params, true); // 	Circular interpolation, clockwise
            },
            G3: (params: any) => {
                this.g2or3(gCode, params, false); // 	Circular interpolation, counter clockwise
            },
            G4: (params: any) => {
                // console.log('G04', params); // 	Dwell
            },
            G5: (params: any) => {
                // console.log('G05', params); //  P10000	High-precision contour control (HPCC)
            },
            G6: (params: any) => {
                // console.log('G06', params); // .1	Non-uniform rational B-spline (NURBS) Machining
            },
            G7: (params: any) => {
                // console.log('G07', params); // 	Imaginary axis designation
            },
            G9: (params: any) => {
                // console.log('G09', params); // 	Exact stop check, non-modal
            },
            G10: (params: any) => {
                // console.log('G10', params); // 	Programmable data input
            },
            G11: (params: any) => {
                // console.log('G11', params); // 	Data write cancel
            },
            G17: (params: any) => {
                // console.log('G17', params); // 	XY plane selection
            },
            G18: (params: any) => {
                // console.log('G18', params); // 	ZX plane selection
            },
            G19: (params: any) => {
                // console.log('G19', params); // 	YZ plane selection
            },
            G20: (params: any) => {
                // console.log('G20', params); // 	Programming in inches
            },
            G21: (params: any) => {
                // console.log('G21', params); // 	Programming in millimeters (mm)
            },
            G28: (params: any) => {
                // console.log('G28', params); // 	Return to home position (machine zero, aka machine reference point)
            },
            G30: (params: any) => {
                // console.log('G30', params); // 	Return to secondary home position (machine zero, aka machine reference point)
            },
            G31: (params: any) => {
                // console.log('G31', params); // 	Feed until skip function
            },
            G32: (params: any) => {
                // console.log('G32', params); // 	Single-point threading, longhand style (if not using a cycle, e.g., G76)
            },
            G33: (params: any) => {
                // console.log('G33', params); // 	Constant-pitch threading
            },
            G34: (params: any) => {
                // console.log('G34', params); // 	Variable-pitch threading
            },
            G40: (params: any) => {
                // console.log('G40', params); // 	Tool radius compensation off
            },
            G41: (params: any) => {
                // console.log('G41', params); // 	Tool radius compensation left
            },
            G42: (params: any) => {
                // console.log('G42', params); // 	Tool radius compensation right
            },
            G43: (params: any) => {
                // console.log('G43', params); // 	Tool height offset compensation negative
            },
            G44: (params: any) => {
                // console.log('G44', params); // 	Tool height offset compensation positive
            },
            G45: (params: any) => {
                // console.log('G45', params); // 	Axis offset single increase
            },
            G46: (params: any) => {
                // console.log('G46', params); // 	Axis offset single decrease
            },
            G47: (params: any) => {
                // console.log('G47', params); // 	Axis offset double increase
            },
            G48: (params: any) => {
                // console.log('G48', params); // 	Axis offset double decrease
            },
            G49: (params: any) => {
                // console.log('G49', params); // 	Tool length offset compensation cancel
            },
            G50: (params: any) => {
                // console.log('G50', params); // 	Define the maximum spindle speed
            },
            G52: (params: any) => {
                // console.log('G52', params); // 	Local coordinate system (LCS)
            },
            G53: (params: any) => {
                // console.log('G53', params); // 	Machine coordinate system
            },
            G54: (params: any) => {
                // console.log('G54', params); //  to G59	Work coordinate systems (WCSs)
            },
            G61: (params: any) => {
                // console.log('G61', params); // 	Exact stop check, modal
            },
            G62: (params: any) => {
                // console.log('G62', params); // 	Automatic corner override
            },
            G64: (params: any) => {
                // console.log('G64', params); // 	Default cutting mode (cancel exact stop check mode)
            },
            G68: (params: any) => {
                // console.log('G68', params); // 	Rotate coordinate system
            },
            G69: (params: any) => {
                // console.log('G69', params); // 	Turn off coordinate system rotation
            },
            G70: (params: any) => {
                // console.log('G70', params); // 	Fixed cycle, multiple repetitive cycle, for finishing (including contours)
            },
            G71: (params: any) => {
                // console.log('G71', params); // 	Fixed cycle, multiple repetitive cycle, for roughing (Z-axis emphasis)
            },
            G72: (params: any) => {
                // console.log('G72', params); // 	Fixed cycle, multiple repetitive cycle, for roughing (X-axis emphasis)
            },
            G73: (params: any) => {
                // console.log('G73', params); // 	Fixed cycle, multiple repetitive cycle, for roughing, with pattern repetition
            },
            G74: (params: any) => {
                // console.log('G74', params); // 	Peck drilling cycle for turning
            },
            G75: (params: any) => {
                // console.log('G75', params); // 	Peck grooving cycle for turning
            },
            G76: (params: any) => {
                // console.log('G76', params); // 	Fine boring cycle for milling
            },
            G80: (params: any) => {
                // console.log('G80', params); // 	Cancel canned cycle
            },
            G81: (params: any) => {
                // console.log('G81', params); // 	Simple drilling cycle
            },
            G82: (params: any) => {
                // console.log('G82', params); // 	Drilling cycle with dwell
            },
            G83: (params: any) => {
                // console.log('G83', params); // 	Peck drilling cycle (full retraction from pecks)
            },
            G84: (params: any) => {
                // console.log('G84', params); // 	Tapping cycle, righthand thread, M03 spindle direction
            },
            G85: (params: any) => {
                // console.log('G85', params); // 	boring cycle, feed in/feed out
            },
            G86: (params: any) => {
                // console.log('G86', params); // 	boring cycle, feed in/spindle stop/rapid out
            },
            G87: (params: any) => {
                // console.log('G87', params); // 	boring cycle, backboring
            },
            G88: (params: any) => {
                // console.log('G88', params); // 	boring cycle, feed in/spindle stop/manual operation
            },
            G89: (params: any) => {
                // console.log('G89', params); // 	boring cycle, feed in/dwell/feed out
            },
            G90: (params: any) => {
                // console.log('G90', params); // 	Absolute programming
            },
            G91: (params: any) => {
                // console.log('G91', params); // 	Incremental programming
            },
            G92: (params: any) => {
                // console.log('G92', params); // 	Threading cycle, simple cycle
            },
            G94: (params: any) => {
                // console.log('G94', params); // 	Feedrate per minute
            },
            G95: (params: any) => {
                // console.log('G95', params); // 	Feedrate per revolution
            },
            G96: (params: any) => {
                // console.log('G96', params); // 	Constant surface speed (CSS)
            },
            G97: (params: any) => {
                // console.log('G97', params); // 	Constant spindle speed
            },
            G98: (params: any) => {
                // console.log('G98', params); // 	Return to initial Z level in canned cycle
            },
            G99: (params: any) => {
                // console.log('G99', params); // 	Return to R level in canned cycle
            },
            G100: (params: any) => {
                // console.log('G100', params); // 	Tool length measurement
            },
            M0: (params: any) => {
                // console.log('M00', params); // 	Compulsory stop
            },
            M1: (params: any) => {
                // console.log('M01', params); // 	Optional stop
            },
            M2: (params: any) => {
                // console.log('M02', params); // 	End of program
            },
            M3: (params: any) => {
                this.spindleState = SpindleState.onClockwise;
                // console.log('M03', params); // 	Spindle on (clockwise rotation)
            },
            M4: (params: any) => {
                this.spindleState = SpindleState.onCounterClockwise;
                // console.log('M04', params); // 	Spindle on (counterclockwise rotation)
            },
            M5: (params: any) => {
                this.spindleState = SpindleState.off;
                // console.log('M05', params); // 	Spindle stop
            },
            M6: (params: any) => {
                // console.log('M06', params); // 	Automatic tool change (ATC)
            },
            M7: (params: any) => {
                // console.log('M07', params); // 	Coolant on (mist)
            },
            M8: (params: any) => {
                // console.log('M08', params); // 	Coolant on (flood)
            },
            M9: (params: any) => {
                // console.log('M09', params); // 	Coolant off
            },
            M10: (params: any) => {
                // console.log('M10', params); // 	Pallet clamp on
            },
            M11: (params: any) => {
                // console.log('M11', params); // 	Pallet clamp off
            },
            M13: (params: any) => {
                // console.log('M13', params); // 	Spindle on (clockwise rotation) and coolant on (flood)
            },
            M19: (params: any) => {
                // console.log('M19', params); // 	Spindle orientation
            },
            M21: (params: any) => {
                // console.log('M21', params); // 	Mirror, X-axis
            },
            M22: (params: any) => {
                // console.log('M22', params); // 	Mirror, Y-axis
            },
            M23: (params: any) => {
                // console.log('M23', params); // 	Mirror OFF
            },
            M24: (params: any) => {
                // console.log('M24', params); // 	Thread gradual pullout OFF
            },
            M30: (params: any) => {
                // console.log('M30', params); // 	End of program, with return to program top
            },
            M41: (params: any) => {
                // console.log('M41', params); // 	Gear select – gear 1
            },
            M42: (params: any) => {
                // console.log('M42', params); // 	Gear select – gear 2
            },
            M43: (params: any) => {
                // console.log('M43', params); // 	Gear select – gear 3
            },
            M44: (params: any) => {
                // console.log('M44', params); // 	Gear select – gear 4
            },
            M48: (params: any) => {
                // console.log('M48', params); // 	Feedrate override allowed
            },
            M49: (params: any) => {
                // console.log('M49', params); // 	Feedrate override NOT allowed
            },
            M52: (params: any) => {
                // console.log('M52', params); // 	Unload Last tool from spindle
            },
            M60: (params: any) => {
                // console.log('M60', params); // 	Automatic pallet change (APC)
            },
            M98: (params: any) => {
                // console.log('M98', params); // 	Subprogram call
            },
            M99: (params: any) => {
                // console.log('M99', params); // 	Subprogram end
            },
            M100: (params: any) => {
                // console.log('M100', params); // 	Clean Nozzle
            },
        };

        return new interpreter({
            handlers: handlers,
            defaultHandler: (cmd: string, params: string[]) => {},
        });
    }

    private g1(gCode: GCode, params: any) {
        const x = this.x(params);
        const y = this.y(params);
        if (x && y) {
            if (this.spindleState !== SpindleState.off) {
                gCode.addLine(this.prevX, this.prevY, x, y);
            }
            this.prevX = x;
            this.prevY = y;
        }
    }

    private g2or3(gCode: GCode, params: any, clockwise: boolean) {
        const x = this.x(params);
        const y = this.y(params);
        const i = this.i(params);
        const j = this.j(params);
        const r = this.r(params);
        const p = this.p(params);
        // console.log({ x }, { y }, { i }, { j });
        if (x !== undefined && y !== undefined) {
            if (this.spindleState !== SpindleState.off) {
                let rx = 0;
                if (i !== undefined && j !== undefined) {
                    rx = Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2));
                } else if (i) {
                    rx = Math.sqrt(Math.pow(i, 2));
                } else if (j) {
                    rx = Math.sqrt(Math.pow(j, 2));
                } else if (r) {
                    rx = r;
                }
                gCode.addAPath(this.prevX, this.prevY, x, y, rx, clockwise);
            }
            this.prevX = x;
            this.prevY = y;
        }
    }

    private x(params: any): number | undefined {
        if ('X' in params) {
            return params.X as number;
        }
        return undefined;
    }
    private y(params: any): number | undefined {
        if ('Y' in params) {
            return params.Y as number;
        }
        return undefined;
    }
    private i(params: any): number | undefined {
        if ('I' in params) {
            return params.I as number;
        }
        return undefined;
    }
    private j(params: any): number | undefined {
        if ('J' in params) {
            return params.J as number;
        }
        return undefined;
    }
    private r(params: any): number | undefined {
        if ('R' in params) {
            return params.R as number;
        }
        return undefined;
    }
    private p(params: any): number | undefined {
        if ('P' in params) {
            return params.P as number;
        }
        return undefined;
    }
}
