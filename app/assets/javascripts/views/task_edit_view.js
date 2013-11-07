Breath.Views.TaskEdit = Backbone.View.extend({
  template: JST['tasks/edit'],

  initialize: function(){
    this.listenTo(this.model, "add remove sync change", this.render);
    this.model.fetch({silent: true})
  },

  events: {
    'blur .update-task': 'updateTask',
    'blur .form-description': 'updateTask',
    'click .completed': 'toggleComplete',
    'click .remove': 'removeTask'
  },

  toggleComplete: function(event){
    var completedVar = this.model.get('completed') ? false : true;
    var that = this;
    this.model.save('completed', completedVar, {
      success: function(obj){
        if (obj.get('project_id') !== 0 && obj.get('project_id')){
          Breath.user.tasks().get(obj.id).save('completed', completedVar);
          Breath.user.tasks().sort();
        }
        that.model.fetch({silent: true});
        that.model.collection.sort();
      }
    })
  },

  updateTask: function(event){
    var target = $(event.currentTarget).attr('name');
    var payload = $(event.currentTarget).val();
    var that = this;
    this.model.save(target, payload, {
      success: function(obj){
        if (obj.get('project_id') !== 0 && obj.get('project_id')){
          Breath.user.tasks().get(obj.id).save(target, payload);
          Breath.user.tasks().sort();
        }
        that.model.fetch({silent: true});
        that.model.collection.sort();
      }
    })
  },

  removeTask: function(event){
    this.model.destroy({
      success: function(obj){
        Breath.user.fetch();
        $('.task-detail').html('<div><h5> Successfully Removed </h5></div>')
      }
    });
  },

  remove: function(){
    this.comments.remove();
    this.assignments.remove();
    this.subtasks.remove();
    Backbone.View.prototype.remove.call(this);
  },

  render: function(){
    var renderedContent = this.template({
      task: this.model,
      project: this.collection
    });

    this.subtasks = new Breath.Views.SubtaskView({
      model: this.model,
      collection: this.model.subtasks()
    });

    this.assignments = new Breath.Views.AssignmentView({
      model: this.model,
      collection: this.model.assigned_users()
    });

    this.comments = new Breath.Views.CommentView({
      model: this.model,
      collection: this.model.comments()
    });

    this.$el.html(renderedContent);
    this.$el.append(this.subtasks.render().$el)
    this.$el.append(this.assignments.render().$el)
    this.$el.append(this.comments.render().$el)
    return this;
  }
})
