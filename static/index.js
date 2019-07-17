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
    schema: {
      color: {default: 'orange'}
    },

    init: function () {
      var data = this.data;
      var el = this.el;  // <a-box>
      var defaultColor = el.getAttribute('material').color;

      el.addEventListener('click', function (ev) {
        // mouse enter and or click
        console.log('doc',document.querySelector('a-entity'))
        document.querySelector('a-entity').setAttribute('environment',"preset: goldmine; skyType: atmosphere")
        fetch("/documents/", { method: "POST", credentials: "same-origin"}).then((response) => {
            response.json().then((data) => {
                console.log(data)
            })
        })
        el.setAttribute('color', "orange");
      });

      el.addEventListener('mouseleave', function () {
        // mouse exit
        el.setAttribute('color', defaultColor);
      });
  
    }
  });

