init = (e = null) ->

  if e
    window.stage = Kinetic.Node.create(e, 'container')
  else
    window.stage = new Kinetic.Stage
      container: "container"


  window.stage.setWidth window.innerWidth
  window.stage.setHeight window.innerHeight

  bglayer = new Kinetic.Layer()
  bg = new Kinetic.Rect
    x: 0
    y: 0
    width: window.innerWidth
    height: window.innerHeight

  tl = new Kinetic.Rect
    x: 0
    y: 0
    width: window.innerWidth/2
    height: window.innerHeight/2
    fill: '#333'

  tr = new Kinetic.Rect
    x: window.innerWidth/2
    y: 0
    width: window.innerWidth/2
    height: window.innerHeight/2
    fill: '#555'

  bl = new Kinetic.Rect
    x: 0
    y: window.innerHeight/2
    width: window.innerWidth/2
    height: window.innerHeight/2
    fill: '#777'

  br = new Kinetic.Rect
    x: window.innerWidth/2
    y: window.innerHeight/2
    width: window.innerWidth/2
    height: window.innerHeight/2
    fill: '#999'

  layer = new Kinetic.Layer()
  rectX = stage.getWidth() / 2 - 50
  rectY = stage.getHeight() / 2 - 25

  makeLabel = ($text, $x, $y) ->

    label = new Kinetic.Label
      x: $x
      y: $y
      draggable: true
      dragOnTop: true

    tag = new Kinetic.Tag(fill: "#F5F5F5")

    text = new Kinetic.Text
      text: $text
      fontSize: 12
      fontFamily: "Menlo"
      padding: 6
      fill: "black"

    label.on 'dragstart touchstart mousedown', ->
      this.moveToTop()

    label.on 'mouseover', ->
      document.body.style.cursor = 'pointer'

    label.on 'mouseout', ->
      document.body.style.cursor = 'default'

    text.on 'dblclick', (evt) ->
      evt.cancelBubble = true
      if this.getText()
        this.setText(prompt('New Text:', this.getText()))
        save()

    label.on 'touchstart', (evt) ->
      evt.cancelBubble = true

    label.add(tag).add(text)

    return label

  stage.on 'touchstart dblclick', (evt) ->
    layer.add(makeLabel prompt('New Tag:'), evt.layerX, evt.layerY)
    save()

  save = ->
    layer.draw()
    window.store.save({key: 'stage',options: window.stage.toJSON()})

  stage.on 'dragend', save
  bglayer.add bg
  bglayer.add tl
  bglayer.add tr
  bglayer.add bl
  bglayer.add br
  window.stage.add(bglayer).add(layer)


window.store = new Lawnchair {name: (window.location.hash or "testing") }, (store) ->
  store.get "stage", (me) ->
    if me and me.options
      init( me.options )
    else
      init()
