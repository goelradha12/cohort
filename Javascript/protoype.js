// ----------For Each-------------
/*
Array.prototype.myforEach = function (callback){
    console.log("Hello", this);
    const myarr = this;
    for(let i=0;i<myarr.length;i++)
    {
        callback(myarr[i],i); 
    }
}
arr.myforEach(function (val,ind){
    console.log(val,ind);
});
*/

// ---------- my map -----------
/*
if(!Array.prototype.myMap)
{
    Array.prototype.myMap = function(userFun) {
        const myArr = this;
        newArr = [];
        for(let i=0;i<myArr.length;i++)
        {
            newArr.push(userFun(myArr[i],i,myArr));
        }
        return newArr;
    }
}
const mappedArr = arr.map((val,index,arr)=>{
    // console.log(val,index,arr);
    return val*2;
});
const myMappedArr = arr.myMap((val,index,arr)=>{
    // console.log(val,index,arr);
    return val*2;
});
console.log(mappedArr);
console.log(myMappedArr,arr);
*/



const arr = [1,2,3,4];

function test()
{
    console.log("Hello");
}

//  --------- my filter
/*
Array.prototype.myfilter = function (userfun){
    newarr = [];
    for(i=0;i<this.length;i++)
    {
        if(userfun(this[i],i,this)==true)
        newarr.push(this[i]);

    }
    return newarr;
}
const test = arr.filter((val,ind,arr)=>
{
    return val>2;
})
const mytest = arr.myfilter((val,ind,arr)=>
{
    return val>2;
});
console.log(test,arr,mytest);
*/