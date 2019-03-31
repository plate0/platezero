import * as React from 'react'
declare var fabric: any

var image

export class App extends React.Component<undefined, undefined> {
  constructor(props) {
    super(props)
    this.state = {}
    this.export = this.export.bind(this)
  }
  componentDidMount() {
    const canvas = new fabric.Canvas('c')
    fabric.Image.fromURL('recipe.jpg', img => {
      image = img
      img.scale(0.1)
      img.selectable = false
      canvas.add(img)
      canvas.centerObject(img)

      setTimeout(() => {
        canvas.renderAll()

        setTimeout(() => {
          var data = img.toDataURL({
            format: 'jpeg',
            left: 0,
            top: 0,
            width: 500,
            height: 100
          })
          data = data.replace(/^data:image\/jpeg;base64,/, '')
          console.log(data)
          require('fs').writeFileSync('out.png', data, 'base64')
        }, 1000)
      }, 5000)
    })

    canvas.on('mouse:wheel', ({ e }) => {
      console.log(e)
      if (e.ctrlKey) {
        var delta = e.deltaY
        var pointer = canvas.getPointer(e)
        var zoom = canvas.getZoom()
        zoom = zoom - delta / 100
        if (zoom > 20) zoom = 20
        if (zoom < 1) zoom = 1
        canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, zoom)
        e.preventDefault()
        e.stopPropagation()
      } else {
        image.top -= e.deltaY
        image.left -= e.deltaX
        canvas.renderAll()
        e.preventDefault()
        e.stopPropagation()
      }
    })

    window.addEventListener('resize', resizeCanvas, false)

    function resizeCanvas() {
      canvas.setHeight(window.innerHeight)
      canvas.setWidth(window.innerWidth)
      canvas.renderAll()
    }

    // resize on init
    resizeCanvas()

    var mousex = 0
    var mousey = 0
    var crop = false
    var r = document.getElementById('c').getBoundingClientRect()
    var pos = [0, 0]
    pos[0] = r.left
    pos[1] = r.top
    // box?
    var el = new fabric.Rect({
      fill: 'transparent',
      originX: 'left',
      originY: 'top',
      stroke: '#333',
      strokeDashArray: [2, 2],
      opacity: 1,
      width: 200,
      height: 80,
      selectable: false
    })
    canvas.add(el)
    el.bringToFront()

    canvas.on('mouse:down', ({ e }) => {
      console.log(e)
      console.log(canvas.getPointer(e))
      const { x, y } = canvas.getPointer(e)
      el.left = x
      el.top = y
      //mousex = e.pageX
      mousey = e.pageY
      canvas.renderAll()
      el.bringToFront()
      console.log('wtf', el)
    })
  }

  export() {
    var data = image.toDataURL({
      format: 'jpeg',
      left: 0,
      top: 0,
      width: 500,
      height: 100
    })
    data = data.replace(/^data:image\/jpeg;base64,/, '')
    require('fs').writeFileSync('out.png', data, 'base64')
  }

  render() {
    setTimeout(() => {
      const canvas = new fabric.Canvas('c')
      // create a rectangle object
      var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20
      })

      // "add" rectangle onto canvas
      canvas.add(rect)
      canvas.renderAll()
    })
    return (
      <div>
        <h2>Welcome to React with Typescript!</h2>
        <button onClick={this.export}>Export</button>
        <canvas id="c" />
      </div>
    )
  }
}
