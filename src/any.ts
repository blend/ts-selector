import { ISelector } from "./interfaces";

/**
 * Represents an `Any` predicate tree node.
 *
 * It is effectively a no-op that matches any label set.
 * @public
 */
export default class Any implements ISelector {
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
