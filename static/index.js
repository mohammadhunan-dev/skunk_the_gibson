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
    element.setAttribute('visible',false);
  })
  const documentWrapper = $('.documents-wrapper');

    data.data.forEach((document) => {
      const htmlDocumentString = `<a-entity class="document-box" mixin="cube" position="${Math.random()} 1 0">
      <a-text value="${document.name}" position="-1 1 0"></a-text>
      <a-entity mixin="cube"></a-entity>
  </a-entity>`;

      documentWrapper.html(documentWrapper.html() + htmlDocumentString)

    })

    

//   $('.collection-wrapper').each((el,element) => {
//     element.setAttribute('visible', false)

//     const documentWrapper = $('.documents-wrapper');
//     //   const entityWrap = document.createElement('a-entity');
//     //   entityWrap.className = "foobar";
//     //   entityWrap.setAttribute("mixin", "cube");
//     // documentWrapper.append(entityWrap);
//     //   entityWrap.setAttribute("position", "-4 1 -4");


//     //     const aText = document.createElement("a-text");
//     //     aText.setAttribute("value", "name-placeholder");
//     //     const aMixinBox = document.createElement('a-mixin');
//     //     aMixinBox.setAttribute("id", "cube");
//     //     aMixinBox.setAttribute("geometry", "primitive: box");
//     //   entityWrap.appendChild(aText);
//     //   entityWrap.appendChild(aMixinBox);
//     //     aText.setAttribute('position', "-4 1 -4" );
//     //     aMixinBox.setAttribute('position', "-4 1 -4");











//     documentWrapper.append("a-entity")
//     let htmlString = `<a-entity class="foobar" mixin="cube" position="-4 1 -4">
//     <a-text value="name-placeholder" position="-4 1 -4"></a-text>
//     <a-entity mixin="cube"></a-entity>
// </a-entity>`;
//     documentWrapper.html(htmlString)

//   })
}