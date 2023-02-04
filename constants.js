export const field_types = { 
    TEXT: 'TEXT', 
    FILES: 'FILES', 
    DROPDOWN: 'DROPDOWN', 
    CHECKBOX_GROUP: 'CHECKBOX_GROUP', 
    RADIO_GROUP: 'RADIO_GROUP', 
    SLIDER: 'SLIDER', 
    TEXTAREA: 'TEXTAREA', 
}
  
export const field_variants = { 
    [field_types.TEXT]: { 
        text: 'text', 
        file: 'file',
        email: 'email', 
        password: 'password', 
        number: 'number' 
    }
}

export const RoleTypes =  { 
    SUPERADMIN: 'SUPERADMIN',  
    SUPERVISOR: 'SUPERVISOR', 
    ADMIN: 'ADMIN', 
}; 

export const ScopeTypes =  { 
    USER: 'USER',  
    ADMIN: 'ADMIN'
}; 