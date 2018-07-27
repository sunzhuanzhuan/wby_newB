import axios from 'axios'


export const handleUpload=(url,formData) =>{
     return axios({
        method: 'post',
        url: url,
        data: formData
    }).then((response) => {
        return response
    })
}