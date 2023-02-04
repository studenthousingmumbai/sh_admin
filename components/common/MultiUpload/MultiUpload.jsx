import { useState, useEffect, useRef } from 'react'
import styles from './MultiUpload.module.css'; 

function MultiUpload(props) {
    const [uploads, setUploads] = useState([]); 
    const file_input_ref = useRef(null); 
    const overlay_ref = useRef(null);
    let counter = 0;

    const hasFiles = ({ dataTransfer: { types = [] } }) => types.indexOf("Files") > -1;

    const dropHandler = (e) => { 
        e.preventDefault();

        addFiles(e.dataTransfer.files);
        overlay_ref.current.classList.remove(styles.draggedOver);
        overlay_ref.current.classList.add('hidden');
        counter = 0;
    }; 

    const dragOverHandler = (e) => { 
        if (hasFiles(e)) {
            e.preventDefault();
        }

        ++counter;
        overlay_ref.current.classList.add(styles.draggedOver);
        overlay_ref.current.classList.remove('hidden');
    }; 

    const dragLeaveHandler = (e) => { 
        --counter;
        overlay_ref.current.classList.remove(styles.draggedOver);
        overlay_ref.current.classList.add('hidden');
    };

    const dragEnterHandler = (e) => { 
        e.preventDefault();

        if (!hasFiles(e)) {
            return;
        }
    }

    const onFileInputChange = (e) => { 
        e.preventDefault(); 
        addFiles(e.target.files);
    }

    const removeFile = (index) => { 
        console.log("Index: ", index);

        let uploads_copy = [...uploads]; 

        console.log("All files: ", uploads_copy);
        
        uploads_copy.splice(index, 1); 

        setUploads(uploads_copy); 
    }

    const removeExistingImage = (index) => { 
        if(props.existingImages && props.setExistingImages) { 
            console.log("Index: ", index);

            let existing_images = [...props.existingImages]; 
            
            existing_images.splice(index, 1); 
    
            props.setExistingImages(existing_images); 
        }
    }

    const addFiles = (files) => {
        let file_objs = [];

        console.log("files: ", files); 

        if(files){
            if(uploads.length > 0) {
                let uploads_copy = [...uploads]; 
                
                for(let upload of uploads_copy) {
                    file_objs.push(upload); 
                }
            }

            for(let file of files) { 
                const isImage = file.type.match("image.*");
                const objectURL = URL.createObjectURL(file);
                const file_obj = { 
                    file, 
                    file_name: file.name, 
                    id: objectURL, 
                    size: file.size > 1024 ? file.size > 1048576 ? Math.round(file.size / 1048576) + "mb" : Math.round(file.size / 1024) + "kb" : file.size + "b", 
                    file_type: ''
                }; 
    
                if(isImage) {
                    file_obj.file_type = 'image'; 
                } 
                else { 
                    file_obj.file_type = 'file'; 
                }
    
                file_objs.push(file_obj);
            }

            props.onChange && props.onChange(file_objs);
            setUploads(file_objs); 
        }
    }

    return (
        <>
            <main className="max-w-screen-lg shadow-sm rounded-md border border-gray-300 overflow-auto">
                {/* <!-- file upload modal --> */}
                <article aria-label="File Upload Modal" className="relative h-full flex flex-col bg-white shadow-xl rounded-md" onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler} onDragEnter={dragEnterHandler}>
                    {/* <!-- overlay --> */}
                    <div id="overlay" ref={overlay_ref} className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md hidden">
                        <i className='overlay-i'>
                            <svg className="fill-current w-12 h-12 mb-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
                            </svg>
                        </i>
                        <p className="text-lg text-blue-700 overlay-p">Drop files to upload</p>
                    </div>
                        
                    {/* <!-- scroll area --> */}
                    <section className="h-full overflow-auto p-8 w-full h-full flex flex-col">
                        <header className="rounded-md border-dashed border-2 border-gray-300 py-12 flex flex-col justify-center items-center">
                            <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                <span>Drag and drop your</span>&nbsp;<span>files anywhere or</span>
                            </p>
                            <input id="hidden-input" ref={file_input_ref} type="file" multiple className="hidden" onChange={onFileInputChange}/>
                            <button type='button' id="button" onClick={() => file_input_ref.current.click()} className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                                Upload a file
                            </button>
                        </header>

                        <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
                            To Upload
                        </h1>

                        <div className='flex'>
                            {
                                uploads.map((upload, upload_index) => upload.file_type === 'image' ? 
                                    ( 
                                        <li key={upload.file_name} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                                            <article tabIndex="0" className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm">
                                                <img src={upload.id} alt="upload preview" className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" />

                                                <section className={`flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3 ${styles.previewImageSection}`}>
                                                    <h1 className="flex-1">{upload.file_name}</h1>

                                                    <div className="flex">
                                                        <span className="p-1">
                                                            <i>
                                                                <svg className="fill-current w-4 h-4 ml-auto pt-" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                    <path d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z" />
                                                                </svg>
                                                            </i>
                                                        </span>

                                                        <p className="p-1 size text-xs">{upload.size}</p>

                                                        <button className={`delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md  ${styles.previewImageButton}`} onClick={() => removeFile(upload_index)}>
                                                            <svg className="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                <path className="pointer-events-none" d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </section>
                                            </article>
                                        </li>
                                    ): 
                                    (
                                        <li key={upload.file_name} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                                            <article tabIndex="0" className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline elative bg-gray-100 cursor-pointer relative shadow-sm">
                                                <img alt="upload preview" className="img-preview hidden w-full h-full sticky object-cover rounded-md bg-fixed" />

                                                <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3" >
                                                    <h1 className="flex-1 group-hover:text-blue-800">{upload.file_name}</h1>
                                                    <div className="flex">
                                                        <span className="p-1 text-blue-800">
                                                            <i>
                                                                <svg className="fill-current w-4 h-4 ml-auto pt-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                    <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                                                                </svg>
                                                            </i>
                                                        </span>

                                                        <p className="p-1 size text-xs text-gray-700">{upload.size}</p>

                                                        <button type='button' className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800" onClick={() => removeFile(upload_index)}>
                                                            <svg className="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                <path className="pointer-events-none" d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </section>
                                            </article>
                                        </li>
                                    )
                                )
                            }
                        </div> 

                        { 
                            uploads.length === 0 && 
                            <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
                                <li id="empty" className="h-full w-full text-center flex flex-col items-center justify-center items-center">
                                    <img className="mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                                    <span className="text-small text-gray-500">No files selected</span>
                                </li>
                            </ul>
                        }    
                        
                        <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
                            Existing Images
                        </h1>

                        <div className='flex'>
                            {
                                props.existingImages && props.existingImages.length > 0 && props.existingImages.map((image, index) => ( 
                                    <li key={image} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                                        <article tabIndex="0" className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm">
                                            <img src={image} alt="upload preview" className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" />

                                            <section className={`flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3 ${styles.previewImageSection}`}>
                                                {/* <h1 className="flex-1">{upload.file_name}</h1> */}

                                                <div className="flex">
                                                    <span className="p-1">
                                                        <i>
                                                            <svg className="fill-current w-4 h-4 ml-auto pt-" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                <path d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z" />
                                                            </svg>
                                                        </i>
                                                    </span>

                                                    {/* <p className="p-1 size text-xs">{upload.size}</p> */}

                                                    <button className={`delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md  ${styles.previewImageButton}`} onClick={() => removeExistingImage(index)}>
                                                        <svg className="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                            <path className="pointer-events-none" d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </section>
                                        </article>
                                    </li>
                                ))
                            }
                        </div>    


                    </section>

                    {/* <!-- sticky footer --> */}
                    {/* <footer className="flex justify-end px-8 pb-8 pt-4">
                        <button id="submit" className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none">
                            Upload now
                        </button>
                        <button id="cancel" className="ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                            Cancel
                        </button>
                    </footer> */}
                </article>
            </main>
        </>
    )
}

export default MultiUpload