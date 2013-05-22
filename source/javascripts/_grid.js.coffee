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

jQuery ->
  $('.todo').draggable
    handle: '.handle'
    stack: '.todo'
