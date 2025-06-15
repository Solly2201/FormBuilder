const builder = document.getElementById('formbox');
let submit = null;
const drags = document.querySelectorAll('.draggable');

drags.forEach(i=> {
    i.addEventListener('dragstart', dragStart);
})

builder.addEventListener('dragover',dragOver);
builder.addEventListener('drop', drop);

const fmap = {
    'big-heading':()=>createElement('text', 'BigHeadDiv','BigHeadInput', 'Click To Edit Big Text'),
    'small-heading':()=>createElement('text', 'SmallHeadDiv','SmallHeadInput', 'Click To Edit Small Text'),
    'paragraph':()=>createElement('text', 'ParaDiv','ParaInput', 'Write Paragraph/Description'),
    'text':()=>createEditableInput('text', 'TextInputDiv','label-edit', 'Text Input Label'),
    'textarea':()=>createEditableInput('textarea', 'TextAreaDiv','label-edit', 'Text Area Label'),
    'select':()=>createMCQ('select', 'SelectDiv'),
    'radio':()=>createMCQ('radio', 'RadioDiv'),
    'checkbox':()=>createMCQ('checkbox', 'CBDiv'),
    'hr':()=>createLine()
};

function dragStart(e){
    e.dataTransfer.setData('type', e.target.getAttribute('data-type'));
}

function drop(e){
    e.preventDefault();
    const type = e.dataTransfer.getData('type');

    let createFn = fmap[type];
    
    if(createFn){
        let newElement = createFn();
        if(submit && builder.contains(submit)){
            builder.insertBefore(newElement, submit);
        }else{
            builder.appendChild(newElement);
        }
        makeElementDraggable(newElement);
        toggleSubmitButton();
    }
}

function createElement(type, divClass, inputClass, defaultValue = "Click to Edit"){
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add(divClass);
    div.classList.add('form-element');

    const labelInput = document.createElement('input');
    labelInput.type = type;
    labelInput.classList.add(inputClass);
    labelInput.placeholder = defaultValue;

    div.appendChild(labelInput);

    const deleteButton = createDeleteButton();
    div.appendChild(deleteButton);

    return div;
}

function createEditableInput(type, divClass, inputClass, defaultValue = "Input Label"){
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add('form-element');
    div.classList.add(divClass);
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add(inputClass);
    labelInput.placeholder = defaultValue;

    let InputElement;
    if(type=="textarea"){
        InputElement = document.createElement('textarea');
    }
    else{
        InputElement = document.createElement('input');
        InputElement.type = type;
    }
    
    InputElement.placeholder = 'Sample Field for Submissions';
    InputElement.disabled = true;

    div.appendChild(labelInput);
    div.appendChild(InputElement);
    const deleteButton = createDeleteButton();
    div.appendChild(deleteButton);

    return div;
}

function createDeleteButton(){
    const delb = document.createElement('button');
    delb.textContent = "Delete";
    delb.type = "button";
    delb.onclick = function(){
        this.parentElement.remove();
        toggleSubmitButton();
    }
    return delb;
}

function createOption(text){
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option-edit');

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.placeholder = text;

    const delb = document.createElement('button');
    delb.textContent = "Remove Option";
    delb.type = "button";
    delb.onclick = function(){
        optionDiv.remove();
    }
    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(delb);

    return optionDiv;
}

function createLine(){
    const line = document.createElement('div');
    line.setAttribute('draggable',true);
    line.classList.add('form-element','linediv');
    const inl = document.createElement('input');
    inl.value = "---A line will be placed here---";
    inl.style.textAlign = 'center';
    inl.disabled = true;
    line.appendChild(inl);
    const deleteButton = createDeleteButton();
    line.appendChild(deleteButton);
    return line;
}
function createMCQ(type, divName){
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add('form-element', divName);

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('label-edit');
    labelInput.placeholder = 'Edit this ' + type.charAt(0).toUpperCase() + type.slice(1) + ' Label';

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    const defaultoption = createOption('Option 1');
    optionsContainer.appendChild(defaultoption);

    const addOptionButton = document.createElement('button');
    addOptionButton.type = 'button';
    addOptionButton.textContent = 'Add Option';

    addOptionButton.onclick = ()=> {
        const newopt = createOption(`Option ${optionsContainer.children.length + 1}`);
        optionsContainer.appendChild(newopt);
    }
    const deleteButton = createDeleteButton();
    div.appendChild(labelInput);
    div.appendChild(optionsContainer);
    div.appendChild(addOptionButton);
    div.appendChild(deleteButton);

    return div;
}

