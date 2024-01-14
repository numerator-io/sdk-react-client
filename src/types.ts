export type Config = {
    apiKey: string;
    baseUrl?: string;
};

export abstract class Client {
    private apiKey: String;
    private baseUrl?: String;
    constructor(config: Config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl;
    }
    allFeatureFlags(): Promise<any> {
        // Empty implementation
        return Promise.resolve();
    }
}
