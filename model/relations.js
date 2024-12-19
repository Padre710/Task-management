const User = require('./user');
const Task = require('./task');
const Comment = require('./comment');
const Tag = require('./tag');


User.hasMany(Task) 
Task.belongsTo(User);

User.hasMany(Task);
Task.belongsTo(User);


Task.hasMany(Comment);
Comment.belongsTo(Task);


User.hasMany(Comment);
Comment.belongsTo(User);

Task.belongsToMany(Tag);
Tag.belongsToMany(Task)

module.exports = { User, Task, Comment, Tag };
