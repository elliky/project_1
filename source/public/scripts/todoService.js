const DELAY_MS = 200;

class TodoNote {
    constructor(title, importance, dueDate, description, finished) {
        this.title = title;
        this.importance = importance;
        this.dueDate = dueDate;
        this.description = description
        this.finished = finished;
    }
}

const songs = [
    new TodoNote('testNote', 5, new Date(2024, 4, 20), "my first Testnote", false),
    new TodoNote('testNote1', 1, new Date(2024, 4, 25), "my second Testnote", true),
    new TodoNote('testNote2', 3, new Date(2024, 4, 27), "my third Testnote", false),
];

function compareImportance(s1, s2) {
  return s2.rating - s1.rating;
}

function findSong(id) {
  return songs.find((song) => parseInt(id) === parseInt(song.id));
}

function getSortedSongs(callback) {
  setTimeout(() => callback([...songs].sort(compareImportance)), DELAY_MS);
}

function rateSong(songId, delta, sortedSongsCallback) {
  const song = findSong(songId);
  if (song) {
    song.rating += delta;
  }
  getSortedSongs(sortedSongsCallback);
}

export default {rateSong, getSortedSongs};
