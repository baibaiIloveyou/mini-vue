class Depend{
    constructor(){
        this.reactiveFns = []
    }
    addDepend(fn){
        if(fn){
            this.reactiveFns.push(fn)
        }
    }
    notify(){
        this.reactiveFns.forEach(fn => {
            fn()
        })
    }
}

const obj = {
    name:'liujian',
    age:18
}

const dep = new Depend()
function watchFn(fn){
    dep.addDepend(fn)
    fn()
}

Object.keys(obj).forEach(key=>{
    let value = obj[key]
    Object.defineProperty(obj,key,{
        set:function(newValue){
            value = newValue
            dep.notify()
        },
        get:function(){
            return value
        }
    })
})


watchFn(function foo(){
        console.log('---age',obj.age)
    }
)

watchFn(function bar(){
    console.log('---name',obj.name)
})

obj.name = 'ooo'