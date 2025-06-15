document.addEventListener('DOMContentLoaded',()=>{

    const formId = window.location.hash.slice(1);
    const saved = localStorage.getItem(`form_${formId}`);
    if(!saved){
        alert("Form not found!");
        window.location.href = "index.html";
        return;
    }
    const formdata = JSON.parse(saved);
    
    const surveyform = document.getElementById("surveyform");
    document.title = formdata[0].value;
    const titlediv = document.createElement('div');
    titlediv.className = 'titlediv';
    const title = document.createElement('h1');
    title.textContent = formdata[0].value;
    title.id = 'page_title';
    titlediv.appendChild(title);
    surveyform.appendChild(titlediv);

    const ncounter = {};
    const FieldNameMap=[];
    formdata.slice(1).forEach(field => {
        let name = field.value;
        if(ncounter[name] === undefined){
            ncounter[name] = 1;
        }else{
            ncounter[name]++;
            name = `${name}_${ncounter[name]}`;
        }
        FieldNameMap.push({
            original: field.value,
            name: name,
            type: field.type,
            options: field.options
        })
        const formgroup = document.createElement('div');
        formgroup.className='form-group';
        if(field.type=='BigHead'){
            const bh = document.createElement('h1');
            bh.textContent = field.value;
            bh.className = 'BigHead';
            formgroup.appendChild(bh);
            surveyform.appendChild(formgroup);
            return;
        }
        if(field.type=='SmallHead'){
            const sh = document.createElement('h3');
            sh.textContent = field.value;
            sh.className = 'SmallHead';
            formgroup.appendChild(sh);
            surveyform.appendChild(formgroup);
            return;
        }
        if(field.type=='Para'){
            const para = document.createElement('p');
            para.textContent = field.value;
            para.className = 'Para';
            formgroup.appendChild(para);
            surveyform.appendChild(formgroup);
            return;
        }
        if(field.type=='hr'){
            const newl = document.createElement('hr');
            newl.className='line';
            surveyform.appendChild(newl);
            return;
        }
        const label = document.createElement('label');
        label.textContent = field.value;
        label.className = field.type;
        label.setAttribute('for',`${name}_input`);
        formgroup.appendChild(label);

        if(field.type=='textInput'){
            const input = document.createElement('input');
            input.type = 'text';
            input.name = name;
            input.id = `${name}_input`;
            input.className = 'TextInputBox';
            formgroup.appendChild(input); 
        }
        else if(field.type=='textArea'){
            const input = document.createElement('textarea');
            input.name = name;
            input.id = `${name}_input`;
            input.className = 'TextAreaBox';
            formgroup.appendChild(input); 
        }
        else if(field.type=='select'){
            const selectWrapper = document.createElement('div');
            selectWrapper.className = 'row';
            const select = document.createElement('select');
            select.className = 'SelectBox';
            select.name = name;
            select.id = `${name}_input`;
            const defaultopt = document.createElement('option');
            defaultopt.textContent = "Select Options";
            defaultopt.value = "";
            defaultopt.selected = true;
            defaultopt.disabled = true;
            select.append(defaultopt);
            field.options.forEach(i=>{
                const option = document.createElement('option');
                option.textContent = i;
                option.value = i;
                select.appendChild(option);
            })
            selectWrapper.appendChild(select);
            formgroup.appendChild(selectWrapper); 
        }
        else if(field.type=='radio'){
            field.options.forEach(i=>{
                const radioWrapper = document.createElement('div');
                radioWrapper.className = 'row';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = name;
                radio.value = i;
                radio.id = name + "_" + i;
                const radioLabel = document.createElement('label');
                radioLabel.textContent = i;
                radioLabel.setAttribute('for',radio.id);
                radioWrapper.appendChild(radio);
                radioWrapper.appendChild(radioLabel);
                formgroup.appendChild(radioWrapper);
            }) 
        }
        else if(field.type=='checkbox'){
            field.options.forEach(i=>{
                const cbWrapper = document.createElement('div');
                cbWrapper.className = 'row';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.name = `${name}[]`;
                cb.value = i;
                cb.id = name + "_" + i;
                const cbLabel = document.createElement('label');
                cbLabel.textContent = i;
                cbLabel.setAttribute('for',cb.id);
                cbWrapper.appendChild(cb);
                cbWrapper.appendChild(cbLabel);
                formgroup.appendChild(cbWrapper);
            }) 
        }
    surveyform.appendChild(formgroup);
    });
    const bdiv = document.createElement('div');
    bdiv.className = 'buttonclass';
    const button = document.createElement('button');
    button.textContent = "Submit";
    button.type = 'submit';
    bdiv.append(button);
    surveyform.appendChild(bdiv);

    surveyform.addEventListener('submit',(e)=>{
        e.preventDefault();
        const responses = {};

        FieldNameMap.forEach(i=>{
            if(i.type === 'textInput' || i.type === 'textArea' || i.type === 'select'){
                const el = document.getElementById(`${i.name}_input`);
                responses[i.original] = el? el.value: '';
            }
            else if(i.type === 'radio'){
                const sel = document.querySelector(`input[name="${i.name}"]:checked`);
                responses[i.original] = sel?sel.value: '';
            }
            else if(i.type === 'checkbox'){
                const cbs = document.querySelectorAll(`input[name="${i.name}[]"]:checked`);
                responses[i.original] = Array.from(cbs).map(f=>f.value);
            }
        })
        console.log("Responses submitted: ", responses);
        const storage = `responses_${formId}`;
        let submission = JSON.parse(localStorage.getItem(storage)) || [];
        submission.push(responses);
        localStorage.setItem(storage,JSON.stringify(submission));

        button.disabled = true;
        let success = document.getElementById('success');
        if(!success){
            success = document.createElement('p');
            success.id = 'success';
            success.style.color = 'green';
            surveyform.appendChild(success);
        }
        success.textContent = "Form Submitted Successfully!";
        success.style.textAlign = 'center';
        surveyform.reset();
        setTimeout(()=>{
            button.disabled = false;
            success.textContent = '';
        },500);
    });
})