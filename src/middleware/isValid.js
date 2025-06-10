const isValid = (schema) => 
     (req, res, next)=> {
        const data = {...req.body, ...req.query, ...req.params}
        const validation = schema.validate(data, {abortEarly: false})
        if (validation.error) {
            const errors = validation.error.details.map(err => err.message)
            return next(new Error(errors, {cause: 400}))
        }
        return next()
    }

export default isValid