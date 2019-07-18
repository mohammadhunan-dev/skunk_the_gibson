console.log('hello from static/index.js!!' );


AFRAME.registerComponent('raycast-info', {
  init: function () {
    this.el.addEventListener('raycaster-intersected', function (evt) {
      var el = evt.target;
// May get two intersection events per tick; same element, different faces.
      el.setAttribute('material', 'color', '#7f7');
    });

    this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
      var el = evt.target;
// May get two intersection events per tick; same element, different faces.
      el.setAttribute('material', 'color', 'white');
    });
  }
});

AFRAME.registerComponent('initial-scene-load-event', {
    schema: {
      color: {default: 'orange'}
    },

    init: function () {
        console.log("initial-scene-load-event init"); 
        fetch("/", { method: "GET", credentials: "same-origin"}).then((response) => {
            response.json().then((data) => {
                console.log(data)
            })
        })
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

          })
        })
        .catch((error) => {
          console.log('error: \t', error);
        })
      })
  
    }
  });

const loadDocumentView = (collectionName, data) => {
  $('.collection-wrapper').each((index, element) => {
    // element.setAttribute('visible',false);
    element.remove();

  })
  $('#skunkwrap').remove();
  $("#collectionlight").remove();
  $("#collectioncamera").remove();
  const cameraString = `<a-entity id="documentcamera" movement-controls="fly: true" position="-3 3 4">
  <a-entity camera position="0 1 4" 
    look-controls="pointerLockEnabled: true" 
    wasd-controls="acceleration:200"
    >
  </a-entity>
</a-entity>`;
  $("a-scene").append(cameraString)

  const documentWrapper = $('.documents-wrapper');


    const maxColumns = 5;
    let x = -1 * maxColumns + 1; // x position
    let y = 1; // y position
    let z = -1; // z position

    d = JSON.parse(data.data);
    d.forEach((doc, i) => {
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
    <a-entity id="filter-1">
      <a-entity mixin="filter" rotation="180 0 0" material="color: green"></a-entity>
      <a-text value="all" scale="1.5 1.5 1.5" side="double" position="0 1.2 0" align="center"></a-text>
    </a-entity>

    <a-entity id="filter-2" position="3 0 0">>
      <a-entity mixin="filter" rotation="180 0 0" material="color: gold"></a-entity>
      <a-text value="cheese" scale="1.5 1.5 1.5" side="double" position="0 1.2 0" align="center"></a-text>
    </a-entity>
    <a-entity id="filter-3" position="6 0 0">
      <a-entity mixin="filter" rotation="180 0 0" material="color: red"></a-entity>
      <a-text value="$gte 6 stars" scale="1.5 1.5 1.5" side="double" position="0 1.2 0" align="center"></a-text>
    </a-entity>
  </a-entity>
    `;
    $("a-scene").append(filterGroupString);

    const lightHtmlString = `<a-light type="point" color="blue" position="0 25 1"></a-light>`;
    $("a-scene").append(lightHtmlString)



}

const loadCollectionView = () => { 
  // switch back to collection view
}

const generateDoor = () => {

}
