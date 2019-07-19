let current_collection_name = "";
const filter_colors = {
  filter_1: 'color: green',
  filter_2: 'color: gold',
  filter_3: 'color: red',
  filter_4: 'color: pink',
  filter_5: 'color: yellow',
}

const data_store = {
  documents: [] // will hold all docs w/ findAll filter once xhr req made
}

AFRAME.registerComponent('raycast-info', {
  init: function () {
    this.el.addEventListener('raycaster-intersected', function (evt) {
      var el = evt.target;
      el.setAttribute('material', 'color: #333; opacity: 1.0');
    });

    this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
      var el = evt.target;
      el.setAttribute('material', 'color: white; opacity: 0.5');

    });
  }
});

AFRAME.registerComponent('load-document-event', {
    schema: { },
    init: function () {
      var data = this.data;
      var el = this.el; 
      this.el.setAttribute("visible",false);
      
      $('.collection-box').click((el) => { 
        const collectionName = el.target.parentEl.id;
        current_collection_name = collectionName;

        const boxColor = el.target.getAttribute("material")['color'];

        fetch("/collections/" + collectionName, {
          method: "GET",
          credentials: "same-origin"
        })
        .then((response) => {
          response.json().then((data) => {
            loadDocumentView(collectionName, data, boxColor);
            data_store.documents = JSON.parse(data.data);
          })
        })
        .catch((error) => {
          console.log('error: \t', error);
        })
      })
  
    }
  });
