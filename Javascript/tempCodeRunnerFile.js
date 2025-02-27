Array.prototype.myforEach = (callback)=>{
    console.log("Hello", this);
    const myarr = this;
    for(let i=0;i<myarr.length;i++)
    {
        callback(myarr[i],i); 
    }
}