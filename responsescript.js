function loadResponses(formId,t){
    const responsekey = `responses_${formId}`;
    const responses = JSON.parse(localStorage.getItem(responsekey)) || [];
    const container = document.getElementById('response-container');
    container.innerHTML='';
    
    const title = document.createElement('h2');
    title.textContent = "Responses for "+t;
    title.style.textAlign = 'center';
    title.style.marginBottom = '10px';
    container.appendChild(title);

    if(responses.length===0){
        container.innerHTML="<p>No Responses submitted yet for this form</p>";
        return;
    }
    responses.forEach((response,index)=>{
        const responsediv = document.createElement('div');
        responsediv.className = 'response-box';
        responsediv.innerHTML = `<h3> Response ${index+1}</h3>`
        for(let key in response){
            responsediv.innerHTML+=`<p><strong>${key}:</strong> ${Array.isArray(response[key]) ? response[key].join(", ") : response[key]}</p>`
        }
        const deleteButton = createDeleteButton(index, formId,t);
        responsediv.appendChild(deleteButton);
        container.appendChild(responsediv);
    })
}

document.getElementById('loadbtn').addEventListener('click',()=>{
    const formId = document.getElementById("formIDInput").value.trim();
    const formkey = `form_${formId}`;
    const error = document.getElementById('error');
    error.textContent = '';

    const formexists=localStorage.getItem(formkey);
    if(!formexists){
        error.textContent = "Invalid Form ID";
        document.getElementById('response-container').style.display= 'none';
        return
    }
    const title = JSON.parse(formexists)[0].value;
    document.getElementById('formInput').style.display = 'none';
    const container = document.getElementById('response-container');
    container.style.display = 'block';
    loadResponses(formId, title);
})
function createDeleteButton(index, formId,t){
    const delb = document.createElement('button');
    delb.textContent = "Delete Response";
    delb.type = "button";
    delb.onclick = function(){
        if(!confirm("Are you sure you want to delete this response?")) return;

        const responsekey = `responses_${formId}`;
        let responses = JSON.parse(localStorage.getItem(responsekey) || []);
        
        responses.splice(index,1);
        localStorage.setItem(responsekey,JSON.stringify(responses));
        loadResponses(formId,t);
    }
    return delb;
}