const renderDocumentsToPage = (myData, x, z, maxColumns) => {
    const documentWrapper = $('.documents-wrapper');

    let documentString = `<a-entity id="matching-documents"  position="-4 -3 4" animation="property: position; to: -4 1 4; dur: 1500">`;

    if (myData.length === 0) {
        documentString += `<a-text align="center" position="-1 1 0" scale="2 2 2" side="double" value="No matching documents!"></a-text>`;
    } else {

        myData.forEach((doc, i) => {
            const stringified_doc = JSON.stringify(doc, null, 4).replace(/'/g, /"/);
            const htmlDocumentString = `
                <a-entity id="documentid-${i}" position="${x} 0 ${z}">
                    <a-text value="${doc.name.slice(0,18)}" align="center" position="0 1.3 0" side="double"></a-text>
                    <a-entity mixin="doc" raycast-info></a-entity>
                    <a-text value='${stringified_doc}' align="left" position="-0.35 0.9 0.5" side="double" height="1.3" width="0.7" baseline="top"></a-text>
                </a-entity>`;
            if ((i + 1) % maxColumns === 0) {
                x = -maxColumns + 1;
                z -= 2;
            } else {
                x += 2;
            }
            documentString += htmlDocumentString;
        });
    }

    documentString += `</a-entity>`;
    documentWrapper.html(documentString);

}
const loadDocumentView = (collectionName, data, collectionColor) => {
  $('.collection-wrapper').each((index, element) => {
    // element.setAttribute('visible',false);
    element.remove();

  })
  $('#skunkwrap').remove();
  $("#collectionlight").remove();
  $("#collectioncamera").remove();
  const cameraString = `
      <a-camera id="documentcamera" 
          position="-4 2.8 6" 
          look-controls 
          wasd-controls="acceleration: 250" 
          user-height="0"
      >
          <a-cursor raycaster="position: 0 0 1"></a-cursor>
      </a-camera>`;
  $("a-scene").append(cameraString);

  const documentWrapper = $('.documents-wrapper');


    const maxColumns = 5;
    let x = -1 * maxColumns + 1; // x position
    let y = 1; // y position
    let z = -1; // z position
    d = JSON.parse(data.data);

    renderDocumentsToPage(d, x, z, maxColumns);

    const zDepth = - Math.ceil(d.length / maxColumns) - 8;

    const exitDoorHtmlString = `
    <a-entity id="exit-doorway"  position="7 0 ${zDepth}" rotation="0 320 0">
            <a-entity gltf-model="#door" scale="1.5 1.5 1.5" animation-mixer="clip: *;"></a-entity>
            <a-text position="-2 3.5 0.8" scale="2.2 2.2 2.2"  value="EXIT COLLECTION" side="double"></a-text>

            <a-entity position="1.9 1.4 0.1">
              <a-entity gltf-model="#picture-frame" scale="0.015 0.015 0.015"></a-entity>
              <a-plane src="#skunkapalooza" position="0 0.57 0.01" width="1.25" height="0.79"></a-plane>
            </a-entity>

        </a-entity>
    </a-entity>`;
    $("a-scene").append(exitDoorHtmlString);


    let filtersHTMLString = ``;

    if (data.filters !== "[]" && data.filters.length > 0) {
        let filters = JSON.parse(data.filters)[0][current_collection_name];
        let filterNames = filters.map((filter) => filter.name);
        let basePos = 3;

        filters.forEach((filter, i) => {
            const aParentEntityID = `filter-${i + 2}`;
            const filterIconID = `filter-icon-${i + 2}`;
            //const aEntityColourIndex = `filter_${i + 2}`;
            
            filtersHTMLString += `<a-entity id="${aParentEntityID}" position="${basePos} 0 0" class="filteration-group">
                    <a-entity id="${filterIconID}" datavalue="${filter.name}"  mixin="filter" rotation="180 0 0" material="color:white; opacity:0.2"></a-entity>
                    <a-text value="${filter.name}" scale="1.5 1.5 1.5" side="double" position="0 -0.2 1" align="center"></a-text>
                </a-entity>`;
          basePos += 3;
        });
    }

    // add "all" filter and any additional filters
    const allFilterString = `
        <a-entity id="filter-group" position="-7 5 -1">
            <a-entity id="filter-1" class="filteration-group">
                <a-entity id="filter-icon-1" datavalue="all" mixin="filter" rotation="180 0 0" material="${filter_colors.filter_1}; opacity:1"></a-entity>
                <a-text value="all" scale="1.5 1.5 1.5" side="double" position="0 -0.2 1" align="center"></a-text>
            </a-entity>
           ${filtersHTMLString}
        </a-entity>
        `;

    $("a-scene").append(allFilterString);


        


    const lightHtmlString = `<a-light type="point" color="${collectionColor}" position="0 25 1"></a-light>`;
    $("a-scene").append(lightHtmlString)
    $('#exit-doorway').click(() => {
      window.location.href = "/";
    })

    $(".filteration-group").click((event)=>{
        const documentWrapper = $('.documents-wrapper');
        const filterName = event.target.getAttribute("datavalue");
        const maxColumns = 5;
        const x = -1 * maxColumns + 1; // x position
        const y = 1; // y position
        const z = -1; // z position


        const resetFilters = () => {
          const resetMaterial = `color: white; opacity: 0.2`;

          $("#filter-icon-1").attr("material", resetMaterial);
          $("#filter-icon-2").attr("material", resetMaterial);
          $("#filter-icon-3").attr("material", resetMaterial);
          $("#filter-icon-4").attr("material", resetMaterial);
        };

        resetFilters();
        if (event.target.id === "filter-icon-1") {
            $("#filter-icon-1").attr("material", `${filter_colors.filter_1}; opacity: 1`);  // set filter as active
            documentWrapper.html('') // set scene to have no documents 
            renderDocumentsToPage(data_store.documents, x, z, maxColumns)
        } else if (event.target.id === "filter-icon-2"){
            $("#filter-icon-2").attr("material", `${filter_colors.filter_2}; opacity: 1`);  // set filter as active
            requestFilteredDocuments(filterName)
        } else if (event.target.id === "filter-icon-3"){
            $("#filter-icon-3").attr("material", `${filter_colors.filter_3}; opacity: 1`);  // set filter as active
            requestFilteredDocuments(filterName)
        } else if (event.target.id === "filter-icon-4"){
            $("#filter-icon-4").attr("material", `${filter_colors.filter_4}; opacity: 1`);  // set filter as active
            requestFilteredDocuments(filterName)
        }
    })
}


async function requestFilteredDocuments(filterName){
  const documentWrapper = $('.documents-wrapper');

  const maxColumns = 5;
  const x = -1 * maxColumns + 1; // x position
  const y = 1; // y position
  const z = -1; // z position
  await fetch(`/collections/${current_collection_name}?filter=${filterName}`).then((res) => {
    res.json().then((response) => {
      const myData = JSON.parse(response.data);
      documentWrapper.html('') // set scene to have no documents 
      renderDocumentsToPage(myData, x, z, maxColumns)
    })

  })
}
