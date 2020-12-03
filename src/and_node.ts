// And is a combination selector.
export default class AndNode implements ISelector {
  constructor(children: ISelector[]) {
    this.children = children;
  }
  children: ISelector[];

  // matches returns if both A and B match the labels.
  matches(labels: Map<string, string>): boolean {
    for (const s of this.children) {
      if (!s.matches(labels)) {
        return false;
      }
    }
    return true;
  }
  // validate validates all the selectors in the clause.
  validate(): Error | null {
    for (const s of this.children) {
      const err = s.validate();
      if (err) {
        return err;
      }
    }
    return null;
  }

  // And returns a string representation for the selector.
  string(): string {
    const childValues: string[] = [];
    for (const s of this.children) {
      childValues.push(s.string());
    }
    return childValues.join(", ");
  }
}
