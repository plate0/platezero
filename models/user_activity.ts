export class UserActivity {
  public date: Date

  public user_id: number

  public static async record(_user_id: number): Promise<void> {
    return null
  }
}
