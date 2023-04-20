const obj = {
    name:'lilei',
    age:18
}




//设置一个专门执行响应式函数的容器
let reactiveFns = []
function watchFn(fn){
    reactiveFns.push(fn)
    fn()
}


watchFn(function foo(){
    console.log(obj.name)
})

watchFn(function bar(){
    console.log(obj.age)
})

reactiveFns.forEach(fn=>{
    fn()
})