export default class FeatureFlag {
  private id: String;
  private name: String;
  private key: String;
  private enabled: Boolean;

  constructor(id: String, name: String, key: String, enabled: Boolean) {
    this.id = id;
    this.name = name;
    this.key = key;
    this.enabled = enabled;
  }

  getId(): String {
    return this.id;
  }
  getName(): String {
    return this.name;
  }
  getKey(): String {
    return this.key;
  }
  isEnabled(): Boolean {
    return this.enabled;
  }
}
