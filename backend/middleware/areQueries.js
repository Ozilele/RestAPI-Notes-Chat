

const areNotesQueries = (req, res, next) => {
  const noteTitle = req.query.title;
  const noteCategory = req.query.category;
  const noteSubject = req.query.subject;
  const filters = [];

  if(noteTitle || noteCategory || noteSubject) {
    if(noteTitle) {
      filters.push({ title: { $regex: noteTitle, $options: 'i'}});
    }
    if(noteCategory) {
      filters.push({ category: { $regex: noteCategory, $options: 'i'}});
    }
    if(noteSubject) {
      filters.push({ subject: { $regex: noteSubject, $options: 'i'}});
    }
  }
  req.filters = filters;
  next();
}

module.exports = { areNotesQueries };