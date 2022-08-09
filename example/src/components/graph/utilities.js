export class Vector
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    _()
    {
        return [this.x, this.y];
    }
}



const normalCrossSettings = {
    "lineWidth": 3,
     "strokeStyle": "#878a91",
    "shadowBlur": 0 
}

const normalGridSettings = {
    "lineWidth": 2,
    "strokeStyle": "#878a91",
    "shadowBlur": 0 
}

const normalFunctionSettings = {
    "lineWidth": 4,  
    // "shadowBlur" : 30,
    
    
}

const normalTextSettings = {
    "lineWidth" : 1,
    "strokeStyle": "black",
    "fillStyle": "#555555",
    
}

const normalOuterGrid = {
    "lineWidth": 1,
    "strokeStyle": "#333435"  
}


export const getMousePos = (event) => 
{
    let delta = event.currentTarget.getBoundingClientRect();
    return new Vector(event.clientX - delta.x, event.clientY - delta.y);
    //return new Vector(event.clientX , event.clientY );
}

export const settings = {
    "grid" : normalGridSettings,
    "outer_grid": normalOuterGrid,
    "axis": normalCrossSettings,
    "function" : normalFunctionSettings,
    "text": normalTextSettings
}