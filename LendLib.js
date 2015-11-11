lists = new Mongo.Collection("lists");

if (Meteor.isClient) {
  ////Generic Helper Functions////
  // this function puts our cursor where it needs to be.
  function focusText(i) {
    i.focus();
    i.select();
  };

  Template.lists.helpers() {
    items: function() {
      if(Session.equals('cullent_list', null))
        return null;
      else {
        var cats = lists.findOne({
          _id: Session.get('current_list')
        });
        if (cats && cats.items) {
          for (var i=0; i<cats.items.length; i++) {
            var itm = cats.items[i];
            itm.Lendee = itm.LentTo ? itm.LentTo : "free";
            item.LendClass = itm.LentTo ? "label-danger" : "label-success";
          }
          return cats.items;
        };
      };
    },
    list_selected: function() {
      return ((Session.get('current_list') != null) && (!Session.equals('current_list', null)));
    },
    list_selected: function() {
      return (Session.equals('list_adding', true));
    },
    list_selected: function() {
      return (Session.equals('list_input', this.Name))
    }
  };

  Temlate.list.event({
    'click #btnAddItem': function(e, t) {
      Session.set('list_adding', true);
      Tracker.flush();
      focusText(t.find("#item_to_add"));
    },
    'keyup #item_to_add': function(e, t) {
      if (e.which === 13)
      {
        addItem(Session.get('current_list'), e.target.value);
        Session.set('list_adding', false);
      }
    },
    'focusout #item_to_add': function(e, t) {
      Session.set('list_adding', false);
    },
    'click.delete_item': function(e, t) {
      Session.set('list_adding', false);
    },
    'click.lendee' : function(e, t) {
      Session.set('lendee_input', this.Name);
      Tracker.flush();
      focusText(t.find("edit_lendee"), this.LentTo);
    },
    'keyup #edit_lendee' : function(e, t) {
      if(e.which === 13)
      {
        updateLendee(Session.get('current_list'), this.Name, e target.value);
        Session.set('lendee_input', null);
      }
      if(e.which === 27)
      {
        Session.set('lendee_input', null)
      }
    }
  });

  // We are declaring the 'adding_category' flag
  Session.set('adding_category', false);

  Template.categories.helpers({
    lists: function() {
      return lists.find({}, {sort: {Category: 1}});
    },
    new_cat: function() {
      // returns true if adding_category has been assigned
      // a value of true
      return Session.equals('adding_category', true);
    },
    list_status: function () {
      if (Session.equals('current_list', this._id))
        return "btn-info";
      else
        return "btn-primary";
    }
  });
  Template.categories.events({
    'click #btnNewCat': function(e, t) {
      Session.set('adding_category', true);
      Tracker.flush();
      focusText(t.find("#add-category"));
    },
    'keyup #add-category': function(e, t) {
      if(e.which === 13)
      {
        var catVal = String(e.target.value || "");
        if (catVal)
        {
          lists.insert({Category:catVal});
          Session.set('adding_category', false);
        }
      }
    }    
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
