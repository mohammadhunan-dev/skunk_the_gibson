console.log('hello from static/index.js!!' );
const filter_colors = {
  filter_1: 'color: green',
  filter_2: 'color: gold',
  filter_3: 'color: red'
}

const data_store = {
  documents: [] // will hold all docs w/ findAll filter once xhr req made
}

AFRAME.registerComponent('raycast-info', {
  init: function () {
    this.el.addEventListener('raycaster-intersected', function (evt) {
      var el = evt.target;
// May get two intersection events per tick; same element, different faces.
      el.setAttribute('material', 'color: green; opacity: 1.0');
    });

    this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
      var el = evt.target;
// May get two intersection events per tick; same element, different faces.
      el.setAttribute('material', 'color: white; opacity: 0.5');
    });
  }
});

AFRAME.registerComponent('initial-scene-load-event', {
    schema: {
      color: {default: 'orange'}
    },

    init: function () {
        console.log("initial-scene-load-event init"); 
        // fetch("/", { method: "GET", credentials: "same-origin"}).then((response) => {
        //     response.json().then((data) => {
        //         console.log(data)
        //     })
        // })
    }
  });

// renders modal with document's data fields
AFRAME.registerComponent('document-modal', {

});

AFRAME.registerComponent('load-document-event', {
    schema: { },
    init: function () {
      console.log('================== LOAD DOCUMENT EVENT =====================')
      var data = this.data;
      var el = this.el; 
      this.el.setAttribute("visible",false);
      
      $('.collection-box').click((el) => { 
        const collectionName = el.target.parentEl.id;

        fetch("/collections/" + collectionName, {
          method: "GET",
          credentials: "same-origin"
        })
        .then((response) => {
          response.json().then((data) => {
            loadDocumentView(collectionName, data);
            data_store.documents = JSON.parse(data.data);
            // debugger;

          })
        })
        .catch((error) => {
          console.log('error: \t', error);
        })
      })
  
    }
  });
