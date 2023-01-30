import { Telegram } from "../telegram/telegram.interface";

export const getTelegramConfig = ():Telegram => ({
  chatId:'',
  token:''
})