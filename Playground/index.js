const storage = require('./storage');

storage.put('first', 5);
storage.put('second', 2);
storage.put('third', 3);
storage.update('third', 'shit');

storage.save(() => {
  storage.load(() => {
    var afterLoadValue = storage.get('third');
  });
});