import React from 'react'

const InputField = ({name, type, placeholder,value, onChange }) => {
    return (
        <div className="input-field">

            <input
                placeholder={placeholder}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

export default InputField
