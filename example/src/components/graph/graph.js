import React, { useEffect, useRef, useState } from 'react';
import {Vector, settings, getMousePos } from './utilities'

 const GraphDraw = (props) => {
    const canvas = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [offset, setOffset] = useState( new Vector(0, 0) );
    const [center, setCenter] = useState( new Vector(0, 0) );
    const [size, setSize] = useState( new Vector(0, 0) );
    const [zoom, setZoom] = useState( 40 );
    
    const [mouseDown, setMouseDown] = useState(null); 
    

    const [increment, setIncrement] = useState(2);
    const pixelUnitSize = 100;
    const [cursor, setCursor] = useState("auto");
    const [canvasStyle, setCanvasStyle] = useState({});



    const applyContextSettings = (settings) => {  for (let setting in settings)  {  ctx[setting] = settings[setting]; }  }
    const clear = () => ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    const toPixelsX = x => center.x + x * zoom;
        const toCartesianX = pX => (pX - center.x) / zoom
    const toPixelsY = y => center.y - y * zoom;    
        const toCartesianY = pY => -(pY - center.y) / zoom

 

    useEffect(() => setCtx(canvas.current.getContext("2d")), [canvas])
    useEffect(() => setSize(new Vector(canvas.current.width, canvas.current.height)), [ctx, props.width, props.height])
    useEffect(() => setCenter(new Vector(size.x / 2 + offset.x, size.y / 2 + offset.y)), [size, offset, zoom]);
    

    const getBoundsX = () => [  toCartesianX( 0 ) ,  toCartesianX( size.x )  ]; 
    const getBoundsY = () => [  toCartesianY( 0 ) ,  toCartesianY( size.y )  ]; 

  

    useEffect(() => {
        setCanvasStyle(() => props.canvasStyle ?? {});
    }, [props.canvasStyle])

    useEffect(() => {
        if (!ctx)
            return;

        clear();    
        
        let [x_bounds, y_bounds] = 
        drawGrid();
        
        drawCrosses();
        drawFunction(x_bounds);
      
    
        drawText(x_bounds, y_bounds);    
       
    }, [ctx, center, props.canvasStyle, increment,  props.functions])


  
    const next = (num) => {
        let previous_term = Math.floor(num / increment);
        return (previous_term + 1) * increment
    }

    const prev = (num) => {
        let next_term = Math.floor(num / increment);
        return next_term * increment        
    }

    const drawText = (x_cords, y_cords) => {
        let font_size = Number(ctx.font.split(" ")[0].split("px")[0] );

        ctx.beginPath();
        applyContextSettings( canvasStyle.text || settings.text);
        ctx.font = "20px Arial";

            let posX = toPixelsY(0) + font_size;
        
            for (let x=x_cords.start; x <= x_cords.end; x += increment)
            {
                let x_level = toPixelsX(x);
                let x_str =  `${x.toFixed(1)}`
                if (x_str == 0)
                    continue;
                ctx.strokeText(x_str, x_level, posX );
                ctx.fillText(  x_str, x_level,   posX );

            }

            
            for (let y=y_cords.start; y >= y_cords.end; y -= increment)
            {

                let y_level = toPixelsY(y);
                let y_str = `${y.toFixed(1)}`; 
                if (y_str == 0)
                    continue;
                ctx.strokeText(y_str, toPixelsX(0) - font_size-17, y_level );
                ctx.fillText(  y_str, toPixelsX(0) - font_size-17, y_level );
            }

            ctx.stroke();
            ctx.fill();
        ctx.closePath();    
    }


    const drawGrid = () => {
       
        ctx.beginPath();
            applyContextSettings( canvasStyle.gridSettings || settings.grid);
            ctx.lineWidth = 2; 

            let boundsX = getBoundsX();
            let boundsY = getBoundsY();

            let _x = {"start" : prev(boundsX[0]), "end" :  next(boundsX[1]) } 
            let _y = {"start" : next(boundsY[0]), "end" :  prev(boundsY[1]) } 

            for (let x= _x.start; x <= _x.end; x += increment )
            {
                let x_level = toPixelsX(x);
                ctx.moveTo(x_level, 0);
                ctx.lineTo(x_level, size.y);                    
            }

            
            for (let y=_y.start; y >= _y.end; y -= increment )
            {
                let y_level = toPixelsY(y);
                ctx.moveTo(0, y_level);
                ctx.lineTo(size.x, y_level);            
            }
            ctx.stroke();
        ctx.closePath();

        // Grid without numbers (greyer)
        ctx.beginPath();
            applyContextSettings( canvasStyle.outerGrid || settings.outer_grid );
            
            ctx.lineWidth = 1; // no matter what

            for (let x= _x.start; x <= _x.end; x += increment /4)
            {
                let x_level = toPixelsX(x);
                ctx.moveTo(x_level, 0);
                ctx.lineTo(x_level, size.y);                    
            }


            for (let y=_y.start; y >= _y.end; y -= increment /4)
            {
                let y_level = toPixelsY(y);
                ctx.moveTo(0, y_level);
                ctx.lineTo(size.x, y_level);            
            }

            ctx.stroke();
        ctx.closePath();
        return [_x, _y];
    }

    const graphFunction = (_, x_cords, inc) => {
        let f  = _[0];
        let color = _[1];
        ctx.strokeStyle = color;
       
        for (let x=x_cords.start; x < x_cords.end; x += inc/10)
            {   
             
                let [x_, y_] = [toPixelsX(x), toPixelsY( f(x) )]

                ctx.moveTo(x_,y_);
                ctx.lineTo(x_,y_);
                   
            }
    
        ctx.stroke();
    }

    const drawFunction = (x_cords) => {
        if (!props.functions)
            return;
        applyContextSettings(canvasStyle.function || settings.function)
        let inc = Math.abs(toCartesianX(size.x) - toCartesianX(0)) / 10000;

        props.functions.forEach(_ => {   
            ctx.beginPath();             
                graphFunction(_, x_cords, inc);
            ctx.closePath();
        })
    }




    const drawCrosses = () =>
    {
        ctx.beginPath();
            applyContextSettings( canvasStyle.axis || settings.axis);  
            // ctx.strokeStyle = "red"     
                ctx.moveTo( center.x, 0 );
                ctx.lineTo( center.x, size.y );
                
                ctx.moveTo( 0,  center.y);
                ctx.lineTo( size.x, center.y );        
            ctx.stroke();
        ctx.closePath();
    }

    

    const handleMouseMove = (e) => {
       
        if (!mouseDown)
            return;
        
        let pos = getMousePos(e);
        
        setOffset(new Vector(
            mouseDown.offset.x - (mouseDown.mpos.x - pos.x),
            mouseDown.offset.y - (mouseDown.mpos.y - pos.y),
        ));
       
        
    }

    const zoomIntoCursor = (event, delta) => {
        let mouse_pos = getMousePos(event);
        setZoom(prev_zoom => {
            let new_zoom = Math.max(prev_zoom + delta, 1);

            let prev_cmposX = (mouse_pos.x - center.x) / prev_zoom;
            let prev_cmposY = (mouse_pos.y - center.y) / prev_zoom;

            let cmposX = (mouse_pos.x - center.x) / new_zoom;
            let cmposY = (mouse_pos.y - center.y) / new_zoom;


            let deltaX = prev_cmposX - cmposX;
            let deltaY = prev_cmposY - cmposY;

            // 1 Cartesian unit to pixels (length)
            let pixelX = Math.abs( (center.x + 2 * new_zoom) - (center.x + 1 * new_zoom) );
            let pixelY = Math.abs( (center.y - 2 * new_zoom) - (center.y - 1 * new_zoom) );


            setOffset(prev => new Vector( prev.x - deltaX * pixelX, prev.y - deltaY * pixelY ) );
            return new_zoom;
        })
    }

    const handleWheel = (e) => {
        if (e.deltaY < 0)
            zoomIntoCursor(e,  4);
        else 
            zoomIntoCursor(e, -4);


        let unit = Math.abs(toPixelsX(increment)- toPixelsX(0));
        if (unit <= 58 || unit >= 120)
        {
            let unit_dist = Math.abs(toPixelsX(2) - toPixelsX(1));
            setIncrement(pixelUnitSize / unit_dist );
        }
    }


    return (
        <canvas style={ {...props.htmlStyle, "cursor" : cursor, "background" : (props.htmlStyle ? props.htmlStyle.background : null) ?? "#f5f5f5"} }
            onMouseDown={(e) => { 
              

                if (e.button !== 2)
                {
                    setCursor("all-scroll");
                    setMouseDown(  { "mpos": getMousePos(e), "offset": offset } ); 
                }
            } 
            
            }
            onMouseUp={  (e) => {setMouseDown(null); setCursor("auto") }  } 
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseLeave={() => {
                setMouseDown(null);
                setCursor("auto");

            }}
            onWheel={(e) => handleWheel(e) }
            

            width={props.width} 
            height={props.height}
            ref={canvas}
        ></canvas>
    )
}

export default GraphDraw