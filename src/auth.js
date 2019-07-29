import {get,readable} from 'svelte/store';
var value;
export const state =  readable(value,function auth(set){
fetch("https://auth.canadiana.ca/1/auth",{
credentials:"include",
})
.then(function(response, data){
    if(response.status == 200){
       set(value = response.status);
    }
    else if(response.status == 401){
        
        set(value = response.status);
    }
}) 
}); 
