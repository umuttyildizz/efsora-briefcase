import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm"
import { Note } from "./Note"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ unique: true })
  email!: string

  @Column()
  password_hash!: string

  @CreateDateColumn()
  created_at!: Date

  @OneToMany(() => Note, (note) => note.user)
  notes!: Note[]
}