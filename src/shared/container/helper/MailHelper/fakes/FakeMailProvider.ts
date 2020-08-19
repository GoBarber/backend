import IFakeMailProvider from '../models/IMailProvider';

interface Message {
  to: string;
  body: string;
}

class FakeMailProvider implements IFakeMailProvider {
  private message: Message[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.message.push({ to, body });
  }
}
export default FakeMailProvider;
