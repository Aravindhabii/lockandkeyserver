const schema = () => {
  db.query(
    `
        CREATE TABLE IF NOT EXISTS users (
          userid VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL
        )`
  )
  db.query(
    `
        CREATE TABLE IF NOT EXISTS pages(
          pageid VARCHAR(36) PRIMARY KEY,
          userid VARCHAR(36) UNIQUE,
          data TEXT NOT NULL,
          FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE 
        )`
  )
}

module.exports = schema
