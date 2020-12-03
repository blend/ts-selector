// Any is a no-op node that always matches.
export default class AnyNode implements ISelector {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  matches(labels: Record<string, string>): boolean {
    return true;
  }
  validate(): Error | null {
    return null;
  }
  string(): string {
    return "";
  }
}
