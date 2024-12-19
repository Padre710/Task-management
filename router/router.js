const express = require('express');
const { User, Task, Comment, Tag } = require('./model');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);


 // Admin creates a new admin user

router.post('/users/admin', roleMiddleware('admin'), async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newAdmin = await User.create({ username, email, password, role: 'admin' });
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ========== TASKS ==========
/**
 * Create a task
 */
router.post('/tasks', async (req, res) => {
  const { title, description, due_date, assigneeId } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      due_date,
      creatorId: req.user.id,
      assigneeId: assigneeId || req.user.id, // Assign to self if no assignee provided
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Update the status of a task
 */
router.put('/tasks/:taskId/status', async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Ensure user owns the task or is an admin
    if (task.assigneeId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    task.status = status;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Delete a task
 */
router.delete('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Ensure only the creator or admin can delete
    if (task.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ========== TAGS ==========
/**
 * Add a tag to a task
 */
router.post('/tasks/:taskId/tags', async (req, res) => {
  const { taskId } = req.params;
  const { name } = req.body;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [tag] = await Tag.findOrCreate({ where: { name } });
    await task.addTag(tag);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get tasks by tag
 */
router.get('/tasks', async (req, res) => {
  const { tagName } = req.query;

  try {
    const tasks = tagName
      ? await Task.findAll({
          include: {
            model: Tag,
            as: 'tags',
            where: { name: tagName },
          },
        })
      : await Task.findAll();

    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ========== COMMENTS ==========
/**
 * Add a comment to a task
 */
router.post('/tasks/:taskId/comments', async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const comment = await Comment.create({
      content,
      authorId: req.user.id,
      taskId: task.id,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Edit a comment
 */
router.put('/comments/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Ensure only the author can edit
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    comment.content = content;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Delete a comment
 */
router.delete('/comments/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Allow author or admin to delete
    if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
