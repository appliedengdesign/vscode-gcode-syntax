
const gcodeColorization = [
    {
        "scope": "gcodes.gcode",
        "settings": {
            "foreground": "#0066DD",
            "fontStyle": "bold"
        }
    },
    {
        "scope": "mcodes.mcode",
        "settings": {
            "foreground": "#990000",
            "fontStyle": "bold"
        }
    }
];

const getColorization = (): any => {
    return gcodeColorization;
};

export {
    getColorization
};