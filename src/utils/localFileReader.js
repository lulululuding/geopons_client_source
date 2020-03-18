export default (file, cbk) => {
    
    // console.log(file)
    if(!/image\/\w+/.test(file.type)){ 
        cbk(null, "文件必须为图片！")
        return
    } 
    const reader = new FileReader(); 
    reader.onload = function(e){ 
        console.log(e)
        cbk(e.target.result, null, file)
    } 
    reader.readAsDataURL(file); 
}