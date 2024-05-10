interface MessageModel {
  id: number;
  text: string;
  userId: string;
  user: {
    id: string;
    userName: string;
   
  };
}
export default MessageModel;