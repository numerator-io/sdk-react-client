import { Client } from './client';

class NumeratorProvider {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  allFeatureFlags(): Promise<any> {
    return this.client.allFeatureFlags();
  }
}

export default NumeratorProvider;
