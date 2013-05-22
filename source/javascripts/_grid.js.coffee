window.TodosListController = ($scope) ->
  $scope.todos = [
    { task: "Wake up" }
    { task: "Brush teeth" }
    { task: "Shower" }
    { task: "Have breakfast" }
    { task: "Go to work" }
    { task: "Go to the gym" }
    { task: "Go to bed" }
  ]

store = new Lawnchair({name: "testing"}, (store) ->
  me = {key: "brian"}
  store.save me
  store.get "brian", (me) ->
    console.log me
)

class Point
  constructor: (x,y) ->
    @x = parseInt x
    @y = parseInt y

getPosition = (object, center) ->
  position = new Point(object.position().top, object.position().left)
  return new Point( center.x - position.x, center.y - position.y)

window.getOrder = ->
  center = new Point( $(window).width()/2, $(window).height()/2 )
  $('.todo').each ->
    console.log center
    console.log getPosition($(this), center)

jQuery ->
  $('.todo').draggable
    handle: '.handle'
    stack: '.todo'
