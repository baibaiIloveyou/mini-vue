
class Depend{
    constructor(){
        this.reactiveFns = new Set()//防止重复加载
    }
    addDepend(){
        if(reactiveFn){
            this.reactiveFns.add(reactiveFn)
        }

    }
    notify(){
        this.reactiveFns.forEach(fn=>{
            fn()
        })
    }
}




let reactiveFn = null
function watchFn(fn){
    reactiveFn = fn
    fn()
    reactiveFn = null
}

let objMap = new WeakMap()
function getDepend(obj,key){
    let map = objMap.get(obj)
    if(!map){
        map = new Map()
        objMap.set(obj,map)
    }

    let dep = map.get(key)
    if(!dep){
        dep = new Depend()
        map.set(key,dep)
    }
    return dep
}

function reactive(obj){
    Object.keys(obj).forEach(key=>{
        let value = obj[key]
        Object.defineProperty(obj,key,{
            set:function(newVal){
                value = newVal
                let dep = getDepend(obj,key)
                dep.notify()
            },
            get:function (){
                let dep = getDepend(obj,key)
                dep.addDepend()
                return value
            }
        })
    })
    return obj
}


const obj = reactive({
    name:'ll',
    age:18
})

watchFn(function bar() {
    console.log(obj.age)
})

watchFn(function foo() {
    console.log(obj.name)
})

obj.name = '1231'