import { useState, useEffect, useRef } from 'react'; 
import useApi from '../../hooks/useApi';

export default function ({ image_file, boxes, setBoxes, setOpen, setCurrentBbox, focusedBed, setFocusedBed }) {
    const image_canvas_ref = useRef(null); 
    const overlay_canvas_ref = useRef(null); 
    const [overlay_context, setOverlayContext] = useState(null); 
    const [image_context , setImageContext] = useState(null); 
    const { updateBed, deleteBed } = useApi(); 
    const is_mounted = useRef(false); 

    const box_list = [...boxes];
    const box_coordinates = {};
	const line_width = 2;      

    let startX, startY; 
	let box_color = '#00ff00';
    let focus_color = '#0000ff';
	let selector_color = '#ffffff';
	let handle_color = '#00ff00';
	let dx = 0;
	let dy = 0;
	let closeEnough = 7;
	let line_dash = [6];
	let resize_box_index = null;
	let hover_index = null;
    let focus_index = focusedBed;
	let selected_box_index = null;
	let isDrawing = false;
	let isDragging = false;
	let hover = false;
	let dragTL = false;
	let dragBL = false;
	let dragTR = false; 
	let dragBR = false; 

    useEffect(() => {
        const image_canvas = image_canvas_ref.current;
        const imageContext = image_canvas.getContext('2d')
        setImageContext(imageContext);

        const overlay_canvas = overlay_canvas_ref.current; 
        const overlay_context = overlay_canvas.getContext('2d')
        setOverlayContext(overlay_context); 

        let media = new Image();    
        var reader = new FileReader();
 
        reader.onload = function (evt) {
            media.onload = function() { 
                image_canvas.width = media.naturalWidth; 
                image_canvas.height = media.naturalHeight;  

                overlay_canvas.width = media.naturalWidth;
                overlay_canvas.height = media.naturalHeight;

                imageContext.drawImage(media, 0, 0, media.width, media.height, 0, 0, image_canvas.width, image_canvas.height);

                drawBoundingBoxes(box_list, overlay_context); 
            }   

            media.src = evt.target.result;
        }

        reader.readAsDataURL(image_file);
    }, []);

    useEffect(() => {
        if(!is_mounted.current) { 
            is_mounted.current = true; 
        } else { 
            if(overlay_context){ 
                const target_index = box_list.findIndex(box => box.id === focusedBed);
                focus_index = target_index;
                
                clearOverlay();
                drawBoundingBoxes(box_list, overlay_context);
            }
        }
    }, [focusedBed])


    function clearOverlay() {
        overlay_context.clearRect(0, 0, overlay.width, overlay.height);
    }
    
    function getBoundingBox(x, y, w, h) {
        return { 
            tl: [x, y],
            tr: [x + w, y], 
            bl: [x, y + h], 
            br: [x + w, y + h] 
        }; 
    }

    const drawSelector = (e) => { 
        overlay_context.strokeStyle = selector_color;
        overlay_context.setLineDash(line_dash);
        overlay_context.lineWidth = line_width;
        overlay_context.beginPath();
        overlay_context.rect(startX, startY, e.nativeEvent.offsetX - startX, e.nativeEvent.offsetY - startY);  
        overlay_context.stroke();
    }

    const drawCircle = (x, y, radius, overlay_context) => { 
        overlay_context.fillStyle = handle_color;
        overlay_context.beginPath();
        overlay_context.arc(x, y, radius, 0, 2 * Math.PI);
        overlay_context.fill();
    }

    const drawHandles = (box, overlay_context) => { 
        drawCircle(box.x, box.y, closeEnough, overlay_context);
        drawCircle(box.x + box.w, box.y, closeEnough, overlay_context);
        drawCircle(box.x + box.w, box.y + box.h, closeEnough, overlay_context);
        drawCircle(box.x, box.y + box.h, closeEnough, overlay_context);
    }

    const drawBoundingBoxes = (box_list, overlay_context) => { 
        if(box_list.length > 0){
            for(let i =0; i< box_list.length; i++){
                const box = box_list[i];
    
                overlay_context.strokeStyle = box_color;
                overlay_context.setLineDash(line_dash);
                overlay_context.lineWidth = line_width;
                overlay_context.beginPath();
                overlay_context.rect(box.x, box.y, box.w, box.h);  
                overlay_context.stroke();
    
                if(hover && hover_index === i){
                    overlay_context.fillStyle = 'rgba(0,255,0,0.2)';
                }
                else{ 
                    overlay_context.fillStyle = 'rgba(0,255,0,0.05)';
                }

                if(focus_index == i) { 
                    overlay_context.strokeStyle = focus_color;
                    overlay_context.setLineDash(line_dash);
                    overlay_context.lineWidth = line_width;
                    overlay_context.beginPath();
                    overlay_context.rect(box.x, box.y, box.w, box.h);  
                    overlay_context.stroke();
                    overlay_context.fillStyle = 'rgba(80, 148, 250,0.3)'
                    handle_color = '#5094fa'; 
                } else  { 
                    handle_color = '#00ff00';
                }
    
                overlay_context.fillRect(box.x, box.y, box.w, box.h);   
                drawHandles(box, overlay_context);
            }
        }
    }

    const checkCloseEnough = (p1,p2) => {
        return Math.abs(p1 - p2) < closeEnough;
    }

    const mouse_in_rect = (box, mouseX, mouseY) => { 
        let x = box.x, y = box.y, w = box.w, h = box.h;
        return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
    }

    const get_center_coords = (bounding_box) => { 
        const x_center = (bounding_box.top_left[0] + bounding_box.bottom_right[0]) / 2;
        const y_center = (bounding_box.top_left[1] + bounding_box.bottom_right[1]) / 2;
        return [x_center, y_center];
    }

    const checkMouseOnHandles = (e) => { 
        let startX = e.nativeEvent.offsetX;
        let startY = e.nativeEvent.offsetY;

        for(let i=0; i < box_list.length; i++){
            const box = box_list[i];

            // 1. Top left 
            if (checkCloseEnough(startX, box.x) && checkCloseEnough(startY, box.y)) {
                overlay_canvas_ref.current.style.cursor = "nw-resize";
            }
            // 2. top right
            else if (checkCloseEnough(startX, box.x + box.w) && checkCloseEnough(startY, box.y)) {
                overlay_canvas_ref.current.style.cursor = "ne-resize";
            }
            // 3. bottom left
            else if (checkCloseEnough(startX, box.x) && checkCloseEnough(startY, box.y + box.h)) {
                overlay_canvas_ref.current.style.cursor = "sw-resize";
            }
            // 4. bottom right
            else if (checkCloseEnough(startX, box.x + box.w) && checkCloseEnough(startY, box.y + box.h)) {
                overlay_canvas_ref.current.style.cursor = "se-resize";
            }
        }
    }

    const handleMouseDown = (e) => { 
        e.preventDefault();
        e.stopPropagation();
    
        // calculate the current mouse position
        startX = e.nativeEvent.offsetX;
        startY = e.nativeEvent.offsetY;
        
        // check if any of the resize handles is being clicked on to resize the box 
        for(let i=0; i < box_list.length; i++){
            const box = box_list[i];
    
            if (checkCloseEnough(startX, box.x) && checkCloseEnough(startY, box.y)) {
                dragTL = true;
                resize_box_index = i;
            }
            // 2. top right
            else if (checkCloseEnough(startX, box.x + box.w) && checkCloseEnough(startY, box.y)) {
                dragTR = true;
                resize_box_index = i;
            }
            // 3. bottom left
            else if (checkCloseEnough(startX, box.x) && checkCloseEnough(startY, box.y + box.h)) {
                dragBL = true;
                resize_box_index = i;
            }
            // 4. bottom right
            else if (checkCloseEnough(startX, box.x + box.w) && checkCloseEnough(startY, box.y + box.h)) {
                dragBR = true;
                resize_box_index = i;
            }

            if(mouse_in_rect(box, startX, startY)){
                setFocusedBed(box.id);
            }
        }
        
        // if none of the resize handles are clicked on 
        if(!dragTL && !dragTR && !dragBL && !dragBR){
            // check if an existing box is being moved 
            for(let i = 0; i < box_list.length; i++){
                if(hover && hover_index === i){
                    isDragging = true;
                    selected_box_index = i;
                    overlay_canvas_ref.current.style.cursor = "grab";
                    break; 
                }
            }
            
            // check if a new box is being drawn 
            if(!isDragging){
                isDrawing = true;
                overlay_canvas_ref.current.style.cursor = "crosshair";
            }
        }
    
        clearOverlay();
        drawBoundingBoxes(box_list, overlay_context);
    }

    const handleMouseMove = (e) => { 
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        clearOverlay();  

        overlay_canvas_ref.current.style.cursor = "default";
        hover = false;

        checkMouseOnHandles(e);

        // if a new box is being drawn 
        if (isDrawing) {
            drawSelector(e);
            overlay.style.cursor = "crosshair";
        } 
        // if an existing box is being resized 
        else if(dragTL || dragTR || dragBL || dragBR){
            // calculate the current mouse position         
            let mouseX = e.nativeEvent.offsetX;
            let mouseY = e.nativeEvent.offsetY;

            for(let i=0; i< box_list.length; i++){
                const box = box_list[i];

                if (dragTL && resize_box_index === i) {
                    box.w += box.x - mouseX;
                    box.h += box.y - mouseY;
                    box.x = mouseX;
                    box.y = mouseY;
                    overlay_canvas_ref.current.style.cursor = "nw-resize";
                } 
                else if (dragTR && resize_box_index === i) {
                    box.w = Math.abs(box.x - mouseX);
                    box.h += box.y - mouseY;
                    box.y = mouseY;
                    overlay_canvas_ref.current.style.cursor = "ne-resize";
                } 
                else if (dragBL && resize_box_index === i) {
                    box.w += box.x - mouseX;
                    box.h = Math.abs(box.y - mouseY);
                    box.x = mouseX;
                    overlay_canvas_ref.current.style.cursor = "sw-resize";
                } 
                else if (dragBR && resize_box_index === i) {
                    box.w = Math.abs(box.x - mouseX);
                    box.h = Math.abs(box.y - mouseY);
                    overlay_canvas_ref.current.style.cursor = "se-resize";
                }

                // update the bounding box coordinates
                box.bb = getBoundingBox(box.x, box.y, box.w, box.h); 
            }

            // setBoxes(box_list); 
        }
        // if an existing box is being moved 
        else if(isDragging){
            overlay_canvas_ref.current.style.cursor = 'grab';
            hover = true; 

            // calculate the current mouse position         
            let mouseX = e.nativeEvent.offsetX;
            let mouseY = e.nativeEvent.offsetY;

            // how far has the mouse dragged from its previous mousemove position?
            const dx = mouseX - startX;
            const dy = mouseY - startY;

            box_list[selected_box_index].x += dx;
            box_list[selected_box_index].y += dy;
            // update the bounding box coordinates
            box_list[selected_box_index].bb = getBoundingBox(
                box_list[selected_box_index].x, 
                box_list[selected_box_index].y, 
                box_list[selected_box_index].w, 
                box_list[selected_box_index].h
            ); 

            // update the starting drag position (== the current mouse position)
            startX = mouseX;
            startY = mouseY;
        }
        // otherwise check if a box is being hovered on with the mouse pointer 
        else{ 
            for(let i = 0; i < box_list.length; i++){
                const box = box_list[i];

                if(mouse_in_rect(box, e.nativeEvent.offsetX, e.nativeEvent.offsetY)){
                    hover = true;
                    hover_index = i;
                    overlay_canvas_ref.current.style.cursor = "grab";
                }
            }
        }

        drawBoundingBoxes(box_list, overlay_context);   
        // setBoxes(box_list); 
    }

    const handleMouseUp = async (e) => { 
        // if a box was being dragged
        if(isDragging) { 
            isDragging = false;
            const target_box = box_list[selected_box_index]; 
            const bbox = { x: target_box.x, y: target_box.y, w: target_box.w, h: target_box.h }; 

            // console.log("targetBox id: ", target_box.id);
            await updateBed(target_box.id, { bbox }); 
        }
        // if a box was being resized 
        if(dragTL || dragTR || dragBL  || dragBR) { 
            dragTL = dragTR = dragBL = dragBR = false;
            const target_box = box_list[resize_box_index]; 
            const bbox = { x: target_box.x, y: target_box.y, w: target_box.w, h: target_box.h }; 

            // console.log("targetBox id: ", target_box.id);
            await updateBed(target_box.id, { bbox }); 
        }
        // if a new box was being drawn 
        if (isDrawing) {
            isDrawing = false;   

            dx = e.nativeEvent.offsetX - startX;
            dy = e.nativeEvent.offsetY - startY;

            if(startX - e.nativeEvent.offsetX >= 0 && startY - e.nativeEvent.offsetY >= 0){
                box_coordinates.top_left = [startX + dx, startY + dy];
                box_coordinates.top_right = [startX, startY + dy];
                box_coordinates.bottom_left = [startX + dx, startY];
                box_coordinates.bottom_right =  [startX, startY];
            }
            else if(startX - e.nativeEvent.offsetX <= 0 && startY - e.nativeEvent.offsetY <= 0){
                box_coordinates.top_left = [startX, startY];
                box_coordinates.top_right = [startX + dx, startY];
                box_coordinates.bottom_left = [startX, startY + dy];
                box_coordinates.bottom_right = [startX + dx, startY + dy];
            }
            else if(startX -  e.nativeEvent.offsetX >= 0 && startY - e.nativeEvent.offsetY <= 0){
                box_coordinates.top_left = [startX + dx, startY];
                box_coordinates.top_right = [startX, startY];
                box_coordinates.bottom_left = [startX + dx, startY + dy];
                box_coordinates.bottom_right = [startX, startY + dy];
            }
            else if(startX - e.nativeEvent.offsetX <= 0 && startY - e.nativeEvent.offsetY >= 0){
                box_coordinates.top_left = [startX, startY + dy];
                box_coordinates.top_right =  [startX + dx, startY + dy];
                box_coordinates.bottom_left =  [startX, startY];
                box_coordinates.bottom_right = [startX + dx, startY];
            }

            if(dx !==0 && dy !== 0){
                box_list.push({ 
                    x: box_coordinates.top_left[0], 
                    y: box_coordinates.top_left[1], 
                    w: Math.abs(dx), 
                    h: Math.abs(dy), 
                    bb: getBoundingBox(box_coordinates.top_left[0], box_coordinates.top_left[1], Math.abs(dx), Math.abs(dy))
                });

                setOpen(true);
                setCurrentBbox({
                    x: box_coordinates.top_left[0], 
                    y: box_coordinates.top_left[1], 
                    w: Math.abs(dx), 
                    h: Math.abs(dy), 
                });
            }

            overlay_canvas_ref.current.style.cursor = "default";
            setBoxes(box_list); 
            clearOverlay();
            drawBoundingBoxes(box_list, overlay_context);
        }
    }

    const handleDoubleClick = async (e) => { 
        setFocusedBed(null); 

        e.preventDefault();
        e.stopPropagation();

        for(let i = 0; i < box_list.length; i++){
            const box = box_list[i];

            if(mouse_in_rect(box, e.nativeEvent.offsetX, e.nativeEvent.offsetY)){
                box_list.splice(i,1); 
                setBoxes(box_list); 
                box.id && await deleteBed(box.id); 
            }
        }
    }

    return (
        <div className='relative'>
            <canvas 
                className='absolute top-0 left-0'
                id="imageCanvas" 
                ref={image_canvas_ref}
            />
            <canvas 
                className='absolute top-0 left-0'
                id="overlay" 
                ref={overlay_canvas_ref}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                onBlur={() => setFocusedBed(null)}
            />
        </div>
    )
}
