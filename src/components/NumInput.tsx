import React from "react"

export const NumInput = () => {
    const [value, setValue] = React.useState('')
    const onChange = (event: any) => {
        const targetValue = event.target.value

        if (value.length <= 6 || value.length > targetValue.length) {
            setValue(targetValue)
        }
    }
    return <input value={value} onChange={onChange}/>
}
