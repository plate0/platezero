import * as React from 'react'
import * as ReactDOM from 'react-dom'

// https://codepen.io/techslides/pen/zowLd
export class Canvas extends React.Component<undefined, undefined> {
  constructor(props) {
    super(props)
    this.state = {
      image: undefined
    }
  }

  public componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas)
    const ctx = canvas.getContext('2d')
    // Decorate Context
    this.trackTransforms(ctx)
    const image = new Image()
    const rect = { x: 0, y: 0, width: 0, height: 0 }
    this.setState({ canvas, ctx, image, rect })
    let self = this
    canvas.width = 800
    canvas.height = 600

    var lastX = canvas.width / 2,
      lastY = canvas.height / 2

    var dragStart, dragged

    console.log('offsets,', canvas.offsetLeft, canvas.offsetTop)

    canvas.addEventListener(
      'mousedown',
      function(evt) {
        console.log(evt)
        if (evt.ctrlKey) {
          let { x, y } = ctx.transformedPoint(evt.pageX, evt.pageY)
          // let { x, y } = ctx.transformedPoint(100, 100)
          x = evt.pageX
          y = evt.pageY
          self.setState(s => ({
            ...s,
            rect: {
              x,
              y,
              height: 0,
              width: 0
            }
          }))
          self.draw()
          return
        }
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect =
          'none'
        lastX = evt.offsetX || evt.pageX - canvas.offsetLeft
        lastY = evt.offsetY || evt.pageY - canvas.offsetTop
        dragStart = ctx.transformedPoint(lastX, lastY)
        dragged = false
      },
      false
    )

    canvas.addEventListener(
      'mousemove',
      function(evt) {
        lastX = evt.offsetX || evt.pageX - canvas.offsetLeft
        lastY = evt.offsetY || evt.pageY - canvas.offsetTop

        if (evt.ctrlKey) {
          const { x, y } = ctx.transformedPoint(lastX, lastY)
          self.setState(s => ({
            ...s,
            rect: {
              ...s.rect,
              width: x,
              height: y
            }
          }))
          self.draw()
          return
        }

        // old
        dragged = true
        if (dragStart) {
          var pt = ctx.transformedPoint(lastX, lastY)
          ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y)
          self.draw()
        }
      },
      false
    )

    canvas.addEventListener(
      'mouseup',
      function(evt) {
        dragStart = null
        if (!dragged) zoom(evt.shiftKey ? -1 : 1)
      },
      false
    )

    var scaleFactor = 1.1

    var zoom = function(clicks) {
      var pt = ctx.transformedPoint(lastX, lastY)
      ctx.translate(pt.x, pt.y)
      var factor = Math.pow(scaleFactor, clicks)
      ctx.scale(factor, factor)
      ctx.translate(-pt.x, -pt.y)
      self.draw()
    }

    var handleScroll = function(evt) {
      var delta = evt.wheelDelta
        ? evt.wheelDelta / 40
        : evt.detail
        ? -evt.detail
        : 0
      if (delta) zoom(delta)
      return evt.preventDefault() && false
    }

    canvas.addEventListener('DOMMouseScroll', handleScroll, false)
    canvas.addEventListener('mousewheel', handleScroll, false)

    // Load image
    // TODO: Get from state
    image.src = 'recipe.jpg'
  }

  private trackTransforms(ctx: CanvasRenderingContext2D) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    var xform = svg.createSVGMatrix()
    ctx.getTransform = function() {
      return xform
    }

    var savedTransforms = []
    var save = ctx.save
    ctx.save = function() {
      savedTransforms.push(xform.translate(0, 0))
      return save.call(ctx)
    }

    var restore = ctx.restore
    ctx.restore = function() {
      xform = savedTransforms.pop()
      return restore.call(ctx)
    }

    var scale = ctx.scale
    ctx.scale = function(sx, sy) {
      xform = xform.scaleNonUniform(sx, sy)
      return scale.call(ctx, sx, sy)
    }

    var rotate = ctx.rotate
    ctx.rotate = function(radians) {
      xform = xform.rotate((radians * 180) / Math.PI)
      return rotate.call(ctx, radians)
    }

    var translate = ctx.translate
    ctx.translate = function(dx, dy) {
      xform = xform.translate(dx, dy)
      return translate.call(ctx, dx, dy)
    }

    var transform = ctx.transform
    ctx.transform = function(a, b, c, d, e, f) {
      var m2 = svg.createSVGMatrix()
      m2.a = a
      m2.b = b
      m2.c = c
      m2.d = d
      m2.e = e
      m2.f = f
      xform = xform.multiply(m2)
      return transform.call(ctx, a, b, c, d, e, f)
    }

    var setTransform = ctx.setTransform
    ctx.setTransform = function(a, b, c, d, e, f) {
      xform.a = a
      xform.b = b
      xform.c = c
      xform.d = d
      xform.e = e
      xform.f = f
      return setTransform.call(ctx, a, b, c, d, e, f)
    }

    var pt = svg.createSVGPoint()
    ctx.transformedPoint = function(x, y) {
      pt.x = x
      pt.y = y
      return pt.matrixTransform(xform.inverse())
    }
  }

  public draw() {
    const { canvas, ctx, image, rect } = this.state
    var p1 = ctx.transformedPoint(0, 0)
    var p2 = ctx.transformedPoint(canvas.width, canvas.height)
    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    ctx.drawImage(image, 0, 0)

    if (rect.x && rect.width) {
      ctx.beginPath()
      ctx.lineWidth = '6'
      ctx.strokeStyle = 'red'
      let invMat = ctx.getTransform()
      let x = rect.x * invMat.a + rect.y * invMat.c + invMat.e
      let y = rect.x * invMat.b + rect.y * invMat.d + invMat.f
      console.log('ugh', x, y)
      ctx.moveTo(x, y)
      ctx.rect(x, y, rect.width - x, rect.height - y)
      ctx.stroke()
    }
  }

  // GOogo
  public gogo() {
    console.log('gogo')
  }

  public render() {
    if (this.state.ctx) {
      this.draw()
    }
    return (
      <div>
        <canvas ref="canvas" style={{ width: '100%' }} />
        <canvas ref="tmp" style={{ width: '100%' }} />
      </div>
    )
  }
}
