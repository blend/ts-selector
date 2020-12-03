export default class AnyNode implements ISelector {
    matches(labels: Map<string, string>): boolean;
    validate(): Error | null;
    string(): string;
}
