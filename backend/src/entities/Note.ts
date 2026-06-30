import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity("notes")
export class Note {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ nullable: true, type: "varchar" })
  title!: string | null

  @Column({ type: "text" })
  content!: string

  @Column({ type: "text", nullable: true })
  summary!: string | null

  @Column({ type: "text", array: true, default: [] })
  tags!: string[]

  @CreateDateColumn()
  created_at!: Date

  @Column()
  user_id!: string

  @ManyToOne(() => User, (user) => user.notes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User
}