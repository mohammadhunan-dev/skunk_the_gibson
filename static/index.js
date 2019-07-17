console.log('hello from static/index.js!!' );

AFRAME.registerComponent('initial-scene-load-event', {
    schema: {
      color: {default: 'orange'}
    },

    init: function () {
   
        fetch("/collections/", { method: "POST", credentials: "same-origin"}).then((response) => {
            response.json().then((data) => {
                console.log(data)
            })
        })
    }
  });


AFRAME.registerComponent('load-document-event', {
    schema: { },
    init: function () {
      console.log('================== LOAD DOCUMENT EVENT =====================')
      var data = this.data;
      var el = this.el; 
      this.el.setAttribute("visible",false);
      
      $('.collection-box').click((el) => { 
        const collectionName = el.target.getAttribute("datnvalue");


        fetch("/collections/" + collectionName, {
          method: "POST",
          credentials: "same-origin"
        })
        .then((response) => {
          response.json().then((data) => {
            switchScene(collectionName, data);

          })
        })
        .catch((error) => {
          console.log('error: \t', error);
        })
      })
  
    }
  });

const switchScene = (collectionName, data) => {
  $('.collection-wrapper').each((index, element) => {
    // element.setAttribute('visible',false);
    element.remove();
  
  })
  const documentWrapper = $('.documents-wrapper');


    const maxColumns = 5;
    let x = -1 * maxColumns + 1; // x position
    let y = 1; // y position
    let z = -1; // z position


    data.data.forEach((document, i) => {
      const stringified_doc = JSON.stringify(document);
      console.log('stringif', stringified_doc)

      const htmlDocumentString = `<a-entity id="documentid-${i}" documentdata='${stringified_doc}' class="document-box" mixin="cube" position="${x} 1 ${z}">
      <a-text value="${document.name}"  align="center" position="0 1.3 0" side="double"></a-text>
      <a-entity mixin="doc" raycast-info></a-entity>
      <a-text value="toppings:\n\t\t${document.toppings}\n\nstyle:\n\t\t${document.style}\n" align="left" position="-0.35 0.8 0.5" side="double" height="1.2" width="0.6" tabSize="4"></a-text>
      <a-entity mixin="cube"></a-entity>
  </a-entity>`;
      if((i + 1) % maxColumns === 0){
        x = -maxColumns + 1;
        z -= 2;
      }else{
        x += 2;
      }
    documentWrapper.html(documentWrapper.html() + htmlDocumentString)
    })
}