const renderDocumentsToPage = (myData,x,z, maxColumns) => {
  const documentWrapper = $('.documents-wrapper');

  myData.forEach((doc, i) => {
    const stringified_doc = JSON.stringify(doc);
    console.log('stringif', stringified_doc)
    const htmlDocumentString = `<a-entity id="documentid-${i}" documentdata='${stringified_doc}' class="document-box" mixin="cube" position="${x} 1 ${z}">
    <a-text value="${doc.name}"  align="center" position="0 1.3 0" side="double"></a-text>
    <a-entity mixin="doc" raycast-info></a-entity>
    <a-text value="toppings:\n\t\t${doc.toppings}\n\nstyle:\n\t\t${doc.style}\n" align="left" position="-0.35 0.8 0.5" side="double" height="1.2" width="0.6" tabSize="4"></a-text>
    <a-entity mixin="cube"></a-entity>
</a-entity>`;
    if ((i + 1) % maxColumns === 0) {
      x = -maxColumns + 1;
      z -= 2;
    } else {
      x += 2;
    }
    documentWrapper.html(documentWrapper.html() + htmlDocumentString)
  })
}
const loadDocumentView = (collectionName, data) => {
  $('.collection-wrapper').each((index, element) => {
    // element.setAttribute('visible',false);
    element.remove();

  })
  $('#skunkwrap').remove();
  $("#collectionlight").remove();
  $("#collectioncamera").remove();
  const cameraString = `
      <a-camera id="documentcamera" 
          position="-3 2.8 8" 
          look-controls 
          wasd-controls="acceleration: 250" 
          user-height="0"
      >
          <a-cursor></a-cursor>
      </a-camera>`;
  $("a-scene").append(cameraString)

  const documentWrapper = $('.documents-wrapper');


    const maxColumns = 5;
    let x = -1 * maxColumns + 1; // x position
    let y = 1; // y position
    let z = -1; // z position

    d = JSON.parse(data.data);
  //   d.forEach((doc, i) => {
  //     const stringified_doc = JSON.stringify(doc);
  //     console.log('stringif', stringified_doc)
  //     const htmlDocumentString = `<a-entity id="documentid-${i}" documentdata='${stringified_doc}' class="document-box" mixin="cube" position="${x} 1 ${z}">
  //     <a-text value="${doc.name}"  align="center" position="0 1.3 0" side="double"></a-text>
  //     <a-entity mixin="doc" raycast-info></a-entity>
  //     <a-text value="toppings:\n\t\t${doc.toppings}\n\nstyle:\n\t\t${doc.style}\n" align="left" position="-0.35 0.8 0.5" side="double" height="1.2" width="0.6" tabSize="4"></a-text>
  //     <a-entity mixin="cube"></a-entity>
  // </a-entity>`;
      // if ((i + 1) % maxColumns === 0) {
      //   x = -maxColumns + 1;
      //   z -= 2;
      // } else {
      //   x += 2;
      // }
    // documentWrapper.html(documentWrapper.html() + htmlDocumentString)
    // })
    renderDocumentsToPage(d, x, z, maxColumns);

    const exitDoorHtmlString = `
    <a-entity id="exit-doorway"  position="7 0 ${z - 4}" rotation="0 320 0">
            <a-entity gltf-model="#door" scale="1.5 1.5 1.5" animation-mixer="clip: *;"></a-entity>
            <a-text position="-2 3.5 0.8" scale="2.2 2.2 2.2"  value="EXIT COLLECTION" side="double"></a-text>

            <a-entity position="1.9 1.4 0.1">
              <a-entity gltf-model="#picture-frame" scale="0.015 0.015 0.015"></a-entity>
              <a-plane src="#skunkapalooza" position="0 0.57 0.01" width="1.25" height="0.79"></a-plane>
            </a-entity>

        </a-entity>
    </a-entity>`;
    $("a-scene").append(exitDoorHtmlString);

    const filterGroupString = `
    <a-entity id="filter-group" position="-7 6 0">
    <a-entity id="filter-1" class="filteration-group">
      <a-entity id="filter-icon-1" datavalue="all" mixin="filter" rotation="180 0 0" material="${filter_colors.filter_1}"></a-entity>
      <a-text value="all" scale="1.5 1.5 1.5" side="double" position="0 1.2 0" align="center"></a-text>
    </a-entity>
    <a-entity id="filter-2" position="3 0 0" class="filteration-group">
      <a-entity id="filter-icon-2" datavalue="Vegetarian"  mixin="filter" rotation="180 0 0" material="${filter_colors.filter_2}"></a-entity>
      <a-text value="Vegetarian" scale="1.5 1.5 1.5" side="double" position="0 1.2 0" align="center"></a-text>
    </a-entity>
    <a-entity id="filter-3" position="6 0 0" class="filteration-group">
      <a-entity id="filter-icon-3" datavalue="$gte 6 stars" mixin="filter" rotation="180 0 0" material="${filter_colors.filter_3}"></a-entity>
      <a-text value="$gte 6 stars" scale="1.5 1.5 1.5" side="double" position="0 1.2 0" align="center"></a-text>
    </a-entity>
  </a-entity>
    `;

    
    $("a-scene").append(filterGroupString);

    const lightHtmlString = `<a-light type="point" color="blue" position="0 25 1"></a-light>`;
    $("a-scene").append(lightHtmlString)

    $(".filteration-group").click((event)=>{
      const documentWrapper = $('.documents-wrapper');
      const filterName = event.target.getAttribute("datavalue");
      const maxColumns = 5;
      let x = -1 * maxColumns + 1; // x position
      let y = 1; // y position
      let z = -1; // z position
  

      if(event.target.id === "filter-icon-1"){
        $("#filter-icon-1").attr("material","color:blue")  // set filter as active
        $("#filter-icon-2").attr("material", filter_colors.filter_2); // set other filter as default
        $("#filter-icon-3").attr("material", filter_colors.filter_3); // set other filter as default

        documentWrapper.html('') // set scene to have no documents 
        renderDocumentsToPage(data_store.documents, x, z, maxColumns)
      }else if(event.target.id === "filter-icon-2"){
        $("#filter-icon-1").attr("material", filter_colors.filter_1); // set filter as active
        $("#filter-icon-2").attr("material","color:blue"); // set other filter as default
        $("#filter-icon-3").attr("material", filter_colors.filter_3); // set other filter as default

        fetch(`/collections/pizza?filter=${filterName}`).then((data) => {
          data.json().then((response) => {
            console.log('response received', response)
            const myData = response.data;
            documentWrapper.html('') // set scene to have no documents 
            renderDocumentsToPage(myData, x, z, maxColumns)

          })
        })
      }else if(event.target.id === "filter-icon-3"){
        $("#filter-icon-1").attr("material", filter_colors.filter_1); // set filter as active
        $("#filter-icon-2").attr("material", filter_colors.filter_2); // set other filter as default
        $("#filter-icon-3").attr("material","color:blue"); // set other filter as default

        fetch(`/collections/pizza?filter=${filterName}`).then((data) => {
          data.json().then((response) => {
            console.log('response received', response)
            const myData = response.data;
            documentWrapper.html('') // set scene to have no documents 
            renderDocumentsToPage(myData, x, z, maxColumns)

          })
        })
      }
    })

}

const loadCollectionView = () => { 
  // switch back to collection view
}

const generateDoor = () => {

}
