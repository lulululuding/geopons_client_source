export default ( map, keys ) => {
    let count = 0;
    keys.forEach(key => {
        if (map.has(key) && !!map.get(key)) {
            ++count;
        }
    })
    return count
}

export const getUploadFiles = (filesMap) => {
    const files = [];
    filesMap.forEach( (v,k) => {
        if (k.toString().includes('file')) {
            files.push(v)
        }
    });
    return files
}