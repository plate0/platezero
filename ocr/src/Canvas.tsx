import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { TransformCanvasRenderingContext2D, decorate } from './context'
import { writeFileSync } from 'fs'

// TODO: Get from DOM, I could not figure it out
const NAVBAR_HEIGHT = 47
const CANVAS_PADDING = 15
const SCALE_FACTOR = 1.1

const ctrlPass = (fn: Function) => (e: any) => (e.ctrlKey ? fn(e) : void 0)
const notCtrlPass = (fn: Function) => (e: any) => (e.ctrlKey ? void 0 : fn(e))

export interface CanvasProps {
  onSelection: (buffer: Buffer) => void
  imagePath?: string
}

interface Point {
  x: number
  y: number
}

interface Rect {
  x?: number
  y?: number
  width?: number
  height?: number
}

interface CanvasState {
  canvas: any
  ctx: TransformCanvasRenderingContext2D
  image: any //Image
  rect: Rect
  last: Point
  dragStart?: Point
  dragging: boolean
}

// https://codepen.io/techslides/pen/zowLd
export class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props: CanvasProps) {
    super(props)
    this.state = {
      image: new Image(),
      rect: { x: 0, y: 0, width: 0, height: 0 },
      last: { x: 0, y: 0 },
      dragging: false
    } as any
    this.scroll = this.scroll.bind(this)
    this.zoom = this.zoom.bind(this)
    this.mousedown = this.mousedown.bind(this)
    this.ctrldown = this.ctrldown.bind(this)
    this.mousemove = this.mousemove.bind(this)
    this.ctrlmove = this.ctrlmove.bind(this)
    this.mouseup = this.mouseup.bind(this)
  }

  // Set canvas size and state from canvas
  public componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas) as any
    canvas.width = (this.refs.parent as any).offsetWidth
    canvas.height = window.innerHeight - NAVBAR_HEIGHT
    const ctx: TransformCanvasRenderingContext2D = decorate(
      canvas.getContext('2d')
    )
    const last = {
      x: canvas.width / 2,
      y: canvas.height / 2
    }
    this.setState({ canvas, ctx, last }, () => {
      if (this.props.imagePath) {
        this.load(this.props.imagePath)
      }
    })

    canvas.addEventListener('DOMMouseScroll', this.scroll, false)
    canvas.addEventListener('mousewheel', this.scroll, false)
    canvas.addEventListener('mousedown', ctrlPass(this.ctrldown), false)
    canvas.addEventListener('mousedown', notCtrlPass(this.mousedown), false)
    canvas.addEventListener('mousemove', notCtrlPass(this.mousemove), false)
    canvas.addEventListener('mousemove', ctrlPass(this.ctrlmove), false)
    canvas.addEventListener('mouseup', this.mouseup, false)

    Mousetrap.bind('space', () => {
      const buffer = this.getImageBuffer(this.state.rect)
      if (buffer) {
        this.props.onSelection(buffer)
      }
    })
  }

  // Crop Selection takes the selected area and selects that area from the
  // original image
  private getImageBuffer(rect: Rect): Buffer | undefined {
    if (!rect.x || !rect.y || !rect.width || !rect.height) {
      return
    }
    const { image } = this.state
    const { x, y, width, height } = rect
    const newCanvas = document.createElement('canvas')
    newCanvas.width = width
    newCanvas.height = height
    const newContext = newCanvas.getContext('2d')
    if (!newContext) {
      throw new Error('Error getting canvas context')
    }
    newContext.drawImage(image, x, y, width, height, 0, 0, width, height)
    let data = newCanvas.toDataURL('image/jpeg')
    data = data.replace(/^data:image\/jpeg;base64,/, '')
    writeFileSync('test-data.jpg', data, 'base64')
    this.setState({ rect: { x: 0, y: 0, width: 0, height: 0 } })
    return Buffer.from(data, 'base64')
  }

  private ctrldown(e: MouseEvent) {
    const { ctx } = this.state
    const { x, y } = ctx.transformedPoint(this.adjustCanvasPoint(e))
    this.setState(s => ({
      ...s,
      rect: {
        x,
        y,
        height: 0,
        width: 0
      }
    }))
    this.draw()
  }

  private mousedown(e: MouseEvent) {
    const { ctx } = this.state
    const last = this.adjustCanvasPoint(e)
    const dragStart = ctx.transformedPoint(last)
    this.setState({
      dragging: false,
      dragStart,
      last
    })
  }

  private ctrlmove(e: MouseEvent) {
    const {
      ctx,
      rect: { x, y }
    } = this.state
    if (!x || !y) {
      return
    }
    const { x: x2, y: y2 } = ctx.transformedPoint(this.adjustCanvasPoint(e))
    const width = x2 - x
    const height = y2 - y
    this.setState(s => ({
      ...s,
      rect: {
        ...s.rect,
        width,
        height
      }
    }))
    this.draw()
  }

  private mousemove(e: MouseEvent) {
    const { ctx, dragStart } = this.state
    const last = this.adjustCanvasPoint(e)
    if (dragStart) {
      const pt = ctx.transformedPoint(last)
      ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y)
      this.draw()
    }
    this.setState({
      last,
      dragging: true
    })
  }

  private mouseup() {
    this.setState({ dragStart: undefined })
  }

  private scroll(e: any /*WheelEvent*/): boolean {
    e.preventDefault()
    const delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0
    if (delta) this.zoom(delta)
    return false
  }

  private zoom(clicks: number) {
    const { ctx, last } = this.state
    const { x, y } = ctx.transformedPoint(last)
    ctx.translate(x, y)
    // TODO: In or Out
    const factor = Math.pow(SCALE_FACTOR, clicks)
    ctx.scale(factor, factor)
    ctx.translate(-x, -y)
    this.draw()
  }

  private load(src: string) {
    const { ctx, canvas, image } = this.state
    const self = this
    image.onload = function() {
      const scale = canvas.width / (this.width + 200)
      ctx.scale(scale, scale)
      // Bump it in a little
      ctx.translate(100, 50)
      self.draw()
    }
    image.src = src
  }

  private adjustCanvasPoint(e: MouseEvent): Point {
    const { canvas } = this.state
    return {
      x: e.pageX - (canvas.offsetLeft - CANVAS_PADDING),
      y: e.pageY - (canvas.offsetTop + NAVBAR_HEIGHT)
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

    if (rect.x && rect.y && rect.width && rect.height) {
      const { x, y, width, height } = rect
      ctx.beginPath()
      ctx.strokeRect(x, y, width, height)
      ctx.stroke()
    }
  }

  public render() {
    return (
      <div ref="parent">
        <canvas ref="canvas" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} />
      </div>
    )
  }
}
