lists = new Mongo.Collection("lists");

if (Meteor.isClient) {
  ////Generic Helper Functions////
  // this function puts our cursor where it needs to be.
  function focusText(i) {
    i.focus();
    i.select();
  };

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
