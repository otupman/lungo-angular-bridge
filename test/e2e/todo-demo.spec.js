'use strict';

var Todo = {
  open: function() {
    browser().navigateTo('../../examples/todo');
  }
  , startAddTodo: function() {
    element('a[data-icon="plus"]').click();
  }
  , cancelAddTodo: function() {
    element('a[data-icon="home"]').click();
  }
  , markAsDoneWithSwipe: function() {
    labElem(Todo.SELECTORS.LIST_ITEMS + ':first').swipeLeft();
  }
  , markAsNotDoneWithSwipe: function() {
    labElem(Todo.SELECTORS.LIST_ITEMS + ':first').swipeRight();
  }
  , SELECTORS: {
    LIST: "#main ul li"
    , LIST_ITEMS: 'li[ng-repeat="todo in todos"]'
  }
};

describe('Todo Demo App', function() {
  beforeEach(function() {
    Todo.open();
  });

  describe('on the Add screen', function() {
    beforeEach(function() {
      Todo.startAddTodo();
    });

    it('should move home', function() {
      Todo.cancelAddTodo();
      expect(browser().location().path()).toEqual('/');
    });

    describe('adding an item', function() {
      beforeEach(function() {
        input('todoText').enter('Test todo');
        element('input[value="add"]').click();
      });

      it('should have 3 items', function() {
        expect(repeater(Todo.SELECTORS.LIST).count()).toBe(3);
      });

      it('should have the new item as incomplete', function() {
        expect(element(Todo.SELECTORS.LIST_ITEMS + ' input:checked').count()).toBe(1);
      });
    });
  });

  describe('modifying the list', function() {
    it('should archive all un-done items', function() {
      labElem('a[class*="archiveButton"]').tap();
      expect(element(Todo.SELECTORS.LIST_ITEMS + ' input:checked').count()).toBe(0);
    });

    it('should modify the remaining task count', function() {

    });
  });
  describe("swipe events", function() {
    it("should mark an item as not done on swipe right", function() {
      Todo.markAsNotDoneWithSwipe();

      expect(element(Todo.SELECTORS.LIST_ITEMS + ':first input:checked').count()).toBe(0);
    });

    it("should mark an item as done on swipe left", function() {
      Todo.markAsDoneWithSwipe();

      expect(element(Todo.SELECTORS.LIST_ITEMS + ':first input:checked').count()).toBe(1);
    });
  });

  describe('on start-up', function() {
    it('should have 2 items present', function() {
      expect(repeater(Todo.SELECTORS.LIST).count()).toBe(2);
    });

    it('should have 1 item marked as complete', function() {
      expect(element(Todo.SELECTORS.LIST_ITEMS + ' input:checked').count()).toBe(1);
    });

    it('should move to the add page', function() {
      Todo.startAddTodo();
      expect(browser().location().path()).toEqual('/add-todo');
    });

    it('should report how many items are complete and left to complete', function() {
      expect(element('span[class*="remainingLabel"]').text()).toEqual('1 of 2 remaining');
    });
  });
});
