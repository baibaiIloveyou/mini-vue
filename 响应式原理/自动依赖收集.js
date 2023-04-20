class Depend {
    constructor () {
        this.reactiveFns = new Set()
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

const obj =reactive( {
    name:'ll',
    age:18
})

let reactiveFn = null
function watchFn(fn){//用来监听对象
    reactiveFn = fn //每个对象单独保存起来在 get里面要使用
    fn()
    reactiveFn = null
}

let objMap = new WeakMap()
function getDepend(obj,key){//用来获取Map对象里面单独的dep对象
    let map = objMap.get(obj)//通过get获取到obj对象
    if(!map){//如果当前没有map对象 就设置一个map对象并加到最外层的ObjMap里面
        map = new Map()
        objMap.set(obj,map)
    }

    let dep = map.get(key) //这里是用来查找多个map对象里面每个不同的dep对象
    if(!dep){//如果不存在的话就重新创建
        dep = new Depend()
        map.set(key,dep)
    }
    return dep
}


function reactive(obj){
    Object.keys(obj).forEach(key=>{
        let value = obj[key] //将每个key单独保存下来 set的时候通过引用去改变
        Object.defineProperty(obj,key,{
            set:function(newVal){
                value = newVal
                let dep = getDepend(obj,key)
                dep.notify() //这里值改变以后要重新执行当前函数

            },
            get:function(){
                let dep = getDepend(obj,key) //每次执行的时候都可以获取到要找的obj和相对应的key 通过这些去objMap使用get去查找相对应的map对象
                dep.addDepend()
                return value
            }
        })
    })
    return obj
}


watchFn(function bar(){
    console.log(obj.name)
})
watchFn(function foo(){
    console.log(obj.age)
})

obj.name = '123'
//将obj里面的属性分别存放在不同的dep里面
// obj {
//  dep:{name:'ll'},
//  dep:{age:18}
// }

//将多个obj 存放在不同的map 对象里面 一个obj 一个map对象
// map{
//     obj{
//         name:dep{name:'11'},
//         age:dep{age:'11'},
//     },
// }
// map2{
//     user{
//          name:{dep:'11'},
//          age:{dep:'11'},
//      }
// }

//然后将多个map对象 放在一个objMap对象里面
// objMap{
//     map{
//         obj{
//             name:dep{name:'11'},
//             age:dep{age:'11'},
//         },
//     }
//     map2{
//         user{
//             name:{dep:'11'},
//             age:{dep:'11'},
//         }
//     }
// }
