const isAuthroized =  (role) => async (req, res, next)=>{
    if(!(role === 'admin')){
        return next(new Error('User not authroized'))
        
    }
    return next()  
}
export default isAuthroized;