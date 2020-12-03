// Any is a no-op node that always matches.
export default class AnyNode implements ISelector {
  // eslint-disable-next-line @typescript-eslint/no-unusd-vars
  matches(labels: Map<string, string>): boolean {
    return true;
  }
  validate(): Error | null {
    return null;
  }
  string(): string {
    return "";
  }
}
