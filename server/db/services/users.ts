export interface User {
  id: string
  name: string
  email: string
  password: string
  image: string
}

class UsersService {
  public addUser(user: User) {
    const prepare = db.prepare(
        `INSERT INTO users (id, name, email, password, image) VALUES (?1, ?2, ?3, ?4, ?5)`,
    )
    const add = db.transaction(() => {
      prepare.run(user.id, user.name, user.email, user.password, user.image)

      const result = db.prepare('SELECT last_insert_rowid() AS id').get() as { id: number }
      return result.id
    })
    const success = add.exclusive() as unknown as number
    if (!success)
      throw new Error('Failed to add user')

    return user
  }

  public removeUser(id: string) {
    const removed = db.prepare(`DELETE FROM users WHERE id = ?1`).get(id)
    console.log('removed', removed)
  }

  public getUserById(id: string) {
    const user = db.prepare(`SELECT * FROM users WHERE id = ?1`).get(id)
    return user as User | null
  }

  public getUserByEmail(email: string) {
    const user = db.prepare(`SELECT * FROM users WHERE email = ?1`).get(email)
    return user as User | null
  }
}

export const usersService = new UsersService()
