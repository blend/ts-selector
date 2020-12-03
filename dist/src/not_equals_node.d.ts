export default class NotEqualsNode implements ISelector {
    key: string;
    value: string;
    constructor(key: string, value: string);
    matches(labels: Record<string, string>): boolean;
    validate(): Error | null;
    string(): string;
}
