import React from "react"
export const NumInput = () => {
    const [value, setValue] = React.useState('')
    // @ts-ignore
    const onChange = (arg1) => {
        if (value.length <= 6) {
            setValue(arg1.target.value)
        }
        if (value.length > arg1.target.value.length) {
            setValue(arg1.target.value)
        }
    }
    return <input value={value} onChange={onChange}/>
}
