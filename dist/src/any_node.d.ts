export default class AnyNode implements ISelector {
    matches(labels: Record<string, string>): boolean;
    validate(): Error | null;
    string(): string;
}
