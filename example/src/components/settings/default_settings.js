export var DEFAULT_SETTINGS = {
    axis: {
        "lineWidth" : 3,
        "strokeStyle": "#4b4b4b",
        "shadowBlur" : 0,  
    },
    grid: {
        "lineWidth" : 2,
        "strokeStyle": "#8f9192",
        "fillStyle" : "white",
    },
    outer_grid: {
        "lineWidth" : 1,
        "strokeStyle": "#c5c5c5",  
    },

    function: {
        "lineWidth": 4,    
    },

}




export const settings_prototype = [
    {"name": "Line Width"			, property: "lineWidth", default: 1, "description": "Width of lines"		, "type": "range", "range": [1, 4]					},
    {"name": "Shadow Blur"		, property: "shadowBlur", default: 0, "description": "Specifies the blurring effect."		, "type": "range", "range": [0, 50] 						},
    {"name": "Line Color"			, property: "strokeStyle", default: "#fff", "description": "Color or style to use for the lines around shapes"		, "type": "color" 					},
    {"name": "Shadow Color"		, property: "shadowColor", default: "transparent", "description": "Color of the shadow. Default: fully-transparent black"		, "type": "color" 						},
    {"name": "Shadow offset X", property: "shadowOffsetX", default: 0, "description": "Horizontal distance the shadow will be offset"		, "type": "range", "range": [0, 50] 								},
    {"name": "Shadow offset Y", property: "shadowOffsetY", default: 0, "description": "Vertical distance the shadow will be offset"		, "type": "range", "range": [0, 50] 								},
    {"name": "Line Cap"				, property: "lineCap", default: "round", "description": "Type of endings on the end of lines. Possible values: butt (default), round, square"		, "type": "select", "options": ["butt", "round", "square"] 				},
    {"name": "Line Join"			, property: "lineJoin", default: "round", "description": "Defines the type of corners where two lines meet. Possible values: round, bevel, miter (default)"		, "type": "select", "options": ["round", "bevel", "miter"] 					},
]


export function createDefaultSettings(settings_prototype)
{
    let settings_copy = DEFAULT_SETTINGS;
    for (let value in settings_copy)
    {
        settings_prototype.forEach(setting => {
            if (!settings_copy[value][setting.property])
            {
                settings_copy[value][setting.property] = setting.default;
            }
        })
    }
    
    return settings_copy;
};