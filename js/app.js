const loadAIUniverse = (dataLimit) =>{
    const url = `https://openapi.programming-hero.com/api/ai/tools`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        displayAIUniverse(data.data.tools, dataLimit)});
}

// Display Data:
displayAIUniverse = (aiData, dataLimit) =>{
    const aiSection = document.getElementById("ai-Section");
    aiSection.textContent = '';
    const showAll = document.getElementById("show-all");
    if(dataLimit && aiData.length > 6){
        aiData = aiData.slice(0,6);
        showAll.classList.remove('d-none');
    }
    else{
        showAll.classList.add('d-none');
    }

    aiData.forEach(aiInfo =>{
        const aiDiv = document.createElement('div');
        aiDiv.classList.add('col');
        aiDiv.innerHTML = `
        <div class="card h-100 p-4">
            <img src="${aiInfo.image}" class="card-img-top rounded" alt="...">
            <div class="card-body">
                <h5 class="card-title">Features</h5>
                <ol> ${aiInfo.features.map(feature => `<li>${feature}</li>`).join(' ')}</ol>
                <hr>
                <div>
                    <div class='d-flex justify-content-between'>
                        <div>
                            <h5>${aiInfo.name}</h5>
                            <p class='mt-3'><span class='me-2'><i class="fa-solid fa-calendar-days"></i></span> ${aiInfo.published_in}</p>
                        </div>
                        <button onclick="loadSingleData('${aiInfo.id}')" class="border-0 rounded-circle mt-3" data-bs-toggle="modal" data-bs-target="#aiDetailModal" style='height: 24px'><i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
        `
        aiSection.appendChild(aiDiv);
    });
    // Stop spinner or loader
    toggleSpinner(false);
}

const process = (dataLimit) =>{
    toggleSpinner(true);
    loadAIUniverse(dataLimit)
}

// Toggle Spinner:
const toggleSpinner = isLoading => {
    const loaderSection= document.getElementById("loader");
    if(isLoading){
        loaderSection.classList.remove('d-none')
    }
    else{
        loaderSection.classList.add('d-none')
    }
} 

// btn-show-all:
document.getElementById('btn-show-all').addEventListener('click', function(){
    process();
})

const loadSingleData = async id => {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displaySingleDataDetails(data.data);
}

const displaySingleDataDetails = info => {
    const modalTitle = document.getElementById("aiDetailModalLabel");
    const dataDetails = document.getElementById("data-details");
    dataDetails.classList.add('col', 'p-3');
    dataDetails.innerHTML = `
    <div class="border border-danger rounded p-3" style='background: rgba(235, 87, 87, 0.05)'>
        <h6>${info.description}</h6>
        <div class="d-flex flex-column flex-md-row justify-content-between gap-2 mt-4 text-center">
            <div class="p-2" style='background: #FFFFFF'>
                <h6 class="text-success">${info?.pricing?.[0]?.price || 'Free of Cost/'} <br> <span>${info.pricing?.[0].plan || 'Basic'}</span></h6>
            </div>
            <div class="p-2" style='background: #FFFFFF'>
                <h6 class="text-warning">${info?.pricing?.[1]?.price || 'Free of Cost/'} <br> <span>${info.pricing?.[1].plan || 'Pro'}</span></h6>
            </div>
            <div class="p-2" style='background: #FFFFFF'>
                <h6 class="text-danger">${info?.pricing?.[2]?.price || 'Free of Cost/'} <br> <span>${info.pricing?.[2].plan || 'Enterprise'}</span></h6>
            </div>
        </div>
        <div class="d-flex justify-content-between mt-4">
            <div>
                <h5>Features</h5>
                <ul>
                    <li>${info.features["1"]["feature_name"]}</li>
                    <li>${info.features["2"]["feature_name"]}</li>
                    <li>${info.features["3"]["feature_name"]}</li>
                    <li class="${info?.features?.["4"]?.["feature_name"] === undefined ? 'd-none' : 'list-style-type: disc'}">${info?.features?.["4"]?.["feature_name"] || ''}</li>
                </ul>
            </div>
            <div>
                <h6>Integrations</h6>
                <ul> ${info?.integrations?.map(integration => `<li>${integration}</li>`).join(' ') ||'No data Found'}</ul>
            </div>
        </div>
    </div>
    <div class="border rounded p-3">
        <div class="position-relative">
            <img src="${info.image_link?.[0]}" class="card-img-top rounded" alt="...">
            <p class="${info.accuracy?.["score"] === null ? 'd-none' : 'bg-danger text-white rounded position-absolute top-0 end-0 px-2 py-1' }">${info.accuracy?.["score"] ? info.accuracy["score"] * 100 + `% accuracy` : ''}</p>
        </div>
        <h6 class="text-center mt-4">${info.input_output_examples?.[0].input || 'Can you give any example?'}</h6>
        <p class="text-center">${info.input_output_examples?.[0].output || 'No! Not yet! Take a break!!!'}</p>
    </div>
    `
}

const sortByDate = () => {
    document.getElementById('loader').classList.remove('d-none');
    const url = 'https://openapi.programming-hero.com/api/ai/tools'
    fetch(url)
    .then( res => res.json())
    .then(data => {
        
        document.getElementById('loader').classList.add('d-none');
        const aiData = data.data.tools;
        aiData.sort((a,b) => new Date(b.published_in) - new Date(a.published_in));
        displayAIUniverse(aiData);
        
    })
}

loadAIUniverse(6);