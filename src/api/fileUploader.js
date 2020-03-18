import axios from 'axios';

function upload (file) {
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', 'geopins')
    data.append('cloud_name', 'denrebenok')
    return axios.post(
        'https://api.cloudinary.com/v1_1/denrebenok/image/upload',
        data
    ).then(res => res.data.url)
    //return res.data.url 
}

export const fileUpload = async files => {

    return await Promise
        .all(files.map( file => upload(file) ))
        .then( urls => urls.filter( url => !!url ) );

}

// async function upload (file) {
//     try {
//         const data = new FormData()
//         data.append('file', file)
//         data.append('upload_preset', 'geopins')
//         data.append('cloud_name', 'denrebenok')
//         const res = await axios.post(
//             'https://api.cloudinary.com/v1_1/denrebenok/image/upload',
//             data
//         )
//         return res.data.url
//     } catch (e) {
//         console.log(e)
//         return null
//     }
// }