# class Point
#   constructor: (x,y) ->
#     @x = parseInt x
#     @y = parseInt y

# getPosition = (object, center) ->
#   position = new Point(object.position().top, object.position().left)
#   return new Point( center.x - position.x, center.y - position.y)

# window.getOrder = ->
#   center = new Point( $(window).width()/2, $(window).height()/2 )
#   $('.todo').each ->
#     console.log center
#     console.log getPosition($(this), center)



#   $('.todo').each ->

#     Hammer( $(this), { drag_max_touches:0 }).on "touch drag", (ev) ->
#       ev.gesture.preventDefault()
#       touches = ev.gesture.touches
#       for touch in touches
#         target = touch.target
#         target.css
#           zIndex: 100
#           left: touch.pageX-20
#           top: touch.pageY-20

# Zepto ->
#   alert 'a'



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

  layer = new Kinetic.Layer()
  rectX = stage.getWidth() / 2 - 50
  rectY = stage.getHeight() / 2 - 25

  makeLabel = ($text, $x, $y) ->

    label = new Kinetic.Label
      x: $x
      y: $y
      draggable: true
      dragOnTop: true

    tag = new Kinetic.Tag(fill: "yellow")

    text = new Kinetic.Text
      text: $text
      fontSize: 18
      padding: 20
      fill: "black"

    label.on 'dragstart touchstart mousedown', ->
      this.moveToTop()

    label.on 'mouseover', ->
      document.body.style.cursor = 'pointer'

    label.on 'mouseout', ->
      document.body.style.cursor = 'default'

    text.on 'dblclick', (evt) ->
      evt.cancelBubble = true
      this.setText(prompt('New Text:', this.getText()))
      save()

    label.on 'touchstart', (evt) ->
      evt.cancelBubble = true

    label.add(tag).add(text)

    return label

  # makeLabel "RARR"

  stage.on 'touchstart dblclick', (evt) ->
    # alert JSON.stringify(evt)
    layer.add(makeLabel prompt('New Tag:'), evt.layerX, evt.layerY)
    save()

  save = ->
    layer.draw()
    window.store.save({key: 'stage',options: window.stage.toJSON()})

  stage.on 'dragend', save
  bglayer.add bg
  window.stage.add(bglayer).add(layer)


window.store = new Lawnchair {name: (window.location.hash or "testing") }, (store) ->
  store.get "stage", (me) ->
    if me and me.options
      init( me.options )
    else
      init()
