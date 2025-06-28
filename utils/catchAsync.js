// module.exports=(fn)=>{
// return(req,res,next)=>{
//     fn(req,res,next).catch(err=>{
//         next(err);
//     })
// }
// }
const catchAsync = function(fn){
    return(req,res,next)=>{
        fn(req,res,next).catch(e=>{
            next(e);
        })
    }
}
module.exports=catchAsync;