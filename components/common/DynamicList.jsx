import { useEffect, useState  } from 'react'
import { field_types } from '../../constants';
import MultiUpload from '../common/MultiUpload/MultiUpload';

function DynamicForm({ fields, values, layout, onChange }) {
    const [state, setState] = useState(values || []);

    useEffect(() => {
        setState(values);
    }, [values])

    const addRow = () => {
        let new_row = {};

        for(let key of Object.keys(fields)){
            new_row[key] = ""
        }
        
        setState([...state, new_row]);

        onChange && onChange([...state, new_row]);
    }

    const removeRow = (index) => {
        let currentState = [...state];

        currentState.splice(index,1);

        setState(currentState);

        onChange && onChange(currentState);
    }

    const handleChange = (index, key, value) => { 
        let currentState = [...state];

        currentState[index][key] = value;

        setState(currentState);

        onChange && onChange(currentState);
    }

    return (
        <>
            {   
                state.map((value,index) => {
                    return (
                        <> 
                            {
                                layout.map(row => ( 
                                    <div>
                                        <div key={index} className='flex mb-3 max-w-screen-lg'>
                                            {
                                                row.map(field => ( 
                                                        fields[field].type === field_types.TEXT ? 
                                                        <input 
                                                            type={fields[field].variant}
                                                            className="flex-1 mr-2 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                            value={value[field]} 
                                                            placeholder={fields[field].placeholder} 
                                                            required={fields[field].required} 
                                                            onChange={(e) => handleChange(index,field,e.target.value)}
                                                            disabled={fields[field].disabled && fields[field].disabled}
                                                        />
                                                        : 
                                                        fields[field].type === field_types.FILES ? 
                                                        <div className='flex-1'>
                                                            <MultiUpload onChange={files => handleChange(index, field, files)}/>
                                                        </div> 
                                                        : 
                                                        fields[field].type === field_types.DROPDOWN ? 
                                                        <div className='flex-1 w-full h-full'>
                                                            <select
                                                                id={fields[field].label}
                                                                name={fields[field].label}
                                                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                onChange={(e) => handleChange(index, field, e.target.value)}
                                                                value={value[field]}
                                                                required={fields[field].required} 
                                                            >
                                                                <option value="" disabled selected>Select your option</option>
                                                                {
                                                                    fields[field].options.map(option => ( 
                                                                        <option value={option}>{option}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        :
                                                        <></>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    
                                ))
                            }
                            <div className='max-w-screen-lg flex justify-end'>
                                <button type='button' className='mb-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' onClick={() => removeRow(index)}>Remove</button>
                            </div> 
                        </>
                    )
                })
            }

            <button type='button' className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' onClick={addRow}>
                Add more
            </button>
        </>
    )
}

export default DynamicForm