import axios from 'axios';
import 'aframe';
import 'aframe-extras'

declare var AFRAME: any;

AFRAME.registerComponent('img4chan', { 

  async init () {
    const posts = (await axios.get('https://a.4cdn.org/a/thread/202427545.json')).data.posts;
    debugger;
    for (let post of posts) {
      if (post.tim) {
        // debugger;
      }
    }

    // debugger;

    // TODO: Images within the post seem not to be working, maybe there are too big?
    // Maybe try other cors proxies https://nordicapis.com/10-free-to-use-cors-proxies/

    const assets = document.querySelector("#assets");
    const scene = document.querySelector("#scene");
    // const imgTest = document.querySelector("#imgTest");

    const newAsset = document.createElement('img');
    newAsset.setAttribute("id", "img4chan")
    newAsset.setAttribute("src", "https://cors-anywhere.herokuapp.com/https://i.4cdn.org/a/1588378060081.jpg");
    newAsset.setAttribute("crossorigin", "anonymous");
    assets.appendChild(newAsset);
    // imgTest.setAttribute("src", "#imgTest");
    // debugger;

    // <a-image id="imgTest" class="intersectable" dragrable position="0 1.5 -2" width="2" height="1"></a-image>
    const newImage =document.createElement("a-image");
    newImage.setAttribute("position", "0 1.5 -2");
    newImage.setAttribute("width", "2");
    newImage.setAttribute("height", "1");
    newImage.setAttribute("src", "#img4chan");
    scene.appendChild(newImage);
  }

});

AFRAME.registerComponent('dragrable', { 
  init () {
    console.log("hello I'm dragable");
    this.scene = this.el.sceneEl;
    this.camera = this.scene.camera;
    this.obj = this.el.object3D;
    this.zPosition = this.el.object3D.position.z;
    this.color = this.el.getAttribute("color");

    this.fromIntersectionToOrigin = null;
    this.initialRotation = null;
    this.clicked = false;

    const mousedownHandler = () => {
      console.log("mousedown");
      this.clicked = true;
    };
    const mouseupHandler = () => {
      console.log("mouseup");
      this.clicked = false;
    };

    this.el.addEventListener('mousedown', mousedownHandler); 
    this.el.addEventListener('mouseup', mouseupHandler); 

    this.el.addEventListener('raycaster-intersected', (e: any) => {
      this.raycaster = e.detail.el.components.raycaster;
      console.log("Intersection enter");
    });
    this.el.addEventListener('raycaster-intersected-cleared', () => {
      this.raycaster = null;
      console.log("Intersection leave");
    });
  },

  tick() {
    if (this.clicked) {
      this.el.setAttribute("color", "#fff");
      if (!this.raycaster) { return; }  // Not intersecting.
      let intersection = this.raycaster.getIntersection(this.el);
      if (!intersection) { return; }
      if (!this.fromIntersectionToOrigin) {
        this.fromIntersectionToOrigin = this.el.object3D.position.clone().sub(intersection.point);
      } else {
        this.el.object3D.position.copy(intersection.point.clone().add(this.fromIntersectionToOrigin));
        this.el.object3D.position.z = this.zPosition;
        // if ( this.el.object3D.position.y < 0) {
        //   this.el.object3D.position.y = 0;
        // }
        if ( this.el.object3D.position.y > 75) {
          this.el.object3D.position.y = 75;
        }
      }
    } else {
      this.fromIntersectionToOrigin = null;
      this.el.setAttribute("color", this.color);
    }
  }
});

AFRAME.registerComponent('rotable', { 
  init () {
    this.scene = this.el.sceneEl;
    this.camera = this.scene.camera;
    this.obj = this.el.object3D;
    this.zPosition = this.el.object3D.position.z;

    this.initialRotation = null;
    this.clicked = false;

    const mousedownHandler = () => {
      this.clicked = true;
    };
    const mouseupHandler = () => {
      this.clicked = false;
    };

    this.el.addEventListener('mousedown', mousedownHandler); 
    this.el.addEventListener('mouseup', mouseupHandler); 

    this.el.addEventListener('raycaster-intersected', (e: any) => {
      this.raycaster = e.detail.el.components.raycaster;
      console.log("Intersection enter");
    });
    this.el.addEventListener('raycaster-intersected-cleared', () => {
      console.log("Intersection leave");
    });
  },

  tick() {
    if (this.clicked) {
      const raycasterRotation = this.raycaster.raycaster.ray.direction.x;
      console.log(this.raycaster.raycaster.ray.direction);
      if (!this.initialRotation) {
        this.initialRotation = raycasterRotation;
      } else {
        this.el.setAttribute("color", "#fff");
        this.el.object3D.rotation.y += (raycasterRotation - this.initialRotation)/2;
      }
    } else {
      this.initialRotation = null;
      this.el.setAttribute("color", this.color);
    }
  }
});