function toggleSubmitButton(){
    const hasItems = builder.querySelectorAll('.form-element').length>0;
    if(hasItems){
        if(!submit){
            submit = document.createElement('button');
            submit.textContent = "Submit";
            submit.type = 'button';
            submit.classList.add('submit-button');
            submit.onclick = handleSubmit;
        }
        if(!builder.contains(submit)) builder.appendChild(submit);
    }
    else{
        if(submit && builder.contains(submit)) submit.remove();
        submit = null;
    }
    
}

function handleSubmit(){
    const titleInput = document.getElementById("titlee").value;
    if(titleInput.trim() === '') return alert("Please Enter Form Title");
    const formdata = [{
        type:'title',
        value: titleInput
    }];
    Array.from(builder.children).forEach((child)=>{
        if ((child.classList.contains('BigHeadDiv') && child.querySelector('.BigHeadInput')) || 
            (child.classList.contains('SmallHeadDiv') && child.querySelector('.SmallHeadInput')) ||
            (child.classList.contains('ParaDiv') && child.querySelector('.ParaInput'))
        ){
            let label = '';
            let elementType = '';
            if(child.querySelector('.BigHeadInput')){
                label = child.querySelector('.BigHeadInput').value;
                elementType = 'BigHead';
            }
            if(child.querySelector('.SmallHeadInput')){
                label = child.querySelector('.SmallHeadInput').value;
                elementType = 'SmallHead';
            }
            if(child.querySelector('.ParaInput')){
                label = child.querySelector('.ParaInput').value;
                elementType = 'Para';
            }

            formdata.push({
                value: label,
                type: elementType
            });
        }
        else if (child.classList.contains('TextInputDiv') || child.classList.contains('TextAreaDiv'))
            {
                const label = child.querySelector('.label-edit').value;
                let elementType = '';
                if(child.classList.contains('TextInputDiv')) elementType = 'textInput';
                if(child.classList.contains('TextAreaDiv')) elementType = 'textArea';

            formdata.push({
                value: label,
                type: elementType
            });
            }
        else if (child.classList.contains('SelectDiv') || child.classList.contains('RadioDiv') ||
                child.classList.contains('CBDiv'))
            {
                const label = child.querySelector('.label-edit').value;
                const optionvalues = [];

                const AllOptionsList = child.querySelector('.options-container')
                const options = AllOptionsList.querySelectorAll('.option-edit');

                options.forEach(i=>{
                    optionvalues.push(i.querySelector('input').value);
                })
                let elementType = '';
                if(child.classList.contains('SelectDiv')) elementType = 'select';
                if(child.classList.contains('RadioDiv')) elementType = 'radio';
                if(child.classList.contains('CBDiv')) elementType = 'checkbox';
            formdata.push({
                value: label,
                type: elementType,
                options: optionvalues
            });
        }
        else if(child.classList.contains('linediv')){
            formdata.push({type: 'hr'})
        }
    })
    const formId = Math.random().toString(36).substring(2, 8);
    localStorage.setItem(`form_${formId}`,JSON.stringify(formdata));
    window.location.href = `form.html#${formId}`;

}
function makeElementDraggable(el){
    el.setAttribute('draggable', true);
    el.addEventListener('dragstart', function(e){
        e.target.classList.add('dragging');
    })
    el.addEventListener('dragend', function(e){
        e.target.classList.remove('dragging');
    })
}

function dragOver(e){
    e.preventDefault();
    const afterElement = getDragAfterElement(builder,e.clientY);
    const draggable = document.querySelector('.dragging');

    if(!draggable) return;

    if(afterElement == null){
        if(submit && builder.contains(submit)){
            builder.insertBefore(draggable, submit);
        }else{
            builder.appendChild(draggable);
        }
    }
    else{
        builder.insertBefore(draggable, afterElement);
    }
}

function getDragAfterElement(container, y){
    const draggableElement = [...container.querySelectorAll('.form-element:not(.dragging)')];
    return draggableElement.reduce((closest, child)=>{
        const box = child.getBoundingClientRect();
        let offset = y - box.top - box.height/2;

        if(offset<0 && offset>closest.offset){
            return{offset:offset, element:child};
        }
        else{
            return closest;
        }
    },{offset: Number.NEGATIVE_INFINITY, element: null}).element;
}