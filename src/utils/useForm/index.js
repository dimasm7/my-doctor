import { useState } from "react"

export const useForm = (initialValue) => {
    const [values, setValues] = useState(initialValue)
    return [
        values, (fromType, fromValue) => {
            if(fromType === 'reset'){
                return setValues(initialValue)
            }
            return setValues({...values, [fromType]: fromValue})
        }
    ]
}