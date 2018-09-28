<template>
  <!-- <div></div> -->
  <div class='waves' id='waves'>
  </div>
</template>
<script>
var SEPARATION = 40
var AMOUNTX = 130
var AMOUNTY = 35
var container
var camera, scene, renderer
var particles
var particle
var count = 0
export default {
  name: 'waves',
  methods: {
    init () {
      camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000)
      camera.position.y = 150 // changes how far back you can see i.e the particles towards horizon
      camera.position.z = 300 // This is how close or far the particles are seen
      camera.rotation.x = 0.35
      scene = new THREE.Scene()
      particles = []

      var PI2 = Math.PI * 2
      var material = new THREE.SpriteCanvasMaterial({

        color: 0x939393, // changes color of particles
        program: function (context) {
          context.beginPath()
          context.arc(0, 0, 0.1, 0, PI2, true)
          context.fill()
        }

      })
      var i = 0
      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[ i++ ] = new THREE.Sprite(material)
          particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2)
          particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) - 10)
          scene.add(particle)
        }
      }
      renderer = new THREE.CanvasRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0xffffff, 1)
      container.appendChild(renderer.domElement)
      window.addEventListener('resize', this.onWindowResize, false)
    },
    onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    animate () {
      this.step = requestAnimationFrame(this.animate)
      this.render()
    },
    render () {
      var i = 0
      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[ i++ ]
          particle.position.y = (Math.sin((ix + count) * 0.5) * 20) + (Math.sin((iy + count) * 0.5) * 20)
          particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 2) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4
        }
      }
      if (document.getElementById('waves')) {
        renderer.render(scene, camera)
      }
      // This increases or decreases speed
      count += 0.2
    }
  },
  mounted () {
    container = document.getElementById('waves')
    this.init()
    this.animate()
  },
  beforeDestroy () {
    cancelAnimationFrame(this.step)
  }
}
</script>
<style lang="less" scoped>
.waves{
}
canvas{
  position: absolute;
  top:0;
  left:0;
  z-index:-1;
  background: #000;
}
</style>



